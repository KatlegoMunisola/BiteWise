import React, { useCallback, useRef, useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import usePressScale from '../../hooks/usePressScale';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { CenteredScreen } from '../../components/ui/Screen';
import EmptyState from '../../components/ui/EmptyState';
import { PrimaryButton, SecondaryButton } from '../../components/ui/Button';
import ChipSelector from '../../components/forms/ChipSelector';
import { colors, fontSize, fontWeight, radius, spacing } from '../../constants/theme';

const MODES = [
  { value: 'barcode', label: 'Barcode' },
  { value: 'photo', label: 'Meal photo' },
];

export default function ScanCameraScreen() {
  const navigation = useNavigation<{ navigate: (screen: string, params?: object) => void }>();
  const { hasPermission, requestPermission } = useCameraPermission();
  const [deniedOnce, setDeniedOnce] = useState(false);
  const [mode, setMode] = useState<'barcode' | 'photo'>('barcode');
  const [capturing, setCapturing] = useState(false);
  const device = useCameraDevice('back');
  const isFocused = useIsFocused();
  const hasScannedRef = useRef(false);
  const cameraRef = useRef<Camera>(null);
  const insets = useSafeAreaInsets();

  useFocusEffect(
    useCallback(() => {
      hasScannedRef.current = false;
    }, [])
  );

  const codeScanner = useCodeScanner({
    codeTypes: ['ean-13', 'ean-8', 'upc-a', 'upc-e'],
    onCodeScanned: (codes) => {
      if (mode !== 'barcode' || hasScannedRef.current) return;
      const value = codes[0]?.value;
      if (!value) return;
      hasScannedRef.current = true;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
      navigation.navigate('ScanResult', { barcode: value });
    },
  });

  const takeMealPhoto = async () => {
    if (capturing || !cameraRef.current) return;
    setCapturing(true);
    try {
      const photo = await cameraRef.current.takePhoto();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
      navigation.navigate('MealPhotoResult', { photoPath: photo.path });
    } catch {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
    } finally {
      setCapturing(false);
    }
  };

  if (!hasPermission) {
    return (
      <CenteredScreen>
        <EmptyState
          icon="camera-outline"
          title="Camera access needed"
          description="BiteWise needs your camera to scan product barcodes."
        />
        <PrimaryButton
          label="Grant camera access"
          onPress={async () => {
            const granted = await requestPermission();
            if (!granted) setDeniedOnce(true);
          }}
          style={styles.button}
        />
        {deniedOnce && (
          <SecondaryButton
            label="Open settings"
            onPress={() => Linking.openSettings()}
            style={styles.button}
          />
        )}
      </CenteredScreen>
    );
  }

  if (!device) {
    return (
      <CenteredScreen>
        <EmptyState icon="camera-outline" title="No camera found" />
      </CenteredScreen>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isFocused}
        photo
        codeScanner={mode === 'barcode' ? codeScanner : undefined}
      />
      <View style={styles.overlay} pointerEvents="box-none">
        <View style={[styles.modeToggleWrap, { marginTop: insets.top + spacing.md }]}>
          <ChipSelector
            options={MODES}
            selected={[mode]}
            onChange={(sel) => setMode(sel[0] as 'barcode' | 'photo')}
            multi={false}
          />
        </View>

        <View style={styles.centerArea} pointerEvents="none">
          {mode === 'barcode' && <View style={styles.frame} />}
        </View>

        <View style={[styles.bottomArea, { paddingBottom: insets.bottom + spacing.xl }]}>
          <Text style={styles.hint}>
            {mode === 'barcode' ? 'Point your camera at a barcode' : 'Frame your meal, then tap to capture'}
          </Text>
          {mode === 'photo' && <ShutterButton onPress={takeMealPhoto} disabled={capturing} />}
        </View>
      </View>
    </View>
  );
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function ShutterButton({ onPress, disabled }: { onPress: () => void; disabled: boolean }) {
  const { animatedStyle, onPressIn, onPressOut } = usePressScale();

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel="Take photo"
      style={[styles.shutterOuter, animatedStyle, disabled && styles.shutterDisabled]}
    >
      <View style={styles.shutterInner} />
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.text },
  button: { marginTop: spacing.md },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
  },
  modeToggleWrap: {
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: radius.pill,
    padding: spacing.xxs,
  },
  centerArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomArea: {
    alignItems: 'center',
    gap: spacing.lg,
  },
  frame: {
    width: '75%',
    aspectRatio: 1.6,
    borderRadius: radius.lg,
    borderWidth: 3,
    borderColor: colors.white,
  },
  hint: {
    color: colors.white,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  shutterOuter: {
    width: 72,
    height: 72,
    borderRadius: radius.pill,
    borderWidth: 4,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
  },
  shutterDisabled: {
    opacity: 0.5,
  },
});
