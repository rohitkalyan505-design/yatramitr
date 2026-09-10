// ============================================================
// RECOMMENDATION ENGINE — deterministic scoring (no AI involved)
// ============================================================
// Weights (as specified):
//   Interest match      30%
//   Budget              20%
//   Crowd preference    15%
//   Duration            15%
//   Travel style        10%
//   Group compatibility 10%
// The numeric score is ALWAYS produced here. Groq may only narrate
// around these results and is never allowed to invent a score.
// ============================================================

import type {
  Experience,
  Mitra,
  Place,
  RecommendationResult,
  RecommendationReason,
  TravellerPreferences,
} from '@/types';

export const SCORE_WEIGHTS = {
  interests: 30,
  budget: 20,
  crowd: 15,
  duration: 15,
  travelStyle: 10,
  group: 10,
} as const;

function interestScore(exp: Experience, prefs: TravellerPreferences): number {
  if (prefs.interests.length === 0) return 0.5;
  const hits = prefs.interests.filter((i) => exp.interests.includes(i));
  return hits.length / prefs.interests.length;
}

function budgetScore(exp: Experience, prefs: TravellerPreferences): number {
  // Fully comfortable at or under budget; gently penalised above it.
  if (exp.pricePerPerson <= prefs.budget) return 1;
  const overshoot = (exp.pricePerPerson - prefs.budget) / Math.max(prefs.budget, 1);
  return Math.max(0, 1 - overshoot * 1.5);
}

function crowdScore(exp: Experience, prefs: TravellerPreferences): number {
  const placePressureOrder: Record<string, number> = { Low: 0, Medium: 1, High: 2 };
  const prefOrder: Record<string, number> = { Quiet: 0, Moderate: 1, Lively: 2 };
  const diff = Math.abs(
    (placePressureOrder[exp.crowdLevel] ?? 1) - (prefOrder[prefs.crowdPreference] ?? 1)
  );
  return diff === 0 ? 1 : diff === 1 ? 0.55 : 0.15;
}

const DURATION_HOURS = { '2 hours': 2, '4 hours': 4, 'Full day': 8 } as const;

function durationScore(exp: Experience, prefs: TravellerPreferences): number {
  const target = DURATION_HOURS[prefs.durationPreference] ?? 4;
  const diff = Math.abs(exp.durationHours - target);
  if (diff <= 0.75) return 1;
  if (diff <= 1.5) return 0.75;
  if (diff <= 3) return 0.4;
  return 0.15;
}

function travelStyleScore(exp: Experience, prefs: TravellerPreferences): number {
  return exp.travelStyle === prefs.travelStyle ? 1 : 0.45;
}

function groupScore(exp: Experience, prefs: TravellerPreferences): number {
  const groupPref: Record<string, number> = {
    Solo: 1,
    '2–3': 2.5,
    '4–5': 4.5,
  };
  const desired = groupPref[prefs.groupPreference] ?? 2.5;
  // Small groups fit small caps; solo fits anything.
  if (desired <= exp.groupCap) return 1;
  return Math.max(0.2, 1 - (desired - exp.groupCap) / 3);
}

export function scoreExperience(
  exp: Experience,
  prefs: TravellerPreferences
): { total: number; breakdown: RecommendationResult['scoreBreakdown'] } {
  const safe = (v: number, fallback: number) => (Number.isFinite(v) ? v : fallback);

  const rows: { criterion: string; weight: number; frac: number }[] = [
    { criterion: 'Interest match', weight: SCORE_WEIGHTS.interests, frac: safe(interestScore(exp, prefs), 0.5) },
    { criterion: 'Budget fit', weight: SCORE_WEIGHTS.budget, frac: safe(budgetScore(exp, prefs), 0.5) },
    { criterion: 'Crowd preference', weight: SCORE_WEIGHTS.crowd, frac: safe(crowdScore(exp, prefs), 0.5) },
    { criterion: 'Duration fit', weight: SCORE_WEIGHTS.duration, frac: safe(durationScore(exp, prefs), 0.5) },
    { criterion: 'Travel style', weight: SCORE_WEIGHTS.travelStyle, frac: safe(travelStyleScore(exp, prefs), 0.5) },
    { criterion: 'Group compatibility', weight: SCORE_WEIGHTS.group, frac: safe(groupScore(exp, prefs), 0.5) },
  ];
  const total = rows.reduce((acc, r) => acc + r.weight * r.frac, 0);
  return {
    total: Math.round(Number.isFinite(total) ? total : 50),
    breakdown: rows.map((r) => ({
      criterion: r.criterion,
      weight: r.weight,
      earned: Math.round(r.weight * r.frac),
    })),
  };
}

