import React from 'react';
import Link from 'next/link';
import {
  Compass, Sparkles, ShieldCheck, Tag, Route, HeartHandshake, Star,
  Bot, ArrowRight, MapPin, Info,
} from 'lucide-react';

const STEPS = [
  {
    icon: Compass,
    title: 'Tell us how you travel',
    detail: 'Interests, budget, crowd preference, pace, duration and group — Find My Yatra captures it in under a minute.',
    href: '/find-my-yatra',
    cta: 'Start Find My Yatra',
  },
  {
    icon: Sparkles,
    title: 'Get matched — transparently',
    detail: 'A deterministic scoring engine (interests 30% · budget 20% · crowd 15% · duration 15% · style 10% · group 10%) produces your match score. No black-box AI in the scoring.',
    href: '/find-my-yatra',
    cta: 'See the engine',
  },
  {
    icon: MapPin,
    title: 'Explore the real Hyderabad',
    detail: '24 places across six heritage themes — from Qutb Shahi origins to living crafts villages — with honest tourism-pressure labels and official sources.',
    href: '/explore',
    cta: 'Open the map',
  },
  {
    icon: ShieldCheck,
    title: 'Meet a Mitra you can evaluate',
    detail: 'Every Mitra carries a Trust Passport: identity, residency, knowledge, safety and references — each step shows its real status. Nothing is auto-approved.',
    href: '/mitras',
    cta: 'Meet the Mitras',
  },
  {
    icon: Tag,
    title: 'Understand the price first',
    detail: 'Every experience shows its price, a typical indicative range, exactly what\u2019s included, and a status. Check any quote with the Price Checker.',
    href: '/price-check',
    cta: 'Try Price Check',
  },
  {
    icon: Route,
    title: 'Travel with Live Trip tools',
    detail: 'Checkpoint check-ins, trip sharing and an always-visible emergency panel (112 / 108) — transparent prototype tools, no fake GPS claims.',
    href: '/trip',
    cta: 'See Live Trip',
  },
  {
    icon: HeartHandshake,
    title: 'See your impact',
    detail: 'After your Yatra: where your spend goes under the proposed 95/5 community model — clearly labelled as illustrative, not measured.',
    href: '/dashboard',
    cta: 'My Yatra',
  },
  {
    icon: Star,
    title: 'Leave a verified review',
    detail: 'Only completed bookings can be reviewed. Every review carries a ✓ Verified Yatra badge — no fake social proof.',
    href: '/dashboard',
    cta: 'My Yatra',
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-page-howitworks">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24 space-y-12">
        <div className="space-y-3 max-w-3xl relative bg-motif-arch">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-terracotta-600">
            <Info className="w-3.5 h-3.5" />
            <span>The complete loop</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-forest-950">How YATRAMITR works</h1>
          <p className="text-sm sm:text-base text-charcoal-700 leading-relaxed">
            One connected journey from &ldquo;I want to explore Hyderabad&rdquo; to a verified review — with
            trust, pricing and safety built into every step.
          </p>
        </div>

        <div className="space-y-4">
          {STEPS.map((step, i) => (
            <div
              key={step.title}
              className="p-6 sm:p-8 rounded-2xl bg-card-elevated grid grid-cols-1 sm:grid-cols-12 gap-5 items-start"
            >
            <div className="sm:col-span-2 flex sm:flex-col items-center gap-3">
              <span className="font-serif text-4xl font-light text-[#B86B4B]">{String(i + 1).padStart(2, '0')}</span>
              <div className="w-10 h-10 rounded-xl bg-forest-50 text-forest-700 flex items-center justify-center shrink-0">
                <step.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="sm:col-span-8 space-y-2">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-forest-950">{step.title}</h2>
              <p className="text-sm text-charcoal-700 leading-relaxed">{step.detail}</p>
            </div>
            <div className="sm:col-span-2 sm:text-right">
              <Link
                href={step.href}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-terracotta-600 hover:underline whitespace-nowrap"
              >
                {step.cta} <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Ask Mitra */}
      <div className="p-6 sm:p-8 rounded-2xl bg-forest-900 text-[#F5F1E8] space-y-3">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-[#DFB86C]" />
          <h2 className="font-serif text-xl font-bold">Or just ask — Ask Mitra</h2>
        </div>
        <p className="text-sm text-[#E8DFCF]/85 leading-relaxed">
          The ✦ Ask Mitra assistant (bottom-right, on every page) answers from the platform&apos;s own database:
          find experiences, check prices, explain places, plan a day, or get safety help. When Groq AI narrates,
          facts still come only from our data — and if AI is unavailable, the platform keeps working.
        </p>
      </div>

      {/* Transparency footer */}
      <div className="p-6 rounded-2xl bg-sand-100 border border-sand-300 space-y-2">
        <p className="text-xs font-bold uppercase tracking-wider text-forest-900">What is real vs. prototype</p>
        <ul className="space-y-1.5 text-xs text-charcoal-800">
          <li>• <strong>Real:</strong> the 24-place historical dataset, six-category system, coordinates, official sources, deterministic scoring, price-check logic.</li>
          <li>• <strong>Prototype (labelled):</strong> demo Mitra profiles, indicative prices, prototype availability, proposed 95/5 impact model, verification workflow states.</li>
          <li>• <strong>Never claimed:</strong> government verification, researched price surveys, live GPS tracking, real reviews or visitor statistics.</li>
        </ul>
      </div>
    </div>
  </div>
  );
}
