import * as FileSystem from 'expo-file-system';

export interface MealAnalysis {
  description: string;
  ingredients: string[];
  allergenTags: string[];
  confidence: 'low' | 'medium' | 'high';
}

const WORKER_URL = 'https://bitewise-meal-vision.katlego.workers.dev/analyze';
const APP_SECRET = '277353';

/**
 * Sends a captured meal photo to the meal-vision Worker for an AI-generated
 * best-effort description, ingredient list, and possible-allergen tags.
 * This is an estimate, not a verified lookup — callers must present it as such.
 */
export async function analyzeMealPhoto(photoPath: string): Promise<MealAnalysis> {
  const uri = photoPath.startsWith('file://') ? photoPath : `file://${photoPath}`;
  const imageBase64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const res = await fetch(WORKER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-BiteWise-Client': APP_SECRET,
    },
    body: JSON.stringify({ imageBase64, mimeType: 'image/jpeg' }),
  });

  if (!res.ok) {
    throw new Error(`Meal photo analysis failed: ${res.status}`);
  }

  return res.json();
}
