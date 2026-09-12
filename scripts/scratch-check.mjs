import fs from 'fs';

async function check() {
  const res = await fetch('http://localhost:3000/explore');
  const html = await res.text();
  console.log('HTML length:', html.length);
  const scripts = [];
  const regex = /<script[^>]+src="([^">]+)"/g;
  let m;
  while ((m = regex.exec(html)) !== null) {
    scripts.push(m[1]);
  }
  console.log('Scripts found:', scripts);
  for (const s of scripts) {
    const url = s.startsWith('http') ? s : `http://localhost:3000${s}`;
    const r = await fetch(url);
    console.log(`Script ${s} -> Status ${r.status}`);
  }
}

check();
