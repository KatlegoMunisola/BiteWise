export type IBSSubtype = 'IBS-D' | 'IBS-C' | 'IBS-M' | 'IBS-U';

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export type Portion = 'small' | 'medium' | 'large';

export type SymptomType =
  | 'pain'
  | 'bloating'
  | 'diarrhea'
  | 'constipation'
  | 'nausea'
  | 'gas'
  | 'reflux'
  | 'fatigue'
  | 'other';

/** Fields shared by every locally-stored, syncable record. */
export interface Syncable {
  id: string;
  /** ISO timestamp of last modification — drives last-write-wins sync. */
  updatedAt: string;
  /** 0 = dirty (needs push), 1 = synced. */
  synced: 0 | 1;
}

export interface Profile extends Syncable {
  name: string;
  /** Canonical allergen ids from constants/allergens.ts */
  allergens: string[];
  ibsSubtype: IBSSubtype | null;
  dietaryPrefs: string[];
  createdAt: string;
}

export interface FoodLog extends Syncable {
  name: string;
  mealType: MealType;
  ingredients: string[];
  portion: Portion | null;
  barcode: string | null;
  source: 'manual' | 'scan' | 'photo';
  /** ISO timestamp of when the food was eaten/logged. */
  loggedAt: string;
  /** 'YYYY-MM-DD' in device-local time — the correlation key. */
  logDate: string;
}

export interface SymptomLog extends Syncable {
  symptomType: SymptomType;
  /** 1-10 */
  severity: number;
  /** 1-7, only for bowel-related entries. */
  bristolScale: number | null;
  durationMinutes: number | null;
  notes: string | null;
  loggedAt: string;
  logDate: string;
}

/** One row per day (id === logDate). */
export interface DailyFactors extends Syncable {
  logDate: string;
  /** 1-10 */
  stressLevel: number | null;
  stressTriggers: string[];
  sleepHours: number | null;
  /** 1-5 */
  sleepQuality: number | null;
  waterGlasses: number | null;
  exerciseMinutes: number | null;
  copingActivities: string[];
}
