import { NextResponse } from 'next/server';
import { fetchExperienceById, fetchPlaceById, fetchMitraById, fetchReviewsForExperience } from '@/lib/data-service';

export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const experience = await fetchExperienceById(params.id);
    if (!experience) return NextResponse.json({ error: 'Experience not found' }, { status: 404 });

    const [place, mitra, reviews] = await Promise.all([
      fetchPlaceById(experience.placeId),
      fetchMitraById(experience.mitraId),
      fetchReviewsForExperience(experience.id),
    ]);

    return NextResponse.json({ experience, place, mitra, reviews });
  } catch {
    return NextResponse.json({ error: 'Unable to load experience' }, { status: 500 });
  }
}
