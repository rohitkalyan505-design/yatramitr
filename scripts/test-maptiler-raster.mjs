import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf-8');
const match = env.match(/NEXT_PUBLIC_MAPTILER_API_KEY=([^\r\n]+)/);
const key = match[1].trim().replace(/^['"]|['"]$/g, '');

async function test() {
  const r256 = await fetch(`https://api.maptiler.com/maps/streets-v2/256/7/91/57.png?key=${key}`);
  console.log('MapTiler 256 raster tile status:', r256.status, r256.headers.get('content-type'), r256.headers.get('content-length'));

  const r512 = await fetch(`https://api.maptiler.com/maps/streets-v2/512/7/91/57.png?key=${key}`);
  console.log('MapTiler 512 raster tile status:', r512.status, r512.headers.get('content-type'), r512.headers.get('content-length'));

  const rOutdoor = await fetch(`https://api.maptiler.com/maps/outdoor-v2/256/7/91/57.png?key=${key}`);
  console.log('MapTiler outdoor 256 raster tile status:', rOutdoor.status, rOutdoor.headers.get('content-type'));

  const rBasic = await fetch(`https://api.maptiler.com/maps/basic-v2/256/7/91/57.png?key=${key}`);
  console.log('MapTiler basic 256 raster tile status:', rBasic.status, rBasic.headers.get('content-type'));

  const rTilesJson = await fetch(`https://api.maptiler.com/maps/streets-v2/tiles.json?key=${key}`);
  console.log('MapTiler raster tiles.json status:', rTilesJson.status);
  if (rTilesJson.ok) {
    const tj = await rTilesJson.json();
    console.log('Raster tiles endpoints:', tj.tiles);
  }
}

test();
