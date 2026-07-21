import { ALLERGENS, type AllergenDef } from '../constants/allergens';

/** Returns the subset of the user's watched allergens present in a scanned product's OFF allergen tags. */
export function matchAllergens(
  offAllergenTags: string[] | undefined,
  userAllergenIds: string[]
): AllergenDef[] {
  if (!offAllergenTags || offAllergenTags.length === 0 || userAllergenIds.length === 0) {
    return [];
  }
  const tagSet = new Set(offAllergenTags);
  return ALLERGENS.filter((a) => userAllergenIds.includes(a.id) && tagSet.has(a.offTag));
}