function buildReasons(
  exp: Experience,
  place: Place | undefined,
  mitra: Mitra | undefined,
  prefs: TravellerPreferences
): RecommendationReason[] {
  const reasons: RecommendationReason[] = [];

  const matchedInterests = prefs.interests.filter((i) => exp.interests.includes(i));
  if (matchedInterests.length > 0) {
    reasons.push({
      criterion: 'Interests',
      detail: `Matches your interest in ${matchedInterests.join(', ').toLowerCase()}`,
    });
  }

  if (exp.pricePerPerson <= prefs.budget) {
    reasons.push({
      criterion: 'Budget',
      detail: `Fits your ₹${prefs.budget} budget (₹${exp.pricePerPerson}/person)`,
    });
  } else {
    reasons.push({
      criterion: 'Budget',
      detail: `Slightly above your ₹${prefs.budget} budget (₹${exp.pricePerPerson}/person)`,
    });
  }

  const pressure = exp.crowdLevel;
  if (
    (prefs.crowdPreference === 'Quiet' && pressure === 'Low') ||
    (prefs.crowdPreference === 'Moderate' && pressure === 'Medium') ||
    (prefs.crowdPreference === 'Lively' && pressure === 'High')
  ) {
    reasons.push({ criterion: 'Crowds', detail: `Matches your ${prefs.crowdPreference.toLowerCase()} crowd preference` });
  } else if (prefs.crowdPreference === 'Quiet') {
    reasons.push({ criterion: 'Crowds', detail: `Busier than your quiet preference (${pressure.toLowerCase()} pressure area)` });
  }

  const target = DURATION_HOURS[prefs.durationPreference] ?? 4;
  if (Math.abs(exp.durationHours - target) <= 0.75) {
    reasons.push({ criterion: 'Duration', detail: `Fits your ${prefs.durationPreference} window (${exp.durationLabel})` });
  }

  if (exp.travelStyle === prefs.travelStyle) {
    reasons.push({ criterion: 'Style', detail: `${exp.travelStyle} pace matches your travel style` });
  }

  if (mitra) {
    const sharedLangs = mitra.languages.filter((l) => prefs.languages.includes(l));
    if (sharedLangs.length > 0) {
      reasons.push({ criterion: 'Language', detail: `Mitra speaks your language (${sharedLangs.join(', ')})` });
    }
    if (place && mitra.homePlaceId === place.id) {
      reasons.push({ criterion: 'Local expertise', detail: `${mitra.name} is from this very neighbourhood` });
    }
  }

  if (place && place.tourismPressure === 'Low' && prefs.crowdPreference !== 'Lively') {
    reasons.push({ criterion: 'Distribution', detail: 'Directs tourism spending to a lower-pressure side of Hyderabad' });
  }

  return reasons;
}

export interface RecommendOptions {
  experiences: Experience[];
  places: Place[];
  mitras: Mitra[];
  prefs: TravellerPreferences;
  limit?: number;
}

export function recommend(opts: RecommendOptions): RecommendationResult[] {
  const { experiences, places, mitras, prefs, limit = 4 } = opts;

  const scored = experiences.map((exp) => {
    const { total, breakdown } = scoreExperience(exp, prefs);
    const place = places.find((p) => p.id === exp.placeId);
    const mitra = mitras.find((m) => m.id === exp.mitraId);
    const reasons = buildReasons(exp, place, mitra, prefs);
    return { matchScore: total, scoreBreakdown: breakdown, experience: exp, place, mitra, reasons } as RecommendationResult;
  });

  return scored.sort((a, b) => b.matchScore - a.matchScore).slice(0, limit);
}

// ---------- Mitra compatibility (deterministic) ----------

export interface MitraCompat {
  mitra: Mitra;
  score: number;
  reasons: string[];
}

export function scoreMitraCompatibility(
  mitra: Mitra,
  prefs: TravellerPreferences,
  placeCategory?: string
): MitraCompat {
  let score = 0;
  const reasons: string[] = [];

  const sharedLangs = mitra.languages.filter((l) => prefs.languages.includes(l));
  if (sharedLangs.length > 0) {
    score += 30;
    reasons.push(`Speaks your language (${sharedLangs.join(', ')})`);
  }

  const sharedInterests = mitra.interests.filter((i) => prefs.interests.includes(i));
  if (sharedInterests.length > 0) {
    score += Math.min(30, sharedInterests.length * 12);
    reasons.push(`Shares your interest in ${sharedInterests.join(', ').toLowerCase()}`);
  }

  if (placeCategory && mitra.categories.includes(placeCategory as Mitra['categories'][number])) {
    score += 20;
    reasons.push(`Specialises in ${placeCategory}`);
  }

  if (mitra.availability.length > 0) {
    score += 10;
    reasons.push('Currently available');
  }

  if (mitra.experienceYears >= 5) {
    score += 10;
    reasons.push(`${mitra.experienceYears} years hosting experience`);
  }

  return { mitra, score: Math.min(99, score), reasons };
}
