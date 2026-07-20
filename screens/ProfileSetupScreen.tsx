import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { saveProfile } from '../db/profile';
import { useAppStore } from '../stores/useAppStore';
import { ALLERGENS } from '../constants/allergens';
import ChipSelector from '../components/forms/ChipSelector';
import FormField from '../components/forms/FormField';
import { colors, radius, spacing, fontSize } from '../constants/theme';
import type { IBSSubtype } from '../types/models';
import { syncAll } from '../services/sync';
import { useAuthStore } from '../stores/useAuthStore';

const IBS_OPTIONS: { value: IBSSubtype; label: string }[] = [
  { value: 'IBS-D', label: 'IBS-D (diarrhea)' },
  { value: 'IBS-C', label: 'IBS-C (constipation)' },
  { value: 'IBS-M', label: 'IBS-M (mixed)' },
  { value: 'IBS-U', label: 'IBS-U (unclassified)' },
];

export default function ProfileSetupScreen() {
  const [name, setName] = useState('');
  const [allergens, setAllergens] = useState<string[]>([]);
  const [ibs, setIbs] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const setProfileReady = useAppStore((s) => s.setProfileReady);
  const user = useAuthStore((s) => s.user);

  const save = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await saveProfile({
        name: name.trim(),
        allergens,
        ibsSubtype: (ibs[0] as IBSSubtype) ?? null,
        dietaryPrefs: [],
      });
      if (user) {
        syncAll(user.uid).catch(() => {});
      }
      setProfileReady(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Set up your profile</Text>
      <Text style={styles.subtitle}>
        This tailors allergen alerts and insights to you. You can change it anytime.
      </Text>

      <FormField label="Your name">
        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor={colors.textMuted}
          value={name}
          onChangeText={setName}
        />
      </FormField>

      <FormField label="Allergens to watch for">
        <ChipSelector
          options={ALLERGENS.map((a) => ({ value: a.id, label: a.label }))}
          selected={allergens}
          onChange={setAllergens}
        />
      </FormField>

      <FormField label="IBS subtype (if diagnosed)">
        <ChipSelector
          options={IBS_OPTIONS}
          selected={ibs}
          onChange={setIbs}
          multi={false}
        />
      </FormField>

      <TouchableOpacity
        style={[styles.button, !name.trim() && styles.buttonDisabled]}
        onPress={save}
        disabled={saving || !name.trim()}
      >
        <Text style={styles.buttonText}>{saving ? 'Saving…' : 'Continue'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingTop: spacing.xl * 2,
    maxWidth: 560,
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textMuted,
    marginBottom: spacing.xl,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: fontSize.md,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: fontSize.md,
    fontWeight: '700',
  },
});
