import React, { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useLogStore } from '../stores/useLogStore';
import { colors, fontSize, fontWeight, spacing } from '../constants/theme';
import Screen from '../components/ui/Screen';
import Card from '../components/ui/Card';
import Icon from '../components/ui/Icon';
import { PrimaryButton } from '../components/ui/Button';
import useEntranceAnimation from '../hooks/useEntranceAnimation';
import type { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const navigation = useNavigation<{ navigate: (s: string, p?: object) => void }>();
  const { food, symptoms, factors, refresh } = useLogStore();

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const latestSymptom = symptoms.length > 0 ? symptoms[symptoms.length - 1] : null;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <Screen>
      <Text style={styles.greeting}>{greeting}</Text>
      <Text style={styles.subtitle}>Here's your day so far</Text>

      <View style={styles.cards}>
        <StatCard index={0} label="Meals logged" value={String(food.length)} icon="restaurant-outline" />
        <StatCard index={1} label="Symptoms" value={String(symptoms.length)} icon="medkit-outline" />
        <StatCard
          index={2}
          label="Stress"
          value={factors?.stressLevel != null ? `${factors.stressLevel}/10` : '—'}
          icon="leaf-outline"
        />
      </View>

      {latestSymptom && (
        <Card tint="dangerTint" bordered={false} style={styles.alertCard}>
          <Text style={styles.alertText}>
            Latest symptom: severity {latestSymptom.severity}/10. Hope you feel better soon.
          </Text>
        </Card>
      )}

      <Card tint="primaryLight" bordered={false} style={styles.streakCard}>
        <Icon name="flame" size="xl" color={colors.primary} />
        <View>
          <Text style={styles.streakTitle}>Logging streak</Text>
          <Text style={styles.streakText}>Coming soon — keep logging daily!</Text>
        </View>
      </Card>

      <Text style={styles.sectionTitle}>Quick actions</Text>
      <View style={styles.actions}>
        <PrimaryButton label="Log food" onPress={() => navigation.navigate('FoodLogEntry')} />
        <PrimaryButton label="Log symptom" onPress={() => navigation.navigate('SymptomLogEntry')} />
        <PrimaryButton label="Daily check-in" onPress={() => navigation.navigate('DailyFactors')} />
      </View>
    </Screen>
  );
}

function StatCard({
  index,
  label,
  value,
  icon,
}: {
  index: number;
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
}) {
  const entranceStyle = useEntranceAnimation(index);
  return (
    <Animated.View style={[styles.statCardWrap, entranceStyle]}>
      <Card style={styles.statCard}>
        <Icon name={icon} size="lg" color={colors.primary} />
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </Card>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  greeting: { fontSize: fontSize.xl, fontWeight: fontWeight.heavy, color: colors.text },
  subtitle: { fontSize: fontSize.md, color: colors.textMuted, marginBottom: spacing.lg },
  cards: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  statCardWrap: { flex: 1 },
  statCard: {
    alignItems: 'center',
    gap: spacing.xxs,
  },
  statValue: { fontSize: fontSize.lg, fontWeight: fontWeight.heavy, color: colors.text },
  statLabel: { fontSize: fontSize.sm, color: colors.textMuted, textAlign: 'center' },
  alertCard: { marginBottom: spacing.lg },
  alertText: { color: colors.danger, fontSize: fontSize.sm },
  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  streakTitle: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: colors.text },
  streakText: { fontSize: fontSize.sm, color: colors.textMuted },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  actions: { gap: spacing.sm },
});
