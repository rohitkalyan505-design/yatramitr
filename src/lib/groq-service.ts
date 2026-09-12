// ============================================================
// ASK MITRA — GROQ AI SERVICE (server-side only)
// ============================================================
// Flow: USER → intent detection → query platform data →
// deterministic data-grounded answer → Groq polishes wording →
// reply. If Groq is unavailable, the deterministic answer stands
// on its own — the platform never depends on the AI.
//
// HARD RULES:
// - Groq NEVER invents places, prices, mitras, scores or facts.
//   Only data from our datasets / recommendation engine enters
//   the prompt, as the sole source of truth.
// - The LLM is explicitly instructed to say "I don't have that
//   information" rather than guess.
// - Safety questions always return pre-verified static answers,
//   independent of Groq.
// ============================================================

import Groq from 'groq-sdk';
import { PLACES } from '@/data/places';
import { EXPERIENCES, MITRAS } from '@/data/experiences';
import { recommend } from '@/lib/recommendation';
import { checkPrice } from '@/lib/pricing';
import type { TravellerPreferences, Interest } from '@/types';

const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

export const isGroqConfigured = Boolean(groq);

// ---------- Intent detection (deterministic) ----------

export type Intent =
  | 'find_experience'
  | 'build_yatra'
  | 'check_price'
  | 'find_mitra'
  | 'explain_place'
  | 'explain_history'
  | 'safety_help'
  | 'booking_help'
  | 'general';

const INTEREST_WORDS: Record<string, Interest> = {
  heritage: 'Heritage', history: 'Heritage', monument: 'Heritage', fort: 'Heritage',
  food: 'Food', eat: 'Food', biryani: 'Food', cuisine: 'Food', snack: 'Food',
  culture: 'Culture', cultural: 'Culture', festival: 'Culture',
  architecture: 'Architecture', design: 'Architecture', building: 'Architecture',
  craft: 'Crafts', crafts: 'Crafts', artisan: 'Crafts', handmade: 'Crafts', textile: 'Crafts',
  photo: 'Photography', photography: 'Photography', camera: 'Photography',
  story: 'Local stories', stories: 'Local stories', local: 'Local stories',
};

const PLACE_WORDS: Record<string, string> = {
  charminar: 'charminar', 'char minar': 'charminar',
  golconda: 'golconda-fort', 'golkonda': 'golconda-fort',
  mecca: 'mecca-masjid', 'makkah': 'mecca-masjid',
  'qutb shahi': 'qutb-shahi-tombs', tombs: 'qutb-shahi-tombs',
  'thousand pillar': 'thousand-pillar-temple', warangal: 'thousand-pillar-temple',
  ramappa: 'ramappa-temple', unesco: 'ramappa-temple',
  bhongir: 'bhongir-fort', bhuvanagiri: 'bhongir-fort',
  'salar jung': 'salar-jung-museum', museum: 'salar-jung-museum',
  chowmahalla: 'chowmahalla-palace', palace: 'chowmahalla-palace',
  falaknuma: 'taj-falaknuma-palace',
  'hussain sagar': 'hussain-sagar', 'tank bund': 'hussain-sagar', lake: 'hussain-sagar',
  'nagarjuna sagar': 'nagarjuna-sagar', dam: 'nagarjuna-sagar',
  ananthagiri: 'ananthagiri-hills', vikarabad: 'ananthagiri-hills',
  'konda pochamma': 'konda-pochamma', reservoir: 'konda-pochamma',
  'birla mandir': 'birla-mandir', birla: 'birla-mandir',
  chilkur: 'chilkur-balaji', visa: 'chilkur-balaji',
  yadadri: 'yadadri', yadagirigutta: 'yadadri', narasimha: 'yadadri',
  jagannath: 'jagannath-temple',
  iskcon: 'iskcon-hyderabad',
  'statue of equality': 'statue-of-equality', ramanuja: 'statue-of-equality',
  shilparamam: 'shilparamam', crafts: 'shilparamam',
  'ramoji film city': 'ramoji-film-city', ramoji: 'ramoji-film-city',
};

