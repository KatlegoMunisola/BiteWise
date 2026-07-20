import * as Crypto from 'expo-crypto';
import type { Profile } from '../types/models';
import { nowISO } from '../utils/dates';
import { getStore } from './store';

/** Single local profile row. Fixed id — the signed-in Firebase uid scopes the
 *  remote copy; locally there is only ever one profile. */
const PROFILE_ID = 'me';

export async function getProfile(): Promise<Profile | null> {
  return getStore().getById<Profile>('profile', PROFILE_ID);
}

export async function saveProfile(
  input: Pick<Profile, 'name' | 'allergens' | 'ibsSubtype' | 'dietaryPrefs'>
): Promise<Profile> {
  const existing = await getProfile();
  const record: Profile = {
    id: PROFILE_ID,
    createdAt: existing?.createdAt ?? nowISO(),
    ...input,
    updatedAt: nowISO(),
    synced: 0,
  };
  await getStore().upsert('profile', record);
  return record;
}

export { PROFILE_ID };
