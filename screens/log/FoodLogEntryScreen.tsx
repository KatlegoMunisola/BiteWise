import React, { useState } from 'react';
import { StyleSheet, Text, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useLogStore } from '../../stores/useLogStore';
import ChipSelector from '../../components/forms/ChipSelector';
import FormField from '../../components/forms/FormField';
import Screen from '../../components/ui/Screen';
import { PrimaryButton } from '../../components/ui/Button';
import { colors, fontSize, fontWeight, radius, spacing } from '../../constants/theme';
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

  const save = async () => {
    if (!name.trim()) return;
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
  };

  return (
    <Screen topInset={false}>
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

      <PrimaryButton label="Save" onPress={save} disabled={!name.trim()} style={styles.button} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.heavy,
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
  button: { marginBottom: spacing.xl },
});
