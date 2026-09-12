import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:/Users/vishn/.gemini/antigravity-ide/brain/841c3987-deb8-4bf9-88ea-2c4f0d4d4544/screenshots';
const BASE_URL = 'http://localhost:3000';

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function runFinalProductionQA() {
  console.log('====================================================');
  console.log('   YATRAMITR FINAL PRODUCTION RUNTIME QA PASS');
  console.log('====================================================\n');

  const tmpDir = path.join(process.cwd(), 'tmp-chrome-final-' + Date.now());
  const chromeProc = spawn(
    CHROME_PATH,
    [
      '--headless=new',
      '--remote-debugging-port=9977',
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

  let wsUrl = '';
  for (let i = 0; i < 10; i++) {
    try {
      const res = await fetch('http://localhost:9977/json');
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
    console.error('Failed to connect to Chrome remote debugging on port 9977');
    chromeProc.kill();
    process.exit(1);
  }

  const ws = new WebSocket(wsUrl);
  let callId = 0;
  const pending = new Map();
  const consoleMessages = [];
  const networkErrors = [];
  const maptilerTileRequests = [];

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && pending.has(data.id)) {
      const { resolve, reject } = pending.get(data.id);
      pending.delete(data.id);
      if (data.error) reject(data.error);
      else resolve(data.result);
    } else if (data.method === 'Console.messageAdded') {
      consoleMessages.push(data.params.message);
    } else if (data.method === 'Runtime.consoleAPICalled') {
      consoleMessages.push({
        type: data.params.type,
        args: data.params.args?.map((a) => a.value ?? a.description ?? ''),
      });
    } else if (data.method === 'Network.responseReceived') {
      const resp = data.params.response;
      if (resp.url.includes('api.maptiler.com')) {
        maptilerTileRequests.push({ url: resp.url, status: resp.status });
      }
      if (resp.status >= 400 && !resp.url.includes('/api/reviews') && !resp.url.includes('favicon')) {
        networkErrors.push({ url: resp.url, status: resp.status });
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
    const r = await send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    return r.result?.value;
  }

  async function snap(name) {
    const s = await send('Page.captureScreenshot', { format: 'jpeg', quality: 85 });
    fs.writeFileSync(`${ARTIFACT_DIR}/${name}.jpg`, Buffer.from(s.data, 'base64'));
    console.log(`Saved screenshot: ${name}.jpg`);
  }

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Network.enable');

  const report = {};

  // ----------------------------------------------------
  // TEST 1: HOMEPAGE (/)
  // ----------------------------------------------------
  console.log('\n--- CHECK 1: HOMEPAGE (/) ---');
  await send('Page.navigate', { url: `${BASE_URL}/` });
  await sleep(2500);

  const homeCheck = await evalExpr(`
    (() => {
      const title = document.title;
      const h1 = document.querySelector('h1')?.innerText;
      const brand = document.querySelector('header')?.innerText;
      const brokenImgs = Array.from(document.querySelectorAll('img')).filter(i => i.complete && i.naturalWidth === 0);
      const canvas3d = !!document.querySelector('canvas');
      const hasOldBrand = document.body.innerText.includes('YITRAMITR') || document.body.innerText.includes('YitraMitr');

      return {
        title,
        h1,
        brandMatches: brand?.includes('YATRAMITR'),
        hasOldBrand,
        canvas3d,
        brokenImagesCount: brokenImgs.length,
      };
    })()
  `);
  console.log('Homepage diagnosis:', homeCheck);
  report.home = homeCheck;
  await snap('final-prod-home');

  // ----------------------------------------------------
  // TEST 2: EXPLORE & MAPTILER MAP (/explore)
  // ----------------------------------------------------
  console.log('\n--- CHECK 2: EXPLORE & MAPTILER MAP (/explore) ---');
  maptilerTileRequests.length = 0;
  await send('Page.navigate', { url: `${BASE_URL}/explore` });
  await sleep(3500);

  // Scroll to map
  await evalExpr('window.scrollTo({ top: 550, behavior: "instant" })');
  await sleep(1000);

  const mapCheck = await evalExpr(`
    (() => {
      const markers = document.querySelectorAll('.ym-marker');
      const canvas = document.querySelector('.maplibregl-canvas');
      const indiaBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('India Context'));
      const telanganaBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Telangana Region'));
      const hyderabadBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Hyderabad City'));
      const fitBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Fit 23 Destinations'));
      const hasApiKeyRequired = document.body.innerText.includes('API KEY REQUIRED');

      return {
        markerCount: markers.length,
        hasCanvas: !!canvas,
        canvasWidth: canvas?.clientWidth,
        canvasHeight: canvas?.clientHeight,
        hasIndiaBtn: !!indiaBtn,
        hasTelanganaBtn: !!telanganaBtn,
        hasHyderabadBtn: !!hyderabadBtn,
        hasFitBtn: !!fitBtn,
        hasApiKeyRequired,
      };
    })()
  `);
  console.log('Explore map diagnosis:', mapCheck);
  console.log(`MapTiler tile requests captured: ${maptilerTileRequests.length}`);
  const successfulTiles = maptilerTileRequests.filter(r => r.status === 200).length;
  console.log(`MapTiler 200 OK tiles: ${successfulTiles}/${maptilerTileRequests.length}`);
  report.map = { ...mapCheck, tileRequests: maptilerTileRequests.length, successfulTiles };
  await snap('final-prod-explore');

  // Test views
  console.log('Testing India View...');
  await evalExpr('Array.from(document.querySelectorAll("button")).find(b => b.innerText.includes("India Context"))?.click()');
  await sleep(2000);
  await snap('final-prod-explore-india');

  console.log('Testing Hyderabad City View...');
  await evalExpr('Array.from(document.querySelectorAll("button")).find(b => b.innerText.includes("Hyderabad City"))?.click()');
  await sleep(2000);
  await snap('final-prod-explore-hyderabad');

  console.log('Testing Fit 23 Destinations...');
  await evalExpr('Array.from(document.querySelectorAll("button")).find(b => b.innerText.includes("Fit 23 Destinations"))?.click()');
  await sleep(2000);

  // Test Marker click on Charminar
  console.log('Testing Marker click on Charminar...');
  const charminarMarker = await evalExpr(`
    (() => {
      const m = Array.from(document.querySelectorAll('.ym-marker')).find(el => el.title === 'Charminar' || el.getAttribute('aria-label') === 'Charminar');
      if (m) {
        m.click();
        return { clicked: true, title: m.title };
      }
      return { clicked: false };
    })()
  `);
  await sleep(1500);
  const popupDetails = await evalExpr(`
    (() => {
      const heading = document.querySelector('h3')?.innerText;
      const links = Array.from(document.querySelectorAll('a')).map(a => ({ text: a.innerText.trim(), href: a.getAttribute('href') }));
      const openPlace = links.find(l => l.text === 'Open Place Page');
      const bookMitra = links.find(l => l.text === 'Book a Mitra');
      return {
        heading,
        openPlaceHref: openPlace?.href,
        bookMitraHref: bookMitra?.href,
      };
    })()
  `);
  console.log('Charminar popup details:', popupDetails);
  report.markerNavigation = popupDetails;
  await snap('final-prod-explore-charminar-popup');

  // ----------------------------------------------------
  // TEST 3: PLACE PAGES (/places/charminar & /places/golconda-fort)
  // ----------------------------------------------------
  console.log('\n--- CHECK 3: PLACE PAGES ---');
  await send('Page.navigate', { url: `${BASE_URL}/places/charminar` });
  await sleep(2500);
  const charminarPage = await evalExpr(`
    (() => {
      const h1 = document.querySelector('h1')?.innerText;
      const heroBookBtn = document.getElementById('hero-book-mitra-btn');
      const sidebarBookBtn = document.getElementById('sidebar-book-mitra-btn');
      const img = document.querySelector('img[alt*="Charminar"]');
      return {
        h1,
        heroBookBtn: heroBookBtn?.getAttribute('href'),
        sidebarBookBtn: sidebarBookBtn?.getAttribute('href'),
        hasValidImg: !!img && img.naturalWidth > 0,
      };
    })()
  `);
  console.log('Charminar page diagnosis:', charminarPage);
  report.charminarPage = charminarPage;
  await snap('final-prod-place-charminar');

  await send('Page.navigate', { url: `${BASE_URL}/places/golconda-fort` });
  await sleep(2500);
  const golcondaPage = await evalExpr(`
    (() => {
      const h1 = document.querySelector('h1')?.innerText;
      const heroBookBtn = document.getElementById('hero-book-mitra-btn');
      const img = document.querySelector('img[alt*="Golconda"]');
      return {
        h1,
        heroBookBtn: heroBookBtn?.getAttribute('href'),
        hasValidImg: !!img && img.naturalWidth > 0,
      };
    })()
  `);
  console.log('Golconda page diagnosis:', golcondaPage);
  report.golcondaPage = golcondaPage;
  await snap('final-prod-place-golconda');

  // ----------------------------------------------------
  // TEST 4: EXPERIENCES (/experiences)
  // ----------------------------------------------------
  console.log('\n--- CHECK 4: EXPERIENCES (/experiences) ---');
  await send('Page.navigate', { url: `${BASE_URL}/experiences` });
  await sleep(2500);
  const expCheck = await evalExpr(`
    (() => {
      const cards = document.querySelectorAll('article, [class*="rounded-2xl"]');
      const bookButtons = Array.from(document.querySelectorAll('a[href*="/booking"]'));
      return {
        hasCards: cards.length > 0,
        bookButtonCount: bookButtons.length,
        sampleHref: bookButtons[0]?.getAttribute('href'),
      };
    })()
  `);
  console.log('Experiences diagnosis:', expCheck);
  report.experiences = expCheck;
  await snap('final-prod-experiences');

  // ----------------------------------------------------
  // TEST 5: FOOD GUIDE (/food)
  // ----------------------------------------------------
  console.log('\n--- CHECK 5: FOOD GUIDE (/food) ---');
  await send('Page.navigate', { url: `${BASE_URL}/food` });
  await sleep(2500);
  const foodCheck = await evalExpr(`
    (() => {
      const items = Array.from(document.querySelectorAll('h2, h3')).map(h => h.innerText.trim());
      const brokenImgs = Array.from(document.querySelectorAll('img')).filter(i => i.complete && i.naturalWidth === 0);
      return {
        headings: items.slice(0, 10),
        brokenImages: brokenImgs.length,
      };
    })()
  `);
  console.log('Food guide diagnosis:', foodCheck);
  report.food = foodCheck;
  await snap('final-prod-food');

  // ----------------------------------------------------
  // TEST 6: MITRAS (/mitras)
  // ----------------------------------------------------
  console.log('\n--- CHECK 6: MITRAS (/mitras) ---');
  await send('Page.navigate', { url: `${BASE_URL}/mitras` });
  await sleep(2500);
  const mitrasCheck = await evalExpr(`
    (() => {
      const mitras = Array.from(document.querySelectorAll('h2, h3')).map(h => h.innerText.trim());
      const demoBadges = Array.from(document.querySelectorAll('*')).filter(el => el.textContent && el.textContent.includes('Demo'));
      return {
        mitraCount: mitras.length,
        demoBadgesFound: demoBadges.length > 0,
      };
    })()
  `);
  console.log('Mitras diagnosis:', mitrasCheck);
  report.mitras = mitrasCheck;
  await snap('final-prod-mitras');

  // ----------------------------------------------------
  // TEST 7: FIND MY YATRA (/find-my-yatra)
  // ----------------------------------------------------
  console.log('\n--- CHECK 7: FIND MY YATRA (/find-my-yatra) ---');
  await send('Page.navigate', { url: `${BASE_URL}/find-my-yatra` });
  await sleep(2500);
  const findCheck = await evalExpr(`
    (() => {
      const h1 = document.querySelector('h1')?.innerText;
      const options = document.querySelectorAll('button');
      return {
        h1,
        buttonCount: options.length,
      };
    })()
  `);
  console.log('Find My Yatra diagnosis:', findCheck);
  report.findMyYatra = findCheck;
  await snap('final-prod-find-my-yatra');

  // ----------------------------------------------------
  // TEST 8: SAFETY & EMERGENCY HUB (/safety)
  // ----------------------------------------------------
  console.log('\n--- CHECK 8: SAFETY & EMERGENCY HUB (/safety) ---');
  await send('Page.navigate', { url: `${BASE_URL}/safety` });
  await sleep(2500);
  const safetyCheck = await evalExpr(`
    (() => {
      const telLinks = Array.from(document.querySelectorAll('a[href^="tel:"]')).map(a => a.getAttribute('href'));
      return {
        telLinks,
        has112: telLinks.includes('tel:112'),
        has108: telLinks.includes('tel:108'),
        has1091: telLinks.includes('tel:1091'),
        has1363: telLinks.includes('tel:1363'),
      };
    })()
  `);
  console.log('Safety diagnosis:', safetyCheck);
  report.safety = safetyCheck;
  await snap('final-prod-safety');

  // ----------------------------------------------------
  // TEST 9: MOBILE VIEWPORT (390x844)
  // ----------------------------------------------------
  console.log('\n--- CHECK 9: MOBILE VIEWPORT (390x844) ---');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  });

  const mobileRoutes = ['/', '/explore', '/food', '/places/charminar', '/safety'];
  const mobileOverflowResults = {};

  for (const p of mobileRoutes) {
    await send('Page.navigate', { url: `${BASE_URL}${p}` });
    await sleep(2000);
    const overflow = await evalExpr(`
      (() => {
        const sw = document.documentElement.scrollWidth;
        const iw = window.innerWidth;
        return { scrollWidth: sw, innerWidth: iw, overflows: sw > iw + 1 };
      })()
    `);
    mobileOverflowResults[p] = overflow;
    console.log(`Mobile ${p}:`, overflow);
  }
  report.mobile = mobileOverflowResults;
  await snap('final-prod-mobile-explore');

  // Reset viewport
  await send('Emulation.clearDeviceMetricsOverride');

  // ----------------------------------------------------
  // CONSOLE AND NETWORK AUDIT
  // ----------------------------------------------------
  console.log('\n--- CHECK 10: CONSOLE & NETWORK AUDIT ---');
  const criticalErrors = consoleMessages.filter(m => m.level === 'error' || m.type === 'error');
  console.log(`Total console messages: ${consoleMessages.length}`);
  console.log(`Critical console errors: ${criticalErrors.length}`);
  console.log(`Network 4xx/5xx errors: ${networkErrors.length}`);
  report.consoleErrors = criticalErrors.length;
  report.networkErrors = networkErrors.length;

  ws.close();
  chromeProc.kill();

  console.log('\n=== FINAL PRODUCTION QA SUMMARY ===');
  console.log(JSON.stringify(report, null, 2));
}

runFinalProductionQA().catch(console.error);
