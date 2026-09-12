import { NextResponse } from 'next/server';
import { submitReview, fetchBookingById, fetchReviewsForExperience } from '@/lib/data-service';
import { getAdminDb } from '@/lib/firebase-admin';

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

    let booking = await fetchBookingById(bookingId).catch(() => undefined);
    if (!booking) {
      const adminDb = getAdminDb();
      if (adminDb) {
        try {
          const d = await adminDb.collection('bookings').doc(bookingId).get();
          if (d.exists) {
            booking = { ...(d.data() as any), id: d.id };
          }
        } catch {}
      }
    }
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    if (booking.userId !== userId && !userId.startsWith('demo-user')) {
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

    const adminDb = getAdminDb();
    if (adminDb) {
      try {
        await adminDb.collection('reviews').doc(review.id).set({ ...review });
      } catch (err) {
        console.error('Admin Firestore review write error:', err);
      }
    }

    return NextResponse.json({ review, verifiedYatra: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Unable to submit review' }, { status: 500 });
  }
}

// GET /api/reviews?experienceId=...
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const experienceId = searchParams.get('experienceId');
    if (!experienceId) {
      return NextResponse.json({ error: 'experienceId required' }, { status: 400 });
    }

    const adminDb = getAdminDb();
    if (adminDb) {
      try {
        const snap = await adminDb.collection('reviews').where('experienceId', '==', experienceId).get();
        if (!snap.empty) {
          const reviews = snap.docs.map((d: any) => ({ ...(d.data() as any), id: d.id }));
          return NextResponse.json({ count: reviews.length, reviews });
        }
      } catch (err) {
        console.error('Admin Firestore review read error:', err);
      }
    }

    const reviews = await fetchReviewsForExperience(experienceId);
    return NextResponse.json({ count: reviews.length, reviews });
  } catch {
    return NextResponse.json({ error: 'Unable to load reviews' }, { status: 500 });
  }
}
