import { NextResponse } from 'next/server';
import { fetchPlaceById, fetchExperiencesByPlace, fetchMitraById } from '@/lib/data-service';

export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const place = await fetchPlaceById(params.id);
    if (!place) return NextResponse.json({ error: 'Place not found' }, { status: 404 });

    const experiences = await fetchExperiencesByPlace(params.id);
    const mitraIds = Array.from(new Set(experiences.map((e) => e.mitraId)));
    const mitras = (await Promise.all(mitraIds.map((id) => fetchMitraById(id)))).filter(Boolean);

    return NextResponse.json({ place, experiences, mitras });
  } catch {
    return NextResponse.json({ error: 'Unable to load place' }, { status: 500 });
  }
}
