import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDb, isFirebaseConfigured } from './firebase';
import { getStore, TABLES, type StoredRecord, type TableName } from '../db/store';

/**
 * Local-first sync: SQLite/local store is the source of truth for the UI;
 * Firestore holds the per-user backup under users/{uid}/{collection}/{id}.
 *
 * Push: every dirty row (synced=0) is written remotely, then marked synced.
 * Pull: remote docs with updatedAt > lastPulledAt are merged locally,
 * last-write-wins on the ISO `updatedAt` timestamp.
 */

const FIRE_COLLECTIONS: Record<TableName, string> = {
  profile: 'profile',
  food_logs: 'foodLogs',
  symptom_logs: 'symptomLogs',
  daily_factors: 'dailyFactors',
};

const LAST_PULL_KEY = 'sync:lastPulledAt';

let inFlight: Promise<void> | null = null;

export function syncAll(uid: string): Promise<void> {
  if (!isFirebaseConfigured) return Promise.resolve();
  // Coalesce concurrent triggers (sign-in + foreground can race).
  if (!inFlight) {
    inFlight = doSync(uid).finally(() => {
      inFlight = null;
    });
  }
  return inFlight;
}

async function doSync(uid: string): Promise<void> {
  await pushDirty(uid);
  await pullSince(uid);
}

async function pushDirty(uid: string): Promise<void> {
  const db = getDb();
  const store = getStore();
  for (const table of TABLES) {
    const dirty = await store.listDirty(table);
    if (dirty.length === 0) continue;
    const pushed: string[] = [];
    for (const record of dirty) {
      const ref = doc(db, 'users', uid, FIRE_COLLECTIONS[table], record.id);
      await setDoc(ref, { ...record, synced: 1 });
      pushed.push(record.id);
    }
    await store.markSynced(table, pushed);
  }
}

async function pullSince(uid: string): Promise<void> {
  const db = getDb();
  const store = getStore();
  const lastPulledAt = (await AsyncStorage.getItem(LAST_PULL_KEY)) ?? '';
  const pullStartedAt = new Date().toISOString();

  for (const table of TABLES) {
    const col = collection(db, 'users', uid, FIRE_COLLECTIONS[table]);
    const q = lastPulledAt ? query(col, where('updatedAt', '>', lastPulledAt)) : query(col);
    const snapshot = await getDocs(q);
    for (const docSnap of snapshot.docs) {
      const remote = docSnap.data() as StoredRecord;
      const local = await store.getById(table, remote.id);
      if (!local || local.updatedAt < remote.updatedAt) {
        await store.upsert(table, { ...remote, synced: 1 });
      }
    }
  }

  await AsyncStorage.setItem(LAST_PULL_KEY, pullStartedAt);
}
