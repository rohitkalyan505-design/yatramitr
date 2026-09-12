async function testTiles() {
  const c = await fetch('https://basemaps.cartocdn.com/rastertiles/voyager/10/583/379.png');
  console.log('CARTO tile status:', c.status, c.headers.get('content-type'));
  const o = await fetch('https://tile.openstreetmap.org/10/583/379.png', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  });
  console.log('OSM tile status:', o.status, o.headers.get('content-type'));
}
testTiles();
