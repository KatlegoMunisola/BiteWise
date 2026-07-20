import { useEffect } from 'react';
import { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { duration, easing, staggerStep } from '../constants/motion';

/** Fade + rise entrance, staggered by `index` — for small fixed-size card/tile groups. */
export default function useEntranceAnimation(index = 0) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      index * staggerStep,
      withTiming(1, { duration: duration.base, easing: easing.decelerate })
    );
  }, [index, progress]);

  return useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * 12 }],
  }));
}
