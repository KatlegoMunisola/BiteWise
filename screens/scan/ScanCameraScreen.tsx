import React, { useCallback, useRef, useState } from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';
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
import { colors, fontSize, fontWeight, radius, spacing } from '../../constants/theme';

export default function ScanCameraScreen() {
  const navigation = useNavigation<{ navigate: (screen: string, params?: object) => void }>();
  const { hasPermission, requestPermission } = useCameraPermission();
  const [deniedOnce, setDeniedOnce] = useState(false);
  const device = useCameraDevice('back');
  const isFocused = useIsFocused();
  const hasScannedRef = useRef(false);

  useFocusEffect(
    useCallback(() => {
      hasScannedRef.current = false;
    }, [])
  );

  const codeScanner = useCodeScanner({
    codeTypes: ['ean-13', 'ean-8', 'upc-a', 'upc-e'],
    onCodeScanned: (codes) => {
      if (hasScannedRef.current) return;
      const value = codes[0]?.value;
      if (!value) return;
      hasScannedRef.current = true;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
      navigation.navigate('ScanResult', { barcode: value });
    },
  });

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
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isFocused}
        codeScanner={codeScanner}
      />
      <View style={styles.overlay} pointerEvents="none">
        <View style={styles.frame} />
        <Text style={styles.hint}>Point your camera at a barcode</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.text },
  button: { marginTop: spacing.md },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  frame: {
    width: '75%',
    aspectRatio: 1.6,
    borderRadius: radius.lg,
    borderWidth: 3,
    borderColor: colors.white,
  },
  hint: {
    marginTop: spacing.lg,
    color: colors.white,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
  },
});
