import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_SCREENSHOTS = 'C:/Users/vishn/.gemini/antigravity-ide/brain/841c3987-deb8-4bf9-88ea-2c4f0d4d4544/screenshots';
const BASE_URL = 'http://localhost:3000';

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function runMobileVerification() {
  console.log('=== REAL CHROME MOBILE VIEWPORT VERIFICATION (390x844) ===\n');

  const tmpDir = path.join(process.cwd(), 'tmp-chrome-mobile-' + Date.now());
  const chromeProc = spawn(
    CHROME_PATH,
    [
      '--headless=new',
      '--remote-debugging-port=9922',
      '--use-gl=angle',
      '--use-angle=swiftshader',
      '--enable-webgl',
      '--ignore-gpu-blocklist',
      '--user-data-dir=' + tmpDir,
      '--window-size=390,844',
    ],
    { stdio: 'ignore' }
  );

  await sleep(1500);

  let wsUrl = '';
  for (let i = 0; i < 10; i++) {
    try {
      const res = await fetch('http://localhost:9922/json');
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
    chromeProc.kill();
    process.exit(1);
  }

  const ws = new WebSocket(wsUrl);
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
    const res = await send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    return res.result?.value;
  }

  await send('Page.enable');
  await send('Runtime.enable');

  const testMobileRoutes = [
    { path: '/', name: 'mobile-home' },
    { path: '/explore', name: 'mobile-explore' },
    { path: '/food', name: 'mobile-food' },
    { path: '/places/charminar', name: 'mobile-place-charminar' },
    { path: '/safety', name: 'mobile-safety' },
  ];

  for (const r of testMobileRoutes) {
    await send('Page.navigate', { url: `${BASE_URL}${r.path}` });
    await sleep(2000);

    const overflowCheck = await evalExpr(`
      (() => {
        const docWidth = document.documentElement.scrollWidth;
        const winWidth = window.innerWidth;
        return {
          docWidth,
          winWidth,
          hasHorizontalScroll: docWidth > winWidth + 2
        };
      })()
    `);

    console.log(`[PASS] Mobile Route ${r.path}:`);
    console.log(`       Doc width: ${overflowCheck.docWidth}px, Win width: ${overflowCheck.winWidth}px`);
    console.log(`       Horizontal overflow: ${overflowCheck.hasHorizontalScroll ? 'YES (FAIL)' : 'None (Clean)'}`);

    const res = await send('Page.captureScreenshot', { format: 'jpeg', quality: 80 });
    fs.writeFileSync(path.join(ARTIFACT_SCREENSHOTS, `${r.name}.jpg`), Buffer.from(res.data, 'base64'));
  }

  ws.close();
  chromeProc.kill();
  console.log('\n=== MOBILE VERIFICATION COMPLETE ===');
}

runMobileVerification().catch((err) => {
  console.error('Error during mobile verification:', err);
  process.exit(1);
});
