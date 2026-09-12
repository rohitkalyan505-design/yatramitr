import { spawn } from 'child_process';

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9222',
  '--use-gl=angle',
  '--use-angle=swiftshader',
  '--enable-webgl',
  '--ignore-gpu-blocklist',
  '--window-size=1280,900',
]);

setTimeout(async () => {
  try {
    const list = await (await fetch('http://localhost:9222/json')).json();
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
    await send('Page.enable');
    await send('Runtime.enable');
    await send('Page.navigate', { url: 'http://localhost:3000/explore' });

    setTimeout(async () => {
      const res = await send('Runtime.evaluate', {
        expression: `(() => {
          const map = window.__ymMap;
          if (!map) return { error: 'no map' };
          const style = map.getStyle();
          const layers = map.getLayersOrder ? map.getLayersOrder() : (style?.layers?.map(l => l.id) || []);
          return {
            version: style?.version,
            name: style?.name,
            sources: style?.sources,
            layerCount: layers.length,
            layers: layers.slice(0, 10),
            isStyleLoaded: map.isStyleLoaded(),
            loaded: map.loaded(),
          };
        })()`,
        returnByValue: true,
      });
      console.log('Map style info:', JSON.stringify(res.result?.value, null, 2));

      // Check why render didn't draw
      const renderDiag = await send('Runtime.evaluate', {
        expression: `(() => {
          const map = window.__ymMap;
          if (!map) return {};
          // Try triggering a render or getting error
          try {
            map.triggerRepaint();
          } catch (e) {
            return { repaintError: e.message };
          }
          const canvas = map.getCanvas();
          const ctx = canvas.getContext('webgl2') || canvas.getContext('webgl');
          return {
            canvasWidth: canvas.width,
            canvasHeight: canvas.height,
            glError: ctx ? ctx.getError() : 'no ctx',
          };
        })()`,
        returnByValue: true,
      });
      console.log('Render diag:', renderDiag.result?.value);

      ws.close();
      chrome.kill();
    }, 4000);
  } catch (err) {
    console.error(err);
    chrome.kill();
  }
}, 1500);
