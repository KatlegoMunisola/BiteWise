/** The 14 major allergens (EU labelling list). Canonical ids are stable —
 *  profile.allergens and the Phase-2 alias dictionary both reference them. */
export interface AllergenDef {
  id: string;
  label: string;
  /** Open Food Facts tag, used by the Phase-2 scanner. */
  offTag: string;
}

export const ALLERGENS: AllergenDef[] = [
  { id: 'milk', label: 'Milk / Dairy', offTag: 'en:milk' },
  { id: 'egg', label: 'Egg', offTag: 'en:eggs' },
  { id: 'peanut', label: 'Peanut', offTag: 'en:peanuts' },
  { id: 'tree_nut', label: 'Tree nuts', offTag: 'en:nuts' },
  { id: 'sesame', label: 'Sesame', offTag: 'en:sesame-seeds' },
  { id: 'soy', label: 'Soy', offTag: 'en:soybeans' },
  { id: 'wheat', label: 'Wheat / Gluten', offTag: 'en:gluten' },
  { id: 'fish', label: 'Fish', offTag: 'en:fish' },
  { id: 'shellfish', label: 'Crustacean shellfish', offTag: 'en:crustaceans' },
  { id: 'mollusc', label: 'Molluscs', offTag: 'en:molluscs' },
  { id: 'celery', label: 'Celery', offTag: 'en:celery' },
  { id: 'mustard', label: 'Mustard', offTag: 'en:mustard' },
  { id: 'lupin', label: 'Lupin', offTag: 'en:lupin' },
  { id: 'sulphite', label: 'Sulphites', offTag: 'en:sulphur-dioxide-and-sulphites' },
];

export const allergenLabel = (id: string): string =>
  ALLERGENS.find((a) => a.id === id)?.label ?? id;
