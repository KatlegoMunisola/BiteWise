import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useLogStore } from '../../stores/useLogStore';
import ChipSelector from '../../components/forms/ChipSelector';
import FormField from '../../components/forms/FormField';
import { colors, radius, spacing, fontSize } from '../../constants/theme';
import { nowISO } from '../../utils/dates';
import type { MealType, Portion } from '../../types/models';

const MEALS: { value: MealType; label: string }[] = [
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'snack', label: 'Snack' },
];

const PORTIONS: { value: Portion; label: string }[] = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
];

export default function FoodLogEntryScreen() {
  const navigation = useNavigation<{ goBack: () => void }>();
  const addFood = useLogStore((s) => s.addFood);
  const [name, setName] = useState('');
  const [meal, setMeal] = useState<string[]>(['snack']);
  const [portion, setPortion] = useState<string[]>([]);
  const [ingredientsText, setIngredientsText] = useState('');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await addFood({
        name: name.trim(),
        mealType: (meal[0] as MealType) ?? 'snack',
        ingredients: ingredientsText
          .split(',')
          .map((i) => i.trim().toLowerCase())
          .filter(Boolean),
        portion: (portion[0] as Portion) ?? null,
        barcode: null,
        source: 'manual',
        loggedAt: nowISO(),
      });
      navigation.goBack();
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Log food</Text>

      <FormField label="What did you eat?">
        <TextInput
          style={styles.input}
          placeholder="e.g. Oat porridge with banana"
          placeholderTextColor={colors.textMuted}
          value={name}
          onChangeText={setName}
        />
      </FormField>

      <FormField label="Meal">
        <ChipSelector options={MEALS} selected={meal} onChange={setMeal} multi={false} />
      </FormField>

      <FormField label="Portion">
        <ChipSelector options={PORTIONS} selected={portion} onChange={setPortion} multi={false} />
      </FormField>

      <FormField label="Ingredients (comma-separated, optional)">
        <TextInput
          style={styles.input}
          placeholder="oats, milk, banana"
          placeholderTextColor={colors.textMuted}
          value={ingredientsText}
          onChangeText={setIngredientsText}
        />
      </FormField>

      <TouchableOpacity
        style={[styles.button, !name.trim() && styles.buttonDisabled]}
        onPress={save}
        disabled={saving || !name.trim()}
      >
        <Text style={styles.buttonText}>{saving ? 'Saving…' : 'Save'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, maxWidth: 560, width: '100%', alignSelf: 'center' },
  title: {
    fontSize: fontSize.lg,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.lg,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: fontSize.md,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontSize: fontSize.md, fontWeight: '700' },
});
