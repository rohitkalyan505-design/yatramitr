import { NextResponse } from 'next/server';
import { fetchMitras } from '@/lib/data-service';
import { PLACE_CATEGORIES } from '@/types';
import type { PlaceCategory } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');

    let mitras = await fetchMitras();
    if (category && category !== 'All') {
      mitras = mitras.filter((m) => m.categories.includes(category as PlaceCategory));
    }

    return NextResponse.json({ count: mitras.length, mitras });
  } catch {
    return NextResponse.json({ error: 'Unable to load mitras' }, { status: 500 });
  }
}
