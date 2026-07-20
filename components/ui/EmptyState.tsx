import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, fontWeight, spacing } from '../../constants/theme';
import Icon from './Icon';

interface Props {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  style?: StyleProp<ViewStyle>;
}

export default function EmptyState({
  icon = 'file-tray-outline',
  title,
  description,
  style,
}: Props) {
  return (
    <View style={[styles.container, style]}>
      <Icon name={icon} size="xxl" color={colors.textMuted} />
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: spacing.xl, gap: spacing.xs },
  title: {
    fontSize: fontSize.md,
    color: colors.textMuted,
    fontWeight: fontWeight.medium,
    textAlign: 'center',
  },
  description: { fontSize: fontSize.sm, color: colors.textMuted, textAlign: 'center' },
});
