// ============================================================
// CREATE QA USER — one clearly-labelled DEMO / QA ONLY account
// ============================================================
// Usage:  npx tsx scripts/create-qa-user.ts
//
// Creates (idempotently — safe to re-run):
//   1. A Firebase Auth user for QA testing (email/password)
//   2. A Firestore profile at users/{uid} marked isDemo: true
//      and labelled "DEMO/QA ONLY".
//
// Credentials come from env overrides or the defaults below.
// This account exists ONLY to exercise the demo journey
// (signup → login → booking → trip → review). It must never be
// used to fabricate public reviews or real-world activity.
// ============================================================

import * as fs from 'fs';
import * as path from 'path';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const admin = require('firebase-admin');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getFirestore } = require('firebase-admin/firestore');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getAuth } = require('firebase-admin/auth');

const QA_EMAIL = process.env.QA_TEST_EMAIL || 'qa.tester@yitramitr.dev';
const QA_PASSWORD = process.env.QA_TEST_PASSWORD || 'YitraMitrQA-Demo1!';
const QA_NAME = 'QA Traveller (DEMO/QA ONLY)';

function certFn(a: typeof admin): (arg: unknown) => unknown {
  return a.credential?.cert ?? a.cert;
}

async function main() {
  // --- Service account resolution (same policy as seed-firestore) ---
  const saPath = path.resolve(process.cwd(), 'service-account.json');
  let credential;
  if (fs.existsSync(saPath)) {
    credential = certFn(admin)(saPath);
    console.log('Using service account at', saPath);
  } else if (
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  ) {
    credential = certFn(admin)({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    });
    console.log('Using service account from environment variables');
  } else {
    console.error(
      'No Firebase credentials found.\n' +
        'Place service-account.json in the project root, or set\n' +
        'FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY.'
    );
    process.exit(1);
  }

  admin.initializeApp({ credential });
  const auth = getAuth();
  const db = getFirestore();

  // --- 1. Firebase Auth user (idempotent) ---
  let uid: string;
  try {
    const existing = await auth.getUserByEmail(QA_EMAIL);
    uid = existing.uid;
    console.log(`Auth user already exists — reusing uid ${uid} for ${QA_EMAIL}`);
  } catch {
    const created = await auth.createUser({
      email: QA_EMAIL,
      password: QA_PASSWORD,
      displayName: QA_NAME,
      emailVerified: true,
    });
    uid = created.uid;
    console.log(`Created Auth user uid ${uid} for ${QA_EMAIL}`);
  }

  // --- 2. Firestore profile (upsert, clearly labelled) ---
  const now = new Date().toISOString();
  const profile = {
    id: uid,
    name: QA_NAME,
    email: QA_EMAIL,
    role: 'traveller',
    isDemo: true,
    qaAccount: true,
    label: 'DEMO / QA ONLY — not a real traveller',
    createdAt: now,
    updatedAt: now,
  };
  await db.collection('users').doc(uid).set(profile, { merge: true });
  console.log(`✓ users/${uid} profile upserted (isDemo: true, DEMO/QA ONLY)`);

  console.log('\n✅ QA account ready. Login with:');
  console.log(`   email:    ${QA_EMAIL}`);
  console.log(
    `   password: ${process.env.QA_TEST_PASSWORD ? '(from QA_TEST_PASSWORD env)' : '(default from scripts/create-qa-user.ts)'}`
  );
  console.log('\nThis account is for QA testing only — never fabricate public reviews or real-world activity with it.');
  process.exit(0);
}

main().catch((e) => {
  console.error('QA user creation failed:', e?.code ?? e?.message ?? e);
  process.exit(1);
});
