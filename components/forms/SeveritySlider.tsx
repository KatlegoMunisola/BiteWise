import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { colors, fontSize, fontWeight, radius, spacing } from '../../constants/theme';
import { duration, easing } from '../../constants/motion';
import usePressScale from '../../hooks/usePressScale';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface Props {
  value: number | null;
  onChange: (value: number) => void;
  /** Inclusive scale bounds; defaults to 1-10. */
  min?: number;
  max?: number;
}

/** Discrete tap-scale (no extra slider dependency; works on web + native). */
export default function SeveritySlider({ value, onChange, min = 1, max = 10 }: Props) {
  const steps: number[] = [];
  for (let i = min; i <= max; i++) steps.push(i);

  const select = (step: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onChange(step);
  };

  return (
    <View style={styles.row}>
      {steps.map((step) => (
        <Step key={step} value={step} active={value === step} onPress={() => select(step)} />
      ))}
    </View>
  );
}

function Step({ value, active, onPress }: { value: number; active: boolean; onPress: () => void }) {
  const { animatedStyle: pressStyle, onPressIn, onPressOut } = usePressScale();
  const activeProgress = useSharedValue(active ? 1 : 0);

  useEffect(() => {
    activeProgress.value = withTiming(active ? 1 : 0, { duration: duration.fast, easing: easing.standard });
  }, [active, activeProgress]);

  const colorStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(activeProgress.value, [0, 1], [colors.surface, colors.primary]),
    borderColor: interpolateColor(activeProgress.value, [0, 1], [colors.border, colors.primary]),
  }));

  return (
    <AnimatedPressable
      style={[styles.step, colorStyle, pressStyle]}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
    >
      <Text style={[styles.label, active && styles.labelActive]}>{value}</Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  step: {
    minWidth: 34,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  label: {
    fontSize: fontSize.sm,
    color: colors.text,
  },
  labelActive: {
    color: colors.onPrimary,
    fontWeight: fontWeight.bold,
  },
});
