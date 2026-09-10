import {
  Destination,
  LocalBuddy,
  Experience,
  RecommendationMatch,
  BookingDetails,
  HiddenGem,
  TravelMatch
} from '@/types';

export const MOCK_DESTINATIONS: Destination[] = [
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    regionalName: 'హైదరాబాద్',
    state: 'Telangana',
    region: 'Deccan Plateau',
    category: 'Indigenous & Tribal Heritage',
    crowdLevel: 'Peaceful',
    rating: 4.92,
    reviewCount: 148,
    headline: 'Charminar lanes, royal heritage, local food and stories beyond the tourist map',
    description:
      'Hyderabad is a city where centuries-old heritage, bustling bazaars, grand palaces, local food traditions and modern city life come together.',
    heroImage:
      'https://images.unsplash.com/photo-1572445271230-a78b5944a659?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1572445271230-a78b5944a659?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1595658658481-d53d3f999875?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80'
    ],
    coordinates: { lat: 17.385, lng: 78.4867 },
    whyVisit:
      'Go beyond the usual tourist checklist and discover Hyderabad through its old neighbourhoods, food streets, heritage architecture, crafts and everyday local life.',
    localStory:
      'Hyderabad grew around the historic Charminar and the old city neighbourhoods surrounding it. Generations of families have preserved traditional food, crafts, markets and stories across these streets.',
    culturalSignificance:
      'The city reflects a unique blend of Deccani, Telugu, Persian and Islamic influences visible in its architecture, language, food and festivals.',
    bestTimeToVisit:
      'October through February for comfortable weather and enjoyable walks through the heritage areas.',
    howToReach: {
      nearestAirport: 'Rajiv Gandhi International Airport (HYD) - about 25 km from central Hyderabad',
      nearestRailhead: 'Hyderabad Deccan / Nampally Railway Station',
      roadAccess: 'Well connected by national highways and city roads'
    },
    safetyGuidelines: [
      'Stay with your Mitra when exploring unfamiliar neighbourhoods.',
      'Respect local customs and ask before photographing people or private spaces.',
      'Keep valuables secure in crowded market areas.',
      'Carry water during long heritage walks.'
    ],
    localSecrets: [
      {
        title: 'Old City Breakfast Trail',
        contributorName: 'Arjun Reddy',
        contributorBadge: 'Verified Hyderabad Native',
        tip:
          'Start early and explore the old neighbourhood food lanes before the main tourist crowds arrive.'
      },
      {
        title: 'Heritage Lanes Beyond Charminar',
        contributorName: 'Ayesha Khan',
        contributorBadge: 'Heritage Explorer',
        tip:
          'Walk a few streets away from the main Charminar area to discover quieter historic lanes, old homes and traditional workshops.'
      }
    ],
    featured: true,
    buddiesCount: 6,
    experiencesCount: 4
  },

  {
    id: 'golconda',
    name: 'Golconda Fort',
    regionalName: 'గోల్కొండ కోట',
    state: 'Telangana',
    region: 'Deccan Plateau',
    category: 'Ancient Architecture',
    crowdLevel: 'Peaceful',
    rating: 4.89,
    reviewCount: 126,
    headline: 'Massive Deccan fort walls, royal stories and spectacular city views',
    description:
      'Explore the historic Golconda Fort, its gateways, courtyards, stone architecture and stories from the Qutb Shahi era.',
    heroImage:
      'https://images.unsplash.com/photo-1590050752117-23a9d4f0d7d1?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1590050752117-23a9d4f0d7d1?auto=format&fit=crop&w=800&q=80'
    ],
    coordinates: { lat: 17.3833, lng: 78.4011 },
    whyVisit:
      'Perfect for travellers who enjoy history, architecture and discovering stories hidden behind famous monuments.',
    localStory:
      'Golconda developed from a fort into a major Deccan kingdom and became famous for its architecture, trade and diamond history.',
    culturalSignificance:
      'The fort represents the architectural and cultural legacy of the Qutb Shahi period in Hyderabad.',
    bestTimeToVisit:
      'October to February, especially during early morning or late afternoon.',
    howToReach: {
      nearestAirport: 'Rajiv Gandhi International Airport (HYD)',
      nearestRailhead: 'Nampally / Hyderabad Deccan Railway Station',
      roadAccess: 'Accessible by road from central Hyderabad'
    },
    safetyGuidelines: [
      'Wear comfortable footwear for uneven stone paths.',
      'Carry water during longer fort walks.',
      'Stay within permitted visitor areas.'
    ],
    localSecrets: [
      {
        title: 'Fort Echo Stories',
        contributorName: 'Ravi Kumar',
        contributorBadge: 'Verified Local Mitra',
        tip:
          'Ask your Mitra about the acoustic design of the fort entrance and the stories connected with its royal courtyards.'
      }
    ],
    featured: true,
    buddiesCount: 3,
    experiencesCount: 2
  },

  {
    id: 'shilparamam',
    name: 'Shilparamam',
    regionalName: 'శిల్పారామం',
    state: 'Telangana',
    region: 'Deccan Plateau',
    category: 'Artisans & Handicrafts',
    crowdLevel: 'Peaceful',
    rating: 4.86,
    reviewCount: 91,
    headline: 'Traditional crafts, village-style spaces and Telangana artisan culture',
    description:
      'A cultural village showcasing Indian handicrafts, traditional arts, craftspeople and regional cultural performances.',
    heroImage:
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80'
    ],
    coordinates: { lat: 17.4526, lng: 78.3789 },
    whyVisit:
      'A good choice for travellers interested in crafts, traditional art and local cultural experiences.',
    localStory:
      'Shilparamam was created as a space where traditional Indian crafts and rural cultural traditions could be experienced within the city.',
    culturalSignificance:
      'The space brings together artisans, handicrafts, folk art and regional cultural traditions.',
    bestTimeToVisit:
      'October to February and during cultural festivals.',
    howToReach: {
      nearestAirport: 'Rajiv Gandhi International Airport (HYD)',
      nearestRailhead: 'Secunderabad Railway Station',
      roadAccess: 'Easily accessible from HITEC City and major Hyderabad roads'
    },
    safetyGuidelines: [
      'Ask artisans before photographing their work or workspace.',
      'Keep personal belongings secure in busy areas.'
    ],
    localSecrets: [
      {
        title: 'Meet the Makers',
        contributorName: 'Meera Rao',
        contributorBadge: 'Verified Craft Mitra',
        tip:
          'Spend time talking to artisans instead of only browsing the shops. Many are happy to explain how their crafts are made.'
      }
    ],
    featured: false,
    buddiesCount: 2,
    experiencesCount: 2
  }
];

