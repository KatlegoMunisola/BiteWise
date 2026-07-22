jest.mock('expo-file-system', () => ({
  readAsStringAsync: jest.fn().mockResolvedValue('base64-image-data'),
  EncodingType: { Base64: 'base64' },
}));

import { analyzeMealPhoto } from '../../services/mealVision';

describe('analyzeMealPhoto', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  it('returns the parsed analysis when the Worker responds OK', async () => {
    const analysis = {
      description: 'Grilled chicken salad',
      ingredients: ['chicken', 'lettuce', 'parmesan', 'croutons'],
      allergenTags: ['en:milk', 'en:gluten'],
      confidence: 'medium',
    };
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => analysis,
    }) as unknown as typeof fetch;

    const result = await analyzeMealPhoto('/tmp/photo.jpg');

    expect(result).toEqual(analysis);
  });

  it('throws when the Worker returns a non-OK response', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 502,
      json: async () => ({}),
    }) as unknown as typeof fetch;

    await expect(analyzeMealPhoto('/tmp/photo.jpg')).rejects.toThrow();
  });

  it('propagates network errors', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('offline')) as unknown as typeof fetch;

    await expect(analyzeMealPhoto('/tmp/photo.jpg')).rejects.toThrow('offline');
  });
});
