import type { SymptomType } from '../types/models';

export interface SymptomDef {
  id: SymptomType;
  label: string;
  emoji: string;
  /** Bristol stool scale applies to bowel-movement symptoms. */
  usesBristol: boolean;
}

export const SYMPTOMS: SymptomDef[] = [
  { id: 'pain', label: 'Abdominal pain', emoji: '😖', usesBristol: false },
  { id: 'bloating', label: 'Bloating', emoji: '🎈', usesBristol: false },
  { id: 'diarrhea', label: 'Diarrhea', emoji: '💧', usesBristol: true },
  { id: 'constipation', label: 'Constipation', emoji: '🪨', usesBristol: true },
  { id: 'nausea', label: 'Nausea', emoji: '🤢', usesBristol: false },
  { id: 'gas', label: 'Gas', emoji: '💨', usesBristol: false },
  { id: 'reflux', label: 'Reflux / Heartburn', emoji: '🔥', usesBristol: false },
  { id: 'fatigue', label: 'Fatigue', emoji: '😴', usesBristol: false },
  { id: 'other', label: 'Other', emoji: '❓', usesBristol: false },
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
