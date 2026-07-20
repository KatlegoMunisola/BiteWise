import React, { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useLogStore } from '../../stores/useLogStore';
import { symptomDef } from '../../constants/symptoms';
import { colors, fontSize, fontWeight, radius, spacing } from '../../constants/theme';
import { duration } from '../../constants/motion';
import { format, parseISO } from 'date-fns';
import Screen from '../../components/ui/Screen';
import Card from '../../components/ui/Card';
import Icon from '../../components/ui/Icon';
import EmptyState from '../../components/ui/EmptyState';
import usePressScale from '../../hooks/usePressScale';
import useEntranceAnimation from '../../hooks/useEntranceAnimation';
import type { Ionicons } from '@expo/vector-icons';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

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
      icon: 'restaurant-outline' as const,
    })),
    ...symptoms.map((s) => {
      const def = symptomDef(s.symptomType);
      return {
        key: `symptom-${s.id}`,
        time: s.loggedAt,
        title: def.label,
        detail: `severity ${s.severity}/10${s.bristolScale ? ` · Bristol ${s.bristolScale}` : ''}`,
        icon: def.icon,
      };
    }),
  ].sort((a, b) => (a.time < b.time ? -1 : 1));

  return (
    <Screen>
      <Text style={styles.heading}>Today · {format(parseISO(date), 'EEE d MMM')}</Text>

      <View style={styles.actions}>
        <ActionButton
          index={0}
          label="Food"
          icon="restaurant-outline"
          onPress={() => navigation.navigate('FoodLogEntry')}
        />
        <ActionButton
          index={1}
          label="Symptom"
          icon="medkit-outline"
          onPress={() => navigation.navigate('SymptomLogEntry')}
        />
        <ActionButton
          index={2}
          label="Daily check-in"
          icon="leaf-outline"
          onPress={() => navigation.navigate('DailyFactors')}
        />
      </View>

      {factors?.stressLevel != null && (
        <Card tint="primaryLight" bordered={false} style={styles.factorsCard}>
          <Text style={styles.factorsText}>
            Daily check-in: stress {factors.stressLevel}/10
            {factors.sleepHours != null ? ` · sleep ${factors.sleepHours}h` : ''}
            {factors.waterGlasses != null ? ` · water ${factors.waterGlasses}` : ''}
          </Text>
        </Card>
      )}

      <Text style={styles.sectionTitle}>Timeline</Text>
      {timeline.length === 0 ? (
        <EmptyState
          icon="time-outline"
          title="Nothing logged yet today"
          description="Add your first entry above."
        />
      ) : (
        timeline.map((item, i) => (
          <Animated.View
            key={item.key}
            entering={FadeInDown.duration(duration.base).delay(Math.min(i, 6) * 30)}
            style={styles.entry}
          >
            <Icon name={item.icon} size="lg" color={colors.primary} />
            <View style={styles.entryBody}>
              <Text style={styles.entryTitle}>{item.title}</Text>
              <Text style={styles.entryDetail}>{item.detail}</Text>
            </View>
            <Text style={styles.entryTime}>{format(parseISO(item.time), 'HH:mm')}</Text>
          </Animated.View>
        ))
      )}
    </Screen>
  );
}

function ActionButton({
  index,
  label,
  icon,
  onPress,
}: {
  index: number;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}) {
  const { animatedStyle: pressStyle, onPressIn, onPressOut } = usePressScale();
  const entranceStyle = useEntranceAnimation(index);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onPress();
  };

  return (
    <AnimatedPressable
      style={[styles.action, pressStyle, entranceStyle]}
      onPress={handlePress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      <Icon name={icon} size="lg" color={colors.primary} />
      <Text style={styles.actionLabel}>{label}</Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.heavy,
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
    gap: spacing.xs,
  },
  actionLabel: { fontSize: fontSize.sm, color: colors.text, fontWeight: fontWeight.medium },
  factorsCard: { marginBottom: spacing.lg },
  factorsText: { color: colors.text, fontSize: fontSize.sm },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  entry: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  entryBody: { flex: 1 },
  entryTitle: { fontSize: fontSize.md, color: colors.text, fontWeight: fontWeight.medium },
  entryDetail: { fontSize: fontSize.sm, color: colors.textMuted },
  entryTime: { fontSize: fontSize.sm, color: colors.textMuted },
});
