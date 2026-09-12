import { Experience, Mitra, TravellerMatch } from '@/types';

// ============================================================
// YITRAMITR — CURATED EXPERIENCES & MITRA RECORDS (MVP)
// ============================================================
// Experiences are platform-curated for the Hyderabad pilot.
// All prices are INDICATIVE ("Prototype estimate — subject to
// field validation") and carry explicit inclusions so the Fair
// Price Guide is honest about what is and isn't covered.
//
// Mitra records in the MVP are DEMO ACCOUNTS created solely to
// demonstrate the product workflow. They are labelled isDemo:true
// and shown with a visible DEMO badge in the UI. They are NOT
// presented as real, verified guides.
// ============================================================

export const MITRAS: Mitra[] = [
  {
    id: 'mitra-arjun',
    name: 'Arjun Reddy',
    avatar:
      '/images/mitras/mitra-arjun.jpg',
    bio: 'Old City native. Grew up in the lanes around Charminar and Laad Bazaar; knows the food streets, the craftsmen and the stories locals actually tell.',
    location: 'Old City, Hyderabad',
    homePlaceId: 'charminar',
    languages: ['Telugu', 'Hindi', 'English', 'Urdu'],
    specialities: ['Old City heritage walks', 'Street food', 'Bazaar crafts', 'Local stories'],
    categories: ['Qutb Shahi & Hyderabad Origins'],
    interests: ['Heritage', 'Food', 'Local stories', 'Photography'],
    experienceYears: 6,
    verificationStatus: 'workflow_completed',
    verification: {
      identityStatus: 'workflow_completed',
      residencyStatus: 'workflow_completed',
      knowledgeStatus: 'workflow_completed',
      safetyStatus: 'pending',
      referencesStatus: 'pending',
      updatedAt: '2026-08-20',
    },
    trustScore: 62,
    trustScoreNote:
      'Transparent score: identity, residency and local-knowledge steps of the verification workflow are complete; safety and reference checks are pending. This is a prototype workflow status — not a government certification.',
    availability: ['Morning', 'Evening'],
    isDemo: true,
    quote: 'Every lane here has two stories — the one on the plaque and the one my grandmother told me.',
  },
  {
    id: 'mitra-ayesha',
    name: 'Ayesha Khan',
    avatar:
      '/images/mitras/mitra-ayesha.jpg',
    bio: 'Third-generation Old City resident. Architecture enthusiast who reads Hyderabad through its doorways, facades and courtyard houses.',
    location: 'Old City, Hyderabad',
    homePlaceId: 'chowmahalla-palace',
    languages: ['Telugu', 'Hindi', 'English', 'Urdu'],
    specialities: ['Architecture', 'Royal history', 'Heritage lanes', 'Culture'],
    categories: ['Qutb Shahi & Hyderabad Origins', 'Royal Hyderabad & Museums'],
    interests: ['Heritage', 'Architecture', 'Culture', 'Local stories'],
    experienceYears: 8,
    verificationStatus: 'workflow_completed',
    verification: {
      identityStatus: 'workflow_completed',
      residencyStatus: 'workflow_completed',
      knowledgeStatus: 'workflow_completed',
      safetyStatus: 'workflow_completed',
      referencesStatus: 'pending',
      updatedAt: '2026-08-25',
    },
    trustScore: 74,
    trustScoreNote:
      'Transparent score: identity, residency, knowledge and safety workflow steps complete; community-reference check pending. Prototype workflow status — not a government certification.',
    availability: ['Morning', 'Afternoon'],
    isDemo: true,
    quote: 'You don\u2019t need to enter a palace to see royalty — the doors themselves are a museum.',
  },
  {
    id: 'mitra-rahul',
    name: 'Rahul Naik',
    avatar:
      '/images/mitras/mitra-rahul.jpg',
    bio: 'History buff from west Hyderabad. Has walked Golconda more times than he can count and still finds new corners of it.',
    location: 'Golconda, Hyderabad',
    homePlaceId: 'golconda-fort',
    languages: ['Telugu', 'Hindi', 'English'],
    specialities: ['Golconda Fort', 'Fort architecture', 'Acoustics', 'Photography'],
    categories: ['Qutb Shahi & Hyderabad Origins', 'Kakatiya & Medieval Heritage'],
    interests: ['Heritage', 'Architecture', 'Photography'],
    experienceYears: 5,
    verificationStatus: 'workflow_completed',
    verification: {
      identityStatus: 'workflow_completed',
      residencyStatus: 'workflow_completed',
      knowledgeStatus: 'workflow_completed',
      safetyStatus: 'workflow_completed',
      referencesStatus: 'workflow_completed',
      updatedAt: '2026-08-28',
    },
    trustScore: 86,
    trustScoreNote:
      'Transparent score: all five verification-workflow steps completed within the prototype. This is a platform workflow status — not a government certification.',
    availability: ['Morning', 'Evening'],
    isDemo: true,
    quote: 'The fort talks back. Stand under the dome, clap once, and history answers.',
  },
  {
    id: 'mitra-meera',
    name: 'Meera Rao',
    avatar:
      '/images/mitras/mitra-meera.jpg',
    bio: 'Craft-sector researcher who works with artisan families across Telangana and hosts slow-craft experiences around the city.',
    location: 'HITEC City, Hyderabad',
    homePlaceId: 'shilparamam',
    languages: ['Telugu', 'English', 'Hindi'],
    specialities: ['Crafts', 'Artisan stories', 'Textiles', 'Slow travel'],
    categories: ['Culture, Crafts & Entertainment'],
    interests: ['Crafts', 'Culture', 'Local stories', 'Photography'],
    experienceYears: 4,
    verificationStatus: 'pending',
    verification: {
      identityStatus: 'verified',
      residencyStatus: 'workflow_completed',
      knowledgeStatus: 'pending',
      safetyStatus: 'not_verified',
      referencesStatus: 'not_verified',
      updatedAt: '2026-09-01',
    },
    trustScore: 38,
    trustScoreNote:
      'Transparent score: identity verified; knowledge assessment, safety orientation and references still in progress. Prototype workflow status — not a government certification.',
    availability: ['Afternoon', 'Evening'],
    isDemo: true,
    quote: 'A weave carries the village it came from — you just have to know how to read it.',
  },
];

