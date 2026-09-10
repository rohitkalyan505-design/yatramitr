import { NextResponse } from 'next/server';
import { fetchExperiences } from '@/lib/data-service';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const placeId = searchParams.get('placeId');
    const maxPrice = searchParams.get('maxPrice');
    const maxDuration = searchParams.get('maxDuration');

    let experiences = await fetchExperiences();
    if (placeId) experiences = experiences.filter((e) => e.placeId === placeId);
    if (maxPrice) experiences = experiences.filter((e) => e.pricePerPerson <= Number(maxPrice));
    if (maxDuration) experiences = experiences.filter((e) => e.durationHours <= Number(maxDuration));

    return NextResponse.json({ count: experiences.length, experiences });
  } catch {
    return NextResponse.json({ error: 'Unable to load experiences' }, { status: 500 });
  }
}
