async function testOriginalUrl() {
  const originalUrl = 'https://upload.wikimedia.org/wikipedia/commons/5/56/Golconda_Fort_005.jpg';
  const res = await fetch(originalUrl, {
    headers: { 'User-Agent': 'YitraMitr/1.0 (responsible-tourism-project; contact@yatramitr.org)' }
  });
  console.log('Original Golconda Fort status:', res.status, res.headers.get('content-type'), res.headers.get('content-length'));
}
testOriginalUrl();
