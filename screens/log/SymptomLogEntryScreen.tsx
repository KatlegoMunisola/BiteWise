import React, { useState } from 'react';
import { StyleSheet, Text, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useLogStore } from '../../stores/useLogStore';
import { SYMPTOMS } from '../../constants/symptoms';
import ChipSelector from '../../components/forms/ChipSelector';
import FormField from '../../components/forms/FormField';
import SeveritySlider from '../../components/forms/SeveritySlider';
import Screen from '../../components/ui/Screen';
import { PrimaryButton } from '../../components/ui/Button';
import { colors, fontSize, fontWeight, radius, spacing } from '../../constants/theme';
import { nowISO } from '../../utils/dates';
import type { SymptomType } from '../../types/models';

export default function SymptomLogEntryScreen() {
  const navigation = useNavigation<{ goBack: () => void }>();
  const addSymptom = useLogStore((s) => s.addSymptom);
  const [type, setType] = useState<string[]>([]);
  const [severity, setSeverity] = useState<number | null>(null);
  const [bristol, setBristol] = useState<number | null>(null);
  const [notes, setNotes] = useState('');

  const selectedDef = SYMPTOMS.find((s) => s.id === type[0]);
  const valid = type.length > 0 && severity != null;

  const save = async () => {
    if (!valid) return;
    await addSymptom({
      symptomType: type[0] as SymptomType,
      severity: severity!,
      bristolScale: selectedDef?.usesBristol ? bristol : null,
      durationMinutes: null,
      notes: notes.trim() || null,
      loggedAt: nowISO(),
    });
    navigation.goBack();
  };

  return (
    <Screen topInset={false}>
      <Text style={styles.title}>Log symptom</Text>

      <FormField label="Symptom">
        <ChipSelector
          options={SYMPTOMS.map((s) => ({ value: s.id, label: s.label }))}
          selected={type}
          onChange={setType}
          multi={false}
        />
      </FormField>

      <FormField label="Severity (1 = mild, 10 = severe)">
        <SeveritySlider value={severity} onChange={setSeverity} />
      </FormField>

      {selectedDef?.usesBristol && (
        <FormField label="Bristol stool scale (1-7)">
          <SeveritySlider value={bristol} onChange={setBristol} min={1} max={7} />
        </FormField>
      )}

      <FormField label="Notes (optional)">
        <TextInput
          style={[styles.input, styles.notesInput]}
          placeholder="Anything else worth noting?"
          placeholderTextColor={colors.textMuted}
          value={notes}
          onChangeText={setNotes}
          multiline
        />
      </FormField>

      <PrimaryButton label="Save" onPress={save} disabled={!valid} style={styles.button} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.heavy,
    color: colors.text,
    marginBottom: spacing.lg,
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
  notesInput: { minHeight: 80, textAlignVertical: 'top' },
  button: { marginBottom: spacing.xl },
});
