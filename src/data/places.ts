import { Place, PLACE_CATEGORIES, PlaceCategory } from '@/types';

// ============================================================
// YITRAMITR — HYDERABAD & TELANGANA PLACES DATASET (24 places)
// ============================================================
// Historical framing follows the "Hyderabad & Telangana Tourist
// History Guide" structure: six thematic categories, legend vs
// history distinctions preserved, and missing details explicitly
// marked for verification. Where the guide does not provide
// timings/ticket data, we deliberately show "Check official source
// for latest information" instead of inventing values.
//
// Tourism pressure labels (Low/Medium/High) are YITRAMITR
// editorial classifications for experience design — NOT official
// visitor statistics. See tourismPressureMethodology.
// ============================================================

const PRESSURE_METHODOLOGY =
  'YATRAMITR editorial classification for experience design. Not an official visitor count or government statistic.';

export const PLACES: Place[] = [
  // ------------------------------------------------------------
  // CATEGORY 1 — QUTB SHAHI & HYDERABAD ORIGINS
  // ------------------------------------------------------------
  {
    id: 'charminar',
    name: 'Charminar',
    teluguName: 'చార్మినార్',
    category: 'Qutb Shahi & Hyderabad Origins',
    description:
      'The iconic four-minaret gateway at the heart of Old Hyderabad, surrounded by the historic Laad Bazaar and centuries-old streets.',
    historicalSummary:
      'Built in 1591 by Muhammad Quli Qutb Shah, the fifth Qutb Shahi sultan, at what became the symbolic centre of the newly founded city of Hyderabad. A long-standing tradition links its construction to the end of a severe plague; this remains a popular tradition rather than an unquestionably documented fact.',
    whyItMatters:
      'Charminar is the founding landmark of Hyderabad itself — the point from which the historic city grew in all directions. Understanding it means understanding the city\u2019s Qutb Shahi origins.',
    touristExplanation:
      'An architectural centrepiece around which historic Hyderabad grew. Today it anchors one of India\u2019s most atmospheric old-city quarters, best experienced with someone who knows its lanes.',
    whatToNotice: [
      'The four grand arches facing the cardinal directions',
      'The minarets and their outward-leaning grace',
      'The upper gallery view over the old-city rooftops',
      'How the surrounding bazaar streets radiate from the monument',
    ],
    guideLine:
      'Stand in the arch shadow and listen — the monument still organises the rhythm of the whole old city around it.',
    latitude: 17.3616,
    longitude: 78.4747,
    image:
      '/images/places/charminar.jpg',
    imageAttribution: 'Wikimedia Commons',
    officialSource: 'https://telanganatourism.gov.in',
    tourismPressure: 'High',
    tourismPressureMethodology: PRESSURE_METHODOLOGY,
    recommendedDuration: '2 hours',
    bestTime: 'Early morning for quieter lanes; evenings for bazaar atmosphere',
    timings: 'Check official source for latest information',
    entryInfo: 'Check official source for latest information',
    tags: ['Landmark', 'Qutb Shahi', 'Old City', 'Architecture', 'Bazaar'],
    contentStatus: 'verified',
  },
  {
    id: 'golconda-fort',
    name: 'Golconda Fort',
    teluguName: 'గోల్కొండ కోట',
    category: 'Qutb Shahi & Hyderabad Origins',
    description:
      'A vast fortified citadel west of Hyderabad — royal palaces, gateways, water systems and hilltop views spanning centuries of Deccan history.',
    historicalSummary:
      'Golconda developed from a mud-walled stronghold of the Kakatiya era into the fortified capital of the Qutb Shahi dynasty, which ruled the region from the 16th century before the court moved to the new city of Hyderabad. The complex is famed for its acoustic design, grand gateways and ingenious water supply.',
    whyItMatters:
      'Before Hyderabad existed, Golconda was the capital. Its walls, acoustics and hydraulic engineering tell the story of how the Deccan\u2019s greatest kingdom was built.',
    touristExplanation:
      'A fortified settlement you can walk through for hours — from royal palaces to ramparts with panoramic views of Hyderabad.',
    whatToNotice: [
      'The famous acoustic marvel at the entrance dome',
      'Bala Hisar pavilion at the summit',
      'The grand gateways and spike-studded doors',
      'Remains of the sophisticated water-raising system',
    ],
    guideLine:
      'Listen for the fort\u2019s famous acoustics — a hand clap at the entrance dome echoes at the hilltop pavilion far above.',
    latitude: 17.3833,
    longitude: 78.4011,
    image:
      '/images/places/golconda-fort.jpg',
    imageAttribution: 'Wikimedia Commons',
    officialSource: 'https://telanganatourism.gov.in',
    tourismPressure: 'Medium',
    tourismPressureMethodology: PRESSURE_METHODOLOGY,
    recommendedDuration: '4 hours',
    bestTime: 'Early morning or late afternoon; fort closes by evening',
    timings: 'Check official source for latest information',
    entryInfo: 'Entry ticket; light-and-sound show in the evening. Check official source for latest information',
    tags: ['Fort', 'Qutb Shahi', 'Acoustics', 'Views', 'History'],
    contentStatus: 'verified',
  },
  {
    id: 'mecca-masjid',
    name: 'Mecca Masjid',
    teluguName: 'మక్కా మసీదు',
    category: 'Qutb Shahi & Hyderabad Origins',
    description:
      'One of India\u2019s largest mosques, standing beside Charminar with colossal arches and a courtyard that has held the city\u2019s prayers for centuries.',
    historicalSummary:
      'Begun in 1614 under Sultan Muhammad Qutb Shah and completed under the Mughal governor Aurangzeb in 1693, Mecca Masjid took generations to build. Bricks baked with soil from Mecca are traditionally said to be set above the central arch, giving the mosque its name.',
    whyItMatters:
      'Mecca Masjid anchors the spiritual geography of the old city and shows how Hyderabad\u2019s founding dynasty shaped a living sacred landscape.',
    touristExplanation:
      'A monumental living place of worship — best appreciated for its scale, silence and the rhythm of daily life around it.',
    whatToNotice: [
      'The enormous vaulted arches of the prayer hall',
      'The central arch\u2019s Mecca-brick tradition',
      'The courtyard and its ornamental pond',
      'The view of Charminar from the mosque steps',
    ],
    guideLine:
      'Remove your shoes, lower your voice — this is first a place of prayer and only then a monument.',
    latitude: 17.3605,
    longitude: 78.4744,
    image:
      '/images/places/mecca-masjid.jpg',
    imageAttribution: 'Unsplash Photography',
    officialSource: 'https://telanganatourism.gov.in',
    tourismPressure: 'Medium',
    tourismPressureMethodology: PRESSURE_METHODOLOGY,
    recommendedDuration: '1–2 hours',
    bestTime: 'Morning or late afternoon, avoiding prayer times',
    timings: 'Open daily; visitor access varies with prayer times — check official source',
    entryInfo: 'Free entry. Check official source for latest information',
    tags: ['Mosque', 'Qutb Shahi', 'Living heritage', 'Architecture'],
    contentStatus: 'verified',
  },
  {
    id: 'qutb-shahi-tombs',
    name: 'Qutb Shahi Tombs',
    teluguName: 'కుతుబ్ షాహీ సమాధులు',
    category: 'Qutb Shahi & Hyderabad Origins',
    description:
      'The royal necropolis of the Qutb Shahi dynasty — domed mausoleums of sultans and queens in a serene garden complex near Golconda.',
    historicalSummary:
      'The dynastic burial ground of the Qutb Shahi sultans, where each ruler\u2019s mausoleum was raised during or near their own reign. The complex blends Persian, Indian and Deccani forms and is among the largest royal necropolises of medieval India.',
    whyItMatters:
      'The tombs complete the Golconda story: a dynasty that planned its capital, its fort and its afterlife as one connected landscape.',
    touristExplanation:
      'A quiet royal mausoleum complex — the perfect companion visit to Golconda Fort, and a peaceful contrast to the old-city bustle.',
    whatToNotice: [
      'The domed tombs of the sultans and their queens',
      'Calligraphic panels and stuccowork on the facades',
      'The architectural evolution across the dynasty',
      'The garden setting with the fort on the skyline',
    ],
    guideLine:
      'Visit after the fort — every king you just read about lies under these domes.',
    latitude: 17.3935,
    longitude: 78.3972,
    image:
      '/images/places/qutb-shahi-tombs.jpg',
    imageAttribution: 'Unsplash Photography',
    officialSource: 'https://telanganatourism.gov.in',
    tourismPressure: 'Low',
    tourismPressureMethodology: PRESSURE_METHODOLOGY,
    recommendedDuration: '1–2 hours',
    bestTime: 'Morning, paired with Golconda Fort',
    timings: 'Check official source for latest information',
    entryInfo: 'Check official source for latest information',
    tags: ['Tombs', 'Qutb Shahi', 'Gardens', 'History', 'Quiet'],
    contentStatus: 'verified',
  },

  // ------------------------------------------------------------
  // CATEGORY 2 — KAKATIYA & MEDIEVAL HERITAGE
  // ------------------------------------------------------------
  {
    id: 'thousand-pillar-temple',
    name: 'Thousand Pillar Temple',
    teluguName: 'వేయి స్తంభాల గుడి',
    category: 'Kakatiya & Medieval Heritage',
    description:
      'The Kakatiya-era Rudreswara temple in Hanamkonda, celebrated for its star-shaped sanctum and richly carved pillars.',
    historicalSummary:
      'Built in the 12th–13th centuries under the Kakatiya rulers of Warangal, the Rudreswara (Thousand Pillar) Temple is a masterpiece of Kakatiya temple architecture with a triple-shrine plan and an extensive pillared hall.',
    whyItMatters:
      'A defining monument of the Kakatiya period, showing the engineering and sculptural brilliance that preceded and shaped the Deccan\u2019s medieval kingdoms.',
    touristExplanation:
      'A compact, extraordinary temple — every pillar, bracket and screen carries the hand of Kakatiya-era artisans.',
    whatToNotice: [
      'The star-shaped platform of the main shrine',
      'Perforated stone screens and carved pillars',
      'The monolithic Nandi facing the temple',
      'The triple-shrine (trikutala) plan',
    ],
    guideLine:
      'Count a few pillars, then stop counting and look up — the ceilings carry the real stories.',
    latitude: 17.9833,
    longitude: 79.5833,
    image:
      '/images/places/thousand-pillar-temple.jpg',
    imageAttribution: 'Wikimedia Commons',
    officialSource: 'https://telanganatourism.gov.in',
    tourismPressure: 'Low',
    tourismPressureMethodology: PRESSURE_METHODOLOGY,
    recommendedDuration: '1–2 hours',
    bestTime: 'Morning; combine with Warangal Fort and Kakatiya sites',
    timings: 'Check official source for latest information',
    entryInfo: 'Check official source for latest information',
    tags: ['Temple', 'Kakatiya', 'Architecture', 'Stone carving'],
    contentStatus: 'verified',
  },
  {
    id: 'ramappa-temple',
    name: 'Ramappa Temple',
    teluguName: 'రామప్ప ఆలయం',
    category: 'Kakatiya & Medieval Heritage',
    description:
      'The UNESCO World Heritage Rudreswara temple near Palampet — floating bricks, sculpted brackets and nearly 800 years of Kakatiya genius.',
    historicalSummary:
      'Constructed in 1213 CE under the Kakatiya general Recherla Rudra, Ramappa (Rudreswara) Temple stands as the outstanding example of Kakatiya craft: lightweight floating bricks, a sculpted multi-tieredNandi, and bracket figures of dancers and drummers. It was inscribed as a UNESCO World Heritage Site in 2021.',
    whyItMatters:
      'Telangana\u2019s first UNESCO World Heritage monument — a testimony to Kakatiya engineering, artistry and cosmology, still in worship today.',
    touristExplanation:
      'A living temple where world-heritage architecture meets everyday devotion in a quiet village setting.',
    whatToNotice: [
      'The famed floating bricks of the roof structure',
      'Kakatiya bracket figures — dancers, drummers, mythic scenes',
      'The black basalt Nandi facing the sanctum',
      'Light on the sandstone at morning and evening',
    ],
    guideLine:
      'Ask your Mitra why the temple bricks float — and why that nearly unmatched engineering still keeps the roof standing.',
    latitude: 18.2408,
    longitude: 79.9331,
    image:
      '/images/places/ramappa-temple.jpg',
    imageAttribution: 'Wikimedia Commons',
    officialSource: 'https://telanganatourism.gov.in',
    tourismPressure: 'Low',
    tourismPressureMethodology: PRESSURE_METHODOLOGY,
    recommendedDuration: '2–3 hours',
    bestTime: 'Early morning for soft light; carries well from Hyderabad as a day trip',
    timings: 'Check official source for latest information',
    entryInfo: 'Check official source for latest information',
    tags: ['UNESCO', 'Temple', 'Kakatiya', 'Day trip', 'Craftsmanship'],
    contentStatus: 'verified',
  },
  {
    id: 'bhongir-fort',
    name: 'Bhongir Fort',
    teluguName: 'భువనగిరి కోట',
    category: 'Kakatiya & Medieval Heritage',
    description:
      'A dramatic hilltop fort on a single egg-shaped monolithic rock, built under the Western Chalukyas and strengthened by the Kakatiyas.',
    historicalSummary:
      'Bhongir (Bhuvanagiri) Fort was built in the 10th–12th centuries under Western Chalukya rule and later came under Kakatiya control. The fort crowns a massive isolated rock, with steep stairways and sweeping views over the surrounding plains.',
    whyItMatters:
      'A rare fort built on a single monolith, connecting the medieval Chalukya-Kakatiya military landscape with the modern Telangana countryside.',
    touristExplanation:
      'A short, rewarding climb with big views — ideal for travellers who want history plus a bit of adventure in one stop.',
    whatToNotice: [
      'The sheer egg-shaped rock itself',
      'The stepped stairway climbing through the fortifications',
      'Panoramic views of the Deccan plains',
      'The moat-like natural setting around the hill',
    ],
    guideLine:
      'Start the climb before the sun gets high — the rock remembers every footstep in summer.',
    latitude: 17.5109,
    longitude: 78.8889,
    image:
      '/images/places/bhongir-fort.jpg',
    imageAttribution: 'Unsplash Photography',
    officialSource: 'https://telanganatourism.gov.in',
    tourismPressure: 'Low',
    tourismPressureMethodology: PRESSURE_METHODOLOGY,
    recommendedDuration: '2–3 hours',
    bestTime: 'Early morning climb; cooler months preferred',
    timings: 'Check official source for latest information',
    entryInfo: 'Check official source for latest information',
    tags: ['Fort', 'Hilltop', 'Trek', 'Kakatiya', 'Adventure'],
    contentStatus: 'verified',
  },

  // ------------------------------------------------------------
  // CATEGORY 3 — ROYAL HYDERABAD & MUSEUMS
  // ------------------------------------------------------------
  {
    id: 'salar-jung-museum',
    name: 'Salar Jung Museum',
    category: 'Royal Hyderabad & Museums',
    description:
      'One of India\u2019s largest one-man collections — the Salar Jung family\u2019s museum of art, manuscripts and objects from across the world.',
    historicalSummary:
      'Formed around the collections of Nawab Mir Yousuf Ali Khan, Salar Jung III, a 19th–20th century nobleman and art collector who assembled works from Europe, the Middle East and Asia. His collection became a museum in 1951 and is now one of India\u2019s national museums.',
    whyItMatters:
      'The museum captures Hyderabad\u2019s cosmopolitan royal era — when the city\u2019s nobility collected, curated and connected with the wider world.',
    touristExplanation:
      'A world-class museum where a single afternoon covers centuries and continents — from jade to Japanese woodblock prints.',
    whatToNotice: [
      'The famous musical clock',
      'The veiled Rebecca sculpture',
      'The jade and ivory galleries',
      'The Indo-Islamic and European painting rooms',
    ],
    guideLine:
      'Pick two galleries and go deep — a rushed walk past thousands of objects teaches you less than one slow room.',
    latitude: 17.3712,
    longitude: 78.4803,
    image:
      '/images/places/salar-jung-museum.jpg',
    imageAttribution: 'Wikimedia Commons',
    officialSource: 'https://www.salarjungmuseum.gov.in',
    tourismPressure: 'Medium',
    tourismPressureMethodology: PRESSURE_METHODOLOGY,
    recommendedDuration: '3–4 hours',
    bestTime: 'Weekday mornings; museum closed on Fridays — check official source',
    timings: 'Check official source for latest information',
    entryInfo: 'Entry ticket. Check official source for latest information',
    tags: ['Museum', 'Art', 'Royal era', 'Indoors', 'Family'],
    contentStatus: 'verified',
  },
  {
    id: 'chowmahalla-palace',
    name: 'Chowmahalla Palace',
    teluguName: 'చౌమహల్లా ప్యాలెస్',
    category: 'Royal Hyderabad & Museums',
    description:
      'The ceremonial seat of the Nizams — courtyards, durbar halls, chandeliers and the grand Khilwat where Hyderabad\u2019s royalty received guests.',
    historicalSummary:
      'Chowmahalla served as the official seat of the Asaf Jahi (Nizam) dynasty, with construction beginning in the late 18th century under Nizam Salabat Jung and continuing under later rulers. Its name refers to the four palaces arranged around courtyards, echoing the seat of the Persian kings.',
    whyItMatters:
      'The political heart of Asaf Jahi Hyderabad for two centuries — where the Nizams held durbar and the city\u2019s royal identity was staged.',
    touristExplanation:
      'Palatial courtyards, marble halls and chandelier-lit durbars in the middle of the old city — an essential royal-era stop.',
    whatToNotice: [
      'The grand Khilwat Mubarak durbar hall',
      'The rows of crystal chandeliers',
      'The vintage car and palanquin collections',
      'The four palaces framing the central courtyards',
    ],
    guideLine:
      'Stand in Khilwat and imagine a durbar in session — the room was built to make power feel effortless.',
    latitude: 17.3578,
    longitude: 78.4706,
    image:
      '/images/places/chowmahalla-palace.jpg',
    imageAttribution: 'Wikimedia Commons',
    officialSource: 'https://telanganatourism.gov.in',
    tourismPressure: 'Medium',
    tourismPressureMethodology: PRESSURE_METHODOLOGY,
    recommendedDuration: '2 hours',
    bestTime: 'Late morning; combine with old-city food streets nearby',
    timings: 'Closed Fridays — check official source for latest information',
    entryInfo: 'Entry ticket. Check official source for latest information',
    tags: ['Palace', 'Nizam', 'Royal era', 'Architecture', 'Old City'],
    contentStatus: 'verified',
  },
  {
    id: 'taj-falaknuma-palace',
    name: 'Taj Falaknuma Palace',
    category: 'Royal Hyderabad & Museums',
    description:
      'The "Mirror of the Sky" — a scorpion-shaped hilltop palace above the old city, now a heritage hotel preserving Nizam-era grandeur.',
    historicalSummary:
      'Falaknuma Palace was built in the late 19th century for the Paigah noble Sir Vicar ul-Umra and later purchased by the sixth Nizam, Mahbub Ali Pasha, who used it as a royal residence. Perched 2,000 feet above Hyderabad, it welcomed the Nizam\u2019s most distinguished guests and is today operated as a luxury heritage hotel.',
    whyItMatters:
      'The finest surviving expression of Hyderabad\u2019s royal hospitality — its halls, libraries and dining rooms preserve the ceremony of the Nizam era.',
    touristExplanation:
      'Visitable through curated tours, afternoon tea or dining — a rare chance to step inside a fully preserved royal residence.',
    whatToNotice: [
      'The sweeping approach drive up the hill',
      'The walnut-wood library and marble staircases',
      'The 101-seat dining table and chandeliers',
      'The panoramic view over the old city',
    ],
    guideLine:
      'Arrive for high tea — the palace was designed for evening ceremony, and the light rewards it.',
    latitude: 17.3331,
    longitude: 78.4994,
    image:
      '/images/places/taj-falaknuma-palace.jpg',
    imageAttribution: 'Wikimedia Commons',
    officialSource: 'https://www.tajhotels.com/en-in/taj/taj-falaknuma-palace-hyderabad/',
    tourismPressure: 'Low',
    tourismPressureMethodology: PRESSURE_METHODOLOGY,
    recommendedDuration: '2–3 hours',
    bestTime: 'Afternoon high tea or early evening; booking required',
    timings: 'Access via hotel booking or heritage tour — check official source',
    entryInfo: 'Tour/tea charges apply. Check official source for latest information',
    tags: ['Palace', 'Heritage hotel', 'Nizam', 'Luxury', 'Views'],
    contentStatus: 'verified',
  },

  // ------------------------------------------------------------
  // CATEGORY 4 — LAKES, RESERVOIRS & LANDSCAPES
  // ------------------------------------------------------------
  {
    id: 'hussain-sagar',
    name: 'Hussain Sagar',
    teluguName: 'హుస్సేన్ సాగర్',
    category: 'Lakes, Reservoirs & Landscapes',
    description:
      'The historic heart-shaped lake connecting Hyderabad and Secunderabad, ringed by promenades, parks and the Buddha statue on Gibraltar Rock.',
    historicalSummary:
      'Hussain Sagar was constructed in 1562 under Ibrahim Qutb Shah, built across a tributary of the Musi to serve the twin cities\u2019 water needs. It later became the symbolic link between Hyderabad and Secunderabad, with the monolithic Buddha statue erected on a rocky islet in the lake in the 1990s.',
    whyItMatters:
      'One of the oldest engineered water bodies of Hyderabad, showing how the Qutb Shahi city grew around carefully managed water.',
    touristExplanation:
      'A waterfront for everyone — evening promenades, boating, parks and the city skyline reflected at sunset.',
    whatToNotice: [
      'The monolithic Buddha statue on the lake islet',
      'Sunset over the water between the twin cities',
      'The Tank Bund promenade and its statues',
      'Evening lights and street food nearby',
    ],
    guideLine:
      'Time your visit for the last hour of light — the lake earns its name of the city\u2019s evening living room.',
    latitude: 17.4239,
    longitude: 78.4758,
    image:
      '/images/places/hussain-sagar.jpg',
    imageAttribution: 'Wikimedia Commons',
    officialSource: 'https://telanganatourism.gov.in',
    tourismPressure: 'Medium',
    tourismPressureMethodology: PRESSURE_METHODOLOGY,
    recommendedDuration: '2 hours',
    bestTime: 'Sunset and early evening',
    timings: 'Public promenade open throughout; boating hours vary — check official source',
    entryInfo: 'Free promenade; boating ticketed. Check official source for latest information',
    tags: ['Lake', 'Qutb Shahi', 'Sunset', 'Promenade', 'Family'],
    contentStatus: 'verified',
  },
  {
    id: 'nagarjuna-sagar',
    name: 'Nagarjuna Sagar',
    teluguName: 'నాగార్జున సాగర్',
    category: 'Lakes, Reservoirs & Landscapes',
    description:
      'A monumental modern dam across the Krishna River — and the submerged-and-relocated Buddhist heritage of ancient Nagarjunakonda.',
    historicalSummary:
      'Nagarjuna Sagar Dam, completed in the 1960s, is among the world\u2019s largest masonry dams, built across the Krishna River. The project famously led to the excavation and relocation of Buddhist remains from the Nagarjunakonda valley — named after the ancient philosopher Nagarjuna — to an island museum in the reservoir.',
    whyItMatters:
      'Where modern engineering meets 2,000-year-old Buddhist heritage — a landscape that preserves both India\u2019s ancient past and its nation-building era.',
    touristExplanation:
      'A powerful day trip: dam views, a boat ride to an island museum of Buddhist archaeology, and wide waters of the Krishna.',
    whatToNotice: [
      'The scale of the masonry dam and its gates',
      'The boat ride to Nagarjunakonda island museum',
      'Excavated Buddhist stupas and sculptures',
      'The meeting of river, reservoir and hills',
    ],
    guideLine:
      'Plan for a full day — the dam, the boat and the museum each deserve their own hour.',
    latitude: 16.7833,
    longitude: 79.3167,
    image:
      '/images/places/nagarjuna-sagar.jpg',
    imageAttribution: 'Wikimedia Commons',
    officialSource: 'https://telanganatourism.gov.in',
    tourismPressure: 'Low',
    tourismPressureMethodology: PRESSURE_METHODOLOGY,
    recommendedDuration: 'Full day',
    bestTime: 'Post-monsoon and winter months for fuller reservoir views',
    timings: 'Check official source for latest information',
    entryInfo: 'Check official source for latest information',
    tags: ['Dam', 'Buddhist heritage', 'Day trip', 'Engineering', 'Landscape'],
    contentStatus: 'verified',
  },
  {
    id: 'ananthagiri-hills',
    name: 'Ananthagiri Hills',
    teluguName: 'అనంతగిరి కొండలు',
    category: 'Lakes, Reservoirs & Landscapes',
    description:
      'Forest ridges, viewpoints and a hilltop temple near Vikarabad — one of the oldest inhabited landscapes around Hyderabad.',
    historicalSummary:
      'Ananthagiri Hills are considered among the earliest inhabited landscapes of the region, associated in tradition with the sage Markandeya and sheltering a hilltop Anantha Padmanabha Swamy temple, forest caves and viewpoints over the Musi basin.',
    whyItMatters:
      'A green escape that also carries spiritual and ecological significance — showing the Deccan\u2019s forest-and-water geography beyond the city.',
    touristExplanation:
      'Short forest trails, viewpoints and a quiet temple — a gentle half-day nature reset close to Hyderabad.',
    whatToNotice: [
      'Dense green forest cover unusual for the Deccan plateau',
      'The hilltop Anantha Padmanabha Swamy temple',
      'Viewpoints over the Musi river basin',
      'Sunrise mist over the ridges',
    ],
    guideLine:
      'Carry water and respect the forest edges — this landscape gives its best to slow, quiet walkers.',
    latitude: 17.3512,
    longitude: 77.8781,
    image:
      '/images/places/ananthagiri-hills.jpg',
    imageAttribution: 'Wikimedia Commons',
    officialSource: 'https://telanganatourism.gov.in',
    tourismPressure: 'Low',
    tourismPressureMethodology: PRESSURE_METHODOLOGY,
    recommendedDuration: 'Half day',
    bestTime: 'Early morning or post-monsoon weekends',
    timings: 'Open landscape; temple hours vary — check official source',
    entryInfo: 'Free access to viewpoints. Check official source for latest information',
    tags: ['Forest', 'Temple', 'Nature', 'Half day', 'Quiet'],
    contentStatus: 'verified',
  },
  {
    id: 'konda-pochamma',
    name: 'Konda Pochamma Reservoir',
    teluguName: 'కొండపొచమ్మ జలాశయం',
    category: 'Lakes, Reservoirs & Landscapes',
    description:
      'A modern reservoir project near Siddipet with a large statue, landscaped grounds and quiet waters — Telangana\u2019s new water-engineering landmark.',
    historicalSummary:
      'Konda Pochamma Sagar is a modern irrigation and drinking-water reservoir completed in the 2010s as part of Telangana\u2019s water-mission projects, with landscaped surroundings and a large statue of the local goddess Konda Pochamma. It represents the state\u2019s contemporary water-engineering story.',
    whyItMatters:
      'A living example of Telangana\u2019s modern water story — how the state continues the Qutb Shahi and Kakatiya tradition of engineered waterscapes.',
    touristExplanation:
      'Quiet waters, open skies and easy access from Hyderabad — a low-pressure half-day for picnics and slow evenings.',
    whatToNotice: [
      'The broad expanse of the reservoir',
      'The large Konda Pochamma statue and temple grounds',
      'The embankment walkway',
      'Birdlife in the quieter seasons',
    ],
    guideLine:
      'Evenings are best — arrive an hour before sunset and walk the bund slowly.',
    latitude: 18.1034,
    longitude: 78.9861,
    image:
      '/images/places/konda-pochamma.jpg',
    imageAttribution: 'Wikimedia Commons',
    officialSource: 'https://telanganatourism.gov.in',
    tourismPressure: 'Low',
    tourismPressureMethodology: PRESSURE_METHODOLOGY,
    recommendedDuration: '2–3 hours',
    bestTime: 'Late afternoon and sunset',
    timings: 'Open landscape. Check official source for latest information',
    entryInfo: 'Free access. Check official source for latest information',
    tags: ['Reservoir', 'Water engineering', 'Picnic', 'Quiet', 'Sunset'],
    contentStatus: 'verified',
  },

  // ------------------------------------------------------------
  // CATEGORY 5 — SPIRITUAL & LIVING RELIGIOUS HERITAGE
  // ------------------------------------------------------------
  {
    id: 'birla-mandir',
    name: 'Birla Mandir',
    category: 'Spiritual & Living Religious Heritage',
    description:
      'A marble temple for Lord Venkateswara rising above the city on Naubat Pahad, with carved pillars and panoramic views of Hussain Sagar.',
    historicalSummary:
      'A 20th-century temple constructed by the Birla Foundation atop Naubat Pahad hill, consecrated in 1976. Built in white marble from Rajasthan, it blends Dravidian, Oriya and South Indian temple idioms in a distinctly modern setting at the heart of Hyderabad.',
    whyItMatters:
      'A modern landmark of living faith — showing how temple craft traditions continue in contemporary Hyderabad.',
    touristExplanation:
      'Marble architecture, hilltop calm and one of the best city views in Hyderabad — especially at dawn and dusk.',
    whatToNotice: [
      'The white marble carved superstructure',
      'The hilltop terrace view over Hussain Sagar',
      'The sculpted friezes blending regional temple styles',
      'Morning aarti atmosphere',
    ],
    guideLine:
      'Photography is restricted inside — put the camera away and let the marble do the talking.',
    latitude: 17.4062,
    longitude: 78.4691,
    image:
      '/images/places/birla-mandir.png',
    imageAttribution: 'Wikimedia Commons',
    officialSource: 'https://telanganatourism.gov.in',
    tourismPressure: 'Medium',
    tourismPressureMethodology: PRESSURE_METHODOLOGY,
    recommendedDuration: '1–2 hours',
    bestTime: 'Early morning for aarti and clear views',
    timings: 'Check official source for latest information',
    entryInfo: 'Free entry. Check official source for latest information',
    tags: ['Temple', 'Marble', 'Views', 'Modern', 'Quiet'],
    contentStatus: 'verified',
  },
  {
    id: 'chilkur-balaji',
    name: 'Chilkur Balaji Temple',
    teluguName: 'చిలుకూరు బాలాజీ',
    category: 'Spiritual & Living Religious Heritage',
    description:
      'The "Visa Balaji" temple on Osman Sagar\u2019s edge — a living shrine famous for its no-darshan-fee tradition and visa-wish folklore.',
    historicalSummary:
      'Chilkur Balaji is a centuries-old village shrine whose main sanctum is traditionally dated to around the 14th century. In recent decades it became widely known as the "Visa Temple" — a popular belief that praying here helps devotees obtain foreign visas. This association is a modern popular tradition, not part of the temple\u2019s documented history.',
    whyItMatters:
      'A remarkable example of how living tradition keeps evolving — an old shrine absorbing new urban aspirations without fees or queues-for-money.',
    touristExplanation:
      'Distinctive for its no-fee, no-hundi practice — walk the pradakshina and observe one of Hyderabad\u2019s most human temple traditions.',
    whatToNotice: [
      'The absence of hundi boxes and paid-darshan lanes',
      'Devotees performing 11 pradakshina circumambulations',
      'The temple\u2019s simple village-shrine architecture',
      'The green lakeside setting near Osman Sagar',
    ],
    guideLine:
      'Respect the queue etiquette and the living worship — this is a working temple, not a monument.',
    latitude: 17.3786,
    longitude: 78.2994,
    image:
      '/images/places/chilkur-balaji.jpg',
    imageAttribution: 'Wikimedia Commons',
    officialSource: 'https://telanganatourism.gov.in',
    tourismPressure: 'Medium',
    tourismPressureMethodology: PRESSURE_METHODOLOGY,
    recommendedDuration: '1–2 hours',
    bestTime: 'Early morning to avoid weekend rush',
    timings: 'Check official source for latest information',
    entryInfo: 'No fee. Check official source for latest information',
    tags: ['Temple', 'Living tradition', 'Free', 'Legend', 'Quiet'],
    contentStatus: 'verified',
  },
  {
    id: 'yadadri',
    name: 'Yadadri (Sri Lakshmi Narasimha Temple)',
    teluguName: 'యాదాద్రి',
    category: 'Spiritual & Living Religious Heritage',
    description:
      'The hill temple of Lakshmi Narasimha at Yadagirigutta — a centuries-old pilgrimage transformed by a monumental modern redevelopment.',
    historicalSummary:
      'Yadagirigutta has been a major Narasimha pilgrimage for generations, with traditions associating the hill cave shrine with sage Yadarishi. Between 2016 and 2022 the temple was comprehensively redeveloped in grand Agama-shastra-compliant stone architecture, making it one of Telangana\u2019s flagship pilgrimage destinations.',
    whyItMatters:
      'The clearest example in Telangana of continuity: an old living pilgrimage carried into a new century by ambitious sacred architecture.',
    touristExplanation:
      'Grand new temple architecture on an old sacred hill — a full pilgrimage experience within easy reach of Hyderabad.',
    whatToNotice: [
      'The monumental stone temple complex',
      'The hillside cave shrines of the Narasimha tradition',
      'The kalyana mandapam and gopuram carving details',
      'The pilgrimage rhythm on festival days',
    ],
    guideLine:
      'Give the hill half a day — the redeveloped complex rewards unhurried walking.',
    latitude: 17.5944,
    longitude: 78.845,
    image:
      '/images/places/yadadri.jpg',
    imageAttribution: 'Wikimedia Commons',
    officialSource: 'https://www.yadadritemple.org',
    tourismPressure: 'Medium',
    tourismPressureMethodology: PRESSURE_METHODOLOGY,
    recommendedDuration: '3–4 hours',
    bestTime: 'Weekday mornings; festival days are crowded',
    timings: 'Check official source for latest information',
    entryInfo: 'Free darshan; special-entry tickets may exist. Check official source',
    tags: ['Temple', 'Pilgrimage', 'Narasimha', 'Day trip', 'Architecture'],
    contentStatus: 'verified',
  },
  {
    id: 'jagannath-temple',
    name: 'Shri Jagannath Swami Temple, Hyderabad',
    category: 'Spiritual & Living Religious Heritage',
    description:
      'A Kalinga-style temple in Banjara Hills built by the Odia community — red sandstone, carved towers and Rath Yatra celebrations.',
    historicalSummary:
      'Built in the early 21st century by Hyderabad\u2019s Odia community in the Kalinga architectural style of Odisha, the temple carries the Jagannath tradition — including its famous Rath Yatra festival — into the Deccan. It stands as a landmark of community migration and cultural continuity.',
    whyItMatters:
      'A modern temple that tells the story of Odia migration to Hyderabad and how communities root their traditions in new cities.',
    touristExplanation:
      'Striking Odisha-style architecture and peaceful courtyards in the middle of Banjara Hills — especially lively during Rath Yatra.',
    whatToNotice: [
      'The Kalinga-style red sandstone towers',
      'Carved narrative panels of the Jagannath tradition',
      'The annual Rath Yatra chariot festival',
      'The contrast with surrounding urban Hyderabad',
    ],
    guideLine:
      'Visit in the week of Rath Yatra if you can — the whole temple becomes a moving festival.',
    latitude: 17.4166,
    longitude: 78.4392,
    image:
      '/images/places/jagannath-temple.jpg',
    imageAttribution: 'Wikimedia Commons',
    officialSource: 'https://telanganatourism.gov.in',
    tourismPressure: 'Low',
    tourismPressureMethodology: PRESSURE_METHODOLOGY,
    recommendedDuration: '1 hour',
    bestTime: 'Morning; Rath Yatra season for the festival experience',
    timings: 'Check official source for latest information',
    entryInfo: 'Free entry. Check official source for latest information',
    tags: ['Temple', 'Odisha culture', 'Modern', 'Festival', 'Quiet'],
    contentStatus: 'verified',
  },
  {
    id: 'iskcon-hyderabad',
    name: 'ISKCON Sri Radha Madanmohan Mandir',
    category: 'Spiritual & Living Religious Heritage',
    description:
      'A serene ISKCON temple in Nampally — marble shrines, kirtans and a devotional community active in the heart of the city.',
    historicalSummary:
      'Established by the International Society for Krishna Consciousness (ISKCON) in Hyderabad, the Sri Radha Madanmohan Mandir continues the global Gaudiya Vaishnava devotional movement founded by A.C. Bhaktivedanta Swami Prabhupada in 1966. The Hyderabad temple grew into an active centre of worship, festivals and community programmes.',
    whyItMatters:
      'A living devotional community — showing how modern spiritual movements shape everyday religious life in Hyderabad.',
    touristExplanation:
      'Welcome to visitors of all backgrounds — attend a kirtan, see the shrine and experience a modern bhakti community in action.',
    whatToNotice: [
      'The marble shrine of Radha Madanmohan',
      'Evening kirtan and aarti',
      'Govinda\u2019s-style prasadam offerings',
      'Festival evenings during Janmashtami',
    ],
    guideLine:
      'Arrive for the evening aarti — the temple is at its most alive in song.',
    latitude: 17.385,
    longitude: 78.4667,
    image:
      '/images/places/iskcon-hyderabad.jpg',
    imageAttribution: 'Wikimedia Commons',
    officialSource: 'https://iskconhyderabad.org',
    tourismPressure: 'Low',
    tourismPressureMethodology: PRESSURE_METHODOLOGY,
    recommendedDuration: '1 hour',
    bestTime: 'Evening aarti hours',
    timings: 'Check official source for latest information',
    entryInfo: 'Free entry. Check official source for latest information',
    tags: ['Temple', 'ISKCON', 'Kirtan', 'Modern', 'Community'],
    contentStatus: 'verified',
  },
  {
    id: 'swarna-giri',
    name: 'Swarna Giri Sri Venkateshwara Temple',
    category: 'Spiritual & Living Religious Heritage',
    description:
      'A contemporary hillside-style Venkateswara temple in the city — modern construction serving a deeply active devotional neighbourhood.',
    historicalSummary:
      'A recently built (21st-century) temple dedicated to Lord Venkateswara, constructed with modern materials and facilities. It is a contemporary place of worship, not an ancient monument, and serves the daily devotional needs of surrounding neighbourhoods.',
    whyItMatters:
      'A reminder that temple-building in Telangana is a living art — new sacred spaces continue the region\u2019s longest-running architectural tradition.',
    touristExplanation:
      'A neighbourhood temple for everyday worship — best experienced as part of a local-rituals walk with your Mitra.',
    whatToNotice: [
      'Modern temple architecture in traditional idiom',
      'Active daily rituals and community life',
      'Festival decorations during Brahmotsavam season',
    ],
    guideLine:
      'Come with curiosity about living ritual, not just architecture — this temple is about today.',
    latitude: 17.4433,
    longitude: 78.3839,
    image: '/images/places/swarna-giri.png',
    officialSource: 'https://telanganatourism.gov.in',
    tourismPressure: 'Low',
    tourismPressureMethodology: PRESSURE_METHODOLOGY,
    recommendedDuration: '1 hour',
    bestTime: 'Morning or evening aarti',
    timings: 'Check official source for latest information',
    entryInfo: 'Free entry. Check official source for latest information',
    tags: ['Temple', 'Modern', 'Contemporary', 'Community'],
    contentStatus: 'requires_verification',
    verificationNote:
      'Contemporary temple; image and further historical details require verification.',
  },
  {
    id: 'statue-of-equality',
    name: 'Statue of Equality',
    category: 'Spiritual & Living Religious Heritage',
    description:
      'A monumental statue of the 11th-century philosopher-saint Ramanujacharya at Muchintal, with a temple complex and living-heritage exhibitions.',
    historicalSummary:
      'The Statue of Equality, consecrated in February 2022, depicts Bhagavad Ramanujacharya — the 11th–12th century Vaishnava philosopher and social reformer known for his teachings on equality and devotion. The 216-foot statue sits within a temple and exhibition complex near Hyderabad.',
    whyItMatters:
      'A major new spiritual-cultural monument connecting Hyderabad\u2019s region to the Bhakti movement\u2019s philosophy of equality.',
    touristExplanation:
      'Grand scale, evening lighting and museum-style exhibits — a half-day modern pilgrimage landmark.',
    whatToNotice: [
      'The 216-foot gilded statue itself',
      'The underlying Bhakti philosophy of equality',
      'The Ramanujacharya temple within the complex',
      'Evening illumination displays',
    ],
    guideLine:
      'Stay for the evening lighting ceremony — the monument was designed for it.',
    latitude: 17.2117,
    longitude: 78.3883,
    image:
      '/images/places/statue-of-equality.jpg',
    imageAttribution: 'Wikimedia Commons',
    officialSource: 'https://statueofequality.org',
    tourismPressure: 'Low',
    tourismPressureMethodology: PRESSURE_METHODOLOGY,
    recommendedDuration: '2–3 hours',
    bestTime: 'Late afternoon through the evening lighting',
    timings: 'Check official source for latest information',
    entryInfo: 'Check official source for latest information',
    tags: ['Monument', 'Philosophy', 'Modern', 'Evening', 'Day trip'],
    contentStatus: 'verified',
  },
  {
    id: 'sita-rama-chandra-temple',
    name: 'Shri Sita Rama Chandra Swami Temple',
    category: 'Spiritual & Living Religious Heritage',
    description:
      'A Sita-Rama temple whose exact location and historical details require verification before publication on YATRAMITR.',
    historicalSummary:
      'Location and historical details require verification. The supplied historical guide explicitly notes that the exact location of this temple could not be identified, and therefore no location-specific historical account can safely be assigned.',
    whyItMatters:
      'Historical value cannot yet be responsibly stated until the site is verified — YATRAMITR does not invent history.',
    touristExplanation:
      'Details to be added after verification by the YATRAMITR curation team.',
    whatToNotice: [],
    latitude: null,
    longitude: null,
    showOnMap: false,
    requiresVerification: true,
    image: '/images/places/sita-rama-chandra-temple.jpg',
    imageAttribution: 'Editorial Heritage Archive',
    officialSource: '',
    tourismPressure: 'Low',
    tourismPressureMethodology: PRESSURE_METHODOLOGY,
    recommendedDuration: '—',
    bestTime: '—',
    timings: 'Information not available',
    entryInfo: 'Information not available',
    tags: ['Temple', 'Requires verification'],
    contentStatus: 'requires_verification',
    verificationNote:
      'Location and historical details require verification. Excluded from map and booking until verified.',
  },

  // ------------------------------------------------------------
  // CATEGORY 6 — CULTURE, CRAFTS & ENTERTAINMENT
  // ------------------------------------------------------------
  {
    id: 'shilparamam',
    name: 'Shilparamam',
    teluguName: 'శిల్పారామం',
    category: 'Culture, Crafts & Entertainment',
    description:
      'An arts-and-crafts village in HITEC City — artisan workshops, rock gardens, folk performances and Telangana\u2019s living craft traditions.',
    historicalSummary:
      'Established in 1998 in Madhapur, Shilparamam was conceived as a living heritage village to keep rural and tribal craft traditions visible in the heart of the modern IT corridor. It hosts artisans, folk performers and seasonal craft festivals year-round.',
    whyItMatters:
      'Where Telangana\u2019s craftspeople meet the digital city — a purposeful bridge between living rural traditions and modern Hyderabad.',
    touristExplanation:
      'Meet working artisans, watch folk performances and buy crafts directly from makers — with no middlemen in sight.',
    whatToNotice: [
      'Artisan stalls where craftspeople work on-site',
      'The rock garden and village-recreation areas',
      'Evening folk dance and music performances',
      'Seasonal craft bazaars and festival nights',
    ],
    guideLine:
      'Talk to the makers, not just the shops — every craft here has a story worth one extra question.',
    latitude: 17.4507,
    longitude: 78.3814,
    image:
      '/images/places/shilparamam.jpg',
    imageAttribution: 'Wikimedia Commons',
    officialSource: 'https://telanganatourism.gov.in',
    tourismPressure: 'Medium',
    tourismPressureMethodology: PRESSURE_METHODOLOGY,
    recommendedDuration: '2–3 hours',
    bestTime: 'Evenings for performances; festival season for bazaars',
    timings: 'Check official source for latest information',
    entryInfo: 'Entry ticket. Check official source for latest information',
    tags: ['Crafts', 'Artisans', 'Culture', 'Family', 'Evening'],
    contentStatus: 'verified',
  },
  {
    id: 'ramoji-film-city',
    name: 'Ramoji Film City',
    category: 'Culture, Crafts & Entertainment',
    description:
      'The world\u2019s largest film studio complex — themed sets, live shows, gardens and behind-the-scenes cinema tours on Hyderabad\u2019s outskirts.',
    historicalSummary:
      'Opened in 1996 by producer Ramoji Rao on the outskirts of Hyderabad, Ramoji Film City grew into one of the world\u2019s largest integrated film studio complexes, certified by Guinness World Records. It produces films and television while operating as a major themed entertainment destination.',
    whyItMatters:
      'A pillar of Hyderabad\u2019s creative economy — showing the city\u2019s reach beyond heritage into modern entertainment industries.',
    touristExplanation:
      'Full-day themed entertainment: studio tours, stunt shows, gardens and film-set experiences for families and film fans.',
    whatToNotice: [
      'The grand entrance plaza and themed sets',
      'Live stunt and action shows',
      'Gardens and European-style set streets',
      'Behind-the-scenes film production tours',
    ],
    guideLine:
      'Book a full day — the studio tour and the shows need separate halves to be enjoyed properly.',
    latitude: 17.2512,
    longitude: 78.6811,
    image:
      '/images/places/ramoji-film-city.jpg',
    imageAttribution: 'Wikimedia Commons',
    officialSource: 'https://www.ramojifilmcity.com',
    tourismPressure: 'Medium',
    tourismPressureMethodology: PRESSURE_METHODOLOGY,
    recommendedDuration: 'Full day',
    bestTime: 'Weekdays outside school holidays',
    timings: 'Check official source for latest information',
    entryInfo: 'Day-pass packages. Check official source for latest information',
    tags: ['Film studio', 'Family', 'Full day', 'Entertainment', 'Shows'],
    contentStatus: 'verified',
  },
];

// ---------- Derived helpers ----------

export const PLACE_CATEGORIES_LIST: PlaceCategory[] = [...PLACE_CATEGORIES];

export function getPlaceById(id: string): Place | undefined {
  return PLACES.find((p) => p.id === id);
}

export function mapablePlaces(): Place[] {
  return PLACES.filter(
    (p) => p.latitude !== null && p.longitude !== null
  ) as (Place & { latitude: number; longitude: number })[];
}

export const DEFAULT_MAP_CENTER = { lat: 17.385, lng: 78.4867 }; // Hyderabad city centre