export const EXPERIENCES: Experience[] = [
  {
    id: 'old-city-heritage-walk',
    title: 'Old City Heritage & Bazaar Walk',
    placeId: 'charminar',
    placeName: 'Charminar',
    category: 'Qutb Shahi & Hyderabad Origins',
    summary:
      'Walk the founding quarter of Hyderabad — Charminar, hidden heritage lanes and the bazaars that grew around them.',
    description:
      'Begin at the monument that started it all, then step off the main circuit into lanes where 400-year-old trade continues today. Your Mitra connects the Qutb Shahi story to the shops, shrines and street food that keep the old city alive.',
    image:
      '/images/experiences/old-city-heritage-walk.jpg',
    durationHours: 3.5,
    durationLabel: '3.5 hours',
    groupCap: 4,
    pricePerPerson: 650,
    priceStatus: 'indicative',
    priceNote: 'Indicative price — prototype estimate, subject to field validation.',
    typicalRange: { min: 500, max: 800 },
    inclusions: [
      'Guided walk with a local Mitra',
      'Heritage lane route beyond the main circuit',
      'One traditional snack-stop tasting',
      'Bazaar craft-stop introductions',
    ],
    interests: ['Heritage', 'Local stories', 'Architecture', 'Food'],
    crowdLevel: 'High',
    travelStyle: 'Balanced',
    languages: ['Telugu', 'Hindi', 'English'],
    meetingPoint: 'Charminar West entrance, Old City',
    status: 'prototype_availability',
    mitraId: 'mitra-arjun',
    tags: ['Walking', 'Old City', 'Bazaar'],
  },
  {
    id: 'old-city-food-walk',
    title: 'Old City Food Trail',
    placeId: 'charminar',
    placeName: 'Charminar',
    category: 'Qutb Shahi & Hyderabad Origins',
    summary:
      'A guided tasting trail through the old city\u2019s legendary food lanes — from breakfast nizami classics to evening kebab streets.',
    description:
      'Hyderabad\u2019s food history is written in its old-city kitchens. Walk with a Mitra who knows which stalls matter, what makes each dish Deccani, and the stories families tell about recipes older than the restaurants serving them.',
    image:
      '/images/experiences/old-city-food-walk.jpg',
    durationHours: 2.5,
    durationLabel: '2.5 hours',
    groupCap: 4,
    pricePerPerson: 700,
    priceStatus: 'indicative',
    priceNote: 'Indicative price — prototype estimate, subject to field validation. Food tastings included.',
    typicalRange: { min: 550, max: 900 },
    inclusions: [
      '5–6 guided tasting stops',
      'All food costs for the listed tastings',
      'Local food-history commentary',
      'Hygiene-checked vendor selection',
    ],
    interests: ['Food', 'Culture', 'Local stories'],
    crowdLevel: 'High',
    travelStyle: 'Balanced',
    languages: ['Telugu', 'Hindi', 'English', 'Urdu'],
    meetingPoint: 'Charminar bus-stop side, Old City',
    status: 'prototype_availability',
    mitraId: 'mitra-arjun',
    tags: ['Food', 'Evening', 'Old City'],
  },
  {
    id: 'golconda-fort-deep-walk',
    title: 'Golconda Fort Deep Walk',
    placeId: 'golconda-fort',
    placeName: 'Golconda Fort',
    category: 'Qutb Shahi & Hyderabad Origins',
    summary:
      'Three hours inside the Qutb Shahi capital — acoustics, water systems, royal apartments and the hilltop Bala Hisar.',
    description:
      'Most visits see the gateways and leave. This walk follows the fort\u2019s full logic: how the acoustics worked as security, how water reached the hilltop, and why Golconda\u2019s diamond trade funded it all. Ends at the Bala Hisar pavilion for the classic view.',
    image:
      '/images/experiences/golconda-fort-deep-walk.jpg',
    durationHours: 3,
    durationLabel: '3 hours',
    groupCap: 5,
    pricePerPerson: 750,
    priceStatus: 'indicative',
    priceNote: 'Indicative price — prototype estimate, subject to field validation. Fort entry ticket not included.',
    typicalRange: { min: 600, max: 900 },
    inclusions: [
      'Guided fort walk with a history-focused Mitra',
      'Acoustics demonstration points',
      'Water-system and architecture interpretation',
      'Bala Hisar viewpoint route',
    ],
    interests: ['Heritage', 'Architecture', 'Photography'],
    crowdLevel: 'Medium',
    travelStyle: 'Balanced',
    languages: ['Telugu', 'Hindi', 'English'],
    meetingPoint: 'Golconda Fort main gate',
    status: 'prototype_availability',
    mitraId: 'mitra-rahul',
    tags: ['Fort', 'History', 'Morning'],
  },
  {
    id: 'quiet-heritage-lanes',
    title: 'Quiet Heritage Lanes of the Old City',
    placeId: 'charminar',
    placeName: 'Charminar',
    category: 'Qutb Shahi & Hyderabad Origins',
    summary:
      'A low-crowd heritage walk through residential lanes, old courtyards and living workshops away from the busiest circuit.',
    description:
      'For travellers who want the old city\u2019s atmosphere without the crush. This slower walk stays on the quieter side streets — courtyard houses, small shrines, craft workshops and the everyday rhythm of a heritage quarter still fully alive.',
    image:
      '/images/experiences/quiet-heritage-lanes.jpg',
    durationHours: 3,
    durationLabel: '3 hours',
    groupCap: 3,
    pricePerPerson: 600,
    priceStatus: 'indicative',
    priceNote: 'Indicative price — prototype estimate, subject to field validation.',
    typicalRange: { min: 450, max: 750 },
    inclusions: [
      'Small-group quiet-lane route (max 3 travellers)',
      'Courtyard and facade interpretation',
      'One workshop visit (subject to artisan availability)',
      'Local stories from a lifelong resident',
    ],
    interests: ['Heritage', 'Architecture', 'Local stories', 'Photography'],
    crowdLevel: 'Low',
    travelStyle: 'Slow',
    languages: ['Telugu', 'Hindi', 'English', 'Urdu'],
    meetingPoint: 'Near Mecca Masjid, Old City',
    status: 'prototype_availability',
    mitraId: 'mitra-ayesha',
    tags: ['Quiet', 'Walking', 'Architecture'],
  },
  {
    id: 'royal-hyderabad-day',
    title: 'Royal Hyderabad Day',
    placeId: 'chowmahalla-palace',
    placeName: 'Chowmahalla Palace',
    category: 'Royal Hyderabad & Museums',
    summary:
      'Nizam-era Hyderabad in one day — Chowmahalla Palace, royal collections and the stories of the Asaf Jahi court.',
    description:
      'Trace the Asaf Jahi story from the durbar halls of Chowmahalla to the artefacts that carried royal Hyderabad into the modern age. Your Mitra explains what the palaces were for — not just what they looked like.',
    image:
      '/images/experiences/royal-hyderabad-day.jpg',
    durationHours: 5,
    durationLabel: '5 hours',
    groupCap: 4,
    pricePerPerson: 1100,
    priceStatus: 'indicative',
    priceNote: 'Indicative price — prototype estimate, subject to field validation. Palace entry tickets not included.',
    typicalRange: { min: 900, max: 1400 },
    inclusions: [
      'Guided palace and royal-quarter route',
      'Nizam-era history interpretation',
      'Transport between two close-by royal sites',
      'Old-city refreshment stop',
    ],
    interests: ['Heritage', 'Architecture', 'Culture'],
    crowdLevel: 'Medium',
    travelStyle: 'Balanced',
    languages: ['Telugu', 'Hindi', 'English'],
    meetingPoint: 'Chowmahalla Palace gate, Old City',
    status: 'prototype_availability',
    mitraId: 'mitra-ayesha',
    tags: ['Royal', 'Palace', 'Museum', 'Full-ish day'],
  },
  {
    id: 'crafts-makers-afternoon',
    title: 'Crafts & Makers Afternoon',
    placeId: 'shilparamam',
    placeName: 'Shilparamam',
    category: 'Culture, Crafts & Entertainment',
    summary:
      'Meet Telangana\u2019s working artisans — watch crafts being made, hear family stories and buy direct from makers.',
    description:
      'A slow afternoon built around conversations: weavers, toy-makers and metalworkers show their craft and tell you where their skills come from. No shopping pressure — the point is meeting the makers behind Telangana\u2019s craft traditions.',
    image:
      '/images/experiences/crafts-makers-afternoon.jpg',
    durationHours: 3,
    durationLabel: '3 hours',
    groupCap: 5,
    pricePerPerson: 550,
    priceStatus: 'indicative',
    priceNote: 'Indicative price — prototype estimate, subject to field validation. Entry ticket not included.',
    typicalRange: { min: 400, max: 700 },
    inclusions: [
      'Guided artisan interactions (3–4 makers)',
      'Craft-demo participation',
      'Fair-trade buying guidance',
      'Craft-tradition context from your Mitra',
    ],
    interests: ['Crafts', 'Culture', 'Local stories', 'Photography'],
    crowdLevel: 'Medium',
    travelStyle: 'Slow',
    languages: ['Telugu', 'English', 'Hindi'],
    meetingPoint: 'Shilparamam main entrance, Madhapur',
    status: 'prototype_availability',
    mitraId: 'mitra-meera',
    tags: ['Crafts', 'Artisans', 'Afternoon'],
  },
  {
    id: 'lakefront-evening-walk',
    title: 'Lakefront Evening Walk',
    placeId: 'hussain-sagar',
    placeName: 'Hussain Sagar',
    category: 'Lakes, Reservoirs & Landscapes',
    summary:
      'Hussain Sagar at golden hour — the Buddha statue, Tank Bund stories and the city\u2019s favourite evening waterside ritual.',
    description:
      'A relaxed evening walk along the lake that linked two cities. Your Mitra weaves Qutb Shahi water history, the Buddha statue\u2019s journey and the everyday lakeside culture of modern Hyderabad into one easy stroll.',
    image:
      '/images/experiences/lakefront-evening-walk.jpg',
    durationHours: 2,
    durationLabel: '2 hours',
    groupCap: 5,
    pricePerPerson: 450,
    priceStatus: 'indicative',
    priceNote: 'Indicative price — prototype estimate, subject to field validation.',
    typicalRange: { min: 350, max: 600 },
    inclusions: [
      'Guided lakefront walk at sunset',
      'Hyderabad water-history commentary',
      'Evening snack stop (one item included)',
    ],
    interests: ['Culture', 'Local stories', 'Photography'],
    crowdLevel: 'Medium',
    travelStyle: 'Slow',
    languages: ['Telugu', 'Hindi', 'English'],
    meetingPoint: 'Tank Bund main promenade',
    status: 'prototype_availability',
    mitraId: 'mitra-rahul',
    tags: ['Sunset', 'Easy', 'Evening'],
  },
  {
    id: 'ramappa-day-trip',
    title: 'Ramappa UNESCO Day Trip',
    placeId: 'ramappa-temple',
    placeName: 'Ramappa Temple',
    category: 'Kakatiya & Medieval Heritage',
    summary:
      'A full-day journey to Telangana\u2019s UNESCO World Heritage temple — floating bricks, sculpted brackets and Kakatiya history.',
    description:
      'Travel out to Palampet with a Mitra who can read the temple\u2019s details: the floating-brick engineering, the dancer brackets, the basalt Nandi. A proper day in the Telangana countryside ending back in Hyderabad by evening.',
    image:
      '/images/experiences/ramappa-day-trip.jpg',
    durationHours: 8,
    durationLabel: 'Full day',
    groupCap: 4,
    pricePerPerson: 1800,
    priceStatus: 'indicative',
    priceNote: 'Indicative price — prototype estimate, subject to field validation. Includes road transport.',
    typicalRange: { min: 1500, max: 2200 },
    inclusions: [
      'Round-trip road transport from Hyderabad',
      'Guided temple walk with historical interpretation',
      'Lunch stop at a local eatery (meal cost on traveller)',
      'Ramappa Lake viewpoint stop',
    ],
    interests: ['Heritage', 'Architecture', 'Photography'],
    crowdLevel: 'Low',
    travelStyle: 'Fast',
    languages: ['Telugu', 'Hindi', 'English'],
    meetingPoint: 'Pickup from central Hyderabad',
    status: 'prototype_availability',
    mitraId: 'mitra-rahul',
    tags: ['UNESCO', 'Day trip', 'Temple'],
  },
  {
    id: 'spiritual-hyderabad-morning',
    title: 'Spiritual Hyderabad Morning',
    placeId: 'birla-mandir',
    placeName: 'Birla Mandir',
    category: 'Spiritual & Living Religious Heritage',
    summary:
      'Three living temples in one calm morning — Birla Mandir marble, a modern devotional community and hilltop views.',
    description:
      'Experience Hyderabad\u2019s living spiritual side respectfully: marble architecture at Birla Mandir, a modern devotional community in action, and the rituals that organise neighbourhood mornings across the city.',
    image:
      '/images/experiences/spiritual-hyderabad-morning.png',
    durationHours: 3,
    durationLabel: '3 hours',
    groupCap: 4,
    pricePerPerson: 500,
    priceStatus: 'indicative',
    priceNote: 'Indicative price — prototype estimate, subject to field validation.',
    typicalRange: { min: 400, max: 650 },
    inclusions: [
      'Guided visits to three living temples',
      'Ritual and tradition explanations',
      'Dress-code and etiquette guidance',
      'Morning prasadam stop',
    ],
    interests: ['Culture', 'Heritage', 'Local stories'],
    crowdLevel: 'Medium',
    travelStyle: 'Balanced',
    languages: ['Telugu', 'Hindi', 'English'],
    meetingPoint: 'Birla Mandir foot of the hill steps',
    status: 'prototype_availability',
    mitraId: 'mitra-ayesha',
    tags: ['Temples', 'Morning', 'Living heritage'],
  },
  {
    id: 'photography-old-city-blue-hour',
    title: 'Old City Photography Walk',
    placeId: 'charminar',
    placeName: 'Charminar',
    category: 'Qutb Shahi & Hyderabad Origins',
    summary:
      'A photographer\u2019s route through the old city — Charminar at blue hour, market light, facades and night lanes.',
    description:
      'Designed around light: start as the bazaar lamps come on, work the Charminar blue-hour angles, then move into lanes where old signage and daily life make frames. Your Mitra knows the spots and the etiquette for photographing people.',
    image:
      '/images/experiences/photography-old-city-blue-hour.jpg',
    durationHours: 2.5,
    durationLabel: '2.5 hours',
    groupCap: 4,
    pricePerPerson: 650,
    priceStatus: 'indicative',
    priceNote: 'Indicative price — prototype estimate, subject to field validation.',
    typicalRange: { min: 500, max: 800 },
    inclusions: [
      'Route built for blue-hour and night photography',
      'Composition spots only locals use',
      'People-photography etiquette briefing',
      'Photo-review break at a local café',
    ],
    interests: ['Photography', 'Heritage', 'Local stories'],
    crowdLevel: 'High',
    travelStyle: 'Balanced',
    languages: ['Telugu', 'Hindi', 'English'],
    meetingPoint: 'Charminar West entrance, Old City',
    status: 'prototype_availability',
    mitraId: 'mitra-arjun',
    tags: ['Photography', 'Evening', 'Blue hour'],
  },
];

