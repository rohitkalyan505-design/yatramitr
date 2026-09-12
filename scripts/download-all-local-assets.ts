import fs from 'fs';
import path from 'path';

const PUBLIC_DIR = path.resolve(__dirname, '../public');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images');

const DIRS = [
  path.join(IMAGES_DIR, 'places'),
  path.join(IMAGES_DIR, 'food'),
  path.join(IMAGES_DIR, 'experiences'),
  path.join(IMAGES_DIR, 'mitras'),
];

DIRS.forEach((d) => {
  if (!fs.existsSync(d)) {
    fs.mkdirSync(d, { recursive: true });
  }
});

// Helper to convert any Wikimedia thumb URL to clean direct upload URL
function cleanWikimediaUrl(url: string): string {
  if (url.includes('upload.wikimedia.org') || url.includes('thumb.wikimedia.org')) {
    // e.g. https://thumb.wikimedia.org/wikipedia/commons/thumb/5/56/Golconda_Fort_005.jpg/1600px-Golconda_Fort_005.jpg
    // -> https://upload.wikimedia.org/wikipedia/commons/5/56/Golconda_Fort_005.jpg
    const match = url.match(/\/wikipedia\/commons\/(?:thumb\/)?([0-9a-f]\/[0-9a-f]{2}\/[^/]+)/i);
    if (match && match[1]) {
      return `https://upload.wikimedia.org/wikipedia/commons/${match[1]}`;
    }
  }
  return url;
}

const PLACES_SOURCES: Record<string, string> = {
  'charminar': 'https://upload.wikimedia.org/wikipedia/commons/7/71/Charminar_Hyderabad_1.jpg',
  'golconda-fort': 'https://upload.wikimedia.org/wikipedia/commons/5/56/Golconda_Fort_005.jpg',
  'mecca-masjid': 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Mecca_Masjid_Hyderabad.JPG',
  'qutb-shahi-tombs': 'https://upload.wikimedia.org/wikipedia/commons/0/08/Qutb_Shahi_Tomb_5.jpg',
  'thousand-pillar-temple': 'https://upload.wikimedia.org/wikipedia/commons/3/37/1000pillar_temple_warangal.jpg',
  'ramappa-temple': 'https://upload.wikimedia.org/wikipedia/commons/2/29/Ramappa_Temple_%28Human_Scale%29.jpg',
  'bhongir-fort': 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Bhongir_Fort_Royal_gate.jpg',
  'salar-jung-museum': 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Salar_Jung_Museum%2C_Hyderabad%2C_India.jpg',
  'chowmahalla-palace': 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Chowmahalla_Palace_01.jpg',
  'taj-falaknuma-palace': 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Falaknuma_Palace_01.jpg',
  'hussain-sagar': 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Aerial_view_of_Hussain_Sagar_from_Bansalipet.jpg',
  'nagarjuna-sagar': 'https://upload.wikimedia.org/wikipedia/commons/c/c9/NagarjunaSagarDam.JPG',
  'ananthagiri-hills': 'https://upload.wikimedia.org/wikipedia/commons/b/b7/Ananthagiri_Hills.JPG',
  'konda-pochamma': 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Konda_Pochamma_Sagar_Reservoir.jpg',
  'birla-mandir': 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Birla_Mandir%2C_Hyderabad.png',
  'chilkur-balaji': 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Chilkoor_balaji_temple.JPG',
  'yadadri': 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Yadagirigutta_Temple_Main_Entrance.jpg',
  'jagannath-temple': 'https://upload.wikimedia.org/wikipedia/commons/8/82/%E0%AC%9C%E0%AC%97%E0%AC%A8%E0%AD%8D%E0%AC%A8%E0%AC%AE%E0%AC%A5_%E0%AC%AE%E0%AC%A8%E0%AD%8D%E0%AC%A6%E0%AC%BF%E0%AC%B0%2C_%E0%AC%B9%E0%AC%BE%E0%AC%87%E0%AC%A6%E0%AD%8D%E0%AC%B0%E0%AC%BE%E0%AC%AC%E0%AC%BE%E0%AC%A6.jpg',
  'iskcon-hyderabad': 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Hare_Krishna_Golden_Temple_%28Hyderabad%2C_India%2C_2018%29.jpg',
  'swarna-giri': 'https://upload.wikimedia.org/wikipedia/commons/e/ed/Swarnagiri_Temple.png',
  'statue-of-equality': 'https://upload.wikimedia.org/wikipedia/commons/3/35/Statue_Of_Equality_Samatha_Murthy.jpg',
  'sita-rama-chandra-temple': 'https://upload.wikimedia.org/wikipedia/commons/9/93/Sri_sita_rama_temple_bhadrachalam_temple_view.jpg',
  'shilparamam': 'https://upload.wikimedia.org/wikipedia/commons/d/db/Entrance_of_Shilparamam%2C_Jubileehills.jpg',
  'ramoji-film-city': 'https://upload.wikimedia.org/wikipedia/commons/d/d1/Ramoji_Film_City.jpg',
};

