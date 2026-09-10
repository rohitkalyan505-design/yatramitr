// Firebase client SDK initialization.
// Works in three modes:
//   1. Real Firebase credentials present -> live Firestore + Auth
//   2. Placeholder/demo values           -> app runs, data layer falls back to local datasets
//   3. Env missing entirely              -> same as (2)
// This keeps the MVP fully demonstrable without credentials, and instantly
// live the moment real Firebase config is supplied.

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';

const env = (import.meta as unknown as { env: Record<string, string | undefined> }).env ?? {};

// Next.js exposes NEXT_PUBLIC_* on process.env; Vite-style import.meta.env is empty.
const raw: Record<string, string | undefined> =
  typeof process !== 'undefined' && process.env ? (process.env as Record<string, string>) : env;

export const firebaseConfig = {
  apiKey: raw.NEXT_PUBLIC_FIREBASE_API_KEY ?? 'demo-api-key',
  authDomain: raw.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? 'demo.firebaseapp.com',
  projectId: raw.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? 'demo-project',
  storageBucket: raw.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? 'demo.appspot.com',
  messagingSenderId: raw.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '0',
  appId: raw.NEXT_PUBLIC_FIREBASE_APP_ID ?? 'demo-app-id',
};

export const isFirebaseConfigured = (() => {
  const k = raw.NEXT_PUBLIC_FIREBASE_API_KEY;
  return Boolean(k && !k.startsWith('demo') && k.length > 20);
})();

let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let initError: string | null = null;

try {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  authInstance = getAuth(app);
} catch (e) {
  initError = e instanceof Error ? e.message : 'Firebase init failed';
  app = null;
  authInstance = null;
}

export function getFirebaseApp(): FirebaseApp | null {
  return app;
}

export function getFirebaseAuth(): Auth | null {
  return authInstance;
}

export function getFirebaseInitError(): string | null {
  return initError;
}
