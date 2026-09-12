import { spawn } from 'child_process';
import * as fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:3000';

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function diagnose() {
  console.log('=== DIAGNOSING MAPLIBRE & MAPTILER IN CHROME ===\n');

  // Spawn Chrome WITH WebGL support (use SwiftShader for headless or native GPU)
  const chromeProc = spawn(
    CHROME_PATH,
    [
      '--headless=new',
      '--remote-debugging-port=9222',
      '--use-gl=angle',
      '--use-angle=swiftshader',
      '--enable-webgl',
      '--ignore-gpu-blocklist',
      '--no-first-run',
      '--no-default-browser-check',
      '--window-size=1280,900',
    ],
    { stdio: 'ignore' }
  );

  await sleep(1500);

  const res = await fetch('http://localhost:9222/json');
  const list = await res.json();
  const pageTarget = list.find((t) => t.type === 'page');

  if (!pageTarget || !pageTarget.webSocketDebuggerUrl) {
    console.error('Failed to find page target');
    chromeProc.kill();
    process.exit(1);
  }

  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  let callId = 0;
  const pending = new Map();
  const consoleMessages = [];
  const networkRequests = [];
  const networkResponses = [];

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
    } else if (data.method === 'Network.requestWillBeSent') {
      networkRequests.push({
        url: data.params.request.url,
        method: data.params.request.method,
      });
    } else if (data.method === 'Network.responseReceived') {
      networkResponses.push({
        url: data.params.response.url,
        status: data.params.response.status,
        statusText: data.params.response.statusText,
        mimeType: data.params.response.mimeType,
      });
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

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Console.enable');
  await send('Network.enable');

  console.log('Navigating to http://localhost:3000/explore...');
  await send('Page.navigate', { url: `${BASE_URL}/explore` });

  // Wait 4 seconds for full render
  await sleep(4000);

  console.log('\n--- NETWORK REQUESTS TO MAP SERVICES ---');
  const mapReqs = networkResponses.filter(
    (r) => r.url.includes('maptiler') || r.url.includes('osm') || r.url.includes('carto') || r.url.includes('tile')
  );
  console.log(`Found ${mapReqs.length} map tile/style responses:`);
  mapReqs.forEach((r) => {
    // Mask API key if present in URL
    const safeUrl = r.url.replace(/key=[a-zA-Z0-9_-]+/g, 'key=HIDDEN_KEY');
    console.log(`  [${r.status}] ${safeUrl} (${r.mimeType})`);
  });

  const failedReqs = networkResponses.filter((r) => r.status >= 400);
  if (failedReqs.length > 0) {
    console.log(`\n--- FAILED NETWORK REQUESTS (${failedReqs.length}) ---`);
    failedReqs.forEach((r) => {
      const safeUrl = r.url.replace(/key=[a-zA-Z0-9_-]+/g, 'key=HIDDEN_KEY');
      console.log(`  [${r.status}] ${safeUrl}`);
    });
  }

  console.log('\n--- CONSOLE LOGS & ERRORS ---');
  consoleMessages.forEach((m) => {
    console.log(`  [${m.type || 'msg'}]`, m.text || m.args?.join(' ') || m);
  });

  console.log('\n--- MAP DOM & CANVAS DIAGNOSIS ---');
  const domDiag = await evalExpr(`
    (() => {
      const container = document.querySelector('.maplibregl-canvas-container');
      const canvas = document.querySelector('.maplibregl-canvas');
      const markers = document.querySelectorAll('.ym-marker');

      let glStatus = 'no canvas';
      let canvasPixelCheck = 'unknown';

      if (canvas) {
        try {
          const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
          if (gl) {
            glStatus = 'WebGL initialized (' + gl.getParameter(gl.RENDERER) + ', vendor: ' + gl.getParameter(gl.VENDOR) + ')';
            const pixels = new Uint8Array(4);
            gl.readPixels(canvas.width / 2, canvas.height / 2, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
            canvasPixelCheck = 'RGBA(' + pixels[0] + ',' + pixels[1] + ',' + pixels[2] + ',' + pixels[3] + ')';
          } else {
            glStatus = 'Failed to get WebGL context';
          }
        } catch (e) {
          glStatus = 'Error getting WebGL: ' + e.message;
        }
      }

      return {
        hasCanvas: !!canvas,
        canvasWidth: canvas?.width,
        canvasHeight: canvas?.height,
        canvasClientWidth: canvas?.clientWidth,
        canvasClientHeight: canvas?.clientHeight,
        glStatus,
        canvasPixelCheck,
        markerCount: markers.length,
      };
    })()
  `);

  console.log('DOM & Canvas Diag:', domDiag);

  ws.close();
  chromeProc.kill();
  console.log('\n=== DIAGNOSIS COMPLETE ===');
}

diagnose().catch(console.error);
