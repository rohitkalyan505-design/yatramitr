import { NextResponse } from 'next/server';
import { fetchPlaces } from '@/lib/data-service';
import { PLACE_CATEGORIES } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const q = searchParams.get('q')?.toLowerCase();

    let places = await fetchPlaces();

    if (category && category !== 'All') {
      if (!PLACE_CATEGORIES.includes(category as (typeof PLACE_CATEGORIES)[number])) {
        return NextResponse.json({ error: 'Unknown category' }, { status: 400 });
      }
      places = places.filter((p) => p.category === category);
    }
    if (q) {
      places = places.filter(
        (p) => p.name.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return NextResponse.json({ count: places.length, places });
  } catch {
    return NextResponse.json({ error: 'Unable to load places' }, { status: 500 });
  }
}
