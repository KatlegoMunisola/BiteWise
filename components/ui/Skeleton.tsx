import React, { useEffect } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { colors, radius } from '../../constants/theme';
import { duration, easing } from '../../constants/motion';

interface Props {
  width?: number | `${number}%`;
  height?: number;
  style?: StyleProp<ViewStyle>;
}

export default function Skeleton({ width = '100%', height = 16, style }: Props) {
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: duration.slow * 2, easing: easing.standard }),
      -1,
      true
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[{ width, height, borderRadius: radius.sm, backgroundColor: colors.border }, animatedStyle, style]}
    />
  );
}
