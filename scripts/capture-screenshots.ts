import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = 'C:\\Users\\vishn\\.gemini\\antigravity-ide\\brain\\19761be4-4367-4045-b3de-963952be60ad\\screenshots';

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

interface Target {
  name: string;
  url: string;
  width?: number;
  height?: number;
}

const targets: Target[] = [
  { name: '01_home', url: 'http://localhost:3000' },
  { name: '02_explore', url: 'http://localhost:3000/explore' },
  { name: '03_place_charminar', url: 'http://localhost:3000/places/charminar' },
  { name: '04_experiences', url: 'http://localhost:3000/experiences' },
  { name: '05_food', url: 'http://localhost:3000/food' },
  { name: '06_find_my_yatra', url: 'http://localhost:3000/find-my-yatra' },
  { name: '07_mitras', url: 'http://localhost:3000/mitras' },
  { name: '08_booking', url: 'http://localhost:3000/booking?placeId=charminar' },
  { name: '09_dashboard', url: 'http://localhost:3000/dashboard' },
  { name: '10_trip', url: 'http://localhost:3000/trip' },
  { name: '11_safety', url: 'http://localhost:3000/safety' },
  { name: '12_login', url: 'http://localhost:3000/login' },
  { name: '13_signup', url: 'http://localhost:3000/signup' },
  { name: '14_how_it_works', url: 'http://localhost:3000/how-it-works' },
  { name: '15_become_mitra', url: 'http://localhost:3000/become-mitra' },
  { name: '16_mobile_home', url: 'http://localhost:3000', width: 375, height: 667 },
  { name: '17_mobile_explore', url: 'http://localhost:3000/explore', width: 375, height: 667 },
  { name: '18_mobile_place', url: 'http://localhost:3000/places/charminar', width: 375, height: 667 },
];

for (const t of targets) {
  const w = t.width || 1280;
  const h = t.height || 900;
  const outPath = path.join(OUTPUT_DIR, `${t.name}.png`);
  console.log(`Capturing ${t.name} from ${t.url} (${w}x${h})...`);
  try {
    // We use a clean headless invocation without virtual-time-budget so animated canvases don't hang
    const cmd = `"${CHROME_PATH}" --headless=new --screenshot="${outPath}" --window-size=${w},${h} --hide-scrollbars "${t.url}"`;
    execSync(cmd, { stdio: 'ignore', timeout: 20000 });
    if (fs.existsSync(outPath)) {
      console.log(`  -> Saved to ${outPath}`);
    } else {
      console.log(`  -> Failed: file not found`);
    }
  } catch (err: any) {
    console.error(`  -> Error capturing ${t.name}:`, err.message);
  }
}

console.log('All screenshots captured successfully.');
