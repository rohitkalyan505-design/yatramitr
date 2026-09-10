import { NextResponse } from 'next/server';
import { fetchBookingById, fetchTripForBooking } from '@/lib/data-service';

export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const booking = await fetchBookingById(params.id);
    if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    const trip = await fetchTripForBooking(params.id);
    return NextResponse.json({ booking, trip });
  } catch {
    return NextResponse.json({ error: 'Unable to load booking' }, { status: 500 });
  }
}
