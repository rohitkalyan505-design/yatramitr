import { NextResponse } from 'next/server';
import { createBooking, fetchBookingsForUser } from '@/lib/data-service';
import { sendBookingConfirmation } from '@/lib/email-service';

export const dynamic = 'force-dynamic';

// POST /api/bookings — create a booking request (no payment in MVP)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, experienceId, date, timeSlot, groupSize, email, isDemo } = body as {
      userId?: string;
      experienceId?: string;
      date?: string;
      timeSlot?: string;
      groupSize?: number;
      email?: string;
      isDemo?: boolean;
    };

    if (!userId || !experienceId || !date || !groupSize || groupSize < 1 || groupSize > 10) {
      return NextResponse.json({ error: 'Missing or invalid booking fields' }, { status: 400 });
    }

    const booking = await createBooking({
      userId,
      experienceId,
      date,
      timeSlot: timeSlot ?? 'Morning',
      groupSize,
      isDemo,
    });

    // Transactional email (non-blocking; falls back silently when unconfigured)
    if (email) {
      await sendBookingConfirmation(email, {
        bookingId: booking.id,
        experienceTitle: booking.experienceTitle,
        date: booking.date,
        timeSlot: booking.timeSlot,
        groupSize: booking.groupSize,
        totalAmount: booking.totalAmount,
      });
    }

    return NextResponse.json({ booking }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Unable to create booking' }, { status: 500 });
  }
}

// GET /api/bookings?userId=... — list a user's bookings
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });
    const bookings = await fetchBookingsForUser(userId);
    return NextResponse.json({ count: bookings.length, bookings });
  } catch {
    return NextResponse.json({ error: 'Unable to load bookings' }, { status: 500 });
  }
}
