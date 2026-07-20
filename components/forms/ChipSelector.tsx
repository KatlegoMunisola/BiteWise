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

interface Option {
  value: string;
  label: string;
}

interface Props {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  multi?: boolean;
}

export default function ChipSelector({ options, selected, onChange, multi = true }: Props) {
  const toggle = (value: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    if (multi) {
      onChange(
        selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]
      );
    } else {
      onChange(selected.includes(value) ? [] : [value]);
    }
  };

  return (
    <View style={styles.row}>
      {options.map((opt) => (
        <Chip
          key={opt.value}
          label={opt.label}
          active={selected.includes(opt.value)}
          onPress={() => toggle(opt.value)}
        />
      ))}
    </View>
  );
}

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
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
      style={[styles.chip, colorStyle, pressStyle]}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
    >
      <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  label: {
    fontSize: fontSize.sm,
    color: colors.text,
  },
  labelActive: {
    color: colors.onPrimary,
    fontWeight: fontWeight.medium,
  },
});
