import { PLACES } from '../src/data/places';
import { FOODS } from '../src/data/food';
import { EXPERIENCES, MITRAS } from '../src/data/experiences';
import fs from 'fs';
import path from 'path';

console.log('=== VERIFYING IMAGES IN DATASETS ===\n');

console.log(`Places: ${PLACES.length}`);
for (const p of PLACES) {
  const isLocal = p.image?.startsWith('/');
  let exists = true;
  if (isLocal) {
    exists = fs.existsSync(path.join(process.cwd(), 'public', p.image));
  }
  console.log(`[Place] ${p.id.padEnd(30)} ${p.name.padEnd(35)} -> ${p.image} (${exists ? 'EXISTS' : 'MISSING'})`);
}

console.log(`\nFoods: ${FOODS.length}`);
for (const f of FOODS) {
  const isLocal = f.image?.startsWith('/');
  let exists = true;
  if (isLocal) {
    exists = fs.existsSync(path.join(process.cwd(), 'public', f.image));
  }
  console.log(`[Food] ${f.id.padEnd(30)} ${f.name.padEnd(35)} -> ${f.image} (${exists ? 'EXISTS' : 'MISSING'})`);
}

console.log(`\nExperiences: ${EXPERIENCES.length}`);
for (const e of EXPERIENCES) {
  const isLocal = e.image?.startsWith('/');
  let exists = true;
  if (isLocal) {
    exists = fs.existsSync(path.join(process.cwd(), 'public', e.image));
  }
  console.log(`[Exp] ${e.id.padEnd(30)} ${e.title.padEnd(35)} -> ${e.image} (${exists ? 'EXISTS' : 'MISSING'})`);
}

console.log(`\nMitras: ${MITRAS.length}`);
for (const m of MITRAS) {
  const isLocal = m.avatar?.startsWith('/');
  let exists = true;
  if (isLocal) {
    exists = fs.existsSync(path.join(process.cwd(), 'public', m.avatar));
  }
  console.log(`[Mitra] ${m.id.padEnd(30)} ${m.name.padEnd(35)} -> ${m.avatar} (${exists ? 'EXISTS' : 'MISSING'})`);
}
