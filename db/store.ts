import { Platform } from 'react-native';
import type { Syncable } from '../types/models';

/**
 * Generic local document store, one "table" per record type.
 *
 * Native: expo-sqlite — each table is (id, log_date, updated_at, synced, data)
 * with an index on log_date, so date-range and dirty-row queries stay in SQL.
 * Web (dev/verification only — expo-sqlite has no web support): the same API
 * over AsyncStorage-backed JSON arrays.
 *
 * Records carry camelCase fields; `logDate`, `updatedAt` and `synced` are
 * mirrored into real columns for indexing. Full record JSON lives in `data`.
 */

export const TABLES = ['profile', 'food_logs', 'symptom_logs', 'daily_factors'] as const;
export type TableName = (typeof TABLES)[number];

export interface StoredRecord extends Syncable {
  logDate?: string;
}

interface StoreBackend {
  upsert(table: TableName, record: StoredRecord): Promise<void>;
  getById<T extends StoredRecord>(table: TableName, id: string): Promise<T | null>;
  listBetween<T extends StoredRecord>(table: TableName, startDate: string, endDate: string): Promise<T[]>;
  listAll<T extends StoredRecord>(table: TableName): Promise<T[]>;
  listDirty<T extends StoredRecord>(table: TableName): Promise<T[]>;
  markSynced(table: TableName, ids: string[]): Promise<void>;
  clearAll(): Promise<void>;
}

// ---------------------------------------------------------------------------
// Native backend: expo-sqlite
// ---------------------------------------------------------------------------

/** Minimal surface of expo-sqlite/next we use (module is required lazily,
 *  so its own types aren't available here). */
interface SqliteDb {
  execAsync(sql: string): Promise<void>;
  runAsync(sql: string, ...params: unknown[]): Promise<unknown>;
  getFirstAsync<T>(sql: string, ...params: unknown[]): Promise<T | null>;
  getAllAsync<T>(sql: string, ...params: unknown[]): Promise<T[]>;
}

function createSqliteBackend(): StoreBackend {
  // Deferred require: expo-sqlite must not be evaluated in web bundles.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { openDatabaseSync } = require('expo-sqlite/next');
  const db: SqliteDb = openDatabaseSync('bitewise.db');

  const SCHEMA_VERSION = 1;
  let ready: Promise<void> | null = null;

  function migrate(): Promise<void> {
    if (!ready) {
      ready = (async () => {
        const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
        const version = row?.user_version ?? 0;
        if (version < 1) {
          await db.execAsync('BEGIN');
          try {
            for (const table of TABLES) {
              await db.execAsync(
                `CREATE TABLE IF NOT EXISTS ${table} (
                   id TEXT PRIMARY KEY NOT NULL,
                   log_date TEXT,
                   updated_at TEXT NOT NULL,
                   synced INTEGER NOT NULL DEFAULT 0,
                   data TEXT NOT NULL
                 );`
              );
              await db.execAsync(
                `CREATE INDEX IF NOT EXISTS idx_${table}_log_date ON ${table} (log_date);`
              );
            }
            await db.execAsync(`PRAGMA user_version = ${SCHEMA_VERSION}`);
            await db.execAsync('COMMIT');
          } catch (e) {
            await db.execAsync('ROLLBACK');
            throw e;
          }
        }
      })();
    }
    return ready;
  }

  const parse = <T,>(rows: { data: string }[]): T[] => rows.map((r) => JSON.parse(r.data) as T);

  return {
    async upsert(table, record) {
      await migrate();
      await db.runAsync(
        `INSERT OR REPLACE INTO ${table} (id, log_date, updated_at, synced, data) VALUES (?, ?, ?, ?, ?)`,
        record.id,
        record.logDate ?? null,
        record.updatedAt,
        record.synced,
        JSON.stringify(record)
      );
    },
    async getById(table, id) {
      await migrate();
      const row = await db.getFirstAsync<{ data: string }>(
        `SELECT data FROM ${table} WHERE id = ?`,
        id
      );
      return row ? JSON.parse(row.data) : null;
    },
    async listBetween(table, startDate, endDate) {
      await migrate();
      const rows = await db.getAllAsync<{ data: string }>(
        `SELECT data FROM ${table} WHERE log_date >= ? AND log_date <= ? ORDER BY log_date ASC`,
        startDate,
        endDate
      );
      return parse(rows);
    },
    async listAll(table) {
      await migrate();
      const rows = await db.getAllAsync<{ data: string }>(`SELECT data FROM ${table}`);
      return parse(rows);
    },
    async listDirty(table) {
      await migrate();
      const rows = await db.getAllAsync<{ data: string }>(
        `SELECT data FROM ${table} WHERE synced = 0`
      );
      return parse(rows);
    },
    async markSynced(table, ids) {
      await migrate();
      for (const id of ids) {
        const row = await db.getFirstAsync<{ data: string }>(
          `SELECT data FROM ${table} WHERE id = ?`,
          id
        );
        if (!row) continue;
        const record = { ...JSON.parse(row.data), synced: 1 };
        await db.runAsync(
          `UPDATE ${table} SET synced = 1, data = ? WHERE id = ?`,
          JSON.stringify(record),
          id
        );
      }
    },
    async clearAll() {
      await migrate();
      for (const table of TABLES) {
        await db.execAsync(`DELETE FROM ${table}`);
      }
    },
  };
}

