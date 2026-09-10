const routes = [
  '/',
  '/discover',
  '/place/hyderabad',
  '/mitras',
  '/experience/katiki',
  '/dashboard',
  '/become-a-buddy',
  '/login',
  '/signup',
  '/booking',
  '/trip',
  '/place/hyderabad',
  '/mitras',
  '/buddy/dashboard'
];

async function checkRoutes() {
  console.log('Testing Yatra Mitra endpoints on http://localhost:3001...\n');
  let allOk = true;

  for (const route of routes) {
    try {
      const res = await fetch(`http://localhost:3001${route}`);
      const text = await res.text();
      const hasTitle = text.includes('Yatra Mitra');
      console.log(`[${res.status === 200 ? 'PASS' : 'FAIL'}] ${route} -> Status: ${res.status} | Title Verified: ${hasTitle}`);
      if (res.status !== 200) allOk = false;
    } catch (err) {
      console.error(`[ERROR] ${route} -> ${err.message}`);
      allOk = false;
    }
  }

  console.log(`\nAll endpoints verified successfully: ${allOk}`);
  process.exit(allOk ? 0 : 1);
}

checkRoutes();
