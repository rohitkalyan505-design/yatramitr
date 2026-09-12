import { spawn } from 'child_process';
import http from 'http';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9222;

async function getWsUrl(): Promise<string> {
  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch(`http://localhost:${PORT}/json`);
      const list = await res.json();
      if (list && list.length > 0 && list[0].webSocketDebuggerUrl) {
        return list[0].webSocketDebuggerUrl;
      }
    } catch {
      // retry
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error('Could not connect to Chrome DevTools port');
}

async function main() {
  console.log('Launching Chrome with DevTools protocol on port 9222...');
  const proc = spawn(CHROME, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    `--remote-debugging-port=${PORT}`,
    'about:blank'
  ], { stdio: 'ignore' });

  try {
    const wsUrl = await getWsUrl();
    console.log('Connected to DevTools WS:', wsUrl);

    // Dynamic import ws or use native WebSocket if Node 22+
    const WS = (globalThis as any).WebSocket;
    if (!WS) {
      console.log('No global WebSocket, falling back.');
      return;
    }

    const ws = new WS(wsUrl);
    await new Promise((resolve) => ws.onopen = resolve);

    let id = 1;
    const send = (method: string, params: any = {}) => {
      return new Promise<any>((resolve) => {
        const msgId = id++;
        const handler = (event: any) => {
          const data = JSON.parse(event.data);
          if (data.id === msgId) {
            ws.removeEventListener('message', handler);
            resolve(data.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    };

    ws.addEventListener('message', (event: any) => {
      const msg = JSON.parse(event.data);
      if (msg.method === 'Console.messageAdded') {
        console.log('[BROWSER CONSOLE]', msg.params.message.level, msg.params.message.text);
      } else if (msg.method === 'Runtime.consoleAPICalled') {
        console.log('[BROWSER LOG]', msg.params.type, msg.params.args.map((a: any) => a.value || a.description).join(' '));
      } else if (msg.method === 'Runtime.exceptionThrown') {
        console.error('[BROWSER EXCEPTION]', msg.params.exceptionDetails.text, msg.params.exceptionDetails.exception?.description);
      } else if (msg.method === 'Network.responseReceived') {
        const status = msg.params.response.status;
        const url = msg.params.response.url;
        if (status >= 400) {
          console.error(`[NETWORK ${status}] ${url}`);
        }
      } else if (msg.method === 'Network.loadingFailed') {
        console.error(`[NETWORK FAILED] ${msg.params.errorText} for ${msg.params.requestId}`);
      }
    });

    await send('Network.enable');
    await send('Console.enable');
    await send('Runtime.enable');
    await send('Page.enable');

    console.log('\nNavigating to http://localhost:3000/explore ...');
    await send('Page.navigate', { url: 'http://localhost:3000/explore' });

    // Wait 5 seconds for all tiles, images and React components to initialize
    await new Promise((r) => setTimeout(r, 6000));

    console.log('\nCapturing browser screenshot to check visual state...');
    const screenshotData: any = await send('Page.captureScreenshot', { format: 'png' });
    if (screenshotData && screenshotData.data) {
      const fs = await import('fs');
      fs.writeFileSync('explore-real-browser.png', Buffer.from(screenshotData.data, 'base64'));
      console.log('Saved explore-real-browser.png (' + screenshotData.data.length + ' base64 chars)');
    }

    ws.close();
  } catch (err: any) {
    console.error('Diagnosis error:', err.message);
  } finally {
    proc.kill();
  }
}

main();
