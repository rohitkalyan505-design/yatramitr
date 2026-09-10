// ============================================================
// DATA SERVICE — Firestore first, local fallback always available
// ============================================================
// Every read tries Firestore (when configured); on failure or when
// Firebase isn't configured it falls back to the curated local
// datasets. Every write has a local echo so the demo journey
// (book -> trip -> review) works end-to-end without credentials.
// Writes return the locally-created record either way, so the UI
// is identical in demo and live modes.
// ============================================================

import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  setDoc,
  updateDoc,
  doc,
  query,
  where,
  Timestamp,
  type Firestore,
} from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { isFirebaseConfigured, getFirebaseApp } from '@/lib/firebase';
import { PLACES } from '@/data/places';
import { EXPERIENCES, MITRAS, DEMO_TRAVELLERS } from '@/data/experiences';
import type {
  Place,
  Experience,
  Mitra,
  Booking,
  Trip,
  Review,
  UserProfile,
  TravellerPreferences,
  TravellerMatch,
  TripCheckpoint,
} from '@/types';

const db: Firestore | null =
  isFirebaseConfigured && getFirebaseApp() ? getFirestore(getFirebaseApp()!) : null;

// ---------- Local echo stores (demo mode) ----------

const LOCAL_BOOKINGS: Booking[] = [];
const LOCAL_TRIPS: Record<string, Trip> = {}; // bookingId -> trip
const LOCAL_REVIEWS: Review[] = [];

// ---------- Helpers ----------

function tsNow(): string {
  return new Date().toISOString();
}

function makeId(): string {
  return `YM-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()}`;
}

function tsToDate(v: unknown): string | undefined {
  if (!v) return undefined;
  if (v instanceof Timestamp) return v.toDate().toISOString();
  if (typeof v === 'string') return v;
  return undefined;
}

async function safeGetAll<T>(
  name: string,
  mapper: (data: Record<string, unknown>, id: string) => T
): Promise<T[] | null> {
  if (!db) return null;
  try {
    const snap = await getDocs(collection(db, name));
    return snap.docs.map((d) => mapper(d.data() as unknown as Record<string, unknown>, d.id));
  } catch {
    return null;
  }
}

function getExperienceByIdSync(id: string): Experience | undefined {
  return EXPERIENCES.find((e) => e.id === id);
}

function getMitraByIdSync(id: string): Mitra | undefined {
  return MITRAS.find((m) => m.id === id);
}

// ---------- Places ----------

export async function fetchPlaces(): Promise<Place[]> {
  const remote = await safeGetAll<Place>('places', (data, id) => ({ ...(data as unknown as Place), id }));
  return remote && remote.length > 0 ? remote : PLACES;
}

export async function fetchMapPlaces(): Promise<Place[]> {
  const places = await fetchPlaces();
  return places.filter(
    (p): p is Place & { latitude: number; longitude: number } =>
      p.latitude !== null && p.longitude !== null
  );
}

export async function fetchPlaceById(id: string): Promise<Place | undefined> {
  const places = await fetchPlaces();
  return places.find((p) => p.id === id);
}

// ---------- Experiences ----------

export async function fetchExperiences(): Promise<Experience[]> {
  const remote = await safeGetAll<Experience>('experiences', (data, id) => ({
    ...(data as unknown as Experience),
    id,
  }));
  return remote && remote.length > 0 ? remote : EXPERIENCES;
}

export async function fetchExperienceById(id: string): Promise<Experience | undefined> {
  const all = await fetchExperiences();
  return all.find((e) => e.id === id);
}

export async function fetchExperiencesByPlace(placeId: string): Promise<Experience[]> {
  const all = await fetchExperiences();
  return all.filter((e) => e.placeId === placeId);
}

// ---------- Mitras ----------

export async function fetchMitras(): Promise<Mitra[]> {
  const remote = await safeGetAll<Mitra>('mitras', (data, id) => ({ ...(data as unknown as Mitra), id }));
  return remote && remote.length > 0 ? remote : MITRAS;
}

export async function fetchMitraById(id: string): Promise<Mitra | undefined> {
  const all = await fetchMitras();
  return all.find((m) => m.id === id);
}

// ---------- Reviews (public read) ----------

export async function fetchReviewsForExperience(experienceId: string): Promise<Review[]> {
  const remote = await safeGetAll<Review>('reviews', (data, id) => ({ ...(data as unknown as Review), id }));
  if (remote && remote.length > 0) {
    return remote.filter((r) => r.experienceId === experienceId);
  }
  return LOCAL_REVIEWS.filter((r) => r.experienceId === experienceId);
}

// ---------- Bookings ----------

