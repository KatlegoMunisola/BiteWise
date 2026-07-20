import type { Ionicons } from '@expo/vector-icons';
import type { SymptomType } from '../types/models';

export interface SymptomDef {
  id: SymptomType;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  /** Bristol stool scale applies to bowel-movement symptoms. */
  usesBristol: boolean;
}

export const SYMPTOMS: SymptomDef[] = [
  { id: 'pain', label: 'Abdominal pain', icon: 'body-outline', usesBristol: false },
  { id: 'bloating', label: 'Bloating', icon: 'ellipse-outline', usesBristol: false },
  { id: 'diarrhea', label: 'Diarrhea', icon: 'water-outline', usesBristol: true },
  { id: 'constipation', label: 'Constipation', icon: 'remove-circle-outline', usesBristol: true },
  { id: 'nausea', label: 'Nausea', icon: 'sad-outline', usesBristol: false },
  { id: 'gas', label: 'Gas', icon: 'cloud-outline', usesBristol: false },
  { id: 'reflux', label: 'Reflux / Heartburn', icon: 'flame-outline', usesBristol: false },
  { id: 'fatigue', label: 'Fatigue', icon: 'moon-outline', usesBristol: false },
  { id: 'other', label: 'Other', icon: 'help-circle-outline', usesBristol: false },
];

export const symptomDef = (id: SymptomType): SymptomDef =>
  SYMPTOMS.find((s) => s.id === id) ?? SYMPTOMS[SYMPTOMS.length - 1];

export const STRESS_TRIGGERS = ['Work', 'Family', 'Health', 'Finances', 'Sleep', 'Social', 'Travel'];

export const COPING_ACTIVITIES = [
  'Deep breathing',
  'Meditation',
  'Walk',
  'Exercise',
  'Journaling',
  'Yoga',
  'Music',
];