export const MOCK_BUDDIES: LocalBuddy[] = [
  {
    id: 'arjun-reddy',
    name: 'Arjun Reddy',
    location: 'Hyderabad',
    state: 'Telangana',
    destinationId: 'hyderabad',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    coverImage:
      'https://images.unsplash.com/photo-1572445271230-a78b5944a659?auto=format&fit=crop&w=1200&q=80',
    bio:
      'Born and raised in Hyderabad, I love showing travellers the heritage lanes, local food spots and everyday stories that tourists often miss.',
    heritageConnection:
      'Grew up exploring Hyderabad old city neighbourhoods and learning local history from family and community elders.',
    languages: ['Telugu', 'Hindi', 'English'],
    specialties: ['Heritage walks', 'Local food', 'Old City', 'Photography'],
    rating: 4.98,
    reviewCount: 74,
    experienceCount: 96,
    knowledgeScore: 98,
    yearsOfResidency: 24,
    verificationBadges: {
      identityVerified: true,
      knowledgeAssessmentPassed: true,
      safetyTrainingCompleted: true
    },
    safetyCertifiedDate: 'Certified Sep 2025 (City Navigation & Traveller Safety)',
    hostedTravelersCount: 180,
    quote:
      'Hyderabad is more than its famous monuments. The real character of the city lives in its streets, food and people.',
    experiencesOffered: [
      'hyderabad-old-city',
      'hyderabad-food-walk'
    ]
  },

  {
    id: 'ayesha-khan',
    name: 'Ayesha Khan',
    location: 'Hyderabad Old City',
    state: 'Telangana',
    destinationId: 'hyderabad',
    avatar:
      'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=600&q=80',
    coverImage:
      'https://images.unsplash.com/photo-1595658658481-d53d3f999875?auto=format&fit=crop&w=1200&q=80',
    bio:
      'I grew up around the historic neighbourhoods of Hyderabad and enjoy sharing stories about architecture, bazaars, food and local traditions.',
    heritageConnection:
      'My family has lived in the Old City for generations and has strong connections with local heritage communities.',
    languages: ['Telugu', 'Hindi', 'English', 'Urdu'],
    specialties: ['Old City heritage', 'Architecture', 'Local stories', 'Culture'],
    rating: 4.96,
    reviewCount: 68,
    experienceCount: 82,
    knowledgeScore: 97,
    yearsOfResidency: 29,
    verificationBadges: {
      identityVerified: true,
      knowledgeAssessmentPassed: true,
      safetyTrainingCompleted: true
    },
    safetyCertifiedDate: 'Certified Oct 2025 (Heritage Walk & City Safety)',
    hostedTravelersCount: 155,
    quote:
      'Every old lane has a story. You just need someone local to show you where to look.',
    experiencesOffered: [
      'hyderabad-heritage-lanes'
    ]
  },

  {
    id: 'rahul-naik',
    name: 'Rahul Naik',
    location: 'Hyderabad',
    state: 'Telangana',
    destinationId: 'golconda',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    coverImage:
      'https://images.unsplash.com/photo-1590050752117-23a9d4f0d7d1?auto=format&fit=crop&w=1200&q=80',
    bio:
      'History enthusiast and Hyderabad native who enjoys exploring forts, monuments and forgotten stories around the city.',
    heritageConnection:
      'Spent years studying the Qutb Shahi heritage of Hyderabad and its surrounding historical sites.',
    languages: ['Telugu', 'Hindi', 'English'],
    specialties: ['Golconda Fort', 'History', 'Architecture', 'Photography'],
    rating: 4.94,
    reviewCount: 57,
    experienceCount: 64,
    knowledgeScore: 96,
    yearsOfResidency: 21,
    verificationBadges: {
      identityVerified: true,
      knowledgeAssessmentPassed: true,
      safetyTrainingCompleted: true
    },
    safetyCertifiedDate: 'Certified Nov 2025 (Heritage Site Safety)',
    hostedTravelersCount: 130,
    quote:
      'History becomes interesting when you stop reading dates and start listening to the stories behind the stones.',
    experiencesOffered: [
      'golconda-history-walk'
    ]
  }
];

