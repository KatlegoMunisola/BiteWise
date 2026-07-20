import React from 'react';
import { ScrollView, ScrollViewProps, StyleSheet, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, contentWidth, spacing } from '../../constants/theme';

interface Props extends ScrollViewProps {
  children: React.ReactNode;
  narrow?: boolean;
  contentStyle?: ViewStyle;
  /** Set false when a native-stack header already reserves top safe-area space. */
  topInset?: boolean;
}

export default function Screen({
  children,
  narrow,
  contentStyle,
  topInset = true,
  ...scrollProps
}: Props) {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { maxWidth: narrow ? contentWidth.narrow : contentWidth.standard },
        topInset && { paddingTop: spacing.lg + insets.top },
        contentStyle,
      ]}
      {...scrollProps}
    >
      {children}
    </ScrollView>
  );
}

export function CenteredScreen({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  const insets = useSafeAreaInsets();
  return <View style={[styles.centered, { paddingTop: spacing.lg + insets.top }, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, width: '100%', alignSelf: 'center' },
  centered: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
});
