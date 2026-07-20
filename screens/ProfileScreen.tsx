import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getProfile } from '../db/profile';
import { useAuthStore } from '../stores/useAuthStore';
import { allergenLabel } from '../constants/allergens';
import { colors, fontSize, fontWeight, radius, spacing } from '../constants/theme';
import Screen from '../components/ui/Screen';
import Card from '../components/ui/Card';
import Skeleton from '../components/ui/Skeleton';
import { SecondaryButton } from '../components/ui/Button';
import type { Profile } from '../types/models';

export default function ProfileScreen() {
  const navigation = useNavigation<{ navigate: (s: string) => void }>();
  const { user, logOut, offlineDevMode } = useAuthStore();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      getProfile()
        .then(setProfile)
        .finally(() => setLoading(false));
    }, [])
  );

  return (
    <Screen>
      <Text style={styles.title}>Profile</Text>

      <Card style={styles.card}>
        {loading ? (
          <>
            <Skeleton width="60%" height={fontSize.lg} style={styles.skeletonGap} />
            <Skeleton width="40%" height={fontSize.sm} />
          </>
        ) : (
          <>
            <Text style={styles.name}>{profile?.name ?? '—'}</Text>
            <Text style={styles.email}>{user?.email ?? ''}</Text>
            {offlineDevMode && (
              <Text style={styles.devNote}>Local-only mode (no Firebase configured)</Text>
            )}
          </>
        )}
      </Card>

      <Text style={styles.sectionTitle}>Allergens watched</Text>
      <Card style={styles.card}>
        {loading ? (
          <Skeleton width="80%" height={fontSize.md} />
        ) : profile && profile.allergens.length > 0 ? (
          <Text style={styles.cardText}>{profile.allergens.map(allergenLabel).join(', ')}</Text>
        ) : (
          <Text style={styles.cardTextMuted}>None selected</Text>
        )}
      </Card>

      <Text style={styles.sectionTitle}>IBS subtype</Text>
      <Card style={styles.card}>
        {loading ? (
          <Skeleton width="50%" height={fontSize.md} />
        ) : (
          <Text style={styles.cardText}>{profile?.ibsSubtype ?? 'Not set'}</Text>
        )}
      </Card>

      <Card tint="accent" bordered={false} style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>
          BiteWise is not medical advice. Always read the physical product label and consult your
          doctor or dietitian about your condition.
        </Text>
      </Card>

      <SecondaryButton
        label="View onboarding again"
        onPress={() => navigation.navigate('Onboarding')}
        style={styles.onboardingButton}
      />

      <TouchableOpacity style={styles.signOut} onPress={logOut}>
        <Text style={styles.signOutText}>Sign out</Text>
      </TouchableOpacity>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.heavy,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  card: { marginBottom: spacing.lg, gap: spacing.xxs },
  skeletonGap: { marginBottom: spacing.xs },
  name: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.text },
  email: { fontSize: fontSize.sm, color: colors.textMuted },
  devNote: { fontSize: fontSize.sm, color: colors.warning, marginTop: spacing.xs },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  cardText: { fontSize: fontSize.md, color: colors.text },
  cardTextMuted: { fontSize: fontSize.md, color: colors.textMuted },
  disclaimer: {
    marginBottom: spacing.lg,
  },
  disclaimerText: { fontSize: fontSize.sm, color: colors.text },
  onboardingButton: { marginBottom: spacing.md },
  signOut: {
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  signOutText: { color: colors.danger, fontWeight: fontWeight.bold },
});
