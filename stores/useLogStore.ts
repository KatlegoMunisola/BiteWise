import { create } from 'zustand';
import type { DailyFactors, FoodLog, SymptomLog } from '../types/models';
import { insertFoodLog, listFoodLogsByDate, type NewFoodLog } from '../db/foodLogs';
import { insertSymptomLog, listSymptomLogsByDate, type NewSymptomLog } from '../db/symptomLogs';
import { getDailyFactors, upsertDailyFactors } from '../db/dailyFactors';
import { todayLogDate } from '../utils/dates';
import { syncAll } from '../services/sync';
import { useAuthStore } from './useAuthStore';

function syncSoon(): void {
  const user = useAuthStore.getState().user;
  if (user) {
    syncAll(user.uid).catch(() => {
      // Offline — rows stay dirty and push on the next sync trigger.
    });
  }
}

interface LogState {
  /** The date being displayed (defaults to today). */
  date: string;
  food: FoodLog[];
  symptoms: SymptomLog[];
  factors: DailyFactors | null;
  loading: boolean;
  refresh: (date?: string) => Promise<void>;
  addFood: (input: NewFoodLog) => Promise<void>;
  addSymptom: (input: NewSymptomLog) => Promise<void>;
  saveFactors: (patch: Partial<Omit<DailyFactors, 'id' | 'logDate' | 'updatedAt' | 'synced'>>) => Promise<void>;
}

export const useLogStore = create<LogState>((set, get) => ({
  date: todayLogDate(),
  food: [],
  symptoms: [],
  factors: null,
  loading: false,

  refresh: async (date) => {
    const logDate = date ?? todayLogDate();
    set({ loading: true, date: logDate });
    const [food, symptoms, factors] = await Promise.all([
      listFoodLogsByDate(logDate),
      listSymptomLogsByDate(logDate),
      getDailyFactors(logDate),
    ]);
    set({ food, symptoms, factors, loading: false });
  },

  addFood: async (input) => {
    await insertFoodLog(input);
    await get().refresh(get().date);
    syncSoon();
  },

  addSymptom: async (input) => {
    await insertSymptomLog(input);
    await get().refresh(get().date);
    syncSoon();
  },

  saveFactors: async (patch) => {
    await upsertDailyFactors(get().date, patch);
    await get().refresh(get().date);
    syncSoon();
  },
}));
