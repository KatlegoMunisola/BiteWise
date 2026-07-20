import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, fontWeight } from '../../constants/theme';

interface Props {
  /** Diameter of the circular mark. */
  size?: number;
  /** Color the bite cutout composites onto — match the surface behind the logo. */
  backgroundColor?: string;
  /** 'mark' is just the badge; 'lockup' adds the "BiteWise" wordmark beside it. */
  variant?: 'mark' | 'lockup';
}

/**
 * Bite-mark + leaf brand mark, built from plain View/Text primitives (no
 * SVG dependency), matching the convention established in
 * components/onboarding/Illustrations.tsx.
 */
export default function Logo({ size = 64, backgroundColor = colors.background, variant = 'mark' }: Props) {
  const biteSize = size * 0.42;
  const leafWidth = size * 0.24;
  const leafHeight = size * 0.13;

  const mark = (
    <View
      style={[
        styles.circle,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <View
        style={[
          styles.bite,
          {
            width: biteSize,
            height: biteSize,
            borderRadius: biteSize / 2,
            top: -biteSize * 0.28,
            right: -biteSize * 0.28,
            backgroundColor,
          },
        ]}
      />
      <View
        style={[
          styles.leaf,
          {
            width: leafWidth,
            height: leafHeight,
            borderRadius: leafHeight / 2,
            top: size * 0.3,
            right: size * 0.16,
          },
        ]}
      />
    </View>
  );

  if (variant === 'mark') return mark;

  return (
    <View style={styles.lockup}>
      {mark}
      <Text style={styles.wordmark}>BiteWise</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    backgroundColor: colors.primary,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bite: {
    position: 'absolute',
  },
  leaf: {
    position: 'absolute',
    backgroundColor: colors.primaryLight,
    transform: [{ rotate: '40deg' }],
  },
  lockup: {
    alignItems: 'center',
    gap: 10,
  },
  wordmark: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.heavy,
    color: colors.primary,
  },
});