const FOOD_SOURCES: Record<string, string> = {
  'gokul-chat': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80',
  'nimrah-cafe': 'https://upload.wikimedia.org/wikipedia/commons/6/63/Subhan_osmania_biscuits.jpg',
  'hotel-shadab': 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Hyderabadi_Chicken_Biryani.jpg',
  'cafe-niloufer': 'https://upload.wikimedia.org/wikipedia/commons/6/63/Subhan_osmania_biscuits.jpg',
  'ram-ki-bandi': 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=1200&q=80',
  'pista-house': 'https://upload.wikimedia.org/wikipedia/commons/d/d6/Hyderabadi_Mutton_Haleem.jpg',
  'bawarchi': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=80',
  'paradise-hotel': 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=1200&q=80',
};

const EXP_SOURCES: Record<string, string> = {
  'old-city-heritage-walk': 'https://upload.wikimedia.org/wikipedia/commons/7/71/Charminar_Hyderabad_1.jpg',
  'old-city-food-walk': 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Hyderabadi_Chicken_Biryani.jpg',
  'golconda-fort-deep-walk': 'https://upload.wikimedia.org/wikipedia/commons/5/56/Golconda_Fort_005.jpg',
  'quiet-heritage-lanes': 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Chowmahalla_Palace_01.jpg',
  'royal-hyderabad-day': 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Falaknuma_Palace_01.jpg',
  'crafts-makers-afternoon': 'https://upload.wikimedia.org/wikipedia/commons/d/db/Entrance_of_Shilparamam%2C_Jubileehills.jpg',
  'lakefront-evening-walk': 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Aerial_view_of_Hussain_Sagar_from_Bansalipet.jpg',
  'ramappa-day-trip': 'https://upload.wikimedia.org/wikipedia/commons/2/29/Ramappa_Temple_%28Human_Scale%29.jpg',
  'spiritual-hyderabad-morning': 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Birla_Mandir%2C_Hyderabad.png',
  'photography-old-city-blue-hour': 'https://upload.wikimedia.org/wikipedia/commons/7/71/Charminar_Hyderabad_1.jpg',
};

const MITRA_SOURCES: Record<string, string> = {
  'mitra-arjun': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
  'mitra-ayesha': 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=600&q=80',
  'mitra-rahul': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
  'mitra-meera': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
};

async function downloadFile(url: string, destPath: string): Promise<boolean> {
  const cleanUrl = cleanWikimediaUrl(url);
  try {
    const res = await fetch(cleanUrl, {
      headers: {
        'User-Agent': 'YitraMitr/1.0 (responsible-tourism-telangana; contact@yatramitr.org)',
      },
    });
    if (!res.ok) {
      console.warn(`  [FAILED ${res.status}] ${cleanUrl}`);
      return false;
    }
    const buffer = await res.arrayBuffer();
    fs.writeFileSync(destPath, Buffer.from(buffer));
    console.log(`  [OK ${res.status}] Saved ${(buffer.byteLength / 1024).toFixed(1)} KB to ${path.basename(destPath)}`);
    return true;
  } catch (err: any) {
    console.error(`  [ERROR] ${cleanUrl}: ${err.message}`);
    return false;
  }
}

async function run() {
  console.log('=== DOWNLOADING PLACES (24) ===');
  for (const [id, url] of Object.entries(PLACES_SOURCES)) {
    const ext = url.includes('.png') ? '.png' : '.jpg';
    const dest = path.join(IMAGES_DIR, 'places', `${id}${ext}`);
    console.log(`Downloading place: ${id}...`);
    await downloadFile(url, dest);
  }

  console.log('\n=== DOWNLOADING FOOD (8) ===');
  for (const [id, url] of Object.entries(FOOD_SOURCES)) {
    const ext = url.includes('.png') ? '.png' : '.jpg';
    const dest = path.join(IMAGES_DIR, 'food', `${id}${ext}`);
    console.log(`Downloading food: ${id}...`);
    await downloadFile(url, dest);
  }

  console.log('\n=== DOWNLOADING EXPERIENCES (10) ===');
  for (const [id, url] of Object.entries(EXP_SOURCES)) {
    const ext = url.includes('.png') ? '.png' : '.jpg';
    const dest = path.join(IMAGES_DIR, 'experiences', `${id}${ext}`);
    console.log(`Downloading experience: ${id}...`);
    await downloadFile(url, dest);
  }

  console.log('\n=== DOWNLOADING MITRAS (4) ===');
  for (const [id, url] of Object.entries(MITRA_SOURCES)) {
    const ext = '.jpg';
    const dest = path.join(IMAGES_DIR, 'mitras', `${id}${ext}`);
    console.log(`Downloading mitra: ${id}...`);
    await downloadFile(url, dest);
  }

  console.log('\nAll assets processed.');
}

run();
