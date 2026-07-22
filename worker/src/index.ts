export interface Env {
  GEMINI_API_KEY: string;
  APP_SECRET: string;
}

// Mirrors constants/allergens.ts in the app repo. Duplicated here rather than
// shared because this Worker is a separate deployable with its own build —
// keep the two lists in sync if the allergen set ever changes.
const ALLERGEN_TAGS = [
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

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-BiteWise-Client',
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}

const RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    description: { type: 'STRING' },
    ingredients: { type: 'ARRAY', items: { type: 'STRING' } },
    allergenTags: {
      type: 'ARRAY',
      items: { type: 'STRING', enum: ALLERGEN_TAGS.map((a) => a.offTag) },
    },
    confidence: { type: 'STRING', enum: ['low', 'medium', 'high'] },
  },
  required: ['description', 'ingredients', 'allergenTags', 'confidence'],
};

function buildPrompt(): string {
  const allergenList = ALLERGEN_TAGS.map((a) => `- ${a.label} (tag: ${a.offTag})`).join('\n');
  return `You are a food-safety assistant analyzing a photo of a meal for a food-allergy tracking app.

Look at the photo and:
1. Identify the dish or food items visible (a short, plain description).
2. List the likely ingredients based on how this dish is typically prepared.
3. From this specific list of allergen categories, flag only the ones a person eating this dish is at reasonable risk of encountering, based on common recipes:
${allergenList}
Only use the exact tag values given above. Err on the side of flagging a possible allergen when uncertain, since this feeds a safety feature — false negatives are worse than false positives here.
4. Set confidence to "high" if you clearly recognize the dish, "medium" if it's a reasonable guess, or "low" if the image is unclear or doesn't show food — in that case, still fill "description" explaining what you see, but leave ingredients and allergenTags empty.

Respond only with the requested JSON.`;
}

async function handleAnalyze(request: Request, env: Env): Promise<Response> {
  if (request.headers.get('X-BiteWise-Client') !== env.APP_SECRET) {
    return json({ error: 'Forbidden' }, 403);
  }

  let body: { imageBase64?: string; mimeType?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const { imageBase64, mimeType } = body;
  if (!imageBase64 || !mimeType) {
    return json({ error: 'imageBase64 and mimeType are required' }, 400);
  }

  const geminiRes = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': env.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: buildPrompt() }, { inline_data: { mime_type: mimeType, data: imageBase64 } }],
          },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: RESPONSE_SCHEMA,
        },
      }),
    }
  );

  if (!geminiRes.ok) {
    const detail = await geminiRes.text();
    return json({ error: `Gemini request failed: ${geminiRes.status}`, detail }, 502);
  }

  const geminiData: { candidates?: { content?: { parts?: { text?: string }[] } }[] } = await geminiRes.json();
  const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    return json({ error: 'Gemini returned no content' }, 502);
  }

  try {
    const analysis = JSON.parse(text);
    return json(analysis);
  } catch {
    return json({ error: 'Gemini returned malformed JSON' }, 502);
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    if (request.method === 'POST' && url.pathname === '/analyze') {
      return handleAnalyze(request, env);
    }

    return json({ error: 'Not found' }, 404);
  },
};
