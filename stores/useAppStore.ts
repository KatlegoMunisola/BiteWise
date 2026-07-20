import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getProfile } from '../db/profile';

const ONBOARDED_KEY = 'app:onboarded';

interface AppState {
  /** null = still loading from storage. */
  onboarded: boolean | null;
  /** null = still loading. False until a profile row exists. */
  profileReady: boolean | null;
  loadFlags: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  refreshProfileReady: () => Promise<void>;
  setProfileReady: (ready: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  onboarded: null,
  profileReady: null,

  loadFlags: async () => {
    const [onboardedRaw, profile] = await Promise.all([
      AsyncStorage.getItem(ONBOARDED_KEY),
      getProfile(),
    ]);
    set({ onboarded: onboardedRaw === 'true', profileReady: profile != null });
  },

  completeOnboarding: async () => {
    await AsyncStorage.setItem(ONBOARDED_KEY, 'true');
    set({ onboarded: true });
  },

  refreshProfileReady: async () => {
    const profile = await getProfile();
    set({ profileReady: profile != null });
  },

  setProfileReady: (ready) => set({ profileReady: ready }),
}));
