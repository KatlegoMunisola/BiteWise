import { matchAllergens } from '../../utils/allergenMatch';

describe('matchAllergens', () => {
  it('returns no matches when the product has no watched allergen tags', () => {
    expect(matchAllergens(['en:soybeans'], ['milk', 'egg'])).toEqual([]);
  });

  it('returns a single match', () => {
    const result = matchAllergens(['en:milk', 'en:soybeans'], ['milk']);
    expect(result.map((a) => a.id)).toEqual(['milk']);
  });

  it('returns multiple matches', () => {
    const result = matchAllergens(['en:milk', 'en:gluten'], ['milk', 'wheat', 'peanut']);
    expect(result.map((a) => a.id).sort()).toEqual(['milk', 'wheat']);
  });

  it('returns no matches when the product has no allergen tags at all', () => {
    expect(matchAllergens(undefined, ['milk'])).toEqual([]);
    expect(matchAllergens([], ['milk'])).toEqual([]);
  });

  it('returns no matches when the user watches no allergens', () => {
    expect(matchAllergens(['en:milk'], [])).toEqual([]);
  });
});