export const MOCK_EXPERIENCES: Experience[] = [
  {
    id: 'hyderabad-old-city',
    title: 'Hyderabad Old City Heritage Walk',
    destinationId: 'hyderabad',
    destinationName: 'Hyderabad',
    hostBuddyId: 'arjun-reddy',
    hostName: 'Arjun Reddy',
    hostAvatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    duration: '3 hours',
    pricePerPerson: 600,
    groupCap: 5,
    category: 'Ancient Architecture',
    summary:
      'Explore historic lanes, architecture and everyday local life around Hyderabad Old City.',
    description:
      'Walk beyond the main tourist points and discover the neighbourhood stories, traditional shops, architecture and local culture that give Hyderabad its character.',
    image:
      'https://images.unsplash.com/photo-1572445271230-a78b5944a659?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1572445271230-a78b5944a659?auto=format&fit=crop&w=800&q=80'
    ],
    inclusions: [
      'Local Mitra companionship',
      'Heritage interpretation',
      'Local snack tasting',
      'Neighbourhood walking route'
    ],
    requirements: [
      'Comfortable walking shoes',
      'Water bottle',
      'Respectful clothing for heritage areas'
    ],
    meetingPoint: {
      title: 'Charminar Area Meeting Point',
      landmark: 'Near Charminar, Hyderabad',
      coordinatesText: '17.3616° N, 78.4747° E'
    },
    itinerary: [
      {
        timeSlot: '08:00 AM - 09:00 AM',
        activity: 'Old City Introduction',
        description: 'Meet your Mitra and learn about Hyderabad heritage and neighbourhood history.'
      },
      {
        timeSlot: '09:00 AM - 10:00 AM',
        activity: 'Heritage Lane Walk',
        description: 'Explore quieter lanes, traditional shops and historic architecture.'
      },
      {
        timeSlot: '10:00 AM - 11:00 AM',
        activity: 'Local Food & Stories',
        description: 'Taste local snacks while hearing stories about everyday Hyderabad.'
      }
    ],
    safetyNotes: [
      'Stay with the Mitra in crowded areas.',
      'Respect local residents and private spaces.'
    ],
    bookingNotice:
      'Morning departure is recommended for a more comfortable walking experience.',
    rating: 4.98,
    reviewCount: 42
  },

  {
    id: 'hyderabad-food-walk',
    title: 'Hyderabad Local Food Walk',
    destinationId: 'hyderabad',
    destinationName: 'Hyderabad',
    hostBuddyId: 'arjun-reddy',
    hostName: 'Arjun Reddy',
    hostAvatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    duration: '2.5 hours',
    pricePerPerson: 700,
    groupCap: 5,
    category: 'Culinary & Spices',
    summary:
      'Discover local Hyderabad flavours through a guided food trail.',
    description:
      'Explore neighbourhood food spots and learn about the stories, ingredients and traditions behind popular Hyderabad dishes and snacks.',
    image:
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80'
    ],
    inclusions: [
      'Local Mitra guidance',
      'Food tasting stops',
      'Local food stories'
    ],
    requirements: [
      'Comfortable footwear',
      'Inform Mitra about food allergies before the experience'
    ],
    meetingPoint: {
      title: 'Old City Food Trail Start',
      landmark: 'Central Hyderabad Old City',
      coordinatesText: '17.3616° N, 78.4747° E'
    },
    itinerary: [
      {
        timeSlot: '05:00 PM - 05:45 PM',
        activity: 'Local Snack Trail',
        description: 'Explore traditional evening snacks and neighbourhood stalls.'
      },
      {
        timeSlot: '05:45 PM - 06:30 PM',
        activity: 'Food Stories',
        description: 'Learn about the cultural influences behind Hyderabad cuisine.'
      },
      {
        timeSlot: '06:30 PM - 07:30 PM',
        activity: 'Dinner Tasting',
        description: 'Finish with a selection of popular local dishes.'
      }
    ],
    safetyNotes: [
      'Choose hygienic food stalls recommended by your Mitra.',
      'Inform your Mitra about allergies or dietary restrictions.'
    ],
    bookingNotice:
      'Food availability can vary depending on the day and vendor.',
    rating: 4.96,
    reviewCount: 36
  },

  {
    id: 'hyderabad-heritage-lanes',
    title: 'Hidden Heritage Lanes of Hyderabad',
    destinationId: 'hyderabad',
    destinationName: 'Hyderabad',
    hostBuddyId: 'ayesha-khan',
    hostName: 'Ayesha Khan',
    hostAvatar:
      'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=200&q=80',
    duration: '3 hours',
    pricePerPerson: 650,
    groupCap: 4,
    category: 'Ancient Architecture',
    summary:
      'Discover historic streets, traditional homes and local stories away from the busiest tourist routes.',
    description:
      'A slower heritage walk through Hyderabad neighbourhoods where old architecture and everyday life exist side by side.',
    image:
      'https://images.unsplash.com/photo-1595658658481-d53d3f999875?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1595658658481-d53d3f999875?auto=format&fit=crop&w=800&q=80'
    ],
    inclusions: [
      'Local Mitra guidance',
      'Heritage storytelling',
      'Neighbourhood exploration'
    ],
    requirements: [
      'Comfortable walking shoes',
      'Water bottle'
    ],
    meetingPoint: {
      title: 'Old Hyderabad Heritage Area',
      landmark: 'Old City, Hyderabad',
      coordinatesText: '17.3600° N, 78.4750° E'
    },
    itinerary: [
      {
        timeSlot: '09:00 AM - 10:00 AM',
        activity: 'Historic Neighbourhood Walk',
        description: 'Explore old streets and traditional architecture.'
      },
      {
        timeSlot: '10:00 AM - 11:00 AM',
        activity: 'Local Stories',
        description: 'Hear stories passed through generations of Hyderabad families.'
      },
      {
        timeSlot: '11:00 AM - 12:00 PM',
        activity: 'Craft & Market Exploration',
        description: 'Visit local markets and traditional workshops.'
      }
    ],
    safetyNotes: [
      'Ask before photographing residents or private properties.'
    ],
    bookingNotice:
      'Small groups help keep the experience relaxed and respectful.',
    rating: 4.97,
    reviewCount: 29
  },

  {
    id: 'golconda-history-walk',
    title: 'Golconda Fort History Walk',
    destinationId: 'golconda',
    destinationName: 'Golconda Fort',
    hostBuddyId: 'rahul-naik',
    hostName: 'Rahul Naik',
    hostAvatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    duration: '3 hours',
    pricePerPerson: 750,
    groupCap: 5,
    category: 'Ancient Architecture',
    summary:
      'Explore Golconda Fort through its architecture, stories and overlooked details.',
    description:
      'Walk through the historic fort with a Hyderabad native who brings the stones, gates and courtyards to life through local stories.',
    image:
      'https://images.unsplash.com/photo-1590050752117-23a9d4f0d7d1?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1590050752117-23a9d4f0d7d1?auto=format&fit=crop&w=800&q=80'
    ],
    inclusions: [
      'Local Mitra guidance',
      'Historical interpretation',
      'Photography viewpoints'
    ],
    requirements: [
      'Comfortable footwear',
      'Water bottle',
      'Sun protection'
    ],
    meetingPoint: {
      title: 'Golconda Fort Main Entrance',
      landmark: 'Golconda Fort, Hyderabad',
      coordinatesText: '17.3833° N, 78.4011° E'
    },
    itinerary: [
      {
        timeSlot: '08:00 AM - 09:00 AM',
        activity: 'Fort Introduction',
        description: 'Understand the history and layout of Golconda Fort.'
      },
      {
        timeSlot: '09:00 AM - 10:00 AM',
        activity: 'Royal Architecture',
        description: 'Explore gateways, courtyards and important structures.'
      },
      {
        timeSlot: '10:00 AM - 11:00 AM',
        activity: 'Stories & Viewpoints',
        description: 'Discover lesser-known stories and scenic viewpoints.'
      }
    ],
    safetyNotes: [
      'Follow marked visitor paths.',
      'Take care on uneven stone surfaces.'
    ],
    bookingNotice:
      'Morning slots are recommended to avoid stronger afternoon heat.',
    rating: 4.95,
    reviewCount: 33
  }
];