// ---------- Traveller matching demo pool (clearly demo-labelled) ----------

export const DEMO_TRAVELLERS: TravellerMatch[] = [
  {
    id: 'demo-traveller-1',
    displayName: 'Ananya (Demo)',
    city: 'Chennai',
    sharedInterests: ['Heritage', 'Food', 'Photography'],
    matchScore: 88,
    travelStyle: 'Slow',
    languages: ['English', 'Tamil'],
    isDemo: true,
  },
  {
    id: 'demo-traveller-2',
    displayName: 'Rohan (Demo)',
    city: 'Pune',
    sharedInterests: ['Heritage', 'Architecture'],
    matchScore: 82,
    travelStyle: 'Balanced',
    languages: ['English', 'Hindi', 'Marathi'],
    isDemo: true,
  },
  {
    id: 'demo-traveller-3',
    displayName: 'Priya (Demo)',
    city: 'Bengaluru',
    sharedInterests: ['Crafts', 'Culture', 'Food'],
    matchScore: 79,
    travelStyle: 'Slow',
    languages: ['English', 'Kannada'],
    isDemo: true,
  },
];

export function getExperienceById(id: string): Experience | undefined {
  return EXPERIENCES.find((e) => e.id === id);
}

export function getMitraById(id: string): Mitra | undefined {
  return MITRAS.find((m) => m.id === id);
}
