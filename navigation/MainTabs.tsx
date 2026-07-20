import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import LogHomeScreen from '../screens/log/LogHomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { InsightsPlaceholder, ScanPlaceholder } from '../screens/PlaceholderScreen';
import { colors } from '../constants/theme';

const Tab = createBottomTabNavigator();

const ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Home: 'home',
  Log: 'create',
  Scan: 'barcode',
  Insights: 'stats-chart',
  Profile: 'person',
};

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={ICONS[route.name] ?? 'ellipse'} color={color} size={size} />
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