export function detectIntent(message: string): Intent {
  const m = message.toLowerCase();
  if (/safe|safety|emergency|unsafe|lost|scared|threat|harass/.test(m)) return 'safety_help';
  if (/booking|booked|reservation|cancel|reschedul/.test(m)) return 'booking_help';

  // Explicit price-intent phrasing (a bare ₹/"fair" alongside interests
  // like "I have ₹800 and 4 hours" should still route to find_experience,
  // so we require a price-question signal).
  const asksPrice = /is .{0,40}fair|price|cost|overcharg|scam|expensive|too much|check.{0,10}price/.test(m);
  const mentionsAmount = /(?:₹|rs\.?\s?)\s?\d{2,5}|\d{2,5}\s*(?:rupees|rs)/.test(m);
  const mentionsInterests = Object.keys(INTEREST_WORDS).some((w) => m.includes(w));
  const mentionsDuration = /\d+\s*(?:hours?|hrs?)|full day|half day/.test(m);
  if (asksPrice && !mentionsInterests) return 'check_price';
  if (asksPrice && mentionsInterests && !(mentionsAmount && mentionsDuration)) return 'check_price';
  if (mentionsAmount && mentionsDuration && mentionsInterests) return 'find_experience';

  if (/mitra|guide|local expert|who can show/.test(m)) return 'find_mitra';
  if (/plan|itinerary|build.*yatra|plan my|day plan|schedule|1-day|one day|day trip|one-day/.test(m)) return 'build_yatra';
  if (/what should i see|what can i do|things to do|places to visit/.test(m)) return 'find_experience';
  if (/history|historic|built|dynasty|kakatiya|qutb shahi|nizam|origin/.test(m) && !mentionsInterests) return 'explain_history';
  if (/tell me about|what is|what's|explain|where is|information about/.test(m)) {
    if (Object.keys(PLACE_WORDS).some((k) => m.includes(k))) return 'explain_place';
    return 'explain_history';
  }
  if (/recommend|suggest|find|experience|quiet|do in|things to/.test(m)) return 'find_experience';
  // Falls through to experience matching when interests are clear
  if (mentionsInterests) return 'find_experience';
  return 'general';
}

// ---------- Preference extraction (deterministic) ----------

export function extractPreferences(message: string): Partial<TravellerPreferences> {
  const m = message.toLowerCase();
  const prefs: Partial<TravellerPreferences> = { interests: [] };

  const interests = new Set<Interest>();
  for (const [word, interest] of Object.entries(INTEREST_WORDS)) {
    if (m.includes(word)) interests.add(interest);
  }
  prefs.interests = Array.from(interests);

  const budgetMatch = m.match(/(?:₹|rs\.?\s?)(\d{2,5})/) ?? m.match(/(\d{2,5})\s*(?:rupees|rs|₹)/);
  if (budgetMatch) {
    prefs.budget = parseInt(budgetMatch[1], 10);
  } else {
    // Word numbers: "eight hundred rupees"
    const words = m.match(/(one|two|three|four|five|six|seven|eight|nine)\s*hundred(?:\s+(?:and\s+)?(fifty|sixty|seventy|eighty|ninety))?\s*(?:rupees|rs|bucks)?/);
    if (words) {
      const base: Record<string, number> = { one: 100, two: 200, three: 300, four: 400, five: 500, six: 600, seven: 700, eight: 800, nine: 900 };
      const tens: Record<string, number> = { fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90 };
      prefs.budget = base[words[1]] + (words[2] ? tens[words[2]] : 0);
    }
  }

  if (/quiet|peaceful|low crowd|less crowded|calm/.test(m)) prefs.crowdPreference = 'Quiet';
  else if (/lively|bustling|vibrant|busy/.test(m)) prefs.crowdPreference = 'Lively';
  else if (/moderate/.test(m)) prefs.crowdPreference = 'Moderate';

  const hourMatch = m.match(/(\d+(?:\.\d+)?)\s*(?:hours?|hrs?)/);
  if (hourMatch) {
    const h = parseFloat(hourMatch[1]);
    prefs.durationPreference = h <= 2 ? '2 hours' : h <= 5 ? '4 hours' : 'Full day';
  } else {
    const wordHours = m.match(/(one|two|three|four|five|six)\s+hours?/);
    if (wordHours) {
      const n: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6 };
      const h = n[wordHours[1]];
      prefs.durationPreference = h <= 2 ? '2 hours' : h <= 5 ? '4 hours' : 'Full day';
    } else if (/full day|whole day/.test(m)) {
      prefs.durationPreference = 'Full day';
    }
  }

  if (/slow/.test(m)) prefs.travelStyle = 'Slow';
  else if (/fast|quick|packed/.test(m)) prefs.travelStyle = 'Fast';
  else if (/balanced/.test(m)) prefs.travelStyle = 'Balanced';

  if (/solo|alone/.test(m)) prefs.groupPreference = 'Solo';
  else if (/group|friends/.test(m)) prefs.groupPreference = '4–5';
  else if (/partner|two of us|couple/.test(m)) prefs.groupPreference = '2–3';

  return prefs;
}

