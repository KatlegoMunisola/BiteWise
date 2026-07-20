import React, { useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { colors, fontSize, fontWeight, radius, spacing } from '../../constants/theme';
import usePressScale from '../../hooks/usePressScale';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ButtonState = 'idle' | 'loading' | 'error';

interface BaseProps {
  label: string;
  onPress: () => void | Promise<void>;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * Owns idle/loading/error state so every save flow gets visible failure
 * feedback for free, instead of each screen swallowing errors in its own
 * try/finally (previously the case everywhere except auth).
 */
function useAsyncPress(onPress: () => void | Promise<void>) {
  const [state, setState] = useState<ButtonState>('idle');
  const resetTimeout = useRef<ReturnType<typeof setTimeout>>();

  const handlePress = async () => {
    if (state === 'loading') return;
    clearTimeout(resetTimeout.current);
    setState('loading');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    try {
      await onPress();
      setState('idle');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    } catch {
      setState('error');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      resetTimeout.current = setTimeout(() => setState('idle'), 2500);
    }
  };

  return { state, handlePress };
}

export function PrimaryButton({ label, onPress, disabled, style }: BaseProps) {
  const { state, handlePress } = useAsyncPress(onPress);
  const { animatedStyle, onPressIn, onPressOut } = usePressScale();
  const isDisabled = disabled || state === 'loading';

  return (
    <AnimatedPressable
      style={[
        styles.primary,
        animatedStyle,
        isDisabled && styles.disabled,
        state === 'error' && styles.errorState,
        style,
      ]}
      onPress={handlePress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: state === 'loading' }}
    >
      {state === 'loading' ? (
        <ActivityIndicator color={colors.onPrimary} />
      ) : (
        <Text style={styles.primaryText} numberOfLines={1}>
          {state === 'error' ? "Couldn't save — tap to retry" : label}
        </Text>
      )}
    </AnimatedPressable>
  );
}

export function SecondaryButton({ label, onPress, disabled, style }: BaseProps) {
  const { state, handlePress } = useAsyncPress(onPress);
  const { animatedStyle, onPressIn, onPressOut } = usePressScale();
  const isDisabled = disabled || state === 'loading';

  return (
    <AnimatedPressable
      style={[styles.secondary, animatedStyle, isDisabled && styles.disabled, style]}
      onPress={handlePress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: state === 'loading' }}
    >
      {state === 'loading' ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        <Text style={styles.secondaryText} numberOfLines={1}>
          {label}
        </Text>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  primary: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  secondary: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  disabled: { opacity: 0.5 },
  errorState: { backgroundColor: colors.danger },
  primaryText: { color: colors.onPrimary, fontSize: fontSize.md, fontWeight: fontWeight.bold },
  secondaryText: { color: colors.primary, fontSize: fontSize.md, fontWeight: fontWeight.bold },
});
