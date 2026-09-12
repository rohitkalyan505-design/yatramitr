import fs from 'fs';
import path from 'path';

const placesFile = path.resolve(__dirname, '../src/data/places.ts');

const newImages: Record<string, string> = {
  'nagarjuna-sagar': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/NagarjunaSagarDam.JPG/1600px-NagarjunaSagarDam.JPG',
  'konda-pochamma': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4f/Konda_Pochamma_Sagar_Reservoir.jpg/1280px-Konda_Pochamma_Sagar_Reservoir.jpg',
  'jagannath-temple': 'https://upload.wikimedia.org/wikipedia/commons/8/82/%E0%AC%9C%E0%AC%97%E0%AC%A8%E0%AD%8D%E0%AC%A8%E0%AC%AE%E0%AC%A5_%E0%AC%AE%E0%AC%A8%E0%AD%8D%E0%AC%A6%E0%AC%BF%E0%AC%B0%2C_%E0%AC%B9%E0%AC%BE%E0%AC%87%E0%AC%A6%E0%AD%8D%E0%AC%B0%E0%AC%BE%E0%AC%AC%E0%AC%BE%E0%AC%A6.jpg',
  'iskcon-hyderabad': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8e/Hare_Krishna_Golden_Temple_%28Hyderabad%2C_India%2C_2018%29.jpg/1280px-Hare_Krishna_Golden_Temple_%28Hyderabad%2C_India%2C_2018%29.jpg',
  'swarna-giri': 'https://upload.wikimedia.org/wikipedia/commons/e/ed/Swarnagiri_Temple.png',
  'statue-of-equality': 'https://upload.wikimedia.org/wikipedia/commons/3/35/Statue_Of_Equality_Samatha_Murthy.jpg'
};

let content = fs.readFileSync(placesFile, 'utf8');

for (const [id, img] of Object.entries(newImages)) {
  const regex = new RegExp(`(id:\\s*['"]${id}['"][\\s\\S]*?image:\\s*['"])([^'"]+)(['"])`, 'm');
  if (regex.test(content)) {
    content = content.replace(regex, `$1${img}$3`);
    console.log(`Updated place ${id} with authentic image.`);
  } else {
    console.warn(`Place ${id} not matched.`);
  }
}

fs.writeFileSync(placesFile, content, 'utf8');
console.log('Successfully updated all remaining places!');
