import fs from 'fs';
import path from 'path';

const placesFile = path.resolve(__dirname, '../src/data/places.ts');
const foodFile = path.resolve(__dirname, '../src/data/food.ts');
const experiencesFile = path.resolve(__dirname, '../src/data/experiences.ts');

const placeImages: Record<string, string> = {
  'charminar': 'https://upload.wikimedia.org/wikipedia/commons/7/71/Charminar_Hyderabad_1.jpg',
  'golconda-fort': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/56/Golconda_Fort_005.jpg/1600px-Golconda_Fort_005.jpg',
  'mecca-masjid': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bb/Mecca_Masjid_Hyderabad.JPG/1600px-Mecca_Masjid_Hyderabad.JPG',
  'qutb-shahi-tombs': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Qutb_Shahi_Tomb_5.jpg/1600px-Qutb_Shahi_Tomb_5.jpg',
  'thousand-pillar-temple': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/37/1000pillar_temple_warangal.jpg/1600px-1000pillar_temple_warangal.jpg',
  'ramappa-temple': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/29/Ramappa_Temple_%28Human_Scale%29.jpg/1600px-Ramappa_Temple_%28Human_Scale%29.jpg',
  'bhongir-fort': 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Bhongir_Fort_Royal_gate.jpg',
  'salar-jung-museum': 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Salar_Jung_Museum%2C_Hyderabad%2C_India.jpg',
  'chowmahalla-palace': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/ce/Chowmahalla_Palace_01.jpg/1600px-Chowmahalla_Palace_01.jpg',
  'taj-falaknuma-palace': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f3/Falaknuma_Palace_01.jpg/1600px-Falaknuma_Palace_01.jpg',
  'hussain-sagar': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a5/Aerial_view_of_Hussain_Sagar_from_Bansalipet.jpg/1600px-Aerial_view_of_Hussain_Sagar_from_Bansalipet.jpg',
  'ananthagiri-hills': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b7/Ananthagiri_Hills.JPG/1600px-Ananthagiri_Hills.JPG',
  'birla-mandir': 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Birla_Mandir%2C_Hyderabad.png',
  'chilkur-balaji': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Chilkoor_balaji_temple.JPG/1600px-Chilkoor_balaji_temple.JPG',
  'yadadri': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Yadagirigutta_Temple_Main_Entrance.jpg/1600px-Yadagirigutta_Temple_Main_Entrance.jpg',
  'paigah-tombs': 'https://upload.wikimedia.org/wikipedia/commons/2/28/Paigah_Tombs.jpg',
  'moula-ali-dargah': 'https://upload.wikimedia.org/wikipedia/commons/a/ae/MoulaAli_1902.jpg',
  'shilparamam': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/db/Entrance_of_Shilparamam%2C_Jubileehills.jpg/1600px-Entrance_of_Shilparamam%2C_Jubileehills.jpg',
  'ramoji-film-city': 'https://upload.wikimedia.org/wikipedia/commons/d/d1/Ramoji_Film_City.jpg',
  'warangal-fort': 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Shiv_Linga_at_Warangal_Fort_Complex.jpg',
  'medak-cathedral': 'https://upload.wikimedia.org/wikipedia/commons/9/97/Medak_Cathedral_photo.jpg',
  'alampur-jogulamba': 'https://upload.wikimedia.org/wikipedia/commons/3/31/Alampur_India_%285%29.JPG',
  'kuntala-waterfall': 'https://upload.wikimedia.org/wikipedia/commons/a/aa/Kuntala-waterfalls1.jpg',
  'sita-rama-chandra-temple': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Sri_sita_rama_temple_bhadrachalam_temple_view.jpg/1600px-Sri_sita_rama_temple_bhadrachalam_temple_view.jpg'
};

