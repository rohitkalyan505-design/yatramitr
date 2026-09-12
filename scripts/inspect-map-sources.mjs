import { spawn } from 'child_process';

import os from 'os';
import path from 'path';

const tmpDir = path.join(os.tmpdir(), 'chrome-test-' + Date.now());

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9333',
  '--use-gl=angle',
  '--use-angle=swiftshader',
  '--enable-webgl',
  '--ignore-gpu-blocklist',
  '--user-data-dir=' + tmpDir,
  '--window-size=1280,900',
]);

setTimeout(async () => {
  try {
    const list = await (await fetch('http://localhost:9333/json')).json();
    const ws = new WebSocket(list[0].webSocketDebuggerUrl);
    await new Promise((r) => (ws.onopen = r));
    let id = 1;
    const send = (m, p = {}) =>
      new Promise((res) => {
        const i = id++;
        const h = (e) => {
          const d = JSON.parse(e.data);
          if (d.id === i) {
            ws.removeEventListener('message', h);
            res(d.result);
          }
        };
        ws.addEventListener('message', h);
        ws.send(JSON.stringify({ id: i, method: m, params: p }));
      });

    ws.addEventListener('message', (e) => {
      const d = JSON.parse(e.data);
      if (d.method === 'Target.targetCreated') {
        console.log('[TARGET CREATED]', d.params.targetInfo.type, d.params.targetInfo.url);
      } else if (d.method === 'Target.targetCrashed') {
        console.error('[TARGET CRASHED]', d.params);
      } else if (d.method === 'Log.entryAdded') {
        console.log('[BROWSER LOG ENTRY]', d.params.entry);
      }
    });

    await send('Target.setDiscoverTargets', { discover: true });
    await send('Log.enable');
    await send('Page.enable');
    await send('Runtime.enable');

    await send('Page.navigate', { url: 'http://localhost:3000/explore' });

    // Wait 7 seconds
    await new Promise((r) => setTimeout(r, 7000));

    // Evaluate detailed MapLibre map internals
    const evalRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const map = window.__ymMap;
        if (!map) return { error: 'No map found' };

        const painter = map.painter;
        const style = map.style;
        const sources = style ? style._sources : {};
        const sourceKeys = Object.keys(sources);

        // Check each source
        const sourceReports = {};
        for (const k of sourceKeys) {
          const src = sources[k];
          sourceReports[k] = {
            type: src.type,
            loaded: src.loaded(),
            hasTileJSON: !!src.tileJSON,
            tiles: src.tiles,
            scheme: src.scheme,
            minzoom: src.minzoom,
            maxzoom: src.maxzoom,
          };
        }

        // Check sourceCaches
        const scReports = {};
        if (style && style._sourceCaches) {
          for (const [k, sc] of Object.entries(style._sourceCaches)) {
            scReports[k] = {
              used: sc.used,
              loaded: sc.loaded(),
              tilesCount: Object.keys(sc._tiles || {}).length,
              tiles: Object.keys(sc._tiles || {}),
              cacheCount: sc._cache ? sc._cache.order.length : 0,
            };
          }
        }

        return {
          painterContext: painter ? !!painter.context : false,
          styleLoaded: map.isStyleLoaded(),
          mapLoaded: map.loaded(),
          sources: sourceReports,
          sourceCaches: scReports,
          transform: {
            width: map.transform.width,
            height: map.transform.height,
            zoom: map.transform.zoom,
            center: [map.transform.center.lng, map.transform.center.lat],
          },
        };
      })()`,
      returnByValue: true,
    });

    console.log('Map detailed internals:\n', JSON.stringify(evalRes.result?.value, null, 2));

    ws.close();
    chrome.kill();
  } catch (err) {
    console.error('Error:', err);
    chrome.kill();
  }
}, 1500);