// ---------------------------------------------------------------------------
// Web backend: AsyncStorage JSON arrays (dev-scale only)
// ---------------------------------------------------------------------------

function createWebBackend(): StoreBackend {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;

  const key = (table: TableName) => `db:${table}`;

  async function load<T extends StoredRecord>(table: TableName): Promise<T[]> {
    const raw = await AsyncStorage.getItem(key(table));
    return raw ? (JSON.parse(raw) as T[]) : [];
  }

  async function save(table: TableName, rows: StoredRecord[]): Promise<void> {
    await AsyncStorage.setItem(key(table), JSON.stringify(rows));
  }

  return {
    async upsert(table, record) {
      const rows = await load(table);
      const idx = rows.findIndex((r) => r.id === record.id);
      if (idx >= 0) rows[idx] = record;
      else rows.push(record);
      await save(table, rows);
    },
    async getById<T extends StoredRecord>(table: TableName, id: string) {
      const rows = await load<T>(table);
      return rows.find((r) => r.id === id) ?? null;
    },
    async listBetween<T extends StoredRecord>(table: TableName, startDate: string, endDate: string) {
      const rows = await load<T>(table);
      return rows
        .filter((r) => r.logDate != null && r.logDate >= startDate && r.logDate <= endDate)
        .sort((a, b) => (a.logDate! < b.logDate! ? -1 : 1));
    },
    async listAll<T extends StoredRecord>(table: TableName) {
      return load<T>(table);
    },
    async listDirty<T extends StoredRecord>(table: TableName) {
      const rows = await load<T>(table);
      return rows.filter((r) => r.synced === 0);
    },
    async markSynced(table, ids) {
      const rows = await load(table);
      const idSet = new Set(ids);
      for (const r of rows) {
        if (idSet.has(r.id)) r.synced = 1;
      }
      await save(table, rows);
    },
    async clearAll() {
      for (const table of TABLES) {
        await AsyncStorage.removeItem(key(table));
      }
    },
  };
}

let backend: StoreBackend | null = null;

export function getStore(): StoreBackend {
  if (!backend) {
    backend = Platform.OS === 'web' ? createWebBackend() : createSqliteBackend();
  }
  return backend;
}

/** Test seam: swap the backend (e.g. an in-memory double) in jest. */
export function setStoreForTesting(replacement: StoreBackend | null): void {
  backend = replacement;
}
