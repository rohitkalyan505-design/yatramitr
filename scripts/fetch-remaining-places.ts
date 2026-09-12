const remaining: Record<string, string> = {
  'warangal-fort': 'Warangal_Fort',
  'thousand-pillar-temple': 'Thousand_Pillar_Temple',
  'ramappa-temple': 'Ramappa_Temple',
  'bhongir-fort': 'Bhongir_Fort',
  'medak-cathedral': 'Medak_Cathedral',
  'alampur-jogulamba': 'Jogulamba_temple',
  'kuntala-waterfall': 'Kuntala_Waterfall',
  'laknavaram-lake': 'Laknavaram_Lake',
  'pillalamarri': 'Pillalamarri',
  'ananthagiri-hills': 'Ananthagiri_Hills,_Vikarabad'
};

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function run() {
  const resObj: Record<string, string> = {};
  for (const [id, title] of Object.entries(remaining)) {
    await sleep(1200);
    try {
      const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${title}`, {
        headers: { 'User-Agent': 'YitraMitr-TouristApp/1.0 (contact@yitramitr.dev)' }
      });
      if (res.ok) {
        const d = await res.json();
        const img = d.originalimage?.source || d.thumbnail?.source;
        if (img) resObj[id] = img;
        console.log(`OK: [${id}] -> ${img}`);
      } else {
        console.log(`FAIL_${res.status}: [${id}]`);
      }
    } catch (e: any) {
      console.log(`ERR: [${id}] ${e.message}`);
    }
  }
  console.log('--- REMAINING JSON ---');
  console.log(JSON.stringify(resObj, null, 2));
}

run();
