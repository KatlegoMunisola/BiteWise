import { useCallback } from 'react';
import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { duration, easing, pressScale } from '../constants/motion';

export default function usePressScale() {
  const scale = useSharedValue(1);

  const onPressIn = useCallback(() => {
    scale.value = withTiming(pressScale.down, {
      duration: duration.instant,
      easing: easing.standard,
    });
  }, [scale]);

  const onPressOut = useCallback(() => {
    scale.value = withTiming(pressScale.up, {
      duration: duration.instant,
      easing: easing.standard,
    });
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return { animatedStyle, onPressIn, onPressOut };
}
