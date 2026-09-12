import { spawn } from 'child_process';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function captureExplore() {
  console.log('Spawning Chrome to capture http://localhost:3000/explore ...');
  const chromeProc = spawn(
    CHROME_PATH,
    [
      '--headless=new',
      '--remote-debugging-port=9555',
      '--use-gl=angle',
      '--use-angle=swiftshader',
      '--enable-webgl',
      '--window-size=1280,900',
    ],
    { stdio: 'ignore' }
  );

  await new Promise((r) => setTimeout(r, 1500));

  const res = await fetch('http://localhost:9555/json');
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

  console.log('Navigating to http://localhost:3000/explore ...');
  await send('Page.navigate', { url: 'http://localhost:3000/explore' });

  // Wait for initial render
  await new Promise((r) => setTimeout(r, 6000));

  // Scroll down so the map is prominently in view
  await send('Runtime.evaluate', {
    expression: 'window.scrollTo({ top: 550, behavior: "instant" })',
  });
  await new Promise((r) => setTimeout(r, 1000));

  const screenshot = await send('Page.captureScreenshot', { format: 'png' });
  const outPath = 'C:/Users/vishn/.gemini/antigravity-ide/brain/841c3987-deb8-4bf9-88ea-2c4f0d4d4544/screenshots/explore-now.png';
  fs.writeFileSync(outPath, Buffer.from(screenshot.data, 'base64'));
  console.log('Captured explore-now.png to', outPath);

  ws.close();
  chromeProc.kill();
}

captureExplore().catch(console.error);
