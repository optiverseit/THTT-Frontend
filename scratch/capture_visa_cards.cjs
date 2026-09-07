const http = require('http');
const fs = require('fs');
const WebSocket = require('ws');

async function getWsUrl() {
  return new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9222/json/list', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const list = JSON.parse(data);
          const page = list.find(p => p.type === 'page' && p.url.includes('localhost:5173'));
          resolve((page || list[0]).webSocketDebuggerUrl);
        } catch(e) { reject(e); }
      });
    }).on('error', reject);
  });
}

(async () => {
  const wsUrl = await getWsUrl();
  const ws = new WebSocket(wsUrl);

  let id = 1;
  const pending = new Map();
  ws.on('message', (msg) => {
    const data = JSON.parse(msg);
    if (pending.has(data.id)) {
      pending.get(data.id)(data.result);
      pending.delete(data.id);
    }
  });

  function send(method, params = {}) {
    return new Promise(resolve => {
      const msgId = id++;
      pending.set(msgId, resolve);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  await new Promise(r => ws.on('open', r));

  // Navigate to visa services
  await send('Page.navigate', { url: 'http://localhost:5173/services/visa-services' });
  await new Promise(r => setTimeout(r, 1500));

  // Set to INR
  await send('Runtime.evaluate', {
    expression: "localStorage.setItem('currencyMode', 'inr'); location.reload();"
  });
  await new Promise(r => setTimeout(r, 1500));
  await send('Runtime.evaluate', { expression: "window.scrollTo(0, 550);" });
  await new Promise(r => setTimeout(r, 400));
  
  const shotInr = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/visa_cards_inr.png', Buffer.from(shotInr.data, 'base64'));

  // Set to USD
  await send('Runtime.evaluate', {
    expression: "localStorage.setItem('currencyMode', 'foreigner'); location.reload();"
  });
  await new Promise(r => setTimeout(r, 1500));
  await send('Runtime.evaluate', { expression: "window.scrollTo(0, 550);" });
  await new Promise(r => setTimeout(r, 400));

  const shotUsd = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/visa_cards_usd.png', Buffer.from(shotUsd.data, 'base64'));

  console.log('Visa card screenshots captured');
  ws.close();
  process.exit(0);
})();
