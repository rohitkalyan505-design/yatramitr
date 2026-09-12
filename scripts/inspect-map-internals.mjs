import { spawn } from 'child_process';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function inspect() {
  const chromeProc = spawn(
    CHROME_PATH,
    [
      '--headless=new',
      '--remote-debugging-port=9222',
      '--use-gl=angle',
      '--use-angle=swiftshader',
      '--enable-webgl',
      '--ignore-gpu-blocklist',
      '--window-size=1280,900',
    ],
    { stdio: 'ignore' }
  );

  await sleep(1500);

  const res = await fetch('http://localhost:9222/json');
  const list = await res.json();
  const pageTarget = list.find((t) => t.type === 'page');

  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
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

  await send('Page.enable');
  await send('Runtime.enable');

  await send('Page.navigate', { url: 'http://localhost:3000/explore' });
  await sleep(6000);

  const styleDiag = await evalExpr(`
    (() => {
      const map = window.__ymMap;
      if (!map) return { noMap: true };
      const s = map.style;
      if (!s) return { noStyle: true };

      return {
        _loaded: s._loaded,
        hasImage: s.hasImage ? true : false,
        spriteLoaded: s.sprite ? s.sprite.isLoaded() : 'no sprite object',
        glyphs: s.glyphManager ? 'has glyphManager' : 'no glyphManager',
        sourcesState: Object.entries(s._sources || {}).map(([k, v]) => ({
          id: k,
          type: v.type,
          loaded: v.loaded ? v.loaded() : 'no loaded func',
          status: v.status,
        })),
        mapLoaded: map.loaded(),
        isStyleLoaded: map.isStyleLoaded(),
        areTilesLoaded: map.areTilesLoaded(),
      };
    })()
  `);

  console.log('Style Diagnosis:\n', JSON.stringify(styleDiag, null, 2));

  ws.close();
  chromeProc.kill();
}

inspect().catch(console.error);
