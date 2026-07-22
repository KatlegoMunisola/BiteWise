import React, { useCallback, useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getProfile } from '../../db/profile';
import { analyzeMealPhoto, type MealAnalysis } from '../../services/mealVision';
import { matchAllergens } from '../../utils/allergenMatch';
import { useLogStore } from '../../stores/useLogStore';
import { MEALS } from '../../constants/meals';
import ChipSelector from '../../components/forms/ChipSelector';
import FormField from '../../components/forms/FormField';
import Screen from '../../components/ui/Screen';
import Card from '../../components/ui/Card';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import { PrimaryButton, SecondaryButton } from '../../components/ui/Button';
import { colors, fontSize, fontWeight, radius, spacing } from '../../constants/theme';
import { nowISO } from '../../utils/dates';
import type { AllergenDef } from '../../constants/allergens';
import type { MealType } from '../../types/models';

type Status = 'loading' | 'error' | 'found';

export default function MealPhotoResultScreen() {
  const navigation = useNavigation<{ goBack: () => void; navigate: (s: string) => void }>();
  const route = useRoute<{ key: string; name: string; params: { photoPath: string } }>();
  const { photoPath } = route.params;
  const addFood = useLogStore((s) => s.addFood);

  const [status, setStatus] = useState<Status>('loading');
  const [analysis, setAnalysis] = useState<MealAnalysis | null>(null);
  const [warnings, setWarnings] = useState<AllergenDef[]>([]);
  const [meal, setMeal] = useState<string[]>(['snack']);

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const [profile, result] = await Promise.all([getProfile(), analyzeMealPhoto(photoPath)]);
      setAnalysis(result);
      setWarnings(matchAllergens(result.allergenTags, profile?.allergens ?? []));
      setStatus('found');
    } catch {
      setStatus('error');
    }
  }, [photoPath]);

  useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    if (!analysis) return;
    await addFood({
      name: analysis.description,
      mealType: (meal[0] as MealType) ?? 'snack',
      ingredients: analysis.ingredients,
      portion: null,
      barcode: null,
      source: 'photo',
      loggedAt: nowISO(),
    });
    navigation.goBack();
  };

  if (status === 'loading') {
    return (
      <Screen topInset={false}>
        <Skeleton height={220} style={styles.gap} />
        <Skeleton width="70%" height={fontSize.lg} style={styles.gap} />
        <Skeleton width="90%" height={fontSize.md} />
      </Screen>
    );
  }

  if (status === 'error') {
    return (
      <Screen topInset={false}>
        <EmptyState
          icon="cloud-offline-outline"
          title="Couldn't analyze this photo"
          description="Check your connection and try again."
        />
        <SecondaryButton label="Try again" onPress={load} style={styles.gap} />
      </Screen>
    );
  }

  return (
    <Screen topInset={false}>
      <Image source={{ uri: `file://${photoPath}` }} style={styles.image} resizeMode="cover" />

      <Card tint="warningTint" bordered={false} style={styles.gap}>
        <Text style={styles.disclaimer}>
          AI estimate from a photo — not a guarantee. Double-check ingredients if you have a severe allergy.
        </Text>
      </Card>

      <Text style={styles.name}>{analysis!.description}</Text>

      {analysis!.confidence === 'low' && (
        <Text style={styles.lowConfidence}>
          Couldn't clearly identify this food — consider logging it manually instead for accuracy.
        </Text>
      )}

      {warnings.length > 0 ? (
        <Card tint="dangerTint" bordered={false} style={styles.gap}>
          <Text style={styles.warningTitle}>Possibly contains allergens you're watching</Text>
          <Text style={styles.warningText}>{warnings.map((a) => a.label).join(', ')}</Text>
        </Card>
      ) : (
        <Card tint="successTint" bordered={false} style={styles.gap}>
          <Text style={styles.okText}>No watched allergens flagged</Text>
        </Card>
      )}

      {analysis!.ingredients.length > 0 && (
        <View style={styles.gap}>
          <Text style={styles.sectionTitle}>Likely ingredients</Text>
          <Text style={styles.ingredients}>{analysis!.ingredients.join(', ')}</Text>
        </View>
      )}

      <FormField label="Meal">
        <ChipSelector options={MEALS} selected={meal} onChange={setMeal} multi={false} />
      </FormField>

      <PrimaryButton label="Log this food" onPress={save} style={styles.button} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  gap: { marginBottom: spacing.lg },
  image: { width: '100%', height: 220, borderRadius: radius.md, marginBottom: spacing.md },
  disclaimer: { fontSize: fontSize.sm, color: colors.text },
  name: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.text, marginBottom: spacing.xs },
  lowConfidence: { fontSize: fontSize.sm, color: colors.textMuted, marginBottom: spacing.md },
  warningTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.danger,
    marginBottom: spacing.xxs,
  },
  warningText: { fontSize: fontSize.sm, color: colors.danger },
  okText: { fontSize: fontSize.md, fontWeight: fontWeight.medium, color: colors.successText },
  sectionTitle: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: colors.text, marginBottom: spacing.xs },
  ingredients: { fontSize: fontSize.sm, color: colors.textMuted },
  button: { marginBottom: spacing.xl },
});
