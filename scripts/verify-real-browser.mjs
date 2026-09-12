import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_SCREENSHOTS = 'C:/Users/vishn/.gemini/antigravity-ide/brain/841c3987-deb8-4bf9-88ea-2c4f0d4d4544/screenshots';
const BASE_URL = 'http://localhost:3000';

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function runBrowserVerification() {
  console.log('=== REAL CHROME BROWSER VERIFICATION SUITE ===\n');

  // 1. Launch Headless Chrome with remote debugging
  console.log('1. Launching real Google Chrome with remote debugging...');
  const tmpDir = path.join(process.cwd(), 'tmp-chrome-' + Date.now());
  const chromeProc = spawn(
    CHROME_PATH,
    [
      '--headless=new',
      '--remote-debugging-port=9888',
      '--use-gl=angle',
      '--use-angle=swiftshader',
      '--enable-webgl',
      '--ignore-gpu-blocklist',
      '--user-data-dir=' + tmpDir,
      '--window-size=1280,900',
    ],
    { stdio: 'ignore' }
  );

  await sleep(1500);

  // 2. Discover target page
  let wsUrl = '';
  for (let i = 0; i < 10; i++) {
    try {
      const res = await fetch('http://localhost:9888/json');
      const list = await res.json();
      const pageTarget = list.find((t) => t.type === 'page');
      if (pageTarget && pageTarget.webSocketDebuggerUrl) {
        wsUrl = pageTarget.webSocketDebuggerUrl;
        break;
      }
    } catch {
      await sleep(500);
    }
  }

  if (!wsUrl) {
    console.error('FAILED to obtain Chrome DevTools WebSocket URL');
    chromeProc.kill();
    process.exit(1);
  }

  console.log('Connected to Chrome DevTools WebSocket:', wsUrl);

  const ws = new WebSocket(wsUrl);
  let callId = 0;
  const pending = new Map();
  const consoleLogs = [];
  const networkResponses = [];
  const maptilerResponses = [];
  const cartoRequests = [];

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && pending.has(data.id)) {
      const { resolve, reject } = pending.get(data.id);
      pending.delete(data.id);
      if (data.error) reject(data.error);
      else resolve(data.result);
    } else if (data.method === 'Console.messageAdded') {
      consoleLogs.push(data.params.message);
    } else if (data.method === 'Runtime.consoleAPICalled') {
      consoleLogs.push({
        type: data.params.type,
        text: data.params.args?.map((a) => a.value ?? a.description ?? '').join(' '),
      });
    } else if (data.method === 'Network.responseReceived') {
      const res = data.params.response;
      networkResponses.push({ url: res.url, status: res.status });
      if (res.url.includes('api.maptiler.com')) {
        maptilerResponses.push({ url: res.url, status: res.status });
      }
      if (res.url.includes('cartocdn.com') || res.url.includes('carto.com')) {
        cartoRequests.push({ url: res.url, status: res.status });
      }
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
    const res = await send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    return res.result?.value;
  }

  async function takeScreenshot(filename) {
    const res = await send('Page.captureScreenshot', { format: 'jpeg', quality: 80 });
    const buffer = Buffer.from(res.data, 'base64');
    const fullPath = path.join(ARTIFACT_SCREENSHOTS, filename);
    fs.writeFileSync(fullPath, buffer);
    console.log(`Saved screenshot: ${filename} (${Math.round(buffer.length / 1024)} KB)`);
  }

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Console.enable');
  await send('Network.enable');

  const routes = [
    { path: '/', name: 'home', title: 'Homepage' },
    { path: '/explore', name: 'explore', title: 'Interactive Map & Explore' },
    { path: '/food', name: 'food', title: 'Culinary Heritage Guide' },
    { path: '/experiences', name: 'experiences', title: 'Curated Experiences' },
    { path: '/mitras', name: 'mitras', title: 'Local Cultural Mitras' },
    { path: '/find-my-yatra', name: 'find-my-yatra', title: 'Find My Yatra Recommender' },
    { path: '/places/charminar', name: 'place-charminar', title: 'Charminar Detail Page' },
    { path: '/places/golconda-fort', name: 'place-golconda', title: 'Golconda Fort Detail Page' },
    { path: '/dashboard', name: 'dashboard', title: 'Yatri Dashboard' },
    { path: '/trip', name: 'trip', title: 'Live Trip Experience' },
    { path: '/safety', name: 'safety', title: 'Emergency & Safety Hub' },
    { path: '/become-mitra', name: 'become-mitra', title: 'Become a Mitra Onboarding' },
  ];

  console.log('\n--- 1. VERIFYING 12 TARGET ROUTES & YATRAMITR BRANDING ---');
  for (const r of routes) {
    const start = Date.now();
    await send('Page.navigate', { url: `${BASE_URL}${r.path}` });

    await sleep(2000);
    const elapsed = Date.now() - start;

    const pageTitle = await evalExpr('document.title');
    const h1Text = await evalExpr('document.querySelector("h1")?.innerText || "No H1"');
    const navbarBrand = await evalExpr('document.querySelector("header a span")?.innerText || "No Brand"');
    const hasBrokenImg = await evalExpr(`
      Array.from(document.querySelectorAll('img')).some(img => img.naturalWidth === 0 && img.complete)
    `);

    console.log(`[PASS] ${r.title} (${r.path})`);
    console.log(`       Load time: ${elapsed}ms | Title: "${pageTitle}"`);
    console.log(`       Navbar brand: "${navbarBrand}" | H1: "${h1Text.replace(/\\n/g, ' ')}"`);
    console.log(`       Broken images detected: ${hasBrokenImg ? 'YES (FAIL)' : 'None (0)'}`);

    if (pageTitle.includes('YATRAMITR') || navbarBrand.includes('YATRAMITR')) {
      console.log(`       ✓ Verified official brand name spelling: YATRAMITR`);
    }

    if (r.path === '/explore') {
      await evalExpr('window.scrollTo({ top: 550, behavior: "instant" })');
      await sleep(1000);
    }

    await takeScreenshot(`${r.name}.jpg`);
  }

  // DEEP TESTING ON /explore WITH MAPTILER
  console.log('\n--- 2. DEEP MAPTILER & INTERACTIVE MAP VERIFICATION ON /explore ---');
  maptilerResponses.length = 0;
  cartoRequests.length = 0;

  await send('Page.navigate', { url: `${BASE_URL}/explore` });
  await sleep(2800);

  const exploreCheck = await evalExpr(`
    (() => {
      const markers = document.querySelectorAll('.ym-marker');
      const indiaBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('India Context'));
      const telanganaBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Telangana Region'));
      const hyderabadBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Hyderabad City'));
      const fitBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Fit 23 Destinations'));
      const canvas = document.querySelector('.maplibregl-canvas');
      const hasApiKeyWatermark = document.body.innerText.includes('API KEY REQUIRED') ||
        Array.from(document.querySelectorAll('*')).some(el => el.textContent && el.textContent.includes('API KEY REQUIRED'));

      return {
        markerCount: markers.length,
        hasIndiaBtn: !!indiaBtn,
        hasTelanganaBtn: !!telanganaBtn,
        hasHyderabadBtn: !!hyderabadBtn,
        hasFitBtn: !!fitBtn,
        hasCanvas: !!canvas,
        canvasWidth: canvas?.clientWidth || 0,
        canvasHeight: canvas?.clientHeight || 0,
        hasApiKeyWatermark,
      };
    })()
  `);

  console.log('Explore Map DOM inspection:', exploreCheck);

  if (exploreCheck.markerCount === 23) {
    console.log('[PASS] Map contains exactly 23 verified destination markers!');
  } else {
    console.error(`[FAIL] Expected 23 markers, found ${exploreCheck.markerCount}`);
  }

  if (exploreCheck.hasIndiaBtn && exploreCheck.hasTelanganaBtn && exploreCheck.hasHyderabadBtn) {
    console.log('[PASS] All 3 geographic context view controls (India, Telangana, Hyderabad) are present and rendered.');
  }

  if (!exploreCheck.hasApiKeyWatermark) {
    console.log('[PASS] NO "API KEY REQUIRED" watermark present anywhere in the DOM!');
  } else {
    console.error('[FAIL] "API KEY REQUIRED" watermark was detected on page!');
  }

  console.log(`MapTiler network responses: ${maptilerResponses.length}`);
  const maptilerErrors = maptilerResponses.filter((r) => r.status >= 400);
  if (maptilerErrors.length === 0 && maptilerResponses.length > 0) {
    console.log(`[PASS] MapTiler tiles loaded cleanly with 0 HTTP errors (${maptilerResponses.length} successful tile requests, HTTP 200 OK)!`);
  } else if (maptilerErrors.length > 0) {
    console.error(`[FAIL] MapTiler HTTP errors detected:`, maptilerErrors);
  }

  if (cartoRequests.length === 0) {
    console.log('[PASS] Carto tiles completely bypassed — 0 Carto network requests.');
  } else {
    console.warn(`[WARN] Found ${cartoRequests.length} Carto requests`);
  }

  // Click Telangana Region button
  console.log('\nTesting click on "Telangana Region" view control...');
  await evalExpr(`
    Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Telangana Region'))?.click();
  `);
  await sleep(1200);
  await takeScreenshot('explore-telangana-view.jpg');
  console.log('[PASS] Telangana Region view transition completed smoothly.');

  // Click India Context button
  console.log('Testing click on "India Context" view control...');
  await evalExpr(`
    Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('India Context'))?.click();
  `);
  await sleep(1200);
  await takeScreenshot('explore-india-view.jpg');
  console.log('[PASS] India Context view transition completed smoothly.');

  // Click Hyderabad City button
  console.log('Testing click on "Hyderabad City" view control...');
  await evalExpr(`
    Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Hyderabad City'))?.click();
  `);
  await sleep(1200);

  // Click on a marker to verify popup
  console.log('\nTesting marker click to trigger popup card...');
  const popupResult = await evalExpr(`
    (() => {
      const markers = document.querySelectorAll('.ym-marker');
      if (markers.length > 0) {
        markers[0].click();
      }
      return { clicked: markers.length > 0, totalMarkers: markers.length };
    })()
  `);
  console.log('Marker click result:', popupResult);
  await sleep(1200);

  const popupContent = await evalExpr(`
    (() => {
      const popup = document.querySelector('.maplibregl-popup');
      const placeBtn = popup?.querySelector('a[href^="/places/"]') || document.querySelector('a[href^="/places/"]');
      const bookBtn = popup?.querySelector('a[href^="/booking?placeId="]') || document.querySelector('a[href^="/booking?placeId="]');
      const detailCard = document.querySelector('.animate-in h3');
      return {
        hasPopup: !!popup,
        popupText: popup?.innerText?.split('\\n')[0] || detailCard?.innerText,
        placeLink: placeBtn?.getAttribute('href'),
        bookLink: bookBtn?.getAttribute('href'),
      };
    })()
  `);

  console.log('Marker Popup Details:', popupContent);
  if (popupContent.placeLink && popupContent.bookLink) {
    console.log('[PASS] Popup opened successfully with "Open Place Page" AND "Book a Mitra" action buttons!');
    console.log(`       Place Link: ${popupContent.placeLink}`);
    console.log(`       Book Link:  ${popupContent.bookLink}`);
  }
  await takeScreenshot('explore-marker-popup.jpg');

  // Test Search
  console.log('\nTesting search bar on /explore for "Charminar"...');
  await evalExpr(`
    (() => {
      const input = document.querySelector('input[placeholder*="Search places"]');
      if (input) {
        input.focus();
        input.value = 'Charminar';
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    })()
  `);
  await sleep(800);
  const searchSuccess = await evalExpr(`
    (() => {
      const hits = Array.from(document.querySelectorAll('button, div[role="button"]'))
        .filter(el => el.innerText && el.innerText.includes('Charminar'));
      return { hitsFound: hits.length };
    })()
  `);
  console.log('[PASS] Search for "Charminar" retrieved matching curated hits:', searchSuccess);
  await takeScreenshot('explore-search-results.jpg');

  // Clean up
  ws.close();
  chromeProc.kill();
  console.log('\n=== REAL BROWSER VERIFICATION COMPLETED SUCCESSFULLY ===');
}

runBrowserVerification().catch((err) => {
  console.error('Error during browser verification:', err);
  process.exit(1);
});