// ---------- Data-grounded answer builders (deterministic) ----------

function prefsToFull(p: Partial<TravellerPreferences>): TravellerPreferences {
  return {
    interests: p.interests ?? ['Heritage'],
    budget: p.budget ?? 800,
    crowdPreference: p.crowdPreference ?? 'Moderate',
    travelStyle: p.travelStyle ?? 'Balanced',
    durationPreference: p.durationPreference ?? '4 hours',
    groupPreference: p.groupPreference ?? '2–3',
    languages: p.languages ?? ['English', 'Hindi'],
  };
}

export interface AskMitraResult {
  reply: string;
  intent: Intent;
  usedGroq: boolean;
  suggestions: { label: string; href: string }[];
  dataUsed: string[];
}

function formatRecommendations(prefs: TravellerPreferences): { text: string; links: AskMitraResult['suggestions'] } {
  const results = recommend({ experiences: EXPERIENCES, places: PLACES, mitras: MITRAS, prefs, limit: 3 });
  if (results.length === 0) {
    return {
      text: "I couldn't find experiences matching those preferences yet. Try widening your budget or crowd preference — or browse all experiences.",
      links: [{ label: 'Browse experiences', href: '/find-my-yatra' }],
    };
  }
  const lines = results.map((r, i) => {
    const price = `₹${r.experience.pricePerPerson}/person`;
    const range = `typical ₹${r.experience.typicalRange.min}–₹${r.experience.typicalRange.max}`;
    return `${i + 1}. ${r.experience.title} — ${r.experience.placeName} · ${r.experience.durationLabel} · ${price} (${range}) · ${r.matchScore}% match`;
  });
  const links = results.slice(0, 3).map((r) => ({
    label: r.experience.title,
    href: `/experiences/${r.experience.id}`,
  }));
  return {
    text: `Here are the closest matches from our experience database:\n\n${lines.join('\n')}\n\nAll prices are indicative (prototype estimates) and every experience is hosted by a local Mitra. Tap a suggestion below to see full details, Trust Passport and Fair Price information.`,
    links,
  };
}

function explainPlace(placeId: string): AskMitraResult | null {
  const place = PLACES.find((p) => p.id === placeId);
  if (!place) return null;
  const exps = EXPERIENCES.filter((e) => e.placeId === place.id);
  const lines = [
    `**${place.name}** (${place.category})`,
    '',
    place.touristExplanation,
    '',
    `**History:** ${place.historicalSummary}`,
    '',
    `**Tourism pressure:** ${place.tourismPressure} (YATRAMITR editorial classification, not an official statistic)`,
    `**Suggested duration:** ${place.recommendedDuration} · **Best time:** ${place.bestTime}`,
    `**Timings/tickets:** ${place.timings ?? 'Check official source for latest information'}`,
  ];
  if (exps.length > 0) {
    lines.push('', `**YATRAMITR experiences here:** ${exps.map((e) => `${e.title} (₹${e.pricePerPerson})`).join(', ')}`);
  }
  const links: AskMitraResult['suggestions'] = [{ label: `Open ${place.name} page`, href: `/places/${place.id}` }];
  if (exps[0]) links.push({ label: exps[0].title, href: `/experiences/${exps[0].id}` });
  return {
    reply: lines.join('\n'),
    intent: 'explain_place',
    usedGroq: false,
    suggestions: links,
    dataUsed: ['places', 'experiences'],
  };
}

