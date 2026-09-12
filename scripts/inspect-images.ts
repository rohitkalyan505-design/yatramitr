import { PLACES } from '../src/data/places';
import { EXPERIENCES } from '../src/data/experiences';
import { FOODS } from '../src/data/food';

console.log('=== PLACES ===');
PLACES.forEach((p, i) => console.log(`${i+1}. [${p.id}] ${p.name} -> ${p.image}`));

console.log('\n=== EXPERIENCES ===');
EXPERIENCES.forEach((e, i) => console.log(`${i+1}. [${e.id}] ${e.title} -> ${e.image}`));

console.log('\n=== FOOD ===');
FOODS.forEach((f, i) => console.log(`${i+1}. [${f.id}] ${f.name} -> ${f.image}`));
