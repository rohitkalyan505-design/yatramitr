async function testDownload() {
  const url = 'https://upload.wikimedia.org/wikipedia/commons/7/71/Charminar_Hyderabad_1.jpg';
  const res = await fetch(url, {
    headers: { 'User-Agent': 'YitraMitr/1.0 (responsible-tourism-project; contact@yatramitr.org)' }
  });
  console.log('Status:', res.status, 'Type:', res.headers.get('content-type'), 'Length:', res.headers.get('content-length'));
}
testDownload();
