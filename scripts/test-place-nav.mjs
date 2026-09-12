import { spawn } from 'child_process';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function testPlaceNavigation() {
  const chromeProc = spawn(
    CHROME_PATH,
    [
      '--headless=new',
      '--remote-debugging-port=9777',
      '--use-gl=angle',
      '--use-angle=swiftshader',
      '--enable-webgl',
      '--window-size=1280,900',
    ],
    { stdio: 'ignore' }
  );

  await sleep(1500);

  const res = await fetch('http://localhost:9777/json');
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

  await send('Page.enable');
  await send('Runtime.enable');

  console.log('Navigating to http://localhost:3000/explore ...');
  await send('Page.navigate', { url: 'http://localhost:3000/explore' });
  await sleep(6000);

  // Click Golconda Fort marker directly
  console.log('Clicking Golconda Fort marker...');
  const golcondaClick = await evalExpr(`
    (() => {
      const marker = Array.from(document.querySelectorAll('.ym-marker')).find(m => m.getAttribute('aria-label') === 'Golconda Fort' || m.title === 'Golconda Fort');
      if (marker) {
        marker.click();
        return { clicked: true, title: marker.title };
      }
      return { clicked: false };
    })()
  `);
  console.log('Golconda clicked:', golcondaClick);
  await sleep(2000);

  // Check detail card
  const details = await evalExpr(`
    (() => {
      const heading = document.querySelector('h3')?.textContent;
      const links = Array.from(document.querySelectorAll('a')).map(a => ({ text: a.textContent.trim(), href: a.getAttribute('href') }));
      return {
        heading,
        links: links.filter(l => l.text.includes('Open Place') || l.text.includes('Book a Mitra')),
      };
    })()
  `);
  console.log('Golconda detail card:', details);

  // Test navigation to /places/golconda-fort
  console.log('Navigating to Golconda place page...');
  await send('Page.navigate', { url: 'http://localhost:3000/places/golconda-fort' });
  await sleep(4000);

  const placePageCheck = await evalExpr(`
    (() => {
      return {
        url: window.location.href,
        title: document.title,
        h1: document.querySelector('h1')?.textContent,
        hasImage: !!document.querySelector('img'),
        bookLink: Array.from(document.querySelectorAll('a')).find(a => a.href.includes('/booking'))?.href,
      };
    })()
  `);
  console.log('Golconda place page check:', placePageCheck);

  // Test navigation to /places/charminar
  console.log('Navigating to Charminar place page...');
  await send('Page.navigate', { url: 'http://localhost:3000/places/charminar' });
  await sleep(4000);

  const charminarCheck = await evalExpr(`
    (() => {
      return {
        url: window.location.href,
        title: document.title,
        h1: document.querySelector('h1')?.textContent,
        hasImage: !!document.querySelector('img'),
        bookLink: Array.from(document.querySelectorAll('a')).find(a => a.href.includes('/booking'))?.href,
      };
    })()
  `);
  console.log('Charminar place page check:', charminarCheck);

  ws.close();
  chromeProc.kill();
  console.log('Place navigation tests completed successfully!');
}

testPlaceNavigation().catch(console.error);
