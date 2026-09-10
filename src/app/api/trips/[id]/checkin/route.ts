import { NextResponse } from 'next/server';
import { fetchTripForBooking, checkInToTrip } from '@/lib/data-service';

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

    const trip = await checkInToTrip(bookingId, checkpointId);
    if (!trip) return NextResponse.json({ error: 'Trip not found' }, { status: 404 });

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
    const trip = await fetchTripForBooking(bookingId);
    if (!trip) return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    return NextResponse.json({ trip });
  } catch {
    return NextResponse.json({ error: 'Unable to load trip' }, { status: 500 });
  }
}
