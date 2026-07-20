import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { ActivityIndicator, AppState, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import OnboardingScreen from './screens/OnboardingScreen';
import { SignInScreen, SignUpScreen } from './screens/auth/AuthScreens';
import ProfileSetupScreen from './screens/ProfileSetupScreen';
import FoodLogEntryScreen from './screens/log/FoodLogEntryScreen';
import SymptomLogEntryScreen from './screens/log/SymptomLogEntryScreen';
import DailyFactorsScreen from './screens/log/DailyFactorsScreen';
import MainTabs from './navigation/MainTabs';
import { useAppStore } from './stores/useAppStore';
import { useAuthStore } from './stores/useAuthStore';
import { syncAll } from './services/sync';
import { colors } from './constants/theme';

const Stack = createStackNavigator();

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
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
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
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});
