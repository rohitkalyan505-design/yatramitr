'use client';

// ============================================================
// FIND MY YATRA — traveller preference onboarding
// Preferences -> deterministic recommendation engine -> match
// score + explanation. Authenticated users get preferences
// persisted (Firestore or local fallback).
// ============================================================

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Compass, ArrowRight, ArrowLeft, Check, Sparkles, Clock, Users,
  IndianRupee, MapPin, Heart, ShieldCheck, Save,
} from 'lucide-react';
import { INTERESTS, type Interest, type TravellerPreferences, type RecommendationResult, type CrowdPreference, type TravelStyle, type DurationPreference, type GroupPreference } from '@/types';
import { useAuth } from '@/lib/auth-context';
import { saveTravellerPreferences, loadTravellerPreferences } from '@/lib/data-service';
import { cn, formatCurrency } from '@/lib/utils';
import DemoBadge from '@/components/ui/DemoBadge';

const BUDGETS = [500, 800, 1200];
const CROWDS: { value: CrowdPreference; label: string; detail: string }[] = [
  { value: 'Quiet', label: 'Quiet', detail: 'Fewer people, calmer spaces' },
  { value: 'Moderate', label: 'Moderate', detail: 'Balanced energy' },
  { value: 'Lively', label: 'Lively', detail: 'Buzz and crowds welcome' },
];
const STYLES: { value: TravelStyle; label: string; detail: string }[] = [
  { value: 'Slow', label: 'Slow', detail: 'Linger, soak it in' },
  { value: 'Balanced', label: 'Balanced', detail: 'A bit of everything' },
  { value: 'Fast', label: 'Fast', detail: 'Cover more ground' },
];
const DURATIONS: { value: DurationPreference }[] = [
  { value: '2 hours' }, { value: '4 hours' }, { value: 'Full day' },
];
const GROUPS: { value: GroupPreference }[] = [
  { value: 'Solo' }, { value: '2–3' }, { value: '4–5' },
];
const LANGS = ['English', 'Hindi', 'Telugu', 'Urdu', 'Tamil', 'Kannada'];

const DEFAULT_PREFS: TravellerPreferences = {
  interests: [],
  budget: 800,
  crowdPreference: 'Moderate',
  travelStyle: 'Balanced',
  durationPreference: '4 hours',
  groupPreference: '2–3',
  languages: ['English'],
};