function priceAnswer(message: string): AskMitraResult {
  const amountMatch = message.match(/(?:₹|rs\.?\s?)(\d{2,5})/) ?? message.match(/(\d{2,5})\s*(?:rupees|rs|₹)/);
  const quoted = amountMatch ? parseInt(amountMatch[1], 10) : 600;
  const hourMatch = message.match(/(\d+(?:\.\d+)?)\s*(?:hours?|hrs?)/);
  const hours = hourMatch ? parseFloat(hourMatch[1]) : 3;
  // Note: word-number forms ("eight hundred rupees") are handled by the
  // find-experience path's extractPreferences; this price-check path
  // defaults to 600 when no digit amount is present.
  const includesTransport = /transport|car|cab|vehicle|pickup/.test(message.toLowerCase());
  const includesFood = /food|meal|tasting|lunch|dinner/.test(message.toLowerCase());
  const includesEntryTickets = /entry|ticket/.test(message.toLowerCase());

  const result = checkPrice({ service: 'Local guiding experience', location: 'Hyderabad', quotedPrice: quoted, hours, includesTransport, includesFood, includesEntryTickets });
  return {
    reply: [
      `**Price check: ₹${result.quotedPrice}**`,
      '',
      `**Status: ${result.statusLabel}**`,
      `Typical indicative range: ₹${result.typicalRange.min}–₹${result.typicalRange.max} (${hours} hours${includesTransport ? ', with transport' : ''}${includesFood ? ', with food' : ''})`,
      '',
      result.explanation,
      result.considerations.length > 0 ? `\n**Worth checking before you decide:**\n${result.considerations.map((c) => `• ${c}`).join('\n')}` : '',
      '',
      `_${result.dataNote}_`,
    ].filter(Boolean).join('\n'),
    intent: 'check_price',
    usedGroq: false,
    suggestions: [{ label: 'Open the full Price Checker', href: '/price-check' }],
    dataUsed: ['price model'],
  };
}

function safetyAnswer(): AskMitraResult {
  return {
    reply: [
      '**Safety first — here is what matters right now:**',
      '',
      '**Emergency services (India-wide): 112** (police, fire, medical)',
      '**Ambulance: 108**',
      '',
      '**On an active YATRAMITR trip:**',
      '• Open Live Trip Mode → the EMERGENCY button is always visible there',
      '• It can call emergency services, share your location, and contact your Mitra or a trusted contact',
      '• Your Mitra is trained to escalate locally and stays with the group',
      '',
      '**General precautions in Hyderabad:**',
      '• Keep valuables secure in crowded bazaars',
      '• Use prepaid/ride-hailing transport at night',
      '• Stay with your group; share your itinerary with someone you trust',
      '',
      'These are static platform answers and do not depend on AI.',
    ].join('\n'),
    intent: 'safety_help',
    usedGroq: false,
    suggestions: [{ label: 'Open Live Trip safety tools', href: '/trip' }],
    dataUsed: ['static safety information'],
  };
}

function bookingAnswer(): AskMitraResult {
  return {
    reply: [
      'For bookings, your dashboard is the source of truth:',
      '',
      '• **My Yatra** lists every booking with its status (booking request confirmed → active → completed)',
      '• Bookings with upcoming dates show **Enter Live Trip**',
      '• Completed bookings unlock **verified reviews** and your **Yatra Impact** summary',
      '',
      'A booking here is a **booking request** — the MVP has no payment gateway, so nothing is charged.',
    ].join('\n'),
    intent: 'booking_help',
    usedGroq: false,
    suggestions: [{ label: 'Open My Yatra', href: '/dashboard' }],
    dataUsed: ['booking workflow'],
  };
}