export const MOCK_RECOMMENDATIONS: RecommendationMatch[] = [
  {
    destination: MOCK_DESTINATIONS[0],
    matchScore: 98,
    aiReasoning:
      'You selected culture, local food, heritage and lower-crowd experiences. Hyderabad matches these preferences with verified local Mitras and neighbourhood experiences.',
    verifiedLocalTip:
      'Your Mitra can help you discover quieter heritage lanes and local food spots away from the busiest tourist areas.',
    recommendedBuddy: MOCK_BUDDIES[0],
    matchingExperience: MOCK_EXPERIENCES[0]
  },

  {
    destination: MOCK_DESTINATIONS[1],
    matchScore: 94,
    aiReasoning:
      'You enjoy history and architecture. Golconda Fort offers a strong combination of heritage, stories and dramatic Deccan architecture.',
    verifiedLocalTip:
      'Visit with a local Mitra to understand the lesser-known stories behind the fort structures.',
    recommendedBuddy: MOCK_BUDDIES[2],
    matchingExperience: MOCK_EXPERIENCES[3]
  }
];

export const DEFAULT_BOOKING: BookingDetails = {
  id: 'YM-2026-HYD-084',
  experienceId: 'hyderabad-old-city',
  experienceTitle: 'Hyderabad Old City Heritage Walk',
  destinationName: 'Hyderabad, Telangana',
  buddyId: 'arjun-reddy',
  buddyName: 'Arjun Reddy',
  buddyAvatar:
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  date: 'Saturday, October 18, 2026',
  timeSlot: '08:00 AM - 11:00 AM',
  guestCount: 2,
  pricePerPerson: 600,
  communityFundContribution: 60,
  totalAmount: 1260,
  travelerName: 'Aditi Sharma',
  travelerPhone: '+91 98450 12345',
  travelerEmail: 'aditi.sharma@example.com',
  meetingPoint:
    'Charminar Area Meeting Point, Old City, Hyderabad',
  status: 'Confirmed',
  createdAt: '2026-10-12T14:30:00Z'
};

