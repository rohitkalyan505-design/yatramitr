// ============================================================
// FAIR PRICE GUIDE — deterministic price comparison logic
// ============================================================
// IMPORTANT: Price ranges in the MVP are INDICATIVE — prototype
// estimates subject to field validation. This module never claims
// a range is research-backed, and never calls a high price a scam.
// A high quote may reflect duration, transport, entry fees, food,
// group size, season, or additional inclusions.
// ============================================================

export type PriceStatus = 'within' | 'above' | 'below';

export interface PriceCheckInput {
  service: string;
  location: string;
  quotedPrice: number;
  hours?: number;
  includesTransport?: boolean;
  includesFood?: boolean;
  includesEntryTickets?: boolean;
}

export interface PriceCheckResult {
  quotedPrice: number;
  typicalRange: { min: number; max: number };
  status: PriceStatus;
  statusLabel: string;
  explanation: string;
  considerations: string[];
  dataNote: string;
}

// Base indicative hourly guiding rates (prototype estimates).
const BASE_RATE_PER_HOUR = 220;
const BASE_MIN = 180;

export function estimateTypicalRange(input: {
  hours: number;
  includesTransport?: boolean;
  includesFood?: boolean;
  includesEntryTickets?: boolean;
}): { min: number; max: number } {
  let min = BASE_MIN * input.hours;
  let max = BASE_RATE_PER_HOUR * input.hours;
  if (input.includesTransport) {
    min += 300;
    max += 700;
  }
  if (input.includesFood) {
    min += 150;
    max += 400;
  }
  if (input.includesEntryTickets) {
    min += 25;
    max += 150;
  }
  // Round to tidy ₹25 steps.
  const round = (n: number) => Math.round(n / 25) * 25;
  return { min: round(min), max: round(max) };
}

export function checkPrice(input: PriceCheckInput): PriceCheckResult {
  const hours = input.hours && input.hours > 0 ? input.hours : 3;
  const typicalRange = estimateTypicalRange({
    hours,
    includesTransport: input.includesTransport,
    includesFood: input.includesFood,
    includesEntryTickets: input.includesEntryTickets,
  });

  let status: PriceStatus = 'within';
  if (input.quotedPrice > typicalRange.max) status = 'above';
  else if (input.quotedPrice < typicalRange.min * 0.6) status = 'below';

  const statusLabel =
    status === 'within'
      ? 'Within typical range'
      : status === 'above'
        ? 'Above typical range'
        : 'Below typical range';

  const considerations: string[] = [];
  if (status === 'above') {
    considerations.push(
      'Longer duration than assumed — guides often charge by the hour',
      'Private transport included in the quote',
      'Entry tickets or activity fees bundled in',
      'Food tastings or meals included',
      'Smaller group size (more personalised attention costs more per person)',
      'Peak season or festival-period demand',
      'Specialist expertise (e.g., certified history or craft specialist)'
    );
  } else if (status === 'below') {
    considerations.push(
      'Shorter duration than assumed',
      'Larger group sharing the cost',
      'Possible commission-based stops (shops paying the guide)',
      'Reduced inclusions — confirm what is covered'
    );
  }

  const explanation =
    status === 'within'
      ? `₹${input.quotedPrice} sits within the typical indicative range of ₹${typicalRange.min}–₹${typicalRange.max} for a ${hours}-hour experience of this kind.`
      : status === 'above'
        ? `₹${input.quotedPrice} is above the typical indicative range of ₹${typicalRange.min}–₹${typicalRange.max}. This is not automatically unfair — check what is included (duration, transport, entry fees, food, group size, season) before deciding.`
        : `₹${input.quotedPrice} is below the typical indicative range of ₹${typicalRange.min}–₹${typicalRange.max}. Very low prices sometimes mean reduced inclusions or commission-based stops — it is reasonable to ask what is covered.`;

  return {
    quotedPrice: input.quotedPrice,
    typicalRange,
    status,
    statusLabel,
    explanation,
    considerations,
    dataNote:
      'Prototype estimate — subject to field validation. Ranges are Yatra Mitra indicative estimates, not researched market data.',
  };
}