const expImages: Record<string, string> = {
  'old-city-heritage-walk': 'https://upload.wikimedia.org/wikipedia/commons/7/71/Charminar_Hyderabad_1.jpg',
  'old-city-food-walk': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7c/Hyderabadi_Chicken_Biryani.jpg/1200px-Hyderabadi_Chicken_Biryani.jpg',
  'golconda-fort-deep-walk': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/56/Golconda_Fort_005.jpg/1600px-Golconda_Fort_005.jpg',
  'quiet-heritage-lanes': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/ce/Chowmahalla_Palace_01.jpg/1600px-Chowmahalla_Palace_01.jpg',
  'royal-hyderabad-day': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f3/Falaknuma_Palace_01.jpg/1600px-Falaknuma_Palace_01.jpg',
  'crafts-makers-afternoon': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/db/Entrance_of_Shilparamam%2C_Jubileehills.jpg/1600px-Entrance_of_Shilparamam%2C_Jubileehills.jpg',
  'lakefront-evening-walk': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a5/Aerial_view_of_Hussain_Sagar_from_Bansalipet.jpg/1600px-Aerial_view_of_Hussain_Sagar_from_Bansalipet.jpg',
  'ramappa-day-trip': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/29/Ramappa_Temple_%28Human_Scale%29.jpg/1600px-Ramappa_Temple_%28Human_Scale%29.jpg',
  'spiritual-hyderabad-morning': 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Birla_Mandir%2C_Hyderabad.png',
  'photography-old-city-blue-hour': 'https://upload.wikimedia.org/wikipedia/commons/7/71/Charminar_Hyderabad_1.jpg'
};

const foodImages: Record<string, string> = {
  'gokul-chat': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
  'nimrah-cafe': 'https://upload.wikimedia.org/wikipedia/commons/6/63/Subhan_osmania_biscuits.jpg',
  'hotel-shadab': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7c/Hyderabadi_Chicken_Biryani.jpg/1200px-Hyderabadi_Chicken_Biryani.jpg',
  'cafe-niloufer': 'https://upload.wikimedia.org/wikipedia/commons/6/63/Subhan_osmania_biscuits.jpg',
  'ram-ki-bandi': 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80',
  'pista-house': 'https://upload.wikimedia.org/wikipedia/commons/d/d6/Hyderabadi_Mutton_Haleem.jpg',
  'bawarchi': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
  'paradise-hotel': 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80'
};

// 1. Update places.ts
let placesContent = fs.readFileSync(placesFile, 'utf8');
for (const [id, img] of Object.entries(placeImages)) {
  const regex = new RegExp(`(id:\\s*['"]${id}['"][\\s\\S]*?image:\\s*['"])([^'"]+)(['"])`, 'm');
  if (regex.test(placesContent)) {
    placesContent = placesContent.replace(regex, `$1${img}$3`);
    console.log(`Updated place: ${id}`);
  } else {
    console.warn(`Place pattern not found for: ${id}`);
  }
}
fs.writeFileSync(placesFile, placesContent, 'utf8');

// 2. Update experiences.ts
let expContent = fs.readFileSync(experiencesFile, 'utf8');
for (const [id, img] of Object.entries(expImages)) {
  const regex = new RegExp(`(id:\\s*['"]${id}['"][\\s\\S]*?image:\\s*['"])([^'"]+)(['"])`, 'm');
  if (regex.test(expContent)) {
    expContent = expContent.replace(regex, `$1${img}$3`);
    console.log(`Updated experience: ${id}`);
  } else {
    console.warn(`Experience pattern not found for: ${id}`);
  }
}
fs.writeFileSync(experiencesFile, expContent, 'utf8');

// 3. Update food.ts
let foodContent = fs.readFileSync(foodFile, 'utf8');
for (const [id, img] of Object.entries(foodImages)) {
  const regex = new RegExp(`(id:\\s*['"]${id}['"][\\s\\S]*?image:\\s*['"])([^'"]+)(['"])`, 'm');
  if (regex.test(foodContent)) {
    foodContent = foodContent.replace(regex, `$1${img}$3`);
    console.log(`Updated food: ${id}`);
  } else {
    console.warn(`Food pattern not found for: ${id}`);
  }
}
fs.writeFileSync(foodFile, foodContent, 'utf8');

console.log('All authentic images successfully applied!');
