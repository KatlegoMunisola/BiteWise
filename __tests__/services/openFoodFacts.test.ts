import { lookupProduct } from '../../services/openFoodFacts';

describe('lookupProduct', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.resetAllMocks();
  });

  it('returns a parsed product when found', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        status: 1,
        product: {
          product_name: 'Oat Milk',
          image_front_url: 'https://example.com/oat-milk.jpg',
          ingredients_text: 'Oats, Water, Salt',
          allergens_tags: ['en:oats'],
        },
      }),
    }) as unknown as typeof fetch;

    const result = await lookupProduct('123456789');

    expect(result).toEqual({
      barcode: '123456789',
      name: 'Oat Milk',
      ingredients: ['oats', 'water', 'salt'],
      imageUrl: 'https://example.com/oat-milk.jpg',
      allergenTags: ['en:oats'],
    });
  });

  it('returns null when the product is not found (status 0)', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ status: 0 }),
    }) as unknown as typeof fetch;

    expect(await lookupProduct('000000000')).toBeNull();
  });

  it('throws on a non-OK HTTP response', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 503,
      json: async () => ({}),
    }) as unknown as typeof fetch;

    await expect(lookupProduct('123')).rejects.toThrow();
  });

  it('propagates network errors', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('offline')) as unknown as typeof fetch;

    await expect(lookupProduct('123')).rejects.toThrow('offline');
  });
});