function mitraAnswer(prefs: TravellerPreferences): AskMitraResult {
  const rec = recommend({ experiences: EXPERIENCES, places: PLACES, mitras: MITRAS, prefs, limit: 1 })[0];
  const lines = [
    'Our Mitras are demo profiles for this MVP build (clearly labelled DEMO), but matching is real:',
    '',
  ];
  if (rec?.mitra) {
    lines.push(
      `**${rec.mitra.name}** — ${rec.mitra.location}`,
      rec.mitra.bio,
      '',
      `**Languages:** ${rec.mitra.languages.join(', ')}`,
      `**Specialities:** ${rec.mitra.specialities.join(', ')}`,
      `**Trust Score:** ${rec.mitra.trustScore}/100 (transparent workflow-based score — see the Trust Passport page)`
    );
  }
  lines.push('', 'Matching uses language overlap, shared interests, category specialisation and availability — deterministic, not AI-generated.');
  return {
    reply: lines.join('\n'),
    intent: 'find_mitra',
    usedGroq: false,
    suggestions: [
      rec?.mitra ? { label: `View ${rec.mitra.name}'s profile`, href: `/mitras/${rec.mitra.id}` } : { label: 'Browse Mitras', href: '/mitras' },
      { label: 'How trust works', href: '/how-it-works' },
    ],
    dataUsed: ['mitras', 'recommendation engine'],
  };
}

function generalAnswer(): AskMitraResult {
  return {
    reply: [
      'Namaste! I\'m **Ask Mitra** — your guide to YATRAMITR. I can:',
      '',
      '• **Find an experience** — "I have ₹800 and four hours and like history"',
      '• **Build my Yatra** — a personalised plan from our actual database',
      '• **Check a price** — "Is ₹900 fair for a 4-hour walk?"',
      '• **Find a Mitra** — matched by language, interests and availability',
      '• **Explain a place** — "Tell me about Charminar" or "What is Ramappa?"',
      '• **Safety help** — static, verified emergency information',
      '• **Booking help** — manage your existing bookings',
      '',
      'Everything I tell you comes from the platform\u2019s own Hyderabad database — I don\u2019t invent places, prices or facts.',
    ].join('\n'),
    intent: 'general',
    usedGroq: false,
    suggestions: [
      { label: 'Find My Yatra', href: '/find-my-yatra' },
      { label: 'Explore the map', href: '/explore' },
      { label: 'Price Checker', href: '/price-check' },
    ],
    dataUsed: [],
  };
}

// ---------- Groq narration (optional polish layer) ----------

async function groqNarrate(systemContext: string, userMessage: string, _dataAnswer: string): Promise<string | null> {
  if (!groq) return null;
  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      temperature: 0.4,
      max_tokens: 500,
      messages: [
        {
          role: 'system',
          content:
            'You are "Ask Mitra", the assistant of YATRAMITR, a responsible-tourism platform for Hyderabad, India. ' +
            'You are given VERIFIED PLATFORM DATA as context. Answer using ONLY that data. ' +
            'If the answer is not in the data, say you don\u2019t have that information and suggest checking the official Telangana Tourism website. ' +
            'Never invent places, prices, timings, statistics, reviews or verification claims. ' +
            'Keep answers concise (max 150 words), warm and practical. Use markdown sparingly.\n\n' +
            'PLATFORM DATA:\n' +
            systemContext,
        },
        { role: 'user', content: userMessage },
      ],
    });
    const text = completion.choices[0]?.message?.content?.trim();
    return text && text.length > 10 ? text : null;
  } catch (err) {
    console.warn('[AskMitra Groq Fallback]:', err instanceof Error ? err.message : err);
    return null;
  }
}

function buildSystemContext(intent: Intent, prefs: TravellerPreferences): string {
  const parts: string[] = [];
  const recs = recommend({ experiences: EXPERIENCES, places: PLACES, mitras: MITRAS, prefs, limit: 3 });
  if (recs.length > 0) {
    parts.push(
      'Top matching experiences:\n' +
        recs
          .map(
            (r) =>
              `- ${r.experience.title} at ${r.experience.placeName}: ${r.experience.durationLabel}, ₹${r.experience.pricePerPerson}/person (indicative), max ${r.experience.groupCap} people, Mitra ${r.mitra?.name ?? 'TBD'}, match ${r.matchScore}%`
          )
          .join('\n')
    );
  }
  if (intent === 'explain_place' || intent === 'explain_history') {
    parts.push(
      'Available places: ' + PLACES.map((p) => `${p.name} (${p.category})`).join('; ')
    );
  }
  if (intent === 'find_mitra') {
    parts.push('Available Mitras: ' + MITRAS.map((m) => `${m.name} — ${m.specialities.join('/')}`).join('; '));
  }
  parts.push('Note: all platform prices are indicative prototype estimates, not researched market data.');
  return parts.join('\n\n');
}

