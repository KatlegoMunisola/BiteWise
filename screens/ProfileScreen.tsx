import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getProfile } from '../db/profile';
import { useAuthStore } from '../stores/useAuthStore';
import { allergenLabel } from '../constants/allergens';
import { colors, radius, spacing, fontSize } from '../constants/theme';
import type { Profile } from '../types/models';

export default function ProfileScreen() {
  const { user, logOut, offlineDevMode } = useAuthStore();
  const [profile, setProfile] = useState<Profile | null>(null);

  useFocusEffect(
    useCallback(() => {
      getProfile().then(setProfile);
    }, [])
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Profile</Text>

      <View style={styles.card}>
        <Text style={styles.name}>{profile?.name ?? '—'}</Text>
        <Text style={styles.email}>{user?.email ?? ''}</Text>
        {offlineDevMode && <Text style={styles.devNote}>Local-only mode (no Firebase configured)</Text>}
      </View>

      <Text style={styles.sectionTitle}>Allergens watched</Text>
      <View style={styles.card}>
        {profile && profile.allergens.length > 0 ? (
          <Text style={styles.cardText}>{profile.allergens.map(allergenLabel).join(', ')}</Text>
        ) : (
          <Text style={styles.cardTextMuted}>None selected</Text>
        )}
      </View>

      <Text style={styles.sectionTitle}>IBS subtype</Text>
      <View style={styles.card}>
        <Text style={styles.cardText}>{profile?.ibsSubtype ?? 'Not set'}</Text>
      </View>

      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>
          BiteWise is not medical advice. Always read the physical product label and consult your
          doctor or dietitian about your condition.
        </Text>
      </View>

      <TouchableOpacity style={styles.signOut} onPress={logOut}>
        <Text style={styles.signOutText}>Sign out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, maxWidth: 560, width: '100%', alignSelf: 'center' },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  name: { fontSize: fontSize.lg, fontWeight: '700', color: colors.text },
  email: { fontSize: fontSize.sm, color: colors.textMuted },
  devNote: { fontSize: fontSize.sm, color: colors.warning, marginTop: spacing.xs },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  cardText: { fontSize: fontSize.md, color: colors.text },
  cardTextMuted: { fontSize: fontSize.md, color: colors.textMuted },
  disclaimer: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  disclaimerText: { fontSize: fontSize.sm, color: colors.text },
  signOut: {
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  signOutText: { color: colors.danger, fontWeight: '700' },
});
