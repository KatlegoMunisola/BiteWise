import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, radius, spacing, fontSize } from '../../constants/theme';

interface Props {
  value: number | null;
  onChange: (value: number) => void;
  /** Inclusive scale bounds; defaults to 1-10. */
  min?: number;
  max?: number;
}

/** Discrete tap-scale (no extra slider dependency; works on web + native). */
export default function SeveritySlider({ value, onChange, min = 1, max = 10 }: Props) {
  const steps = [];
  for (let i = min; i <= max; i++) steps.push(i);

  return (
    <View style={styles.row}>
      {steps.map((step) => {
        const active = value === step;
        return (
          <TouchableOpacity
            key={step}
            style={[styles.step, active && styles.stepActive]}
            onPress={() => onChange(step)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
          >
            <Text style={[styles.label, active && styles.labelActive]}>{step}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
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
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  stepActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  label: {
    fontSize: fontSize.sm,
    color: colors.text,
  },
  labelActive: {
    color: '#fff',
    fontWeight: '700',
  },
});
