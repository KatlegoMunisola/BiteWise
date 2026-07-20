import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { colors, elevation, radius, spacing } from '../../constants/theme';

type Tint = 'surface' | 'primaryLight' | 'accent' | 'dangerTint' | 'warningTint' | 'successTint';

interface Props {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  tint?: Tint;
  bordered?: boolean;
}

const TINTS: Record<Tint, string> = {
  surface: colors.surface,
  primaryLight: colors.primaryLight,
  accent: colors.accent,
  dangerTint: colors.dangerTint,
  warningTint: colors.warningTint,
  successTint: colors.successTint,
};

export default function Card({ children, style, tint = 'surface', bordered = true }: Props) {
  return (
    <View
      style={[styles.card, { backgroundColor: TINTS[tint] }, bordered && styles.bordered, style]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.md,
    padding: spacing.md,
    ...elevation.low,
  },
  bordered: {
    borderWidth: 1,
    borderColor: colors.border,
  },
});
