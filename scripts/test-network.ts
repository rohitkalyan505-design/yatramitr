import { PLACES } from '../src/data/places';
import { FOODS } from '../src/data/food';
import { EXPERIENCES } from '../src/data/experiences';

async function checkUrl(url: string, name: string) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'http://localhost:3000/'
      }
    });
    console.log(`[${res.status}] ${name} -> ${url.substring(0, 60)}...`);
    return res.status;
  } catch (err: any) {
    console.log(`[ERROR] ${name} -> ${err.message}`);
    return 0;
  }
}

async function run() {
  console.log('--- CHECKING SAMPLE PLACES ---');
  for (const p of PLACES.slice(0, 5)) {
    await checkUrl(p.image, p.name);
  }

  console.log('\n--- CHECKING SAMPLE FOOD ---');
  for (const f of FOODS.slice(0, 5)) {
    await checkUrl(f.image, f.name);
  }

  console.log('\n--- CHECKING SAMPLE EXPERIENCES ---');
  for (const e of EXPERIENCES.slice(0, 5)) {
    await checkUrl(e.image, e.title);
  }
}

run();
