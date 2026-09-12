/* eslint-disable */
// ============================================================
// FIREBASE ADMIN SDK — Server-only initialized instance
// ============================================================
// Uses service account credentials from .env.local to bypass
// client Firestore security rules for server API operations.
// ============================================================

import type { App } from 'firebase-admin/app';
import type { Firestore } from 'firebase-admin/firestore';
import type { Auth } from 'firebase-admin/auth';

let adminApp: App | null = null;
let adminDb: Firestore | null = null;
let adminAuth: Auth | null = null;

export function getAdminFirebase(): { app: App | null; db: Firestore | null; auth: Auth | null } {
  if (typeof window !== 'undefined') {
    return { app: null, db: null, auth: null };
  }

  if (adminDb && adminAuth && adminApp) {
    return { app: adminApp, db: adminDb, auth: adminAuth };
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const admin = require('firebase-admin');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { getFirestore } = require('firebase-admin/firestore');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { getAuth } = require('firebase-admin/auth');

    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (!projectId || !clientEmail || !privateKey) {
      return { app: null, db: null, auth: null };
    }

    if (privateKey.includes('\\n')) {
      privateKey = privateKey.replace(/\\n/g, '\n');
    }

    const appName = 'yatramitr-admin';
    const existingApps = admin.getApps ? admin.getApps() : [];
    const found = existingApps.find((a: App) => a.name === appName);

    adminApp = found || admin.initializeApp({
      credential: admin.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    }, appName);

    adminDb = getFirestore(adminApp);
    adminAuth = getAuth(adminApp);

    return { app: adminApp, db: adminDb, auth: adminAuth };
  } catch (err) {
    console.error('Failed to initialize Firebase Admin SDK:', err);
    return { app: null, db: null, auth: null };
  }
}

export function getAdminDb(): Firestore | null {
  return getAdminFirebase().db;
}

export function getAdminAuth(): Auth | null {
  return getAdminFirebase().auth;
}
