// ============================================================
// SEED FIRESTORE — repeatable, idempotent seeding
// ============================================================
// Usage:
//   1. Place your Firebase service-account JSON at ./service-account.json
//      (or set FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY)
//   2. npm install -D firebase-admin typescript tsx   (if not present)
//   3. npx tsx scripts/seed-firestore.ts
//
// The script is IDEMPOTENT: re-running updates the same document IDs
// instead of creating duplicates. It seeds:
//   places (24) · experiences · mitras (demo-labelled) · priceRanges
// It never fabricates: content comes from the curated datasets, and
// demo records are labelled isDemo: true.
// ============================================================

import * as fs from 'fs';
import * as path from 'path';

// --- Dynamically require firebase-admin so the script fails gracefully ---
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let admin: any;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  admin = require('firebase-admin');
} catch {
  console.error(
    'firebase-admin is not installed. Run:\n  npm install -D firebase-admin\nthen re-run this script.'
  );
  process.exit(1);
}

// --- Datasets are loaded as plain JSON-ish via ts compile-free trick ---
// We inline a small loader: since this runs via tsx, direct imports work.
async function main() {
  const { PLACES } = await import('../src/data/places');
  const { EXPERIENCES, MITRAS } = await import('../src/data/experiences');

  // --- Service account resolution ---
  const saPath = path.resolve(process.cwd(), 'service-account.json');
  let credential;
  if (fs.existsSync(saPath)) {
    credential = admin.credential.cert(saPath);
    console.log('Using service account at', saPath);
  } else if (
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  ) {
    credential = admin.credential.cert({
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
  const db = admin.firestore();

  const now = new Date().toISOString();

  // --- Seed places (24) ---
  console.log('\nSeeding places…');
  for (const place of PLACES) {
    const doc = {
      ...place,
      latitude: place.latitude,
      longitude: place.longitude,
      createdAt: now,
      updatedAt: now,
    };
    await db.collection('places').doc(place.id).set(doc, { merge: true });
    console.log(`  ✓ places/${place.id} — ${place.name}`);
  }

  // --- Seed experiences ---
  console.log('\nSeeding experiences…');
  for (const exp of EXPERIENCES) {
    const doc = { ...exp, createdAt: now };
    await db.collection('experiences').doc(exp.id).set(doc, { merge: true });
    console.log(`  ✓ experiences/${exp.id} — ${exp.title}`);
  }

  // --- Seed mitras (demo-labelled) ---
  console.log('\nSeeding mitras (demo accounts, isDemo: true)…');
  for (const mitra of MITRAS) {
    const doc = { ...mitra, createdAt: now };
    await db.collection('mitras').doc(mitra.id).set(doc, { merge: true });
    console.log(`  ✓ mitras/${mitra.id} — ${mitra.name} (DEMO)`);
  }

  // --- Seed price ranges (indicative, honest) ---
  console.log('\nSeeding priceRanges…');
  const priceRanges = [
    {
      id: 'heritage-walk',
      service: 'Heritage walking experience',
      indicativeRange: { min: 450, max: 800 },
      note: 'Indicative price — prototype estimate, subject to field validation.',
    },
    {
      id: 'food-trail',
      service: 'Food trail',
      indicativeRange: { min: 550, max: 900 },
      note: 'Indicative price — prototype estimate, subject to field validation.',
    },
    {
      id: 'craft-visit',
      service: 'Craft & artisan visit',
      indicativeRange: { min: 400, max: 700 },
      note: 'Indicative price — prototype estimate, subject to field validation.',
    },
    {
      id: 'day-trip',
      service: 'Day trip (with transport)',
      indicativeRange: { min: 1500, max: 2200 },
      note: 'Indicative price — prototype estimate, subject to field validation.',
    },
  ];
  for (const range of priceRanges) {
    await db.collection('priceRanges').doc(range.id).set(range, { merge: true });
    console.log(`  ✓ priceRanges/${range.id}`);
  }

  console.log('\n✅ Seed complete. Summary:');
  console.log(`   places:       ${PLACES.length} (incl. 1 requiring verification, excluded from map)`);
  console.log(`   experiences:  ${EXPERIENCES.length} (indicative prices)`);
  console.log(`   mitras:       ${MITRAS.length} (all isDemo: true)`);
  console.log(`   priceRanges:  ${priceRanges.length}`);
  console.log('\nRe-running this script is safe — documents are upserted by ID.');
  process.exit(0);
}

main().catch((e) => {
  console.error('Seed failed:', e);
  process.exit(1);
});
