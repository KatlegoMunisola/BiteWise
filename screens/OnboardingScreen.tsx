import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import { useNavigation } from '@react-navigation/native';
import { useAppStore } from '../stores/useAppStore';
import { colors, radius, spacing, fontSize, fontWeight, lineHeight } from '../constants/theme';
import {
  AllergenIllustration,
  InsightIllustration,
  TrackIllustration,
} from '../components/onboarding/Illustrations';

const Skip = ({ skipLabel, onPress }: { skipLabel: string; onPress: () => void }) => (
  <TouchableOpacity
    onPress={onPress}
    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
    style={{ marginLeft: spacing.lg }}
  >
    <Text style={{ color: colors.textMuted, fontSize: fontSize.sm, fontWeight: fontWeight.medium }}>
      {skipLabel}
    </Text>
  </TouchableOpacity>
);

const Pill = ({ label, onPress }: { label: string; onPress: () => void }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      marginRight: spacing.lg,
      backgroundColor: colors.primary,
      borderRadius: radius.pill,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
    }}
  >
    <Text
      numberOfLines={1}
      style={{ color: colors.onPrimary, fontSize: fontSize.md, fontWeight: fontWeight.bold }}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const Next = ({ nextLabel, onPress }: { nextLabel: string; onPress: () => void }) => (
  <Pill label={nextLabel} onPress={onPress} />
);

const Done = ({ onPress }: { onPress: () => void }) => <Pill label="Start" onPress={onPress} />;

const Dots = ({ selected }: { selected: boolean }) => (
  <View
    style={{
      width: selected ? 20 : 8,
      height: 8,
      borderRadius: 4,
      marginHorizontal: 3,
      backgroundColor: selected ? colors.primary : colors.border,
    }}
  />
);

const OnboardingScreen = () => {
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const navigation = useNavigation<{ canGoBack: () => boolean; goBack: () => void }>();

  // When replayed from the profile screen this is pushed on top of the
  // existing stack, so finishing should just pop back instead of
  // re-running first-launch onboarding bookkeeping.
  const finish = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      completeOnboarding();
    }
  };

  return (
    <Onboarding
      bottomBarHeight={88}
      titleStyles={{
        color: colors.text,
        fontSize: fontSize.xl,
        fontWeight: fontWeight.heavy,
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.sm,
      }}
      subTitleStyles={{
        color: colors.textMuted,
        fontSize: fontSize.md,
        lineHeight: lineHeight.md,
        paddingHorizontal: spacing.lg,
      }}
      imageContainerStyles={{ paddingBottom: spacing.xl }}
      SkipButtonComponent={Skip}
      NextButtonComponent={Next}
      DoneButtonComponent={Done}
      DotComponent={Dots}
      onSkip={finish}
      onDone={finish}
      pages={[
        {
          backgroundColor: colors.primaryLight,
          image: <TrackIllustration />,
          title: 'Track with ease',
          subtitle: 'Log meals, symptoms, and stress in seconds, so patterns become obvious instead of overwhelming.',
        },
        {
          backgroundColor: colors.accent,
          image: <AllergenIllustration />,
          title: 'Unmask hidden allergens',
          subtitle: 'We scan ingredient lists for sneaky aliases — like casein, tahini, or albumen — before they catch you off guard.',
        },
        {
          backgroundColor: colors.background,
          image: <InsightIllustration />,
          title: 'Feel confident, not confused',
          subtitle: 'See how food, stress, and symptoms connect, and get gentle guidance made for you.',
        },
      ]}
    />
  );
};

export default OnboardingScreen;
