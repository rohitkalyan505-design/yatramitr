import { PLACES } from '../src/data/places';
import { FOODS } from '../src/data/food';
import { EXPERIENCES, MITRAS } from '../src/data/experiences';

const BASE_URL = 'http://localhost:3000';

interface TestResult {
  name: string;
  passed: boolean;
  details?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, name: string, details?: string) {
  results.push({
    name,
    passed: !!condition,
    details: details || (condition ? 'Passed' : 'Assertion failed'),
  });
  const status = condition ? 'PASS' : 'FAIL';
  console.log(`[${status}] ${name}${details ? ` — ${details}` : ''}`);
}

async function runTests() {
  console.log('=== STARTING YITRAMITR END-TO-END VERIFICATION ===\n');

  // 1. DATASETS VERIFICATION
  console.log('--- 1. CANONICAL DATASETS ---');
  assert(PLACES.length === 24, 'Canonical places count is exactly 24', `Found ${PLACES.length}`);
  assert(FOODS.length === 8, 'Canonical food entries count is exactly 8', `Found ${FOODS.length}`);
  
  const sitaRama = PLACES.find(p => p.id === 'sita-rama-chandra-temple');
  assert(
    !!sitaRama && sitaRama.showOnMap === false && sitaRama.latitude === null && sitaRama.requiresVerification === true,
    'Sita Rama Temple correctly excluded from map due to unverified coordinates',
    `showOnMap: ${sitaRama?.showOnMap}, lat: ${sitaRama?.latitude}`
  );
  assert(
    !!sitaRama?.image && sitaRama.image.length > 0,
    'Sita Rama Temple has a matching curated heritage image',
    sitaRama?.image
  );

  const placesOnMap = PLACES.filter(p => p.showOnMap !== false && p.latitude !== null && p.longitude !== null);
  assert(placesOnMap.length === 23, 'Exactly 23 places have verified geographic map coordinates', `Found ${placesOnMap.length}`);

  const placesWithImages = PLACES.filter(p => !!p.image);
  assert(placesWithImages.length === 24, 'Every place has a valid image URL', `${placesWithImages.length}/24`);

  const foodsWithImages = FOODS.filter(f => !!f.image);
  assert(foodsWithImages.length === 8, 'Every food entry has a valid image URL', `${foodsWithImages.length}/8`);

  const expsWithImages = EXPERIENCES.filter(e => !!e.image);
  assert(expsWithImages.length === EXPERIENCES.length, 'Every experience has a valid image URL', `${expsWithImages.length}/${EXPERIENCES.length}`);

  const mitrasWithAvatars = MITRAS.filter(m => !!m.avatar);
  assert(mitrasWithAvatars.length === MITRAS.length, 'Every Mitra has a valid avatar URL', `${mitrasWithAvatars.length}/${MITRAS.length}`);

  // 2. HTTP PAGE ROUTES & BACKGROUND STYLING
  console.log('\n--- 2. CORE PAGE ROUTES & BACKGROUND IDENTITY ---');
  const pages = [
    { path: '/', bgClass: 'bg-page-home', title: 'Home' },
    { path: '/explore', bgClass: 'bg-page-explore', title: 'Explore' },
    { path: '/places/charminar', bgClass: 'bg-page-place', title: 'Place (Charminar)' },
    { path: '/experiences', bgClass: 'bg-page-experiences', title: 'Experiences' },
    { path: '/experiences/old-city-heritage-walk', bgClass: 'bg-page-experiences', title: 'Experience Detail' },
    { path: '/food', bgClass: 'bg-page-food', title: 'Food Guide' },
    { path: '/mitras', bgClass: 'bg-page-mitras', title: 'Mitras' },
    { path: '/mitras/mitra-arjun', bgClass: 'bg-page-mitras', title: 'Mitra Profile' },
    { path: '/find-my-yatra', bgClass: 'bg-page-find', title: 'Find My Yatra' },
    { path: '/price-check', bgClass: 'bg-page-price', title: 'Price Check' },
    { path: '/safety', bgClass: 'bg-page-safety', title: 'Emergency & Safety' },
    { path: '/how-it-works', bgClass: 'bg-page-howitworks', title: 'How It Works' },
    { path: '/become-mitra', bgClass: 'bg-page-become-mitra', title: 'Become a Mitra' },
    { path: '/login', bgClass: 'bg-page-auth', title: 'Login' },
    { path: '/signup', bgClass: 'bg-page-auth', title: 'Signup' },
    { path: '/dashboard', bgClass: 'bg-page-dashboard', title: 'Dashboard' },
    { path: '/trip', bgClass: 'bg-page-trip', title: 'Live Trip' },
  ];

  for (const p of pages) {
    try {
      const res = await (fetch as any)(`${BASE_URL}${p.path}`);
      const text = await res.text();
      assert(res.status === 200, `Page ${p.title} (${p.path}) responds with HTTP 200 OK`, `Status ${res.status}`);
      assert(text.includes(p.bgClass), `Page ${p.title} contains visual background class '${p.bgClass}'`);
    } catch (err) {
      assert(false, `Page ${p.title} (${p.path}) loads without network failure`, String(err));
    }
  }

  // 3. EMERGENCY & SAFETY SECTION VERIFICATION
  console.log('\n--- 3. EMERGENCY & SAFETY ASSISTANCE ---');
  const homeRes = await (fetch as any)(`${BASE_URL}/`);
  const homeHtml = await homeRes.text();
  assert(homeHtml.includes('112') && homeHtml.includes('tel:112'), 'Home page contains 112 National Emergency with tel:112 link');
  assert(homeHtml.includes('108') && homeHtml.includes('tel:108'), 'Home page contains 108 Ambulance with tel:108 link');
  assert(homeHtml.includes('1091') && homeHtml.includes('tel:1091'), 'Home page contains 1091 Women Helpline with tel:1091 link');
  assert(homeHtml.includes('1363') && homeHtml.includes('tel:1363'), 'Home page contains 1363 Tourist Helpline with tel:1363 link');

  const safetyRes = await (fetch as any)(`${BASE_URL}/safety`);
  const safetyHtml = await safetyRes.text();
  assert(safetyHtml.includes('tel:112') && safetyHtml.includes('tel:108') && safetyHtml.includes('tel:1091') && safetyHtml.includes('tel:1363'),
    'Dedicated /safety page contains all 4 emergency numbers with functional tel: links');

  // 4. PLACE PAGE & "BOOK A MITRA" BUTTONS
  console.log('\n--- 4. PLACE PAGE, BOOK A MITRA & HORIZONTAL LAYOUTS ---');
  const placeRes = await (fetch as any)(`${BASE_URL}/places/charminar`);
  const placeHtml = await placeRes.text();
  assert(placeHtml.includes('hero-book-mitra-btn'), 'Place page contains prominent hero "Book a Mitra" button (hero-book-mitra-btn)');
  assert(placeHtml.includes('sidebar-book-mitra-btn'), 'Place page contains prominent sidebar "Book a Mitra" card (sidebar-book-mitra-btn)');
  assert(placeHtml.includes('Book a Mitra for Charminar'), 'Place page "Book a Mitra" button explicitly names the destination');
  assert(placeHtml.includes('/booking?placeId=charminar'), 'Place page Book button links to /booking with placeId=charminar');
  assert(placeHtml.includes('Food landmarks near Charminar'), 'Place page renders Food landmarks section');
  assert(placeHtml.includes('Mitras who guide here'), 'Place page renders Mitras section with horizontal cards');

  // 5. ASK MITRA AI SERVICE & WIDGET
  console.log('\n--- 5. ASK MITRA WIDGET & AI SERVICE ---');
  try {
    const chatRes1 = await (fetch as any)(`${BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Tell me about Charminar' }),
    });
    const chatData1 = await chatRes1.json();
    assert(chatRes1.status === 200, 'Ask Mitra endpoint responds with HTTP 200 OK');
    assert(
      typeof chatData1.reply === 'string' && chatData1.reply.toLowerCase().includes('charminar'),
      'Ask Mitra answers questions about Charminar with relevant platform context',
      chatData1.reply?.slice(0, 100) + '...'
    );

    const chatRes2 = await (fetch as any)(`${BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Is ₹900 fair for a 4-hour food walk?' }),
    });
    const chatData2 = await chatRes2.json();
    assert(
      typeof chatData2.reply === 'string' && chatData2.reply.length > 20,
      'Ask Mitra responds to Fair Price inquiry',
      chatData2.reply?.slice(0, 100) + '...'
    );
  } catch (err) {
    assert(false, 'Ask Mitra API test executed without error', String(err));
  }

  // 6. ROUTE API & GEOGRAPHIC OSRM ROUTING
  console.log('\n--- 6. GEOGRAPHIC MAP ROUTING API ---');
  try {
    const routeRes = await (fetch as any)(
      `${BASE_URL}/api/route?fromLat=17.3616&fromLng=78.4747&toLat=17.3833&toLng=78.4011&mode=driving`
    );
    const routeData = await routeRes.json();
    assert(routeRes.status === 200, 'Route API responds with HTTP 200 OK');
    assert(
      typeof routeData.distanceKm === 'number' && routeData.distanceKm > 0 && Array.isArray(routeData.geometry),
      'Route API calculates distance and geometry line between Charminar and Golconda Fort',
      `${routeData.distanceKm} km via ${routeData.provider}`
    );
  } catch (err) {
    assert(false, 'Route API test executed without error', String(err));
  }

  // 7. BOOKING PERSISTENCE & DASHBOARD FLOW
  console.log('\n--- 7. BOOKING LIFECYCLE & PERSISTENCE ---');
  let createdBookingId = '';
  try {
    const bookRes = await (fetch as any)(`${BASE_URL}/api/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'qa-tester-auto',
        experienceId: 'old-city-heritage-walk',
        date: '2026-10-15',
        timeSlot: 'Morning (08:00–11:00)',
        groupSize: 2,
        email: 'qa.tester@yitramitr.dev',
        isDemo: true,
      }),
    });
    const bookData = await bookRes.json();
    assert(bookRes.status === 201 && !!bookData.booking?.id, 'Booking created successfully with HTTP 201', bookData.booking?.id);
    createdBookingId = bookData.booking?.id;

    // Verify booking query
    const listRes = await (fetch as any)(`${BASE_URL}/api/bookings?userId=qa-tester-auto`);
    const listData = await listRes.json();
    assert(
      listRes.status === 200 && Array.isArray(listData.bookings) && listData.bookings.some((b: any) => b.id === createdBookingId),
      'Created booking is persisted and retrievable via GET /api/bookings',
      `Found ${listData.bookings?.length} bookings for user`
    );
  } catch (err) {
    assert(false, 'Booking lifecycle test executed without error', String(err));
  }

  // 8. LIVE TRIP CHECKPOINTS & VERIFIED-REVIEW GATE
  console.log('\n--- 8. LIVE TRIP & VERIFIED REVIEW GATE ---');
  if (createdBookingId) {
    try {
      // 8a. Test check-in on trip checkpoint
      const checkinRes = await (fetch as any)(`${BASE_URL}/api/trips/${createdBookingId}/checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checkpointId: 'cp-1' }),
      });
      const checkinData = await checkinRes.json();
      assert(
        checkinRes.status === 200 && !!checkinData.trip,
        'Live Trip checkpoint check-in completes successfully',
        `Trip status: ${checkinData.trip?.status}`
      );

      // 8b. Verified Review Gate: Try to review before trip is completed -> MUST FAIL WITH 403
      const earlyReviewRes = await (fetch as any)(`${BASE_URL}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: createdBookingId,
          userId: 'qa-tester-auto',
          rating: 5,
          comment: 'Premature review attempt',
        }),
      });
      assert(
        earlyReviewRes.status === 403,
        'Verified-review gate blocks review on non-completed booking (HTTP 403)',
        `Status ${earlyReviewRes.status}`
      );

      // 8c. Mark all checkpoints completed (cp-2, cp-3, cp-4)
      await (fetch as any)(`${BASE_URL}/api/trips/${createdBookingId}/checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checkpointId: 'cp-2' }),
      });
      await (fetch as any)(`${BASE_URL}/api/trips/${createdBookingId}/checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checkpointId: 'cp-3' }),
      });
      await (fetch as any)(`${BASE_URL}/api/trips/${createdBookingId}/checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checkpointId: 'cp-4' }),
      });

      // 8d. Submit review on now-completed booking -> MUST SUCCEED WITH 201
      const validReviewRes = await (fetch as any)(`${BASE_URL}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: createdBookingId,
          userId: 'qa-tester-auto',
          rating: 5,
          comment: 'Authentic heritage walk around Charminar. Excellent local storytelling!',
        }),
      });
      const validReviewData = await validReviewRes.json();
      assert(
        validReviewRes.status === 201 && validReviewData.verifiedYatra === true,
        'Verified review successfully submitted for completed trip with verifiedYatra badge (HTTP 201)',
        `Review ID: ${validReviewData.review?.id}`
      );
    } catch (err) {
      assert(false, 'Live trip and review gate test executed without error', String(err));
    }
  }

  // 9. BECOME A MITRA APPLICATION FLOW
  console.log('\n--- 9. BECOME A MITRA ONBOARDING ---');
  try {
    const appRes = await (fetch as any)(`${BASE_URL}/api/mitras`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Kavitha Devi',
        email: 'kavitha.devi@example.com',
        location: 'Old City, Hyderabad',
        bio: 'Lifelong resident with passion for Charminar lac bangles and Irani chai history.',
        languages: ['Telugu', 'Hindi', 'English', 'Urdu'],
        area: 'Old City (Charminar)',
        categories: ['Qutb Shahi & Hyderabad Origins'],
        speciality: 'Old city bazaars and historic mosques',
        availability: ['Morning', 'Weekends only'],
      }),
    });
    const appData = await appRes.json();
    assert(
      (appRes.status === 200 || appRes.status === 201) && appData.success === true,
      'Become a Mitra application submitted and registered in verification pipeline',
      `Success: ${appData.success}`
    );
  } catch (err) {
    assert(false, 'Become a Mitra test executed without error', String(err));
  }

  // SUMMARY REPORT
  console.log('\n========================================');
  console.log('         TEST EXECUTION SUMMARY         ');
  console.log('========================================');
  const total = results.length;
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  console.log(`Total tests run: ${total}`);
  console.log(`Passed:         ${passed}`);
  console.log(`Failed:         ${failed}`);
  if (failed > 0) {
    console.log('\nFailed tests:');
    results.filter(r => !r.passed).forEach(r => console.log(` - ${r.name}: ${r.details}`));
    process.exit(1);
  } else {
    console.log('\nALL END-TO-END VERIFICATIONS PASSED CLEANLY (100%)!');
    process.exit(0);
  }
}

runTests();
