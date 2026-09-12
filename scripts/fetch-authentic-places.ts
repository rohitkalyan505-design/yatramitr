const placesWikiMap: Record<string, string> = {
  'charminar': 'Charminar',
  'golconda-fort': 'Golconda',
  'mecca-masjid': 'Makkah_Masjid,_Hyderabad',
  'qutb-shahi-tombs': 'Qutb_Shahi_tombs',
  'chowmahalla-palace': 'Chowmahalla_Palace',
  'salar-jung-museum': 'Salar_Jung_Museum',
  'taj-falaknuma-palace': 'Falaknuma_Palace',
  'hussain-sagar': 'Hussain_Sagar',
  'birla-mandir': 'Birla_Mandir,_Hyderabad',
  'paigah-tombs': 'Paigah_Tombs',
  'moula-ali-dargah': 'Moula_Ali_Dargah',
  'shilparamam': 'Shilparamam',
  'ramoji-film-city': 'Ramoji_Film_City',
  'ananthagiri-hills': 'Ananthagiri_Hills,_Vikarabad',
  'warangal-fort': 'Warangal_Fort',
  'thousand-pillar-temple': 'Thousand_Pillar_Temple',
  'ramappa-temple': 'Ramappa_Temple',
  'bhongir-fort': 'Bhongir_Fort',
  'medak-cathedral': 'Medak_Cathedral',
  'alampur-jogulamba': 'Jogulamba_temple',
  'kuntala-waterfall': 'Kuntala_Waterfall',
  'laknavaram-lake': 'Laknavaram_Lake',
  'pillalamarri': 'Pillalamarri',
  'sita-rama-chandra-temple': 'Bhadrachalam_Temple',
};

async function getImages() {
  const result: Record<string, string> = {};
  for (const [id, title] of Object.entries(placesWikiMap)) {
    try {
      const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${title}`);
      if (res.ok) {
        const data = await res.json();
        const img = data.originalimage?.source || data.thumbnail?.source;
        if (img) {
          result[id] = img;
          console.log(`OK: [${id}] -> ${img.slice(0, 80)}...`);
        } else {
          console.log(`NO_IMG: [${id}]`);
        }
      } else {
        console.log(`FAIL_${res.status}: [${id}] (${title})`);
      }
    } catch (e: any) {
      console.log(`ERR: [${id}] (${e.message})`);
    }
  }
  console.log('\n--- JSON RESULT ---');
  console.log(JSON.stringify(result, null, 2));
}

getImages();
