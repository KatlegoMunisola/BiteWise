import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import LogHomeScreen from '../screens/log/LogHomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { InsightsPlaceholder, ScanPlaceholder } from '../screens/PlaceholderScreen';
import { colors, fontSize, fontWeight, iconSize, spacing } from '../constants/theme';

const Tab = createBottomTabNavigator();

const ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Home: 'home',
  Log: 'create',
  Scan: 'barcode',
  Insights: 'stats-chart',
  Profile: 'person',
};

export default function MainTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          height: 56 + insets.bottom + spacing.sm,
          paddingTop: spacing.sm,
          paddingBottom: insets.bottom + spacing.sm,
        },
        tabBarLabelStyle: {
          fontSize: fontSize.sm,
          fontWeight: fontWeight.medium,
        },
        tabBarIcon: ({ color, focused }) => (
          <Ionicons
            name={ICONS[route.name] ?? 'ellipse'}
            color={color}
            size={focused ? iconSize.xl : iconSize.lg}
          />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Log" component={LogHomeScreen} />
      <Tab.Screen name="Scan" component={ScanPlaceholder} />
      <Tab.Screen name="Insights" component={InsightsPlaceholder} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
