import * as Crypto from 'expo-crypto';
import type { SymptomLog } from '../types/models';
import { nowISO, toLogDate } from '../utils/dates';
import { getStore } from './store';

export type NewSymptomLog = Omit<SymptomLog, 'id' | 'updatedAt' | 'synced' | 'logDate'> & {
  logDate?: string;
};

export async function insertSymptomLog(input: NewSymptomLog): Promise<SymptomLog> {
  const record: SymptomLog = {
    ...input,
    id: Crypto.randomUUID(),
    logDate: input.logDate ?? toLogDate(new Date(input.loggedAt)),
    updatedAt: nowISO(),
    synced: 0,
  };
  await getStore().upsert('symptom_logs', record);
  return record;
}

export function listSymptomLogsBetween(startDate: string, endDate: string): Promise<SymptomLog[]> {
  return getStore().listBetween<SymptomLog>('symptom_logs', startDate, endDate);
}

export function listSymptomLogsByDate(logDate: string): Promise<SymptomLog[]> {
  return listSymptomLogsBetween(logDate, logDate);
}
