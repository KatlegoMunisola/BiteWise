import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, fontWeight } from '../../constants/theme';

interface Props {
  /** Width/height of the square mark. */
  size?: number;
  /** 'mark' is just the badge; 'lockup' adds the "BiteWise" wordmark beside it. */
  variant?: 'mark' | 'lockup';
}

export default function Logo({ size = 64, variant = 'mark' }: Props) {
  const mark = (
    <Image
      source={require('../../assets/logo.png')}
      style={{ width: size, height: size }}
      resizeMode="contain"
    />
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
  lockup: {
    alignItems: 'center',
    gap: 10,
  },
  wordmark: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.heavy,
    color: colors.text,
  },
});
