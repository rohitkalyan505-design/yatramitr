import { spawn } from 'child_process';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:/Users/vishn/.gemini/antigravity-ide/brain/841c3987-deb8-4bf9-88ea-2c4f0d4d4544/screenshots';

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function testInteractions() {
  console.log('Spawning Chrome to test map interactions...');
  const chromeProc = spawn(
    CHROME_PATH,
    [
      '--headless=new',
      '--remote-debugging-port=9666',
      '--use-gl=angle',
      '--use-angle=swiftshader',
      '--enable-webgl',
      '--window-size=1280,900',
    ],
    { stdio: 'ignore' }
  );

  await sleep(1500);

  const res = await fetch('http://localhost:9666/json');
  const list = await res.json();
  const target = list.find((t) => t.type === 'page');

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  let callId = 0;
  const pending = new Map();

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && pending.has(data.id)) {
      const { resolve, reject } = pending.get(data.id);
      pending.delete(data.id);
      if (data.error) reject(data.error);
      else resolve(data.result);
    }
  };

  await new Promise((r) => (ws.onopen = r));

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = ++callId;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async function evalExpr(expression) {
    const r = await send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    return r.result?.value;
  }

  async function snap(name) {
    const s = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${ARTIFACT_DIR}/${name}.jpg`, Buffer.from(s.data, 'base64'));
    console.log(`Saved screenshot: ${name}.jpg`);
  }

  await send('Page.enable');
  await send('Runtime.enable');

  console.log('Navigating to http://localhost:3000/explore ...');
  await send('Page.navigate', { url: 'http://localhost:3000/explore' });
  await sleep(6000);

  // Scroll to map
  await evalExpr('window.scrollTo({ top: 550, behavior: "instant" })');
  await sleep(1000);

  // 1. Telangana View (Default)
  console.log('Checking default Telangana view...');
  await snap('explore-telangana-view');

  // 2. Click India Context
  console.log('Clicking India Context button...');
  const indiaClicked = await evalExpr(`
    (() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('India Context'));
      if (btn) { btn.click(); return true; }
      return false;
    })()
  `);
  console.log('India Context clicked:', indiaClicked);
  await sleep(2500);
  await snap('explore-india-view');

  // 3. Click Hyderabad City
  console.log('Clicking Hyderabad City button...');
  const hydClicked = await evalExpr(`
    (() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Hyderabad City'));
      if (btn) { btn.click(); return true; }
      return false;
    })()
  `);
  console.log('Hyderabad City clicked:', hydClicked);
  await sleep(2500);
  await snap('explore-hyderabad-view');

  // 4. Click Fit 23 Destinations
  console.log('Clicking Fit 23 Destinations button...');
  const fitClicked = await evalExpr(`
    (() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Fit 23 Destinations'));
      if (btn) { btn.click(); return true; }
      return false;
    })()
  `);
  console.log('Fit 23 Destinations clicked:', fitClicked);
  await sleep(2500);
  await snap('explore-fit-23-destinations');

  // 5. Marker click test: Charminar
  console.log('Clicking Charminar marker...');
  const markerClicked = await evalExpr(`
    (() => {
      const marker = Array.from(document.querySelectorAll('.ym-marker')).find(m => m.getAttribute('aria-label') === 'Charminar' || m.title === 'Charminar');
      if (marker) {
        marker.click();
        return { clicked: true, title: marker.title };
      }
      return { clicked: false, available: Array.from(document.querySelectorAll('.ym-marker')).map(m => m.title).slice(0, 5) };
    })()
  `);
  console.log('Marker click result:', markerClicked);
  await sleep(2000);
  await snap('explore-charminar-marker-popup');

  // Check detail panel / popup
  const detailCheck = await evalExpr(`
    (() => {
      const panel = document.querySelector('.ym-marker-popup') || document.querySelector('h3');
      const links = Array.from(document.querySelectorAll('a')).map(a => ({ text: a.textContent.trim(), href: a.getAttribute('href') }));
      const openPlaceLink = links.find(l => l.text === 'Open Place Page');
      const bookLink = links.find(l => l.text === 'Book a Mitra');
      return {
        hasPopupOrPanel: !!panel,
        heading: panel?.textContent?.trim(),
        openPlaceHref: openPlaceLink?.href,
        bookHref: bookLink?.href,
      };
    })()
  `);
  console.log('Charminar marker details check:', detailCheck);

  // 6. Test Search Box: search "Golconda"
  console.log('Testing search for Golconda...');
  await evalExpr(`
    (() => {
      const input = document.querySelector('input[type="text"]') || document.querySelector('input[placeholder*="Search"]');
      if (input) {
        input.value = 'Golconda';
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    })()
  `);
  await sleep(1000);
  await snap('explore-search-golconda');

  ws.close();
  chromeProc.kill();
  console.log('Map interaction tests completed successfully!');
}

testInteractions().catch(console.error);
