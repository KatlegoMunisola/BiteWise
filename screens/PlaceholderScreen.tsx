import React from 'react';
import { StyleSheet, Text } from 'react-native';
import type { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, fontWeight, spacing } from '../constants/theme';
import { CenteredScreen } from '../components/ui/Screen';
import Icon from '../components/ui/Icon';

export default function PlaceholderScreen({
  title,
  phase,
  icon,
}: {
  title: string;
  phase: string;
  icon: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <CenteredScreen>
      <Icon name={icon} size="xxl" color={colors.primary} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.text}>Coming in {phase}.</Text>
    </CenteredScreen>
  );
}

export const ScanPlaceholder = () => (
  <PlaceholderScreen title="Barcode scanner" phase="Phase 2" icon="barcode-outline" />
);
export const InsightsPlaceholder = () => (
  <PlaceholderScreen title="Insights" phase="Phase 3" icon="stats-chart-outline" />
);

const styles = StyleSheet.create({
  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.heavy,
    color: colors.text,
    marginTop: spacing.md,
  },
  text: { fontSize: fontSize.md, color: colors.textMuted, marginTop: spacing.sm },
});
