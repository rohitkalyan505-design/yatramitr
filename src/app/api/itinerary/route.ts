import { NextResponse } from 'next/server';
import { buildItinerary } from '@/lib/groq-service';
import type { TravellerPreferences } from '@/types';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

// POST /api/itinerary — body: { preferences }
// Structure comes from real Firestore/dataset experiences; Groq only
// narrates around them and can never insert a place that isn't real.
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const prefs = body?.preferences as TravellerPreferences | undefined;
    if (!prefs) {
      return NextResponse.json({ error: 'preferences required' }, { status: 400 });
    }
    const result = await buildItinerary(prefs);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Unable to build itinerary' }, { status: 500 });
  }
}
