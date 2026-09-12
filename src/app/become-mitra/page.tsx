'use client';

// ============================================================
// BECOME A MITRA — onboarding flow
// Basic profile → Languages → Local expertise → Experience
// category → Availability → Verification workflow → Submitted.
// Persisted to mitraVerifications via the data service.
// ============================================================

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Compass, ArrowRight, ArrowLeft, CheckCircle2, Loader2, ShieldCheck, Info,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { saveMitraApplication } from '@/lib/data-service';
import { PLACE_CATEGORIES, type PlaceCategory } from '@/types';
import { cn } from '@/lib/utils';

const LANGS = ['Telugu', 'Hindi', 'English', 'Urdu', 'Tamil', 'Kannada', 'Marathi'];
const AREAS = [
  'Old City (Charminar)',
  'Golconda & west Hyderabad',
  'Secunderabad',
  'HITEC City / Madhapur',
  'Warangal region',
  'Other Telangana',
];
const AVAILABILITY = ['Morning', 'Afternoon', 'Evening', 'Weekends only'];
const STEPS = ['Profile', 'Languages', 'Expertise', 'Availability', 'Submit'];

export default function BecomeMitraPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [name, setName] = useState(user?.name ?? '');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [languages, setLanguages] = useState<string[]>([]);
  const [area, setArea] = useState('');
  const [categories, setCategories] = useState<PlaceCategory[]>([]);
  const [speciality, setSpeciality] = useState('');
  const [availability, setAvailability] = useState<string[]>([]);
  const [referenceContact, setReferenceContact] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggle = <T,>(arr: T[], v: T, set: (x: T[]) => void) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const submit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        userId: user?.id ?? 'demo-user-local',
        name,
        location,
        bio,
        languages,
        guidingArea: area,
        experienceCategories: categories,
        speciality,
        availability,
        referenceContact: referenceContact ? 'provided' : 'not provided',
        isDemoSubmission: !user,
      };
      await fetch('/api/mitras', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => {});
      await saveMitraApplication(payload);
      setSubmitted(true);
    } catch {
      setError('Submission failed — please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls =
    'w-full p-3 rounded-xl bg-white border border-sand-300 text-charcoal-800 text-sm font-medium focus:outline-none focus:border-forest-800';

  if (submitted) {
    return (
      <div className="min-h-screen bg-page-become-mitra pt-28 pb-24">
        <div className="max-w-2xl mx-auto px-4 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-forest-50 text-forest-700 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-forest-950">Application submitted</h1>
        <p className="text-sm text-charcoal-700 leading-relaxed max-w-lg mx-auto">
          Thank you, {name.split(' ')[0] || 'Mitra'}. Your application is in the verification workflow:
        </p>
        <div className="p-6 rounded-2xl bg-white border border-[#E8DFCF] text-left space-y-3 max-w-lg mx-auto">
          {[
            ['Identity verification', 'Pending'],
            ['Local residency confirmation', 'Pending'],
            ['Local knowledge assessment', 'Pending'],
            ['Safety orientation', 'Not started'],
            ['Community references', 'Not started'],
          ].map(([stepName, status]) => (
            <div key={stepName} className="flex items-center justify-between text-xs">
              <span className="font-semibold text-forest-950">{stepName}</span>
              <span className={cn(
                'px-2.5 py-1 rounded-full font-bold',
                status === 'Pending' ? 'bg-gold-100 text-gold-700' : 'bg-sand-100 text-charcoal-700'
              )}>
                {status}
              </span>
            </div>
          ))}
        </div>
        <div className="p-4 rounded-xl bg-terracotta-50 border border-terracotta-200 text-[11px] text-terracotta-700 max-w-lg mx-auto text-left">
          <strong>Transparency:</strong> this is the prototype verification workflow. It does not constitute
          government verification. Statuses update as each step is completed by the (future) verification team.
        </div>
        <button
          onClick={() => router.push('/')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-forest-900 text-[#F5F1E8] text-sm font-bold hover:bg-forest-800 transition-colors"
        >
          Back to home <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
    );
  }

  return (
    <div className="min-h-screen bg-page-become-mitra">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24 space-y-8">
        <div className="space-y-3 relative bg-motif-arch">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-terracotta-600">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Community stewardship</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest-950">Become a Local Mitra</h1>
          <p className="text-sm text-charcoal-700 leading-relaxed max-w-2xl">
            Share your neighbourhood&apos;s stories, craft and food with travellers — and direct tourism spending
            into your community. Five verification steps keep the platform trustworthy.
          </p>
        </div>

      {/* Step indicator */}
      <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
        {STEPS.map((label, i) => (
          <React.Fragment key={label}>
            {i > 0 && <span className="text-[#1D2521]/40">→</span>}
            <span className={cn(
              'px-2.5 py-1 rounded-full font-semibold',
              step === i + 1 ? 'bg-forest-900 text-[#F5F1E8]' : step > i + 1 ? 'bg-forest-50 text-forest-700' : 'bg-sand-100 text-charcoal-700'
            )}>
              {i + 1}. {label}
            </span>
          </React.Fragment>
        ))}
      </div>

      {/* STEP 1: Profile */}
      {step === 1 && (
        <div className="p-6 sm:p-8 rounded-2xl bg-sand-100 border border-sand-300 space-y-5">
          <h2 className="font-serif text-xl font-bold text-forest-950">Basic profile</h2>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" className={inputCls} />
          <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Your neighbourhood (e.g., Old City, Hyderabad)" className={inputCls} />
          <textarea rows={3} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell travellers who you are and what you love showing people…" className={inputCls} />
          <div className="flex justify-end">
            <button
              onClick={() => setStep(2)}
              disabled={!name || !location}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md bg-forest-900 hover:bg-forest-800 text-[#F5F1E8] text-xs font-bold transition-colors disabled:opacity-40"
            >
              Next <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Languages */}
      {step === 2 && (
        <div className="p-6 sm:p-8 rounded-2xl bg-sand-100 border border-sand-300 space-y-5">
          <h2 className="font-serif text-xl font-bold text-forest-950">Languages you guide in</h2>
          <div className="flex flex-wrap gap-2">
            {LANGS.map((l) => (
              <button
                key={l}
                onClick={() => toggle(languages, l, setLanguages)}
                className={cn(
                  'px-4 py-2 rounded-lg border text-xs font-bold transition-all',
                  languages.includes(l) ? 'bg-forest-900 text-[#F5F1E8] border-forest-900' : 'bg-white border-sand-300 hover:border-forest-800'
                )}
              >
                {l}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <button onClick={() => setStep(1)} className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-forest-950 hover:underline">
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={languages.length === 0}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md bg-forest-900 hover:bg-forest-800 text-[#F5F1E8] text-xs font-bold transition-colors disabled:opacity-40"
            >
              Next <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Expertise */}
      {step === 3 && (
        <div className="p-6 sm:p-8 rounded-2xl bg-sand-100 border border-sand-300 space-y-5">
          <h2 className="font-serif text-xl font-bold text-forest-950">Local expertise</h2>
          <div>
            <label className="text-[10px] uppercase font-bold tracking-wider text-charcoal-700 block mb-2">Guiding area</label>
            <select value={area} onChange={(e) => setArea(e.target.value)} className={inputCls}>
              <option value="">Select your area…</option>
              {AREAS.map((a) => <option key={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold tracking-wider text-charcoal-700 block mb-2">Experience categories</label>
            <div className="flex flex-wrap gap-2">
              {PLACE_CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => toggle(categories, c, setCategories)}
                  className={cn(
                    'px-3 py-2 rounded-lg border text-[11px] font-semibold transition-all text-left',
                    categories.includes(c) ? 'bg-forest-900 text-[#F5F1E8] border-forest-900' : 'bg-white border-sand-300 hover:border-forest-800'
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <input value={speciality} onChange={(e) => setSpeciality(e.target.value)} placeholder="Your speciality (e.g., Old City food stories, Qutb Shahi architecture)" className={inputCls} />
          <div className="flex items-center justify-between">
            <button onClick={() => setStep(2)} className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-forest-950 hover:underline">
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <button
              onClick={() => setStep(4)}
              disabled={!area || categories.length === 0}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md bg-forest-900 hover:bg-forest-800 text-[#F5F1E8] text-xs font-bold transition-colors disabled:opacity-40"
            >
              Next <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Availability + reference */}
      {step === 4 && (
        <div className="p-6 sm:p-8 rounded-2xl bg-sand-100 border border-sand-300 space-y-5">
          <h2 className="font-serif text-xl font-bold text-forest-950">Availability & reference</h2>
          <div>
            <label className="text-[10px] uppercase font-bold tracking-wider text-charcoal-700 block mb-2">When can you guide?</label>
            <div className="flex flex-wrap gap-2">
              {AVAILABILITY.map((a) => (
                <button
                  key={a}
                  onClick={() => toggle(availability, a, setAvailability)}
                  className={cn(
                    'px-4 py-2 rounded-lg border text-xs font-bold transition-all',
                    availability.includes(a) ? 'bg-forest-900 text-[#F5F1E8] border-forest-900' : 'bg-white border-sand-300 hover:border-forest-800'
                  )}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
          <input
            value={referenceContact}
            onChange={(e) => setReferenceContact(e.target.value)}
            placeholder="A community reference we could contact (name & context)"
            className={inputCls}
          />
          <p className="text-[11px] text-charcoal-600 flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 text-terracotta-600 shrink-0 mt-0.5" />
            References are contacted only during verification, with your consent. In this MVP build, submissions
            are recorded for the prototype workflow.
          </p>
          <div className="flex items-center justify-between">
            <button onClick={() => setStep(3)} className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-forest-950 hover:underline">
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <button
              onClick={() => setStep(5)}
              disabled={availability.length === 0}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md bg-forest-900 hover:bg-forest-800 text-[#F5F1E8] text-xs font-bold transition-colors disabled:opacity-40"
            >
              Review & submit <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Submit */}
      {step === 5 && (
        <div className="p-6 sm:p-8 rounded-2xl bg-sand-100 border border-sand-300 space-y-5">
          <h2 className="font-serif text-xl font-bold text-forest-950">Review your application</h2>
          <div className="p-4 rounded-xl bg-white border border-sand-300 space-y-2 text-xs">
            <p><strong>Name:</strong> {name}</p>
            <p><strong>Location:</strong> {location}</p>
            <p><strong>Languages:</strong> {languages.join(', ')}</p>
            <p><strong>Guiding area:</strong> {area}</p>
            <p><strong>Categories:</strong> {categories.join(', ')}</p>
            <p><strong>Speciality:</strong> {speciality || '—'}</p>
            <p><strong>Availability:</strong> {availability.join(', ')}</p>
            <p><strong>Reference:</strong> {referenceContact ? 'Provided' : 'Not provided'}</p>
          </div>

          <div className="p-4 rounded-xl bg-forest-50 border border-forest-200 text-[11px] text-forest-950 space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> What happens next
            </p>
            <p>Your application enters the five-step verification workflow: identity, residency, knowledge, safety, references. You&apos;ll be able to track each status — nothing is auto-approved.</p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-terracotta-50 border border-terracotta-200 text-xs text-terracotta-700">{error}</div>
          )}

          <div className="flex items-center justify-between">
            <button onClick={() => setStep(4)} className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-forest-950 hover:underline">
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <button
              onClick={submit}
              disabled={submitting}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-md bg-forest-900 hover:bg-forest-800 text-[#F5F1E8] text-sm font-bold shadow transition-colors disabled:opacity-50"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Compass className="w-4 h-4 text-[#DFB86C]" />}
              Submit application
            </button>
          </div>
        </div>
      )}
    </div>
  </div>
  );
}
