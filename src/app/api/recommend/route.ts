import { NextResponse } from 'next/server';
import { fetchPlaces, fetchExperiences, fetchMitras } from '@/lib/data-service';
import { recommend } from '@/lib/recommendation';
import { isGroqConfigured } from '@/lib/groq-service';
import type { TravellerPreferences } from '@/types';

export const dynamic = 'force-dynamic';

const DEFAULT_PREFS: TravellerPreferences = {
  interests: ['Heritage'],
  budget: 800,
  crowdPreference: 'Moderate',
  travelStyle: 'Balanced',
  durationPreference: '4 hours',
  groupPreference: '2–3',
  languages: ['English', 'Hindi'],
};

function sanitizePrefs(input: Partial<TravellerPreferences> | undefined): TravellerPreferences {
  if (!input) return DEFAULT_PREFS;
  const VALID_CROWDS = ['Quiet', 'Moderate', 'Lively'];
  const VALID_STYLES = ['Slow', 'Balanced', 'Fast'];
  const VALID_DURATIONS = ['2 hours', '4 hours', 'Full day'];
  const VALID_GROUPS = ['Solo', '2–3', '4–5'];
  return {
    interests: Array.isArray(input.interests) && input.interests.length > 0 ? input.interests : DEFAULT_PREFS.interests,
    budget: typeof input.budget === 'number' && Number.isFinite(input.budget) && input.budget > 0
      ? Math.min(input.budget, 100000)
      : DEFAULT_PREFS.budget,
    crowdPreference: VALID_CROWDS.includes(String(input.crowdPreference))
      ? (input.crowdPreference as TravellerPreferences['crowdPreference'])
      : DEFAULT_PREFS.crowdPreference,
    travelStyle: VALID_STYLES.includes(String(input.travelStyle))
      ? (input.travelStyle as TravellerPreferences['travelStyle'])
      : DEFAULT_PREFS.travelStyle,
    durationPreference: VALID_DURATIONS.includes(String(input.durationPreference))
      ? (input.durationPreference as TravellerPreferences['durationPreference'])
      : DEFAULT_PREFS.durationPreference,
    groupPreference: VALID_GROUPS.includes(String(input.groupPreference))
      ? (input.groupPreference as TravellerPreferences['groupPreference'])
      : DEFAULT_PREFS.groupPreference,
    languages: Array.isArray(input.languages) && input.languages.length > 0 ? input.languages : DEFAULT_PREFS.languages,
  };
}

// POST /api/recommend — deterministic scoring engine (no AI in the scoring path)
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const prefs = sanitizePrefs(body?.preferences);
    const limit = typeof body?.limit === 'number' ? Math.min(body.limit, 10) : 4;

    const [places, experiences, mitras] = await Promise.all([
      fetchPlaces(),
      fetchExperiences(),
      fetchMitras(),
    ]);

    const results = recommend({ experiences, places, mitras, prefs, limit });

    return NextResponse.json({
      preferences: prefs,
      results,
      engine: {
        type: 'deterministic-weighted-scoring',
        weights: { interests: 30, budget: 20, crowd: 15, duration: 15, travelStyle: 10, group: 10 },
        aiInvolved: false,
        groqConfigured: isGroqConfigured,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Unable to compute recommendations' }, { status: 500 });
  }
}
