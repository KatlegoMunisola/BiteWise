import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { ActivityIndicator, AppState, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import OnboardingScreen from './screens/OnboardingScreen';
import { SignInScreen, SignUpScreen } from './screens/auth/AuthScreens';
import ProfileSetupScreen from './screens/ProfileSetupScreen';
import FoodLogEntryScreen from './screens/log/FoodLogEntryScreen';
import SymptomLogEntryScreen from './screens/log/SymptomLogEntryScreen';
import DailyFactorsScreen from './screens/log/DailyFactorsScreen';
import ScanResultScreen from './screens/scan/ScanResultScreen';
import MealPhotoResultScreen from './screens/scan/MealPhotoResultScreen';
import MainTabs from './navigation/MainTabs';
import { useAppStore } from './stores/useAppStore';
import { useAuthStore } from './stores/useAuthStore';
import { syncAll } from './services/sync';
import { colors, spacing } from './constants/theme';
import Logo from './components/ui/Logo';

const Stack = createNativeStackNavigator();

export default function App() {
  const { onboarded, profileReady, loadFlags } = useAppStore();
  const { user, initializing, init } = useAuthStore();

  useEffect(() => {
    loadFlags();
    init();
  }, [loadFlags, init]);

  // Push/pull sync whenever the app returns to the foreground.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      const currentUser = useAuthStore.getState().user;
      if (state === 'active' && currentUser) {
        syncAll(currentUser.uid).catch(() => {});
      }
    });
    return () => sub.remove();
  }, []);

  // Re-check profile existence when the signed-in user changes (e.g. after
  // first sign-up, or after a pull brings a profile from another device).
  useEffect(() => {
    if (user) {
      useAppStore.getState().refreshProfileReady();
    }
  }, [user]);

  if (onboarded === null || initializing) {
    return (
      <View style={styles.loading}>
        <Logo size={56} />
        <ActivityIndicator size="large" color={colors.primary} style={styles.loadingSpinner} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={styles.root}>
        <NavigationContainer>
          <StatusBar style="dark" />
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!onboarded ? (
              <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            ) : !user ? (
              <>
                <Stack.Screen name="SignIn" component={SignInScreen} />
                <Stack.Screen name="SignUp" component={SignUpScreen} />
              </>
            ) : !profileReady ? (
              <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
            ) : (
              <>
                <Stack.Screen name="Main" component={MainTabs} />
                <Stack.Screen
                  name="Onboarding"
                  component={OnboardingScreen}
                  options={{ presentation: 'modal' }}
                />
                <Stack.Screen
                  name="FoodLogEntry"
                  component={FoodLogEntryScreen}
                  options={{ presentation: 'modal', headerShown: true, title: 'Log food' }}
                />
                <Stack.Screen
                  name="SymptomLogEntry"
                  component={SymptomLogEntryScreen}
                  options={{ presentation: 'modal', headerShown: true, title: 'Log symptom' }}
                />
                <Stack.Screen
                  name="DailyFactors"
                  component={DailyFactorsScreen}
                  options={{ presentation: 'modal', headerShown: true, title: 'Daily check-in' }}
                />
                <Stack.Screen
                  name="ScanResult"
                  component={ScanResultScreen}
                  options={{ presentation: 'modal', headerShown: true, title: 'Scan result' }}
                />
                <Stack.Screen
                  name="MealPhotoResult"
                  component={MealPhotoResultScreen}
                  options={{ presentation: 'modal', headerShown: true, title: 'Meal photo' }}
                />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  loadingSpinner: {
    marginTop: spacing.lg,
  },
});
