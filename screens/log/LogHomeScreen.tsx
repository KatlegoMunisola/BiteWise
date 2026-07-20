import React, { useCallback } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useLogStore } from '../../stores/useLogStore';
import { symptomDef } from '../../constants/symptoms';
import { colors, radius, spacing, fontSize } from '../../constants/theme';
import { format, parseISO } from 'date-fns';

export default function LogHomeScreen() {
  const navigation = useNavigation<{ navigate: (s: string) => void }>();
  const { date, food, symptoms, factors, refresh } = useLogStore();

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const timeline = [
    ...food.map((f) => ({
      key: `food-${f.id}`,
      time: f.loggedAt,
      title: f.name,
      detail: `${f.mealType}${f.portion ? ` · ${f.portion}` : ''}`,
      emoji: '🍽️',
    })),
    ...symptoms.map((s) => {
      const def = symptomDef(s.symptomType);
      return {
        key: `symptom-${s.id}`,
        time: s.loggedAt,
        title: def.label,
        detail: `severity ${s.severity}/10${s.bristolScale ? ` · Bristol ${s.bristolScale}` : ''}`,
        emoji: def.emoji,
      };
    }),
  ].sort((a, b) => (a.time < b.time ? -1 : 1));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Today · {format(parseISO(date), 'EEE d MMM')}</Text>

      <View style={styles.actions}>
        <ActionButton label="Food" emoji="🍽️" onPress={() => navigation.navigate('FoodLogEntry')} />
        <ActionButton
          label="Symptom"
          emoji="🩺"
          onPress={() => navigation.navigate('SymptomLogEntry')}
        />
        <ActionButton
          label="Daily check-in"
          emoji="🧘"
          onPress={() => navigation.navigate('DailyFactors')}
        />
      </View>

      {factors?.stressLevel != null && (
        <View style={styles.factorsCard}>
          <Text style={styles.factorsText}>
            Daily check-in: stress {factors.stressLevel}/10
            {factors.sleepHours != null ? ` · sleep ${factors.sleepHours}h` : ''}
            {factors.waterGlasses != null ? ` · water ${factors.waterGlasses}` : ''}
          </Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>Timeline</Text>
      {timeline.length === 0 ? (
        <Text style={styles.empty}>Nothing logged yet today. Add your first entry above.</Text>
      ) : (
        timeline.map((item) => (
          <View key={item.key} style={styles.entry}>
            <Text style={styles.entryEmoji}>{item.emoji}</Text>
            <View style={styles.entryBody}>
              <Text style={styles.entryTitle}>{item.title}</Text>
              <Text style={styles.entryDetail}>{item.detail}</Text>
            </View>
            <Text style={styles.entryTime}>{format(parseISO(item.time), 'HH:mm')}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

function ActionButton({
  label,
  emoji,
  onPress,
}: {
  label: string;
  emoji: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.action} onPress={onPress}>
      <Text style={styles.actionEmoji}>{emoji}</Text>
      <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, maxWidth: 560, width: '100%', alignSelf: 'center' },
  heading: {
    fontSize: fontSize.lg,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.lg,
  },
  actions: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  action: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    padding: spacing.md,
  },
  actionEmoji: { fontSize: 24, marginBottom: spacing.xs },
  actionLabel: { fontSize: fontSize.sm, color: colors.text, fontWeight: '600' },
  factorsCard: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  factorsText: { color: colors.text, fontSize: fontSize.sm },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  empty: { color: colors.textMuted, fontSize: fontSize.sm },
  entry: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  entryEmoji: { fontSize: 20, marginRight: spacing.md },
  entryBody: { flex: 1 },
  entryTitle: { fontSize: fontSize.md, color: colors.text, fontWeight: '600' },
  entryDetail: { fontSize: fontSize.sm, color: colors.textMuted },
  entryTime: { fontSize: fontSize.sm, color: colors.textMuted },
});
