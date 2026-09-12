import { spawn } from 'child_process';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9222;

async function run() {
  const proc = spawn(CHROME, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    `--remote-debugging-port=${PORT}`,
    'http://localhost:3000/explore'
  ]);

  try {
    let wsUrl = '';
    for (let i = 0; i < 30; i++) {
      try {
        const res = await fetch(`http://localhost:${PORT}/json`);
        const list = await res.json();
        const pageTarget = list.find((t) => t.type === 'page');
        if (pageTarget && pageTarget.webSocketDebuggerUrl) {
          wsUrl = pageTarget.webSocketDebuggerUrl;
          break;
        }
      } catch {}
      await new Promise((r) => setTimeout(r, 200));
    }
    console.log('WS URL:', wsUrl);
    if (!wsUrl) throw new Error('Could not get WS URL');

    const ws = new WebSocket(wsUrl);
    await new Promise((r) => (ws.onopen = r));

    let id = 1;
    function send(method, params = {}) {
      return new Promise((resolve) => {
        const msgId = id++;
        const handler = (event) => {
          const d = JSON.parse(event.data);
          if (d.id === msgId) {
            ws.removeEventListener('message', handler);
            resolve(d.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    ws.addEventListener('message', (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method === 'Console.messageAdded') {
        console.log('[BROWSER CONSOLE]', msg.params.message.level, msg.params.message.text);
      } else if (msg.method === 'Runtime.consoleAPICalled') {
        console.log('[BROWSER LOG]', msg.params.type, msg.params.args.map((a) => a.value || a.description).join(' '));
      } else if (msg.method === 'Runtime.exceptionThrown') {
        console.error('[BROWSER EXCEPTION]', msg.params.exceptionDetails.text, msg.params.exceptionDetails.exception?.description);
      }
    });

    await send('Console.enable');
    await send('Runtime.enable');
    await send('Page.enable');

    console.log('Navigating explicitly to http://localhost:3000/explore ...');
    await send('Page.navigate', { url: 'http://localhost:3000/explore' });

    console.log('Waiting 6 seconds for page load & hydration...');
    await new Promise((r) => setTimeout(r, 6000));

    const evalResult = await send('Runtime.evaluate', {
      expression: `(() => {
        const maplibreEl = document.querySelector(".maplibregl-map");
        const canvasEl = document.querySelector("canvas.maplibregl-canvas");
        const markers = document.querySelectorAll(".ym-marker");
        const tiles = document.querySelectorAll(".maplibregl-tile");
        const errorBoxes = Array.from(document.querySelectorAll("div")).filter(d => d.textContent?.includes("couldn't load"));
        return {
          hasMaplibreEl: !!maplibreEl,
          maplibreWidth: maplibreEl?.offsetWidth,
          maplibreHeight: maplibreEl?.offsetHeight,
          hasCanvas: !!canvasEl,
          markersCount: markers.length,
          tilesCount: tiles.length,
          hasErrorBox: errorBoxes.length > 0,
          title: document.title
        };
      })()`,
      returnByValue: true
    });

    console.log('DOM Evaluation Result:', JSON.stringify(evalResult, null, 2));

    console.log('Clicking the first marker on the map...');
    const clickResult = await send('Runtime.evaluate', {
      expression: `(() => {
        const marker = document.querySelector(".ym-marker");
        if (marker) {
          marker.click();
          return { clicked: true, title: marker.getAttribute("aria-label") };
        }
        return { clicked: false };
      })()`,
      returnByValue: true
    });
    console.log('Marker Click Result:', clickResult.result.value);

    await new Promise((r) => setTimeout(r, 1000));

    const popupResult = await send('Runtime.evaluate', {
      expression: `(() => {
        const titleEl = document.querySelector(".maplibregl-map .font-serif, [class*='backdrop-blur'] .font-serif");
        const openPlaceBtn = Array.from(document.querySelectorAll("a")).find(a => a.textContent?.includes("Open Place Page"));
        const bookMitraBtn = Array.from(document.querySelectorAll("a")).find(a => a.textContent?.includes("Book a Mitra"));
        return {
          hasPopup: !!titleEl,
          popupTitle: titleEl?.textContent,
          hasOpenPlaceBtn: !!openPlaceBtn,
          openPlaceHref: openPlaceBtn?.getAttribute("href"),
          hasBookMitraBtn: !!bookMitraBtn,
          bookMitraHref: bookMitraBtn?.getAttribute("href")
        };
      })()`,
      returnByValue: true
    });
    console.log('Popup Verification Result:', JSON.stringify(popupResult.result.value, null, 2));

    // Also take a screenshot via DevTools Protocol Page.captureScreenshot with format jpeg quality 80
    const ss = await send('Page.captureScreenshot', { format: 'jpeg', quality: 60 });
    if (ss && ss.data) {
      const fs = await import('fs');
      fs.writeFileSync('explore-snap.jpg', Buffer.from(ss.data, 'base64'));
      console.log('Successfully wrote explore-snap.jpg, size:', ss.data.length);
    }

    ws.close();
  } catch (e) {
    console.error('Error:', e);
  } finally {
    proc.kill();
  }
}
run();