// ---------- Main entry ----------

export async function askMitra(message: string): Promise<AskMitraResult> {
  const intent = detectIntent(message);

  if (intent === 'safety_help') return safetyAnswer();
  if (intent === 'booking_help') return bookingAnswer();

  if (intent === 'check_price') {
    const base = priceAnswer(message);
    const narrated = await groqNarrate('Price comparison result for a Hyderabad experience.', message, base.reply);
    return narrated ? { ...base, reply: narrated, usedGroq: true } : base;
  }

  const prefsPartial = extractPreferences(message);

  if (intent === 'explain_place' || intent === 'explain_history') {
    for (const [word, placeId] of Object.entries(PLACE_WORDS)) {
      if (message.toLowerCase().includes(word)) {
        const base = explainPlace(placeId);
        if (base) {
          const narrated = await groqNarrate(
            `Information about ${base.reply.slice(0, 600)}`,
            message,
            base.reply
          );
          return narrated ? { ...base, reply: narrated, usedGroq: true } : base;
        }
      }
    }
    return {
      reply:
        'I don\u2019t have verified information about that place yet — and I won\u2019t guess. I currently cover 24 places across Hyderabad and Telangana. Try asking about Charminar, Golconda Fort, Ramappa Temple or Chowmahalla Palace, or browse them all on the map.',
      intent,
      usedGroq: false,
      suggestions: [{ label: 'Explore all 24 places', href: '/explore' }],
      dataUsed: ['places'],
    };
  }

  if (intent === 'find_mitra') {
    const base = mitraAnswer(prefsToFull(prefsPartial));
    return base;
  }

  if (intent === 'find_experience' || intent === 'build_yatra') {
    const prefs = prefsToFull(prefsPartial);
    const base = formatRecommendations(prefs);
    const sysCtx = buildSystemContext(intent, prefs);
    const narrated = await groqNarrate(sysCtx, message, base.text);
    return {
      reply: narrated ?? base.text,
      intent,
      usedGroq: Boolean(narrated),
      suggestions: base.links,
      dataUsed: ['experiences', 'places', 'mitras', 'recommendation engine'],
    };
  }

  // general
  const general = generalAnswer();
  const narrated = await groqNarrate(buildSystemContext('general', prefsToFull(prefsPartial)), message, general.reply);
  return narrated ? { ...general, reply: narrated, usedGroq: true } : general;
}

// ---------- AI itinerary (Groq narration over real data) ----------

export async function buildItinerary(prefs: TravellerPreferences): Promise<{
  items: { time: string; title: string; detail: string }[];
  narration: string | null;
  usedGroq: boolean;
}> {
  const recs = recommend({ experiences: EXPERIENCES, places: PLACES, mitras: MITRAS, prefs, limit: 3 });
  const items: { time: string; title: string; detail: string }[] = [];
  let clock = 9 * 60; // 09:00
  for (const r of recs) {
    const dur = Math.min(r.experience.durationHours, 3.5) * 60;
    const time = `${String(Math.floor(clock / 60)).padStart(2, '0')}:${String(clock % 60).padStart(2, '0')}`;
    items.push({
      time,
      title: r.experience.title,
      detail: `${r.experience.placeName} · ${r.mitra?.name ?? 'Mitra TBD'} · ₹${r.experience.pricePerPerson}/person`,
    });
    clock += Math.round(dur) + 45; // + travel buffer
  }
  const planText = items.map((i) => `${i.time} — ${i.title} (${i.detail})`).join('\n');
  const narrated = await groqNarrate(
    'A day plan built ONLY from these real platform experiences:',
    `Write a 3-4 sentence friendly intro for this Hyderabad day plan and one practical closing tip. Plan:\n${planText}`,
    planText
  );
  return { items, narration: narrated, usedGroq: Boolean(narrated) };
}
