import { Easing } from 'react-native-reanimated';

export const duration = {
  instant: 100,
  fast: 180,
  base: 240,
  slow: 320,
};

export const easing = {
  standard: Easing.bezier(0.2, 0, 0, 1),
  decelerate: Easing.bezier(0, 0, 0, 1),
  accelerate: Easing.bezier(0.3, 0, 1, 1),
};

export const pressScale = {
  down: 0.96,
  up: 1,
};

export const staggerStep = 40;
