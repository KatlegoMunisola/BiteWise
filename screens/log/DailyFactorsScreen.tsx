import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useLogStore } from '../../stores/useLogStore';
import { COPING_ACTIVITIES, STRESS_TRIGGERS } from '../../constants/symptoms';
import ChipSelector from '../../components/forms/ChipSelector';
import FormField from '../../components/forms/FormField';
import SeveritySlider from '../../components/forms/SeveritySlider';
import { colors, radius, spacing, fontSize } from '../../constants/theme';

export default function DailyFactorsScreen() {
  const navigation = useNavigation<{ goBack: () => void }>();
  const { factors, saveFactors, refresh } = useLogStore();
  const [stress, setStress] = useState<number | null>(null);
  const [triggers, setTriggers] = useState<string[]>([]);
  const [sleepHours, setSleepHours] = useState('');
  const [sleepQuality, setSleepQuality] = useState<number | null>(null);
  const [water, setWater] = useState('');
  const [exercise, setExercise] = useState('');
  const [coping, setCoping] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Prefill from today's existing check-in (upsert semantics).
  useEffect(() => {
    if (!factors) return;
    setStress(factors.stressLevel);
    setTriggers(factors.stressTriggers);
    setSleepHours(factors.sleepHours?.toString() ?? '');
    setSleepQuality(factors.sleepQuality);
    setWater(factors.waterGlasses?.toString() ?? '');
    setExercise(factors.exerciseMinutes?.toString() ?? '');
    setCoping(factors.copingActivities);
  }, [factors]);

  const parseNum = (raw: string): number | null => {
    const n = Number(raw.replace(',', '.'));
    return raw.trim() !== '' && Number.isFinite(n) && n >= 0 ? n : null;
  };

  const save = async () => {
    setSaving(true);
    try {
      await saveFactors({
        stressLevel: stress,
        stressTriggers: triggers,
        sleepHours: parseNum(sleepHours),
        sleepQuality,
        waterGlasses: parseNum(water),
        exerciseMinutes: parseNum(exercise),
        copingActivities: coping,
      });
      navigation.goBack();
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Daily check-in</Text>
      <Text style={styles.subtitle}>One entry per day — saving again updates today.</Text>

      <FormField label="Stress level (1 = calm, 10 = very stressed)">
        <SeveritySlider value={stress} onChange={setStress} />
      </FormField>

      <FormField label="What contributed to stress?">
        <ChipSelector
          options={STRESS_TRIGGERS.map((t) => ({ value: t, label: t }))}
          selected={triggers}
          onChange={setTriggers}
        />
      </FormField>

      <FormField label="Sleep last night (hours)">
        <TextInput
          style={styles.input}
          placeholder="e.g. 7.5"
          placeholderTextColor={colors.textMuted}
          keyboardType="decimal-pad"
          value={sleepHours}
          onChangeText={setSleepHours}
        />
      </FormField>

      <FormField label="Sleep quality (1-5)">
        <SeveritySlider value={sleepQuality} onChange={setSleepQuality} min={1} max={5} />
      </FormField>

      <FormField label="Water (glasses)">
        <TextInput
          style={styles.input}
          placeholder="e.g. 6"
          placeholderTextColor={colors.textMuted}
          keyboardType="number-pad"
          value={water}
          onChangeText={setWater}
        />
      </FormField>

      <FormField label="Exercise (minutes)">
        <TextInput
          style={styles.input}
          placeholder="e.g. 30"
          placeholderTextColor={colors.textMuted}
          keyboardType="number-pad"
          value={exercise}
          onChangeText={setExercise}
        />
      </FormField>

      <FormField label="Stress-management activities done today">
        <ChipSelector
          options={COPING_ACTIVITIES.map((c) => ({ value: c, label: c }))}
          selected={coping}
          onChange={setCoping}
        />
      </FormField>

      <TouchableOpacity style={styles.button} onPress={save} disabled={saving}>
        <Text style={styles.buttonText}>{saving ? 'Saving…' : 'Save check-in'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, maxWidth: 560, width: '100%', alignSelf: 'center' },
  title: {
    fontSize: fontSize.lg,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: { fontSize: fontSize.sm, color: colors.textMuted, marginBottom: spacing.lg },
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
    marginBottom: spacing.xl,
  },
  buttonText: { color: '#fff', fontSize: fontSize.md, fontWeight: '700' },
});