export async function createBooking(input: {
  userId: string;
  experienceId: string;
  date: string;
  timeSlot: string;
  groupSize: number;
  isDemo?: boolean;
}): Promise<Booking> {
  const experience = getExperienceByIdSync(input.experienceId);
  const mitra = getMitraByIdSync(experience?.mitraId ?? '');
  const place = PLACES.find((p) => p.id === experience?.placeId);

  const pricePerPerson = experience?.pricePerPerson ?? 0;
  const totalAmount = pricePerPerson * input.groupSize;
  const mitraShare = Math.round(totalAmount * 0.95);
  const communityContribution = totalAmount - mitraShare;

  const booking: Booking = {
    id: makeId(),
    userId: input.userId,
    experienceId: experience?.id ?? input.experienceId,
    experienceTitle: experience?.title ?? 'Experience',
    placeId: place?.id ?? '',
    placeName: place?.name ?? '',
    mitraId: mitra?.id ?? '',
    mitraName: mitra?.name ?? 'Assigned at check-in',
    date: input.date,
    timeSlot: input.timeSlot,
    groupSize: input.groupSize,
    pricePerPerson,
    totalAmount,
    mitraShare,
    communityContribution,
    status: 'booking_request_confirmed',
    isDemoBooking: input.isDemo,
    createdAt: tsNow(),
  };

  if (db) {
    try {
      const ref = await addDoc(collection(db, 'bookings'), { ...booking });
      booking.id = ref.id;
    } catch {
      // offline fallback: keep the locally generated id
    }
  }

  LOCAL_BOOKINGS.push(booking);
  return booking;
}

export async function fetchBookingsForUser(userId: string): Promise<Booking[]> {
  if (db) {
    try {
      const q = query(collection(db, 'bookings'), where('userId', '==', userId));
      const snap = await getDocs(q);
      const remote = snap.docs.map((d) => ({ ...(d.data() as Booking), id: d.id }));
      if (remote.length > 0) return remote;
    } catch {
      // fall through to local
    }
  }
  return LOCAL_BOOKINGS.filter((b) => b.userId === userId);
}

export async function fetchBookingById(id: string): Promise<Booking | undefined> {
  if (db) {
    try {
      const d = await getDoc(doc(db, 'bookings', id));
      if (d.exists()) return { ...(d.data() as Booking), id: d.id };
    } catch {
      // fall through
    }
  }
  return LOCAL_BOOKINGS.find((b) => b.id === id);
}

export async function updateBookingStatus(id: string, status: Booking['status']): Promise<void> {
  const local = LOCAL_BOOKINGS.find((b) => b.id === id);
  if (local) local.status = status;
  if (db) {
    try {
      await updateDoc(doc(db, 'bookings', id), { status });
    } catch {
      // offline
    }
  }
}

// ---------- Trips ----------

export function buildCheckpoints(experience: Experience | undefined, placeName: string): TripCheckpoint[] {
  const base = [
    { title: `Assembly — ${experience?.meetingPoint ?? 'meeting point'}`, scheduledTime: 'Start' },
    { title: `Explore ${experience?.placeName ?? placeName}`, scheduledTime: 'Mid 1' },
    { title: 'Mid-experience break', scheduledTime: 'Mid 2' },
    { title: 'Wrap-up & farewells', scheduledTime: 'End' },
  ];
  return base.map((b, i) => ({
    id: `cp-${i + 1}`,
    title: b.title,
    scheduledTime: b.scheduledTime,
    state: i === 0 ? ('current' as const) : ('upcoming' as const),
  }));
}

export async function createTripForBooking(booking: Booking): Promise<Trip> {
  const experience = getExperienceByIdSync(booking.experienceId);
  const trip: Trip = {
    id: `TRIP-${booking.id}`,
    bookingId: booking.id,
    userId: booking.userId,
    experienceId: booking.experienceId,
    experienceTitle: booking.experienceTitle,
    mitraId: booking.mitraId,
    mitraName: booking.mitraName,
    status: 'active',
    currentCheckpointId: 'cp-1',
    checkpoints: buildCheckpoints(experience, booking.placeName),
    startedAt: tsNow(),
    createdAt: tsNow(),
  };

  if (db) {
    try {
      await setDoc(doc(db, 'trips', trip.id), { ...trip });
    } catch {
      // offline
    }
  }

  LOCAL_TRIPS[booking.id] = trip;
  return trip;
}

export async function fetchTripForBooking(bookingId: string): Promise<Trip | undefined> {
  if (db) {
    try {
      const d = await getDoc(doc(db, 'trips', `TRIP-${bookingId}`));
      if (d.exists()) return d.data() as Trip;
    } catch {
      // fall through
    }
  }
  return LOCAL_TRIPS[bookingId];
}