export const ARAKU_HIDDEN_GEMS: HiddenGem[] = [
  {
    id: 'old-city-lanes',
    name: 'Old City Heritage Lanes',
    location: 'Old City, Hyderabad',
    shortDescription:
      'Historic neighbourhood lanes filled with architecture, markets and local stories.',
    experienceType: 'Heritage Walk',
    estimatedPrice: 500,
    image:
      'https://images.unsplash.com/photo-1572445271230-a78b5944a659?auto=format&fit=crop&w=1200&q=80',
    whyMatchesYou: [
      'Quieter than the busiest tourist points.',
      'Great for architecture lovers.',
      'Local stories from Hyderabad residents.',
      'Recommended for culture and photography travellers.'
    ],
    recommendedBuddyId: 'arjun-reddy',
    experienceId: 'hyderabad-old-city'
  },

  {
    id: 'hyderabad-food-lanes',
    name: 'Hyderabad Food Lanes',
    location: 'Old City, Hyderabad',
    shortDescription:
      'Explore traditional food spots and neighbourhood flavours.',
    experienceType: 'Food & Culture',
    estimatedPrice: 700,
    image:
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80',
    whyMatchesYou: [
      'Discover local Hyderabad flavours.',
      'Explore neighbourhood food streets.',
      'Learn the stories behind traditional dishes.',
      'Recommended for food-loving travellers.'
    ],
    recommendedBuddyId: 'arjun-reddy',
    experienceId: 'hyderabad-food-walk'
  },

  {
    id: 'heritage-workshops',
    name: 'Local Craft & Heritage Workshops',
    location: 'Hyderabad',
    shortDescription:
      'Meet local makers and discover traditional crafts.',
    experienceType: 'Arts & Crafts',
    estimatedPrice: 600,
    image:
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80',
    whyMatchesYou: [
      'Meet local artisans.',
      'Learn about traditional crafts.',
      'Support local makers.',
      'Recommended for slow cultural travel.'
    ],
    recommendedBuddyId: 'ayesha-khan',
    experienceId: 'hyderabad-heritage-lanes'
  },

  {
    id: 'golconda-viewpoint',
    name: 'Golconda Fort Viewpoints',
    location: 'Golconda, Hyderabad',
    shortDescription:
      'Historic fort walls, architecture and city views.',
    experienceType: 'History & Architecture',
    estimatedPrice: 750,
    image:
      'https://images.unsplash.com/photo-1590050752117-23a9d4f0d7d1?auto=format&fit=crop&w=1200&q=80',
    whyMatchesYou: [
      'Rich Deccan history.',
      'Great architecture photography.',
      'Stories beyond the standard tourist route.',
      'Recommended for history lovers.'
    ],
    recommendedBuddyId: 'rahul-naik',
    experienceId: 'golconda-history-walk'
  }
];

export const MOCK_TRAVEL_MATCHES: TravelMatch[] = [
  {
    id: 'match-ananya',
    name: 'Ananya',
    city: 'Chennai',
    tags: ['Culture', 'Photography', 'Food'],
    matchPercentage: 92,
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    travelStyle: 'Slow heritage walks & local food',
    upcomingDestination: 'Hyderabad'
  },

  {
    id: 'match-rohan',
    name: 'Rohan',
    city: 'Pune',
    tags: ['History', 'Architecture', 'Food'],
    matchPercentage: 88,
    avatar:
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    travelStyle: 'Early morning heritage exploration',
    upcomingDestination: 'Hyderabad'
  },

  {
    id: 'match-priya',
    name: 'Priya',
    city: 'Bengaluru',
    tags: ['Culture', 'Crafts', 'Photography'],
    matchPercentage: 94,
    avatar:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    travelStyle: 'Slow travel & local cultural experiences',
    upcomingDestination: 'Hyderabad'
  }
];