import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  // @ts-expect-error — exported by the react-native entrypoint of firebase/auth,
  // but missing from the web type declarations TS resolves.
  getReactNativePersistence,
  type Auth,
} from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

/** True when a Firebase project is wired up via EXPO_PUBLIC_FIREBASE_* env
 *  vars. Without one, the app runs in local-only dev mode: auth is stubbed
 *  and sync is a no-op, but all logging features work. */
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let firestore: Firestore | null = null;

function ensureApp(): FirebaseApp {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured. Set EXPO_PUBLIC_FIREBASE_* in .env.');
  }
  if (!app) {
    app = initializeApp(firebaseConfig);
  }
  return app;
}

export function getFirebaseAuth(): Auth {
  if (!auth) {
    const a = ensureApp();
    auth =
      Platform.OS === 'web'
        ? getAuth(a)
        : initializeAuth(a, { persistence: getReactNativePersistence(AsyncStorage) });
  }
  return auth;
}

export function getDb(): Firestore {
  if (!firestore) {
    firestore = getFirestore(ensureApp());
  }
  return firestore;
}
