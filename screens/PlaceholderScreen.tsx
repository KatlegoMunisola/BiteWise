import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, fontSize } from '../constants/theme';

export default function PlaceholderScreen({
  title,
  phase,
}: {
  title: string;
  phase: string;
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.text}>Coming in {phase}.</Text>
    </View>
  );
}

export const ScanPlaceholder = () => (
  <PlaceholderScreen title="Barcode scanner 📷" phase="Phase 2" />
);
export const InsightsPlaceholder = () => (
  <PlaceholderScreen title="Insights 📈" phase="Phase 3" />
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  title: { fontSize: fontSize.lg, fontWeight: '800', color: colors.text },
  text: { fontSize: fontSize.md, color: colors.textMuted, marginTop: spacing.sm },
});
