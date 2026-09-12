// ============================================================
// YITRAMITR — DOMAIN MODEL
// Hyderabad MVP (Smart India Hackathon 2026)
// ============================================================

// ---------- Taxonomy ----------

export const PLACE_CATEGORIES = [
  'Qutb Shahi & Hyderabad Origins',
  'Kakatiya & Medieval Heritage',
  'Royal Hyderabad & Museums',
  'Lakes, Reservoirs & Landscapes',
  'Spiritual & Living Religious Heritage',
  'Culture, Crafts & Entertainment',
] as const;

export type PlaceCategory = (typeof PLACE_CATEGORIES)[number];

export type TourismPressure = 'Low' | 'Medium' | 'High';

export type Interest =
  | 'Heritage'
  | 'Food'
  | 'Culture'
  | 'Architecture'
  | 'Crafts'
  | 'Photography'
  | 'Local stories';

export const INTERESTS: Interest[] = [
  'Heritage',
  'Food',
  'Culture',
  'Architecture',
  'Crafts',
  'Photography',
  'Local stories',
];

export type CrowdPreference = 'Quiet' | 'Moderate' | 'Lively';
export type TravelStyle = 'Slow' | 'Balanced' | 'Fast';
export type DurationPreference = '2 hours' | '4 hours' | 'Full day';
export type GroupPreference = 'Solo' | '2–3' | '4–5';

export type VerificationStatus =
  | 'verified'
  | 'pending'
  | 'workflow_completed'
  | 'not_verified';

// ---------- Places ----------

export interface Place {
  id: string;
  name: string;
  teluguName?: string;
  category: PlaceCategory;
  description: string;
  historicalSummary: string;
  whyItMatters: string;
  touristExplanation: string;
  whatToNotice: string[];
  guideLine?: string;
  latitude: number | null;
  longitude: number | null;
  /** Explicit editorial guardrails for places that must not appear on the map. */
  showOnMap?: boolean;
  requiresVerification?: boolean;
  image: string;
  imageAttribution?: string;
  officialSource?: string;
  tourismPressure: TourismPressure;
  tourismPressureMethodology: string;
  recommendedDuration: string;
  bestTime: string;
  timings?: string;
  entryInfo?: string;
  tags: string[];
  contentStatus: 'verified' | 'requires_verification';
  verificationNote?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ---------- Food ----------

export const FOOD_CATEGORIES = [
  'Biryani',
  'Irani Chai & Bakery',
  'Street Food / Chaat',
  'Tiffins',
  'Haleem',
  'Local Specialities',
] as const;

export type FoodCategory = (typeof FOOD_CATEGORIES)[number];

export interface FoodEntry {
  id: string;
  name: string;
  location: string;
  category: FoodCategory;
  description: string;
  whatToTry: string[];
  touristTip: string;
  latitude: number | null;
  longitude: number | null;
  image: string;
  /** Who supplied the photo: 'source_guide' (uploaded guide), 'editorial' (stock/licensed), 'none' */
  imageSource: 'source_guide' | 'editorial' | 'none';
  imageAttribution?: string;
  priceLevel: '₹' | '₹₹' | '₹₹₹';
  indicativePriceRange?: string;
  tags: string[];
  contentStatus: 'verified' | 'requires_verification';
  verificationNote?: string;
}

// ---------- Experiences ----------

export interface Experience {
  id: string;
  title: string;
  placeId: string;
  placeName: string;
  category: string;
  summary: string;
  description: string;
  image: string;
  durationHours: number;
  durationLabel: string;
  groupCap: number;
  pricePerPerson: number;
  priceStatus: 'indicative' | 'field_validated';
  priceNote: string;
  typicalRange: { min: number; max: number };
  inclusions: string[];
  interests: Interest[];
  crowdLevel: TourismPressure;
  travelStyle: TravelStyle;
  languages: string[];
  meetingPoint: string;
  status: 'available' | 'prototype_availability';
  mitraId: string;
  tags: string[];
  createdAt?: string;
}

// ---------- Mitras ----------

export interface MitraVerification {
  identityStatus: VerificationStatus;
  residencyStatus: VerificationStatus;
  knowledgeStatus: VerificationStatus;
  safetyStatus: VerificationStatus;
  referencesStatus: VerificationStatus;
  updatedAt?: string;
}

export interface Mitra {
  id: string;
  userId?: string;
  name: string;
  avatar: string;
  bio: string;
  location: string;
  homePlaceId: string;
  languages: string[];
  specialities: string[];
  categories: PlaceCategory[];
  interests: Interest[];
  experienceYears: number;
  verificationStatus: VerificationStatus;
  verification: MitraVerification;
  trustScore: number;
  trustScoreNote: string;
  availability: string[];
  isDemo: boolean;
  quote?: string;
  createdAt?: string;
}

// ---------- Traveller preferences ----------

export interface TravellerPreferences {
  interests: Interest[];
  budget: number;
  crowdPreference: CrowdPreference;
  travelStyle: TravelStyle;
  durationPreference: DurationPreference;
  groupPreference: GroupPreference;
  languages: string[];
}

// ---------- Recommendations ----------

export interface RecommendationReason {
  criterion: string;
  detail: string;
}

export interface RecommendationResult {
  matchScore: number;
  scoreBreakdown: { criterion: string; weight: number; earned: number }[];
  experience: Experience;
  place: Place;
  mitra: Mitra;
  reasons: RecommendationReason[];
}

// ---------- Bookings ----------

export type BookingStatus =
  | 'booking_request_confirmed'
  | 'confirmed'
  | 'active'
  | 'completed'
  | 'cancelled';

export interface Booking {
  id: string;
  userId: string;
  experienceId: string;
  experienceTitle: string;
  placeId: string;
  placeName: string;
  mitraId: string;
  mitraName: string;
  date: string;
  timeSlot: string;
  groupSize: number;
  pricePerPerson: number;
  totalAmount: number;
  mitraShare: number;
  communityContribution: number;
  status: BookingStatus;
  isDemoBooking?: boolean;
  createdAt: string;
}

// ---------- Trips ----------

export type CheckpointState = 'completed' | 'current' | 'upcoming';

export interface TripCheckpoint {
  id: string;
  title: string;
  scheduledTime: string;
  state: CheckpointState;
  checkedInAt?: string;
}

export type TripStatus = 'not_started' | 'active' | 'completed';

export interface Trip {
  id: string;
  bookingId: string;
  userId: string;
  experienceId: string;
  experienceTitle: string;
  mitraId: string;
  mitraName: string;
  status: TripStatus;
  currentCheckpointId?: string;
  checkpoints: TripCheckpoint[];
  lastCheckInAt?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
}

// ---------- Reviews ----------

export interface Review {
  id: string;
  bookingId: string;
  userId: string;
  experienceId: string;
  experienceTitle: string;
  mitraId: string;
  rating: number;
  comment: string;
  verifiedYatra: true;
  createdAt: string;
}

// ---------- Traveller matching ----------

export interface TravellerMatch {
  id: string;
  displayName: string;
  city: string;
  sharedInterests: string[];
  matchScore: number;
  travelStyle: TravelStyle;
  languages: string[];
  isDemo: boolean;
}

// ---------- Homepage compatibility aliases ----------

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

// ---------- Community impact ----------

export interface TripImpact {
  travellerSpend: number;
  mitraEarnings: number;
  communityContribution: number;
  localBusinessesEstimate: number;
  label: string;
  modelNote: string;
}

// ---------- Auth ----------

export type UserRole = 'traveller' | 'mitra' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  isDemo?: boolean;
  createdAt: string;
  updatedAt: string;
}
