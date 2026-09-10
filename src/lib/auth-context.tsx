'use client';

// ============================================================
// AUTH PROVIDER — Firebase Authentication + DEMO MODE
// ============================================================
// Two modes:
//   1. LIVE  — real Firebase Auth when credentials are configured
//   2. DEMO  — a clearly-labelled demo session when they aren't
//              (used by the "Try Demo" journey and judges)
// User profiles are persisted via the data service (users/{uid}).
// ============================================================

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut as fbSignOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import { getFirebaseAuth, isFirebaseConfigured } from '@/lib/firebase';
import { createUserProfile, fetchUserProfile } from '@/lib/data-service';
import type { UserProfile, UserRole } from '@/types';

interface AuthContextValue {
  user: UserProfile | null;
  firebaseUser: User | null;
  loading: boolean;
  isDemoSession: boolean;
  isFirebaseLive: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  startDemoSession: (name?: string) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const DEMO_PROFILE: UserProfile = {
  id: 'demo-user-local',
  name: 'Demo Traveller',
  email: 'demo.traveller@yatramitra.demo',
  role: 'traveller',
  isDemo: true,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoSession, setIsDemoSession] = useState(false);

  // Restore demo session from localStorage on first load
  useEffect(() => {
    try {
      const demo = localStorage.getItem('ym-demo-session');
      if (demo === '1') {
        const cached = localStorage.getItem('ym-user-demo-user-local');
        setUser(cached ? (JSON.parse(cached) as UserProfile) : DEMO_PROFILE);
        setIsDemoSession(true);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth || !isFirebaseConfigured) {
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        setIsDemoSession(false);
        let profile = await fetchUserProfile(fbUser.uid);
        if (!profile) {
          profile = {
            id: fbUser.uid,
            name: fbUser.displayName ?? fbUser.email?.split('@')[0] ?? 'Traveller',
            email: fbUser.email ?? '',
            role: 'traveller',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          await createUserProfile(profile);
        }
        setUser(profile);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const auth = getFirebaseAuth();
    if (!auth || !isFirebaseConfigured) {
      // Demo fallback: accept the credentials locally, clearly labelled.
      const profile: UserProfile = {
        id: 'demo-user-local',
        name: email.split('@')[0] || 'Demo Traveller',
        email,
        role: 'traveller',
        isDemo: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem('ym-demo-session', '1');
      await createUserProfile(profile);
      setUser(profile);
      setIsDemoSession(true);
      return;
    }
    await signInWithEmailAndPassword(auth, email, password);
  }, []);

  const signup = useCallback(
    async (name: string, email: string, password: string, role: UserRole) => {
      const auth = getFirebaseAuth();
      if (!auth || !isFirebaseConfigured) {
        const profile: UserProfile = {
          id: 'demo-user-local',
          name,
          email,
          role,
          isDemo: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        localStorage.setItem('ym-demo-session', '1');
        await createUserProfile(profile);
        setUser(profile);
        setIsDemoSession(true);
        return;
      }
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (name) await updateProfile(cred.user, { displayName: name });
      const profile: UserProfile = {
        id: cred.user.uid,
        name,
        email,
        role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await createUserProfile(profile);
      setUser(profile);
    },
    []
  );

  const logout = useCallback(async () => {
    const auth = getFirebaseAuth();
    if (auth && isFirebaseConfigured && firebaseUser) {
      await fbSignOut(auth);
    }
    localStorage.removeItem('ym-demo-session');
    setUser(null);
    setIsDemoSession(false);
  }, [firebaseUser]);

  const resetPassword = useCallback(async (email: string) => {
    const auth = getFirebaseAuth();
    if (!auth || !isFirebaseConfigured) {
      throw new Error(
        'Password reset requires live Firebase configuration. In demo mode, just sign in with any email.'
      );
    }
    await sendPasswordResetEmail(auth, email);
  }, []);

  const startDemoSession = useCallback((name?: string) => {
    const profile: UserProfile = { ...DEMO_PROFILE, name: name ?? DEMO_PROFILE.name };
    localStorage.setItem('ym-demo-session', '1');
    setUser(profile);
    setIsDemoSession(true);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      firebaseUser,
      loading,
      isDemoSession,
      isFirebaseLive: isFirebaseConfigured,
      login,
      signup,
      logout,
      resetPassword,
      startDemoSession,
    }),
    [user, firebaseUser, loading, isDemoSession, login, signup, logout, resetPassword, startDemoSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
