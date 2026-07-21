import React, { useCallback, useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getProfile } from '../../db/profile';
import { lookupProduct, type OFFProduct } from '../../services/openFoodFacts';
import { matchAllergens } from '../../utils/allergenMatch';
import { useLogStore } from '../../stores/useLogStore';
import { MEALS } from '../../constants/meals';
import ChipSelector from '../../components/forms/ChipSelector';
import FormField from '../../components/forms/FormField';
import Screen from '../../components/ui/Screen';
import Card from '../../components/ui/Card';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import Icon from '../../components/ui/Icon';
import { PrimaryButton, SecondaryButton } from '../../components/ui/Button';
import { colors, fontSize, fontWeight, radius, spacing } from '../../constants/theme';
import { nowISO } from '../../utils/dates';
import type { AllergenDef } from '../../constants/allergens';
import type { MealType } from '../../types/models';

type Status = 'loading' | 'not-found' | 'error' | 'found';

export default function ScanResultScreen() {
  const navigation = useNavigation<{ goBack: () => void; navigate: (s: string) => void }>();
  const route = useRoute<{ key: string; name: string; params: { barcode: string } }>();
  const { barcode } = route.params;
  const addFood = useLogStore((s) => s.addFood);

  const [status, setStatus] = useState<Status>('loading');
  const [product, setProduct] = useState<OFFProduct | null>(null);
  const [warnings, setWarnings] = useState<AllergenDef[]>([]);
  const [meal, setMeal] = useState<string[]>(['snack']);

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const [profile, result] = await Promise.all([getProfile(), lookupProduct(barcode)]);
      if (!result) {
        setStatus('not-found');
        return;
      }
      setProduct(result);
      setWarnings(matchAllergens(result.allergenTags, profile?.allergens ?? []));
      setStatus('found');
    } catch {
      setStatus('error');
    }
  }, [barcode]);

  useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    if (!product) return;
    await addFood({
      name: product.name,
      mealType: (meal[0] as MealType) ?? 'snack',
      ingredients: product.ingredients,
      portion: null,
      barcode: product.barcode,
      source: 'scan',
      loggedAt: nowISO(),
    });
    navigation.goBack();
  };

  if (status === 'loading') {
    return (
      <Screen topInset={false}>
        <Skeleton height={180} style={styles.gap} />
        <Skeleton width="70%" height={fontSize.lg} style={styles.gap} />
        <Skeleton width="90%" height={fontSize.md} />
      </Screen>
    );
  }

  if (status === 'not-found') {
    return (
      <Screen topInset={false}>
        <EmptyState
          icon="barcode-outline"
          title="Product not found"
          description="This barcode isn't in the Open Food Facts database yet."
        />
        <SecondaryButton
          label="Log it manually"
          onPress={() => navigation.navigate('FoodLogEntry')}
          style={styles.gap}
        />
      </Screen>
    );
  }

  if (status === 'error') {
    return (
      <Screen topInset={false}>
        <EmptyState
          icon="cloud-offline-outline"
          title="Couldn't look up this product"
          description="Check your connection and try again."
        />
        <SecondaryButton label="Try again" onPress={load} style={styles.gap} />
      </Screen>
    );
  }

  return (
    <Screen topInset={false}>
      {product!.imageUrl ? (
        <Image source={{ uri: product!.imageUrl }} style={styles.image} resizeMode="contain" />
      ) : (
        <View style={[styles.image, styles.imageFallback]}>
          <Icon name="fast-food-outline" size="xxl" color={colors.textMuted} />
        </View>
      )}

      <Text style={styles.name}>{product!.name}</Text>

      {warnings.length > 0 ? (
        <Card tint="dangerTint" bordered={false} style={styles.gap}>
          <Text style={styles.warningTitle}>Contains allergens you're watching</Text>
          <Text style={styles.warningText}>{warnings.map((a) => a.label).join(', ')}</Text>
        </Card>
      ) : (
        <Card tint="successTint" bordered={false} style={styles.gap}>
          <Text style={styles.okText}>No watched allergens found</Text>
        </Card>
      )}

      {product!.ingredients.length > 0 && (
        <View style={styles.gap}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          <Text style={styles.ingredients}>{product!.ingredients.join(', ')}</Text>
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
  image: { width: '100%', height: 180, borderRadius: radius.md, marginBottom: spacing.md },
  imageFallback: { backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.text, marginBottom: spacing.md },
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
