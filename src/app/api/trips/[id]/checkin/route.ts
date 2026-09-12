import { NextResponse } from 'next/server';
import { fetchTripForBooking, checkInToTrip } from '@/lib/data-service';
import { getAdminDb } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

// POST /api/trips/[id]/checkin  body: { checkpointId }
// [id] here is the trip id (TRIP-<bookingId>) — we accept the booking id too.
export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json().catch(() => ({}));
    const checkpointId = body?.checkpointId;
    if (!checkpointId) {
      return NextResponse.json({ error: 'checkpointId required' }, { status: 400 });
    }

    // Normalize: allow either "TRIP-xxx" or bare booking id "xxx"
    const tripId = params.id.startsWith('TRIP-') ? params.id : `TRIP-${params.id}`;
    const bookingId = tripId.replace(/^TRIP-/, '');

    const adminDb = getAdminDb();

    let trip = await checkInToTrip(bookingId, checkpointId);
    if (!trip && adminDb) {
      try {
        const d = await adminDb.collection('bookings').doc(bookingId).get();
        if (d.exists) {
          const booking = { ...(d.data() as any), id: d.id };
          const { createTripForBooking } = await import('@/lib/data-service');
          await createTripForBooking(booking);
          trip = await checkInToTrip(bookingId, checkpointId);
        }
      } catch (err) {
        console.error('Admin Firestore fallback error in checkin:', err);
      }
    }

    if (!trip) return NextResponse.json({ error: 'Trip not found' }, { status: 404 });

    if (adminDb) {
      try {
        await adminDb.collection('trips').doc(trip.id).set({ ...trip }, { merge: true });
        if (trip.status === 'completed') {
          await adminDb.collection('bookings').doc(bookingId).set({ status: 'completed' }, { merge: true });
        }
      } catch (err) {
        console.error('Admin Firestore trip write error:', err);
      }
    }

    return NextResponse.json({ trip, message: 'Check-in recorded.' });
  } catch {
    return NextResponse.json({ error: 'Unable to record check-in' }, { status: 500 });
  }
}

// GET — fetch current trip state
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const tripId = params.id.startsWith('TRIP-') ? params.id : `TRIP-${params.id}`;
    const bookingId = tripId.replace(/^TRIP-/, '');

    const adminDb = getAdminDb();
    if (adminDb) {
      try {
        const d = await adminDb.collection('trips').doc(tripId).get();
        if (d.exists) {
          return NextResponse.json({ trip: d.data() });
        }
      } catch (err) {
        console.error('Admin Firestore trip read error:', err);
      }
    }

    const trip = await fetchTripForBooking(bookingId);
    if (!trip) return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    return NextResponse.json({ trip });
  } catch {
    return NextResponse.json({ error: 'Unable to load trip' }, { status: 500 });
  }
}
