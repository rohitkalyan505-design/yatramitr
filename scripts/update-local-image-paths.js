const fs = require('fs');
const path = require('path');

// 1. UPDATE PLACES
let placesContent = fs.readFileSync('src/data/places.ts', 'utf8');
const placeIds = [
  'charminar', 'golconda-fort', 'mecca-masjid', 'qutb-shahi-tombs',
  'thousand-pillar-temple', 'ramappa-temple', 'bhongir-fort', 'salar-jung-museum',
  'chowmahalla-palace', 'taj-falaknuma-palace', 'hussain-sagar', 'nagarjuna-sagar',
  'ananthagiri-hills', 'konda-pochamma', 'birla-mandir', 'chilkur-balaji',
  'yadadri', 'jagannath-temple', 'iskcon-hyderabad', 'swarna-giri',
  'statue-of-equality', 'sita-rama-chandra-temple', 'shilparamam', 'ramoji-film-city'
];

for (const id of placeIds) {
  const ext = fs.existsSync(path.join('public', 'images', 'places', id + '.png')) ? '.png' : '.jpg';
  const localPath = '/images/places/' + id + ext;
  const regex = new RegExp('(id:\\s*[\'\"]' + id + '[\'\"][\\s\\S]*?image:\\s*)(?:\\n\\s*)?[\'\""][^\'\""]+[\'\""]', 'm');
  if (regex.test(placesContent)) {
    placesContent = placesContent.replace(regex, '$1\'' + localPath + '\'');
    console.log('Updated place:', id, '->', localPath);
  } else {
    console.error('FAILED TO MATCH PLACE:', id);
  }
}
fs.writeFileSync('src/data/places.ts', placesContent, 'utf8');

// 2. UPDATE FOOD
let foodContent = fs.readFileSync('src/data/food.ts', 'utf8');
const foodIds = [
  'gokul-chat', 'nimrah-cafe', 'hotel-shadab', 'cafe-niloufer',
  'ram-ki-bandi', 'pista-house', 'bawarchi', 'paradise-hotel'
];

for (const id of foodIds) {
  const localPath = '/images/food/' + id + '.jpg';
  const regex = new RegExp('(id:\\s*[\'\"]' + id + '[\'\"][\\s\\S]*?image:\\s*)(?:\\n\\s*)?[\'\""][^\'\""]+[\'\""]', 'm');
  if (regex.test(foodContent)) {
    foodContent = foodContent.replace(regex, '$1\'' + localPath + '\'');
    console.log('Updated food:', id, '->', localPath);
  } else {
    console.error('FAILED TO MATCH FOOD:', id);
  }
}
fs.writeFileSync('src/data/food.ts', foodContent, 'utf8');

// 3. UPDATE EXPERIENCES & MITRAS
let expContent = fs.readFileSync('src/data/experiences.ts', 'utf8');
const expIds = [
  'old-city-heritage-walk', 'old-city-food-walk', 'golconda-fort-deep-walk',
  'quiet-heritage-lanes', 'royal-hyderabad-day', 'crafts-makers-afternoon',
  'lakefront-evening-walk', 'ramappa-day-trip', 'spiritual-hyderabad-morning',
  'photography-old-city-blue-hour'
];

for (const id of expIds) {
  const ext = id === 'spiritual-hyderabad-morning' ? '.png' : '.jpg';
  const localPath = '/images/experiences/' + id + ext;
  const regex = new RegExp('(id:\\s*[\'\"]' + id + '[\'\"][\\s\\S]*?image:\\s*)(?:\\n\\s*)?[\'\""][^\'\""]+[\'\""]', 'm');
  if (regex.test(expContent)) {
    expContent = expContent.replace(regex, '$1\'' + localPath + '\'');
    console.log('Updated exp:', id, '->', localPath);
  } else {
    console.error('FAILED TO MATCH EXP:', id);
  }
}

const mitraIds = ['mitra-arjun', 'mitra-ayesha', 'mitra-rahul', 'mitra-meera'];
for (const id of mitraIds) {
  const localPath = '/images/mitras/' + id + '.jpg';
  const regex = new RegExp('(id:\\s*[\'\"]' + id + '[\'\"][\\s\\S]*?avatar:\\s*)(?:\\n\\s*)?[\'\""][^\'\""]+[\'\""]', 'm');
  if (regex.test(expContent)) {
    expContent = expContent.replace(regex, '$1\'' + localPath + '\'');
    console.log('Updated mitra:', id, '->', localPath);
  } else {
    console.error('FAILED TO MATCH MITRA:', id);
  }
}
fs.writeFileSync('src/data/experiences.ts', expContent, 'utf8');

console.log('All image paths updated to local assets successfully.');
