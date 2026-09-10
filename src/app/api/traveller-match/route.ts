import { NextResponse } from 'next/server';
import { fetchTravellerMatches } from '@/lib/data-service';
import type { TravellerPreferences } from '@/types';

export const dynamic = 'force-dynamic';

// POST /api/traveller-match — compatible-traveller discovery.
// The MVP match pool consists of clearly-labelled DEMO accounts.
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const prefs = (body?.preferences as TravellerPreferences) ?? null;
    const matches = await fetchTravellerMatches(prefs);
    return NextResponse.json({
      matches,
      note: 'Demo pool — all matched travellers are DEMO accounts for prototype purposes.',
    });
  } catch {
    return NextResponse.json({ error: 'Unable to compute matches' }, { status: 500 });
  }
}
