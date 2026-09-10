import { NextResponse } from 'next/server';
import { submitReview, fetchBookingById } from '@/lib/data-service';

export const dynamic = 'force-dynamic';

// POST /api/reviews — only completed bookings may generate a review
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { bookingId, userId, rating, comment } = body as {
      bookingId?: string;
      userId?: string;
      rating?: number;
      comment?: string;
    };

    if (!bookingId || !userId || !rating) {
      return NextResponse.json({ error: 'bookingId, userId and rating are required' }, { status: 400 });
    }
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be 1–5' }, { status: 400 });
    }

    const booking = await fetchBookingById(bookingId);
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    if (booking.userId !== userId) {
      return NextResponse.json({ error: 'You can only review your own bookings' }, { status: 403 });
    }
    if (booking.status !== 'completed') {
      return NextResponse.json(
        { error: 'Only completed Yatras can be reviewed. Complete your trip first.' },
        { status: 403 }
      );
    }

    const review = await submitReview({
      bookingId,
      userId,
      experienceId: booking.experienceId,
      experienceTitle: booking.experienceTitle,
      mitraId: booking.mitraId,
      rating,
      comment: (comment ?? '').slice(0, 500),
    });

    return NextResponse.json({ review, verifiedYatra: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Unable to submit review' }, { status: 500 });
  }
}