export default function FindMyYatraPage() {
  const router = useRouter();
  const { user, isDemoSession } = useAuth();
  const [step, setStep] = useState(1);
  const [prefs, setPrefs] = useState<TravellerPreferences>(DEFAULT_PREFS);
  const [results, setResults] = useState<RecommendationResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Load saved preferences for logged-in users
  useEffect(() => {
    if (user) {
      loadTravellerPreferences(user.id).then((p) => {
        if (p) setPrefs({ ...DEFAULT_PREFS, ...p });
      });
    }
  }, [user]);

  const toggleInterest = (i: Interest) => {
    setPrefs((p) => ({
      ...p,
      interests: p.interests.includes(i) ? p.interests.filter((x) => x !== i) : [...p.interests, i],
    }));
  };

  const toggleLang = (l: string) => {
    setPrefs((p) => ({
      ...p,
      languages: p.languages.includes(l) ? p.languages.filter((x) => x !== l) : [...p.languages, l],
    }));
  };

  const submit = async () => {
    if (prefs.interests.length === 0) {
      setStep(1);
      return;
    }
    setLoading(true);
    try {
      // Persist for authenticated users
      if (user) {
        await saveTravellerPreferences(user.id, prefs);
        setSaved(true);
      }
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferences: prefs, limit: 4 }),
      });
      const data = await res.json();
      setResults(data.results ?? []);
      setStep(3);
    } catch {
      setResults([]);
      setStep(3);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-10">
      {/* Header */}
      <div className="space-y-3 max-w-3xl">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-terracotta-600">
          <Compass className="w-3.5 h-3.5" />
          <span>Find My Yatra</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-forest-950">
          Tell us how you travel.
        </h1>
        <p className="text-sm sm:text-base text-charcoal-700 leading-relaxed">
          A few quick preferences and our deterministic matching engine (no black-box AI in the scoring)
          will pair you with real Hyderabad experiences, Mitras and fair prices.
        </p>
        {isDemoSession && (
          <div className="inline-flex items-center gap-2 text-xs text-[#80311F]">
            <DemoBadge label="Demo session" /> Preferences stay in this browser only.
          </div>
        )}
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 text-xs">
        {['Interests', 'Preferences', 'Your matches'].map((label, i) => (
          <React.Fragment key={label}>
            {i > 0 && <span className="text-[#1D2521]/40">→</span>}
            <span
              className={cn(
                'px-3 py-1.5 rounded-full font-semibold',
                step === i + 1 ? 'bg-[#16352A] text-[#F5F1E8]' : step > i + 1 ? 'bg-forest-50 text-forest-700' : 'bg-[#F5F1E8] text-[#1D2521]/60'
              )}
            >
              {i + 1}. {label}
            </span>
          </React.Fragment>
        ))}
      </div>

      {/* STEP 1: Interests */}
      {step === 1 && (
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E8DFCF] shadow-sm space-y-6">
          <h2 className="font-serif text-2xl font-bold text-[#0D211A]">What pulls you in?</h2>
          <div className="flex flex-wrap gap-3">
            {INTERESTS.map((i) => {
              const active = prefs.interests.includes(i);
              return (
                <button
                  key={i}
                  onClick={() => toggleInterest(i)}
                  className={cn(
                    'px-5 py-3 rounded-xl border text-sm font-semibold transition-all',
                    active
                      ? 'bg-[#16352A] text-[#F5F1E8] border-[#16352A] shadow-sm scale-[1.02]'
                      : 'bg-[#FAF8F5] text-[#1D2521] border-[#E8DFCF] hover:border-[#B8955A]'
                  )}
                >
                  {active && <Check className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />}
                  {i}
                </button>
              );
            })}
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => setStep(2)}
              disabled={prefs.interests.length === 0}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-[#16352A] hover:bg-[#0D211A] text-[#F5F1E8] text-sm font-bold transition-colors disabled:opacity-40"
            >
              Next: Preferences <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Preferences */}
      {step === 2 && (
        <div className="space-y-6">
          {/* Budget */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E8DFCF] shadow-sm space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#0D211A] flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-[#B86B4B]" /> Budget per experience
            </h3>
            <div className="flex flex-wrap gap-3">
              {BUDGETS.map((b) => (
                <button
                  key={b}
                  onClick={() => setPrefs((p) => ({ ...p, budget: b }))}
                  className={cn(
                    'px-5 py-2.5 rounded-xl border text-sm font-bold transition-all',
                    prefs.budget === b ? 'bg-[#16352A] text-[#F5F1E8] border-[#16352A]' : 'bg-[#FAF8F5] border-[#E8DFCF] hover:border-[#B8955A]'
                  )}
                >
                  ₹{b}{b === 1200 ? '+' : ''}
                </button>
              ))}
              <input
                type="number"
                min={200}
                max={5000}
                value={prefs.budget}
                onChange={(e) => setPrefs((p) => ({ ...p, budget: Number(e.target.value) || 500 }))}
                className="w-28 px-4 py-2.5 rounded-xl border border-[#E8DFCF] text-sm font-semibold focus:outline-none focus:border-[#16352A]"
                aria-label="Custom budget"
              />
            </div>
          </div>

          {/* Crowd + Style */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-[#E8DFCF] shadow-sm space-y-3">
              <h3 className="font-serif text-lg font-bold text-[#0D211A]">Crowd preference</h3>
              {CROWDS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setPrefs((p) => ({ ...p, crowdPreference: c.value }))}
                  className={cn(
                    'w-full text-left px-4 py-3 rounded-xl border transition-all',
                    prefs.crowdPreference === c.value ? 'border-[#16352A] bg-forest-50' : 'border-[#E8DFCF] hover:border-[#B8955A]'
                  )}
                >
                  <p className="text-sm font-bold text-[#0D211A]">{c.label}</p>
                  <p className="text-[11px] text-[#1D2521]/60">{c.detail}</p>
                </button>
              ))}
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#E8DFCF] shadow-sm space-y-3">
              <h3 className="font-serif text-lg font-bold text-[#0D211A]">Travel style</h3>
              {STYLES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setPrefs((p) => ({ ...p, travelStyle: s.value }))}
                  className={cn(
                    'w-full text-left px-4 py-3 rounded-xl border transition-all',
                    prefs.travelStyle === s.value ? 'border-[#16352A] bg-forest-50' : 'border-[#E8DFCF] hover:border-[#B8955A]'
                  )}
                >
                  <p className="text-sm font-bold text-[#0D211A]">{s.label}</p>
                  <p className="text-[11px] text-[#1D2521]/60">{s.detail}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Duration + Group */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-[#E8DFCF] shadow-sm space-y-3">
              <h3 className="font-serif text-lg font-bold text-[#0D211A] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#B86B4B]" /> Duration
              </h3>
              <div className="flex flex-wrap gap-2">
                {DURATIONS.map((d) => (
                  <button
                    key={d.value}
                    onClick={() => setPrefs((p) => ({ ...p, durationPreference: d.value }))}
                    className={cn(
                      'px-4 py-2 rounded-lg border text-xs font-bold transition-all',
                      prefs.durationPreference === d.value ? 'bg-[#16352A] text-[#F5F1E8] border-[#16352A]' : 'border-[#E8DFCF] hover:border-[#B8955A]'
                    )}
                  >
                    {d.value}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#E8DFCF] shadow-sm space-y-3">
              <h3 className="font-serif text-lg font-bold text-[#0D211A] flex items-center gap-2">
                <Users className="w-4 h-4 text-[#B86B4B]" /> Group
              </h3>
              <div className="flex flex-wrap gap-2">
                {GROUPS.map((g) => (
                  <button
                    key={g.value}
                    onClick={() => setPrefs((p) => ({ ...p, groupPreference: g.value }))}
                    className={cn(
                      'px-4 py-2 rounded-lg border text-xs font-bold transition-all',
                      prefs.groupPreference === g.value ? 'bg-[#16352A] text-[#F5F1E8] border-[#16352A]' : 'border-[#E8DFCF] hover:border-[#B8955A]'
                    )}
                  >
                    {g.value}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Languages */}
          <div className="p-6 rounded-2xl bg-white border border-[#E8DFCF] shadow-sm space-y-3">
            <h3 className="font-serif text-lg font-bold text-[#0D211A]">Languages you&apos;re comfortable with</h3>
            <div className="flex flex-wrap gap-2">
              {LANGS.map((l) => (
                <button
                  key={l}
                  onClick={() => toggleLang(l)}
                  className={cn(
                    'px-4 py-2 rounded-lg border text-xs font-bold transition-all',
                    prefs.languages.includes(l) ? 'bg-[#16352A] text-[#F5F1E8] border-[#16352A]' : 'border-[#E8DFCF] hover:border-[#B8955A]'
                  )}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button onClick={() => setStep(1)} className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#0D211A] hover:underline">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to interests
            </button>
            <button
              onClick={submit}
              disabled={loading}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-md bg-[#16352A] hover:bg-[#0D211A] text-[#F5F1E8] text-sm font-bold shadow transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-[#DFB86C] border-t-transparent rounded-full animate-spin" />
                  <span>Matching…</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#DFB86C]" />
                  <span>Show my matches</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Results */}
      {step === 3 && results && (
        <div className="space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-serif text-2xl font-bold text-[#0D211A]">
              {results.length > 0 ? 'Your matched Yatras' : 'No matches yet'}
            </h2>
            {saved && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest-700">
                <Save className="w-3.5 h-3.5" /> Preferences saved
              </span>
            )}
          </div>

          {results.length === 0 ? (
            <div className="p-10 rounded-2xl bg-white border border-[#E8DFCF] text-center space-y-3">
              <p className="font-serif text-xl font-bold text-[#0D211A]">No experiences match these preferences.</p>
              <p className="text-sm text-[#1D2521]/70">Try expanding your budget or crowd preference.</p>
              <button onClick={() => setStep(2)} className="text-sm font-bold text-[#16352A] hover:underline">
                Adjust preferences
              </button>
            </div>
          ) : (
            results.map((r) => (
              <div key={r.experience.id} className="rounded-2xl bg-white border border-[#E8DFCF] shadow-sm overflow-hidden">
                <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Score */}
                  <div className="lg:col-span-3 flex flex-col items-center justify-center text-center space-y-2 border-b lg:border-b-0 lg:border-r border-[#E8DFCF] pb-6 lg:pb-0">
                    <div className="relative w-24 h-24">
                      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                        <circle cx="50" cy="50" r="42" fill="none" stroke="#E8DFCF" strokeWidth="10" />
                        <circle
                          cx="50" cy="50" r="42" fill="none" stroke="#16352A" strokeWidth="10"
                          strokeLinecap="round"
                          strokeDasharray={`${(r.matchScore / 100) * 264} 264`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-serif text-2xl font-extrabold text-[#16352A]">{r.matchScore}%</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#1D2521]/60">Match score</span>
                    <span className="text-[10px] text-[#1D2521]/50">
                      Deterministic engine · weights: interests 30 · budget 20 · crowd 15 · duration 15 · style 10 · group 10
                    </span>
                  </div>

                  {/* Details */}
                  <div className="lg:col-span-9 space-y-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#B86B4B]">
                          {r.experience.placeName} · {r.experience.category}
                        </span>
                        <h3 className="font-serif text-2xl font-bold text-[#0D211A]">{r.experience.title}</h3>
                      </div>
                      <div className="text-right">
                        <p className="font-serif text-xl font-bold text-[#16352A]">{formatCurrency(r.experience.pricePerPerson)}</p>
                        <p className="text-[10px] text-[#1D2521]/60">typical ₹{r.experience.typicalRange.min}–₹{r.experience.typicalRange.max}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 text-xs text-[#1D2521]/70">
                      <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {r.experience.durationLabel}</span>
                      <span className="inline-flex items-center gap-1"><Users className="w-3.5 h-3.5" /> Max {r.experience.groupCap}</span>
                      <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {r.experience.meetingPoint}</span>
                    </div>

                    {/* Why this matches you */}
                    <div className="p-4 rounded-xl bg-forest-50 border border-forest-200/80 space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-forest-900 flex items-center gap-1.5">
                        <Heart className="w-3.5 h-3.5" /> Why this matches you
                      </span>
                      <ul className="space-y-1">
                        {r.reasons.map((reason, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-forest-950">
                            <Check className="w-3.5 h-3.5 text-forest-700 shrink-0 mt-0.5" />
                            <span><strong>{reason.criterion}:</strong> {reason.detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Mitra */}
                    {r.mitra && (
                      <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-[#F5F1E8] border border-[#E8DFCF]">
                        <div className="flex items-center gap-3">
                          <ShieldCheck className="w-4 h-4 text-[#16352A]" />
                          <div>
                            <p className="text-xs font-bold text-[#0D211A]">
                              With {r.mitra.name} {r.mitra.isDemo && <DemoBadge />}
                            </p>
                            <p className="text-[11px] text-[#1D2521]/60">Trust Score {r.mitra.trustScore}/100 · {r.mitra.location}</p>
                          </div>
                        </div>
                        <Link href={`/mitras/${r.mitra.id}`} className="text-[11px] font-bold text-[#16352A] hover:underline whitespace-nowrap">
                          Trust Passport →
                        </Link>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 pt-1">
                      <Link
                        href={`/experiences/${r.experience.id}`}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-[#16352A] hover:bg-[#0D211A] text-[#F5F1E8] text-xs font-bold transition-colors"
                      >
                        View experience & book <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href={`/places/${r.experience.placeId}`}
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-md border border-[#16352A]/30 text-[#0D211A] text-xs font-semibold hover:bg-[#F5F1E8] transition-colors"
                      >
                        Place details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

          <div className="text-center">
            <button onClick={() => setStep(2)} className="text-sm font-bold text-[#16352A] hover:underline">
              ← Adjust preferences and re-match
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
