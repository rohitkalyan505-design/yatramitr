export type CrowdLevel = 'Untouched' | 'Sparse' | 'Peaceful' | 'Moderate';

export type Category = 
  | 'Nature & Waterfalls' 
  | 'Indigenous & Tribal Heritage' 
  | 'Ancient Architecture' 
  | 'High-Altitude Meadows' 
  | 'Culinary & Spices' 
  | 'Artisans & Handicrafts';

export interface Destination {
  id: string;
  name: string;
  regionalName?: string;
  state: string;
  region: 'Eastern Ghats' | 'Northeast' | 'Himalayas' | 'Western Ghats' | 'Deccan Plateau' | 'Southern Coromandel';
  category: Category;
  crowdLevel: CrowdLevel;
  rating: number;
  reviewCount: number;
  headline: string;
  description: string;
  heroImage: string;
  gallery: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  whyVisit: string;
  localStory: string;
  culturalSignificance: string;
  bestTimeToVisit: string;
  howToReach: {
    nearestAirport: string;
    nearestRailhead: string;
    roadAccess: string;
  };
  safetyGuidelines: string[];
  localSecrets: {
    title: string;
    contributorName: string;
    contributorBadge: string;
    tip: string;
  }[];
  featured: boolean;
  buddiesCount: number;
  experiencesCount: number;
}

export interface VerificationBadges {
  identityVerified: boolean;
  knowledgeAssessmentPassed: boolean;
  safetyTrainingCompleted: boolean;
}

export interface LocalBuddy {
  id: string;
  name: string;
  location: string;
  state: string;
  destinationId: string;
  avatar: string;
  coverImage?: string;
  bio: string;
  heritageConnection: string;
  languages: string[];
  specialties: string[];
  rating: number;
  reviewCount: number;
  experienceCount: number;
  knowledgeScore: number; // e.g. 98 out of 100
  yearsOfResidency: number;
  verificationBadges: VerificationBadges;
  safetyCertifiedDate: string;
  hostedTravelersCount: number;
  quote: string;
  experiencesOffered: string[]; // experience IDs
}

export interface Experience {
  id: string;
  title: string;
  destinationId: string;
  destinationName: string;
  hostBuddyId: string;
  hostName: string;
  hostAvatar: string;
  duration: string; // e.g. "3.5 hours"
  pricePerPerson: number; // in INR e.g. 600
  groupCap: number; // e.g. 4 people max
  category: Category;
  summary: string;
  description: string;
  image: string;
  gallery: string[];
  inclusions: string[];
  requirements: string[];
  meetingPoint: {
    title: string;
    landmark: string;
    coordinatesText: string;
  };
  itinerary: {
    timeSlot: string;
    activity: string;
    description: string;
  }[];
  safetyNotes: string[];
  bookingNotice: string;
  rating: number;
  reviewCount: number;
}

export interface RecommendationMatch {
  destination: Destination;
  matchScore: number; // 0 - 100
  aiReasoning: string;
  verifiedLocalTip: string;
  recommendedBuddy: LocalBuddy;
  matchingExperience: Experience;
}

export interface BookingDetails {
  id: string;
  experienceId: string;
  experienceTitle: string;
  destinationName: string;
  buddyId: string;
  buddyName: string;
  buddyAvatar: string;
  date: string;
  timeSlot: string;
  guestCount: number;
  pricePerPerson: number;
  communityFundContribution: number;
  totalAmount: number;
  travelerName: string;
  travelerPhone: string;
  travelerEmail: string;
  meetingPoint: string;
  status: 'Confirmed' | 'Active' | 'Completed';
  createdAt: string;
}

export interface Checkpoint {
  id: string;
  title: string;
  time: string;
  completed: boolean;
  note?: string;
}

export interface HiddenGem {
  id: string;
  name: string;
  location: string;
  shortDescription: string;
  experienceType: string;
  estimatedPrice: number;
  image: string;
  whyMatchesYou: string[];
  recommendedBuddyId: string;
  experienceId: string;
}

export interface TravelMatch {
  id: string;
  name: string;
  city: string;
  tags: string[];
  matchPercentage: number;
  avatar: string;
  travelStyle: string;
  upcomingDestination: string;
}
