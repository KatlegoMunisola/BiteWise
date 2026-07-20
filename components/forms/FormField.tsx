import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, fontSize } from '../../constants/theme';

interface Props {
  label: string;
  children: React.ReactNode;
}

export default function FormField({ label, children }: Props) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
});
