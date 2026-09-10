import { NextResponse } from 'next/server';
import { fetchMitraById, fetchExperiences } from '@/lib/data-service';
import { scoreMitraCompatibility } from '@/lib/recommendation';
import type { TravellerPreferences } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const mitra = await fetchMitraById(params.id);
    if (!mitra) return NextResponse.json({ error: 'Mitra not found' }, { status: 404 });

    const allExperiences = await fetchExperiences();
    const experiences = allExperiences.filter((e) => e.mitraId === mitra.id);

    // Optional live compatibility scoring: ?prefs=<base64 JSON>
    const { searchParams } = new URL(req.url);
    const prefsParam = searchParams.get('prefs');
    let compatibility: ReturnType<typeof scoreMitraCompatibility> | null = null;
    if (prefsParam) {
      try {
        const prefs = JSON.parse(
          Buffer.from(prefsParam, 'base64').toString('utf-8')
        ) as TravellerPreferences;
        compatibility = scoreMitraCompatibility(mitra, prefs, experiences[0]?.category);
      } catch {
        compatibility = null;
      }
    }

    return NextResponse.json({ mitra, experiences, compatibility });
  } catch {
    return NextResponse.json({ error: 'Unable to load mitra' }, { status: 500 });
  }
}
