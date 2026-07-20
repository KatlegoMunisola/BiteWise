import * as Crypto from 'expo-crypto';
import type { FoodLog } from '../types/models';
import { nowISO, toLogDate } from '../utils/dates';
import { getStore } from './store';

export type NewFoodLog = Omit<FoodLog, 'id' | 'updatedAt' | 'synced' | 'logDate'> & {
  logDate?: string;
};

export async function insertFoodLog(input: NewFoodLog): Promise<FoodLog> {
  const record: FoodLog = {
    ...input,
    id: Crypto.randomUUID(),
    logDate: input.logDate ?? toLogDate(new Date(input.loggedAt)),
    updatedAt: nowISO(),
    synced: 0,
  };
  await getStore().upsert('food_logs', record);
  return record;
}

export function listFoodLogsBetween(startDate: string, endDate: string): Promise<FoodLog[]> {
  return getStore().listBetween<FoodLog>('food_logs', startDate, endDate);
}

export function listFoodLogsByDate(logDate: string): Promise<FoodLog[]> {
  return listFoodLogsBetween(logDate, logDate);
}
