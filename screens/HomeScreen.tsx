import React, { useCallback } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useLogStore } from '../stores/useLogStore';
import { colors, radius, spacing, fontSize } from '../constants/theme';

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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.greeting}>{greeting} 👋</Text>
      <Text style={styles.subtitle}>Here's your day so far</Text>

      <View style={styles.cards}>
        <StatCard label="Meals logged" value={String(food.length)} emoji="🍽️" />
        <StatCard label="Symptoms" value={String(symptoms.length)} emoji="🩺" />
        <StatCard
          label="Stress"
          value={factors?.stressLevel != null ? `${factors.stressLevel}/10` : '—'}
          emoji="🧘"
        />
      </View>

      {latestSymptom && (
        <View style={styles.alertCard}>
          <Text style={styles.alertText}>
            Latest symptom: severity {latestSymptom.severity}/10. Hope you feel better soon.
          </Text>
        </View>
      )}

      <View style={styles.streakCard}>
        <Text style={styles.streakEmoji}>🔥</Text>
        <View>
          <Text style={styles.streakTitle}>Logging streak</Text>
          <Text style={styles.streakText}>Coming soon — keep logging daily!</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Quick actions</Text>
      <View style={styles.actions}>
        <QuickAction label="Log food" onPress={() => navigation.navigate('FoodLogEntry')} />
        <QuickAction label="Log symptom" onPress={() => navigation.navigate('SymptomLogEntry')} />
        <QuickAction label="Daily check-in" onPress={() => navigation.navigate('DailyFactors')} />
      </View>
    </ScrollView>
  );
}

function StatCard({ label, value, emoji }: { label: string; value: string; emoji: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statEmoji}>{emoji}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function QuickAction({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.quickAction} onPress={onPress}>
      <Text style={styles.quickActionText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, maxWidth: 560, width: '100%', alignSelf: 'center' },
  greeting: { fontSize: fontSize.xl, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: fontSize.md, color: colors.textMuted, marginBottom: spacing.lg },
  cards: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    padding: spacing.md,
  },
  statEmoji: { fontSize: 20 },
  statValue: { fontSize: fontSize.lg, fontWeight: '800', color: colors.text },
  statLabel: { fontSize: 11, color: colors.textMuted, textAlign: 'center' },
  alertCard: {
    backgroundColor: '#fdecea',
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  alertText: { color: colors.danger, fontSize: fontSize.sm },
  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  streakEmoji: { fontSize: 28 },
  streakTitle: { fontSize: fontSize.md, fontWeight: '700', color: colors.text },
  streakText: { fontSize: fontSize.sm, color: colors.textMuted },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  actions: { gap: spacing.sm },
  quickAction: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  quickActionText: { color: '#fff', fontWeight: '700', fontSize: fontSize.md },
});
