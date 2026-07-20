import type { DailyFactors } from '../types/models';
import { nowISO } from '../utils/dates';
import { getStore } from './store';

const EMPTY: Omit<DailyFactors, 'id' | 'logDate' | 'updatedAt' | 'synced'> = {
  stressLevel: null,
  stressTriggers: [],
  sleepHours: null,
  sleepQuality: null,
  waterGlasses: null,
  exerciseMinutes: null,
  copingActivities: [],
};

export function getDailyFactors(logDate: string): Promise<DailyFactors | null> {
  // One row per day: the record id IS the logDate.
  return getStore().getById<DailyFactors>('daily_factors', logDate);
}

export async function upsertDailyFactors(
  logDate: string,
  patch: Partial<Omit<DailyFactors, 'id' | 'logDate' | 'updatedAt' | 'synced'>>
): Promise<DailyFactors> {
  const existing = await getDailyFactors(logDate);
  const record: DailyFactors = {
    ...EMPTY,
    ...(existing ?? {}),
    ...patch,
    id: logDate,
    logDate,
    updatedAt: nowISO(),
    synced: 0,
  };
  await getStore().upsert('daily_factors', record);
  return record;
}

export function listDailyFactorsBetween(startDate: string, endDate: string): Promise<DailyFactors[]> {
  return getStore().listBetween<DailyFactors>('daily_factors', startDate, endDate);
}
