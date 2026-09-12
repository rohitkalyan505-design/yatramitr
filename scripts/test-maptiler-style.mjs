import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf-8');
const match = env.match(/NEXT_PUBLIC_MAPTILER_API_KEY=([^\r\n]+)/);
if (!match) {
  console.log('NO KEY FOUND');
  process.exit(1);
}
const key = match[1].trim().replace(/^['"]|['"]$/g, '');
console.log('Key length:', key.length);

async function testStyle() {
  const url = `https://api.maptiler.com/maps/streets-v2/style.json?key=${key}`;
  console.log('Fetching style from:', url.replace(key, 'HIDDEN_KEY'));
  const res = await fetch(url);
  console.log('Response status:', res.status, res.statusText);
  if (!res.ok) {
    const text = await res.text();
    console.error('Error body:', text);
    return;
  }
  const json = await res.json();
  console.log('Style Name:', json.name);
  console.log('Sources:', Object.keys(json.sources || {}));
  console.log('Layer count:', json.layers?.length);
  console.log('Glyphs URL:', json.glyphs);
  console.log('Sprite URL:', json.sprite);

  // Check the primary vector tile source
  for (const [srcName, srcObj] of Object.entries(json.sources || {})) {
    console.log(`Source [${srcName}]:`, srcObj.type, srcObj.url);
    if (srcObj.url) {
      const sRes = await fetch(srcObj.url);
      console.log(`  Source tilejson status:`, sRes.status);
      if (sRes.ok) {
        const sJson = await sRes.json();
        console.log(`  Tiles endpoints:`, sJson.tiles);
        if (sJson.tiles && sJson.tiles.length > 0) {
          // Try fetching a sample tile at zoom 7 for Hyderabad coords (lat ~17.4, lon ~78.5)
          // z=7, x=91, y=57
          const sampleTileUrl = sJson.tiles[0].replace('{z}', '7').replace('{x}', '91').replace('{y}', '57');
          const tRes = await fetch(sampleTileUrl);
          console.log(`  Sample vector tile (z=7,x=91,y=57): ${tRes.status} (${tRes.headers.get('content-type')}, ${tRes.headers.get('content-length')} bytes)`);
        }
      }
    }
  }

  // Check glyphs
  if (json.glyphs) {
    const glyphTest = json.glyphs.replace('{fontstack}', 'Noto%20Sans%20Regular').replace('{range}', '0-255');
    const gRes = await fetch(glyphTest);
    console.log('Glyph test (0-255):', gRes.status, gRes.headers.get('content-type'));
  }

  // Check sprite
  if (json.sprite) {
    const spriteJson = `${json.sprite}.json`;
    const spRes = await fetch(spriteJson);
    console.log('Sprite JSON test:', spRes.status);
    const spritePng = `${json.sprite}.png`;
    const spPngRes = await fetch(spritePng);
    console.log('Sprite PNG test:', spPngRes.status);
  }
}

testStyle().catch(console.error);
