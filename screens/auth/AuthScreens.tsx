import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuthStore } from '../../stores/useAuthStore';
import { colors, contentWidth, elevation, fontSize, fontWeight, radius, spacing } from '../../constants/theme';
import Card from '../../components/ui/Card';
import Logo from '../../components/ui/Logo';

interface Props {
  mode: 'signIn' | 'signUp';
  onSwitchMode: () => void;
}

function AuthForm({ mode, onSwitchMode }: Props) {
  const { signIn, signUp, error, offlineDevMode } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!email.trim() || !password) return;
    setBusy(true);
    try {
      if (mode === 'signIn') await signIn(email, password);
      else await signUp(email, password);
    } catch {
      // error message is surfaced via the store
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Card style={styles.card} bordered={false}>
        <Logo variant="lockup" size={56} backgroundColor={colors.background} />
        <Text style={styles.subtitle}>
          {mode === 'signIn' ? 'Welcome back' : 'Create your account'}
        </Text>

        {offlineDevMode && (
          <View style={styles.devBanner}>
            <Text style={styles.devBannerText}>
              Firebase not configured — running in local-only mode. Any email/password works and
              data stays on this device.
            </Text>
          </View>
        )}

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={colors.textMuted}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={colors.textMuted}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity style={styles.button} onPress={submit} disabled={busy}>
          {busy ? (
            <ActivityIndicator color={colors.onPrimary} />
          ) : (
            <Text style={styles.buttonText}>{mode === 'signIn' ? 'Sign in' : 'Sign up'}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={onSwitchMode}>
          <Text style={styles.switchText}>
            {mode === 'signIn'
              ? "Don't have an account? Sign up"
              : 'Already have an account? Sign in'}
          </Text>
        </TouchableOpacity>
      </Card>
    </KeyboardAvoidingView>
  );
}

export function SignInScreen({ navigation }: { navigation: { navigate: (s: string) => void } }) {
  return <AuthForm mode="signIn" onSwitchMode={() => navigation.navigate('SignUp')} />;
}

export function SignUpScreen({ navigation }: { navigation: { navigate: (s: string) => void } }) {
  return <AuthForm mode="signUp" onSwitchMode={() => navigation.navigate('SignIn')} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  card: {
    backgroundColor: colors.background,
    alignItems: 'center',
    padding: spacing.xl,
    maxWidth: contentWidth.narrow,
    width: '100%',
    alignSelf: 'center',
    ...elevation.med,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  devBanner: {
    backgroundColor: colors.accent,
    borderRadius: radius.sm,
    padding: spacing.sm,
    marginBottom: spacing.md,
    width: '100%',
  },
  devBannerText: {
    fontSize: fontSize.sm,
    color: colors.text,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: fontSize.md,
    color: colors.text,
    marginBottom: spacing.md,
    backgroundColor: colors.background,
  },
  error: {
    color: colors.danger,
    marginBottom: spacing.md,
    fontSize: fontSize.sm,
  },
  button: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  buttonText: {
    color: colors.onPrimary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  switchText: {
    color: colors.primary,
    textAlign: 'center',
    fontSize: fontSize.sm,
  },
});
