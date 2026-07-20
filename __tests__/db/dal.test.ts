import { setStoreForTesting } from '../../db/store';
import { createMemoryStore } from '../helpers/memoryStore';
import { insertFoodLog, listFoodLogsBetween, listFoodLogsByDate } from '../../db/foodLogs';
import { insertSymptomLog, listSymptomLogsByDate } from '../../db/symptomLogs';
import { getDailyFactors, upsertDailyFactors } from '../../db/dailyFactors';
import { getProfile, saveProfile } from '../../db/profile';

describe('data access layer', () => {
  beforeEach(() => {
    setStoreForTesting(createMemoryStore() as never);
  });

  afterEach(() => {
    setStoreForTesting(null);
  });

  describe('foodLogs', () => {
    it('derives logDate from loggedAt in local time and filters by date range', async () => {
      await insertFoodLog({
        name: 'Porridge',
        mealType: 'breakfast',
        ingredients: ['oats'],
        portion: 'medium',
        barcode: null,
        source: 'manual',
        loggedAt: new Date(2026, 6, 18, 8, 30).toISOString(),
      });
      await insertFoodLog({
        name: 'Salad',
        mealType: 'lunch',
        ingredients: [],
        portion: null,
        barcode: null,
        source: 'manual',
        loggedAt: new Date(2026, 6, 20, 12, 0).toISOString(),
      });

      const inRange = await listFoodLogsBetween('2026-07-18', '2026-07-19');
      expect(inRange).toHaveLength(1);
      expect(inRange[0].name).toBe('Porridge');
      expect(inRange[0].logDate).toBe('2026-07-18');
      expect(inRange[0].synced).toBe(0);
    });

    it('keeps a late-evening log on its local date', async () => {
      await insertFoodLog({
        name: 'Midnight snack',
        mealType: 'snack',
        ingredients: [],
        portion: null,
        barcode: null,
        source: 'manual',
        loggedAt: new Date(2026, 6, 18, 23, 59).toISOString(),
      });
      const rows = await listFoodLogsByDate('2026-07-18');
      expect(rows).toHaveLength(1);
    });
  });

  describe('symptomLogs', () => {
    it('stores severity and bristol scale', async () => {
      await insertSymptomLog({
        symptomType: 'diarrhea',
        severity: 7,
        bristolScale: 6,
        durationMinutes: null,
        notes: null,
        loggedAt: new Date(2026, 6, 19, 9, 0).toISOString(),
      });
      const rows = await listSymptomLogsByDate('2026-07-19');
      expect(rows).toHaveLength(1);
      expect(rows[0].severity).toBe(7);
      expect(rows[0].bristolScale).toBe(6);
    });
  });

  describe('dailyFactors', () => {
    it('upserts a single row per day keyed by logDate', async () => {
      await upsertDailyFactors('2026-07-19', { stressLevel: 8 });
      await upsertDailyFactors('2026-07-19', { sleepHours: 6.5 });

      const row = await getDailyFactors('2026-07-19');
      expect(row).not.toBeNull();
      expect(row!.id).toBe('2026-07-19');
      // Second upsert must merge, not clobber, the first.
      expect(row!.stressLevel).toBe(8);
      expect(row!.sleepHours).toBe(6.5);
      expect(row!.synced).toBe(0);
    });

    it('returns null for days with no entry', async () => {
      expect(await getDailyFactors('2026-07-01')).toBeNull();
    });
  });

  describe('profile', () => {
    it('saves and reloads the single profile row, preserving createdAt', async () => {
      const first = await saveProfile({
        name: 'Kat',
        allergens: ['milk', 'sesame'],
        ibsSubtype: 'IBS-M',
        dietaryPrefs: [],
      });
      const updated = await saveProfile({
        name: 'Kat',
        allergens: ['milk'],
        ibsSubtype: 'IBS-M',
        dietaryPrefs: [],
      });

      expect(updated.createdAt).toBe(first.createdAt);
      const loaded = await getProfile();
      expect(loaded!.allergens).toEqual(['milk']);
    });
  });
});