export async function checkInToTrip(bookingId: string, checkpointId: string): Promise<Trip | undefined> {
  let trip: Trip | undefined = LOCAL_TRIPS[bookingId];
  if (!trip) {
    trip = await fetchTripForBooking(bookingId);
  }
  // Auto-create the trip if a booking exists but no trip has started yet
  if (!trip) {
    const booking = await fetchBookingById(bookingId);
    if (booking) {
      trip = await createTripForBooking(booking);
    }
  }
  if (!trip) return undefined;
  LOCAL_TRIPS[bookingId] = trip;

  const now = tsNow();
  const cp = trip.checkpoints.find((c) => c.id === checkpointId);
  if (cp) {
    cp.state = 'completed';
    cp.checkedInAt = now;
    const idx = trip.checkpoints.findIndex((c) => c.id === checkpointId);
    const next = trip.checkpoints[idx + 1];
    if (next) {
      next.state = 'current';
      trip.currentCheckpointId = next.id;
    } else {
      trip.status = 'completed';
      trip.completedAt = now;
      trip.currentCheckpointId = undefined;
    }
  }
  trip.lastCheckInAt = now;

  // Keep the booking lifecycle in sync: a completed trip completes the booking
  if (trip.status === 'completed') {
    await updateBookingStatus(bookingId, 'completed');
  }

  if (db) {
    try {
      await setDoc(doc(db, 'trips', trip.id), trip, { merge: true });
    } catch {
      // offline
    }
  }
  return trip;
}

// ---------- Reviews ----------

export async function submitReview(input: {
  bookingId: string;
  userId: string;
  experienceId: string;
  experienceTitle: string;
  mitraId: string;
  rating: number;
  comment: string;
}): Promise<Review> {
  const review: Review = {
    id: makeId(),
    verifiedYatra: true,
    ...input,
    createdAt: tsNow(),
  };
  LOCAL_REVIEWS.push(review);
  if (db) {
    try {
      const ref = await addDoc(collection(db, 'reviews'), { ...review });
      review.id = ref.id;
    } catch {
      // offline
    }
  }
  return review;
}

// ---------- Profiles & preferences ----------

export async function saveTravellerPreferences(userId: string, prefs: TravellerPreferences): Promise<void> {
  const payload = { ...prefs, updatedAt: tsNow() };
  if (db) {
    try {
      await setDoc(doc(db, 'travellerProfiles', userId), payload, { merge: true });
    } catch {
      // offline
    }
  }
  try {
    localStorage.setItem(`ym-prefs-${userId}`, JSON.stringify(payload));
  } catch {
    // storage unavailable
  }
}

export async function loadTravellerPreferences(userId: string): Promise<TravellerPreferences | null> {
  if (db) {
    try {
      const d = await getDoc(doc(db, 'travellerProfiles', userId));
      if (d.exists()) {
        const data = d.data() as TravellerPreferences & { updatedAt?: string };
        const { updatedAt, ...prefs } = data;
        return prefs;
      }
    } catch {
      // fall through to localStorage
    }
  }
  try {
    const raw = localStorage.getItem(`ym-prefs-${userId}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as TravellerPreferences & { updatedAt?: string };
    const { updatedAt, ...prefs } = parsed;
    return prefs;
  } catch {
    return null;
  }
}

export async function saveMitraApplication(payload: Record<string, unknown> & { userId: string }) {
  if (db) {
    try {
      await addDoc(collection(db, 'mitraVerifications'), {
        ...payload,
        identityStatus: 'pending',
        residencyStatus: 'pending',
        knowledgeStatus: 'pending',
        safetyStatus: 'not_verified',
        referencesStatus: 'not_verified',
        updatedAt: tsNow(),
      });
      return { persisted: true };
    } catch {
      // fall through
    }
  }
  return { persisted: false };
}

export async function createUserProfile(profile: UserProfile): Promise<void> {
  if (db) {
    try {
      await setDoc(doc(db, 'users', profile.id), profile, { merge: true });
    } catch {
      // offline
    }
  }
  try {
    localStorage.setItem(`ym-user-${profile.id}`, JSON.stringify(profile));
  } catch {
    // ignore
  }
}

export async function fetchUserProfile(id: string): Promise<UserProfile | null> {
  if (db) {
    try {
      const d = await getDoc(doc(db, 'users', id));
      if (d.exists()) return d.data() as UserProfile;
    } catch {
      // fall through
    }
  }
  try {
    const raw = localStorage.getItem(`ym-user-${id}`);
    return raw ? (JSON.parse(raw) as UserProfile) : null;
  } catch {
    return null;
  }
}

// ---------- Traveller matching (deterministic, demo pool) ----------

export async function fetchTravellerMatches(
  prefs: TravellerPreferences | null
): Promise<TravellerMatch[]> {
  if (!prefs) return DEMO_TRAVELLERS;
  const scored = DEMO_TRAVELLERS.map((t) => {
    const shared = t.sharedInterests.filter((i) => (prefs.interests as string[]).includes(i));
    const styleBonus = t.travelStyle === prefs.travelStyle ? 6 : 0;
    const langBonus = t.languages.some((l) => prefs.languages.includes(l)) ? 4 : 0;
    const score = Math.min(
      99,
      Math.round(
        (shared.length / Math.max(prefs.interests.length, 1)) * 90 + styleBonus + langBonus
      )
    );
    return {
      ...t,
      matchScore: score,
      sharedInterests: shared.length ? shared : t.sharedInterests,
    };
  });
  return scored.sort((a, b) => b.matchScore - a.matchScore);
}
