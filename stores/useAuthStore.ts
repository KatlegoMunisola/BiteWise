import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { getFirebaseAuth, isFirebaseConfigured } from '../services/firebase';
import { syncAll } from '../services/sync';

export interface AuthUser {
  uid: string;
  email: string | null;
}

interface AuthState {
  user: AuthUser | null;
  /** True until the initial session restore has settled. */
  initializing: boolean;
  error: string | null;
  /** True when running without a Firebase project (local-only dev mode). */
  offlineDevMode: boolean;
  init: () => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
}

const DEV_USER_KEY = 'auth:devUser';

function friendlyAuthError(e: unknown): string {
  const code = (e as { code?: string })?.code ?? '';
  switch (code) {
    case 'auth/invalid-email':
      return 'That email address looks invalid.';
    case 'auth/email-already-in-use':
      return 'An account already exists for that email.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Email or password is incorrect.';
    case 'auth/network-request-failed':
      return 'Network error — check your connection and try again.';
    default:
      return e instanceof Error ? e.message : 'Something went wrong. Please try again.';
  }
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  initializing: true,
  error: null,
  offlineDevMode: !isFirebaseConfigured,

  init: () => {
    if (!isFirebaseConfigured) {
      // Local-only dev mode: restore the fake session if one exists.
      AsyncStorage.getItem(DEV_USER_KEY).then((raw: string | null) => {
        set({ user: raw ? JSON.parse(raw) : null, initializing: false });
      });
      return;
    }
    onAuthStateChanged(getFirebaseAuth(), (fbUser) => {
      set({
        user: fbUser ? { uid: fbUser.uid, email: fbUser.email } : null,
        initializing: false,
      });
      if (fbUser) {
        syncAll(fbUser.uid).catch(() => {
          // Offline is fine — sync retries on next foreground.
        });
      }
    });
  },

  signIn: async (email, password) => {
    set({ error: null });
    if (!isFirebaseConfigured) {
      const user = { uid: 'offline-dev', email };
      await AsyncStorage.setItem(DEV_USER_KEY, JSON.stringify(user));
      set({ user });
      return;
    }
    try {
      await signInWithEmailAndPassword(getFirebaseAuth(), email.trim(), password);
    } catch (e) {
      set({ error: friendlyAuthError(e) });
      throw e;
    }
  },

  signUp: async (email, password) => {
    set({ error: null });
    if (!isFirebaseConfigured) {
      return get().signIn(email, password);
    }
    try {
      await createUserWithEmailAndPassword(getFirebaseAuth(), email.trim(), password);
    } catch (e) {
      set({ error: friendlyAuthError(e) });
      throw e;
    }
  },

  logOut: async () => {
    if (!isFirebaseConfigured) {
      await AsyncStorage.removeItem(DEV_USER_KEY);
      set({ user: null });
      return;
    }
    await signOut(getFirebaseAuth());
  },
}));
