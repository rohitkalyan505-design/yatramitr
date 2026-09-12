import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const env = fs.readFileSync('.env.local', 'utf-8');
const match = env.match(/NEXT_PUBLIC_MAPTILER_API_KEY=([^\r\n]+)/);
const key = match[1].trim().replace(/^['"]|['"]$/g, '');

async function testMap() {
  // Create an HTML file that loads maplibre-gl and renders both vector and raster
  const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>MapLibre MapTiler Render Test</title>
  <link href="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css" rel="stylesheet" />
  <script src="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js"></script>
  <style>
    body { margin: 0; padding: 0; background: #FAF8F5; font-family: sans-serif; }
    .map-box { width: 600px; height: 400px; margin: 20px; border: 2px solid #333; display: inline-block; position: relative; }
  </style>
</head>
<body>
  <h2>MapLibre + MapTiler Verification</h2>
  <div id="vector-map" class="map-box"><h3>Vector Style</h3></div>
  <div id="raster-map" class="map-box"><h3>Raster Style</h3></div>

  <script>
    window.__results = {};

    // 1. Vector Map
    try {
      const vMap = new maplibregl.Map({
        container: 'vector-map',
        style: 'https://api.maptiler.com/maps/streets-v2/style.json?key=${key}',
        center: [78.47, 17.38],
        zoom: 11,
      });
      vMap.on('load', () => {
        window.__results.vectorLoaded = true;
      });
      vMap.on('error', (e) => {
        window.__results.vectorError = e.error ? e.error.message : String(e);
      });
    } catch (e) {
      window.__results.vectorInitError = e.message;
    }

    // 2. Raster Map
    try {
      const rMap = new maplibregl.Map({
        container: 'raster-map',
        style: {
          version: 8,
          sources: {
            'maptiler-raster': {
              type: 'raster',
              tiles: ['https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${key}'],
              tileSize: 256,
              attribution: '&copy; MapTiler &copy; OpenStreetMap contributors',
            }
          },
          layers: [{
            id: 'maptiler-raster-layer',
            type: 'raster',
            source: 'maptiler-raster',
            minzoom: 0,
            maxzoom: 20
          }]
        },
        center: [78.47, 17.38],
        zoom: 11,
      });
      rMap.on('load', () => {
        window.__results.rasterLoaded = true;
      });
      rMap.on('error', (e) => {
        window.__results.rasterError = e.error ? e.error.message : String(e);
      });
    } catch (e) {
      window.__results.rasterInitError = e.message;
    }
  </script>
</body>
</html>`;

  fs.writeFileSync('public/map-test.html', htmlContent);
  console.log('Saved public/map-test.html');

  // Spawn Chrome and open http://localhost:3000/map-test.html
  const chromeProc = spawn(
    CHROME_PATH,
    [
      '--headless=new',
      '--remote-debugging-port=9444',
      '--use-gl=angle',
      '--use-angle=swiftshader',
      '--enable-webgl',
      '--window-size=1280,900',
    ],
    { stdio: 'ignore' }
  );

  await new Promise((r) => setTimeout(r, 1500));

  const res = await fetch('http://localhost:9444/json');
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

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Network.enable');

  console.log('Navigating to http://localhost:3000/map-test.html ...');
  await send('Page.navigate', { url: 'http://localhost:3000/map-test.html' });

  // Wait 6 seconds for tiles to render
  await new Promise((r) => setTimeout(r, 6000));

  const evalRes = await send('Runtime.evaluate', {
    expression: 'window.__results',
    returnByValue: true,
  });
  console.log('Test results from window.__results:', evalRes.result?.value);

  // Capture screenshot to see both maps!
  const screenshot = await send('Page.captureScreenshot', { format: 'png' });
  if (screenshot && screenshot.data) {
    fs.writeFileSync('test-maps-screenshot.png', Buffer.from(screenshot.data, 'base64'));
    console.log('Saved test-maps-screenshot.png (check visuals!)');
  }

  ws.close();
  chromeProc.kill();
  if (fs.existsSync('public/map-test.html')) {
    fs.unlinkSync('public/map-test.html');
  }
}

testMap().catch(console.error);
