export interface OFFProduct {
  barcode: string;
  name: string;
  ingredients: string[];
  imageUrl: string | null;
  allergenTags: string[];
}

const USER_AGENT = 'BiteWise - Android - Version 1.0 - github.com/KatlegoMunisola/BiteWise';

/**
 * Looks up a product by barcode via the Open Food Facts API.
 * Returns null when the product isn't in OFF's database (a normal case);
 * throws on network/HTTP failure so the caller can offer a retry.
 */
export async function lookupProduct(barcode: string): Promise<OFFProduct | null> {
  const url = `https://world.openfoodfacts.org/api/v2/product/${barcode}.json?fields=product_name,image_front_url,ingredients_text,allergens_tags`;
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  if (!res.ok) {
    throw new Error(`Open Food Facts lookup failed: ${res.status}`);
  }
  const data = await res.json();
  if (data.status !== 1 || !data.product) {
    return null;
  }

  const product = data.product;
  const ingredients: string[] = (product.ingredients_text ?? '')
    .split(',')
    .map((i: string) => i.trim().toLowerCase())
    .filter(Boolean);

  return {
    barcode,
    name: product.product_name || 'Unknown product',
    ingredients,
    imageUrl: product.image_front_url ?? null,
    allergenTags: product.allergens_tags ?? [],
  };
}
