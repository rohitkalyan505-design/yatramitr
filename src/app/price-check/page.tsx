'use client';

// ============================================================
// PRICE CHECK — "Before you pay, understand what the price includes."
// Deterministic comparison against indicative ranges. Never calls
// a high price a scam; explains what may justify differences.
// ============================================================

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Tag, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Info,
} from 'lucide-react';
import { checkPrice, type PriceCheckResult } from '@/lib/pricing';
import { cn } from '@/lib/utils';

export default function PriceCheckPage() {
  const [service, setService] = useState('Heritage walking experience');
  const [location, setLocation] = useState('Hyderabad');
  const [quotedPrice, setQuotedPrice] = useState('');
  const [hours, setHours] = useState(3);
  const [transport, setTransport] = useState(false);
  const [food, setFood] = useState(false);
  const [tickets, setTickets] = useState(false);
  const [result, setResult] = useState<PriceCheckResult | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const price = Number(quotedPrice);
    if (!price || price <= 0) return;
    setResult(
      checkPrice({
        service,
        location,
        quotedPrice: price,
        hours,
        includesTransport: transport,
        includesFood: food,
        includesEntryTickets: tickets,
      })
    );
  };

  const statusStyle = (status: string) =>
    status === 'within'
      ? 'bg-forest-50 text-forest-700 border-forest-200'
      : status === 'above'
        ? 'bg-terracotta-50 text-terracotta-700 border-terracotta-200'
        : 'bg-gold-100 text-gold-700 border-gold-300';

  const inputCls =
    'w-full px-4 py-2.5 rounded-xl border border-sand-300 bg-white text-sm font-medium focus:outline-none focus:border-forest-800';

  return (
    <div className="min-h-screen bg-page-price">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24 space-y-8">
        <div className="space-y-3 relative bg-motif-arch">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-terracotta-600">
            <Tag className="w-3.5 h-3.5" />
            <span>Consumer protection</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest-950">Check a price</h1>
          <p className="text-sm sm:text-base text-charcoal-700 leading-relaxed">
            Before you pay, understand what the price includes. Compare any quoted guiding price against a
            typical indicative range — and see what could justify a difference.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="p-6 sm:p-8 rounded-2xl bg-card-elevated space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] uppercase font-bold tracking-wider text-charcoal-700 block mb-1.5">Service</label>
            <select value={service} onChange={(e) => setService(e.target.value)} className={inputCls}>
              <option>Heritage walking experience</option>
              <option>Food trail</option>
              <option>Craft & artisan visit</option>
              <option>Fort / monument guided tour</option>
              <option>Day trip (with transport)</option>
              <option>Photography walk</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold tracking-wider text-charcoal-700 block mb-1.5">Location</label>
            <input value={location} onChange={(e) => setLocation(e.target.value)} className={inputCls} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] uppercase font-bold tracking-wider text-charcoal-700 block mb-1.5">Quoted price (₹ per person)</label>
            <input
              type="number"
              min={50}
              value={quotedPrice}
              onChange={(e) => setQuotedPrice(e.target.value)}
              placeholder="e.g., 900"
              className={inputCls}
              required
            />
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold tracking-wider text-charcoal-700 block mb-1.5">Duration: {hours} hour{hours > 1 ? 's' : ''}</label>
            <input
              type="range"
              min={1}
              max={8}
              step={0.5}
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="w-full mt-3 accent-forest-900"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] uppercase font-bold tracking-wider text-charcoal-700 block mb-2">What does the quote include?</label>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Transport', value: transport, set: setTransport },
              { label: 'Food / tastings', value: food, set: setFood },
              { label: 'Entry tickets', value: tickets, set: setTickets },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => item.set(!item.value)}
                className={cn(
                  'px-4 py-2 rounded-lg border text-xs font-bold transition-all',
                  item.value ? 'bg-forest-900 text-[#F5F1E8] border-forest-900' : 'bg-white border-sand-300 hover:border-forest-800'
                )}
              >
                {item.value ? '✓ ' : ''}{item.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-forest-900 hover:bg-forest-800 text-[#F5F1E8] font-bold text-sm shadow-md transition-colors"
        >
          <ShieldCheck className="w-4 h-4 text-[#DFB86C]" />
          Check this price
        </button>
      </form>

      {/* Result */}
      {result && (
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E8DFCF] shadow-sm space-y-5 animate-in fade-in duration-300">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-3xl font-extrabold text-forest-950">₹{result.quotedPrice}</span>
              <span className="text-xs text-[#1D2521]/60">quoted</span>
            </div>
            <span className={cn('inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border', statusStyle(result.status))}>
              {result.status === 'above' ? <AlertCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
              {result.statusLabel}
            </span>
          </div>

          {/* Range bar */}
          <div>
            <div className="flex justify-between text-[10px] font-semibold text-[#1D2521]/60 mb-1">
              <span>₹{result.typicalRange.min}</span>
              <span>Typical indicative range</span>
              <span>₹{result.typicalRange.max}</span>
            </div>
            <div className="relative h-3 rounded-full bg-sand-200 overflow-hidden">
              <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-2/3 bg-forest-500/30 rounded-full" />
              <div
                className={cn(
                  'absolute top-0 bottom-0 w-1 rounded-full',
                  result.status === 'within' ? 'bg-forest-700' : result.status === 'above' ? 'bg-terracotta-500' : 'bg-gold-500'
                )}
                style={{
                  left: `${Math.min(98, Math.max(2, (result.quotedPrice / (result.typicalRange.max * 1.3)) * 100))}%`,
                }}
              />
            </div>
          </div>

          <p className="text-sm text-charcoal-800 leading-relaxed">{result.explanation}</p>

          {result.considerations.length > 0 && (
            <div className="p-4 rounded-xl bg-sand-100 border border-sand-300 space-y-2">
              <p className="text-xs font-bold text-forest-950">Worth checking before you decide:</p>
              <ul className="space-y-1.5">
                {result.considerations.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-charcoal-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-terracotta-500 mt-1.5 shrink-0" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="p-3.5 rounded-xl bg-forest-50 border border-forest-200 text-[11px] text-forest-950 flex items-start gap-2">
            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            {result.dataNote}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/experiences"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-forest-900 hover:bg-forest-800 text-[#F5F1E8] text-xs font-bold transition-colors"
            >
              Browse experiences with Fair Price ranges <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Education */}
      <div className="p-6 rounded-2xl bg-forest-900 text-[#F5F1E8] space-y-2">
        <p className="font-serif text-lg font-bold">Why a &ldquo;high&rdquo; price isn&apos;t automatically unfair</p>
        <p className="text-xs text-[#E8DFCF]/85 leading-relaxed">
          Duration, private transport, entry fees, food, group size, season and specialist knowledge all move
          a fair price up or down. YATRAMITR&apos;s Fair Price Guide gives you the questions to ask — not a
          verdict on any individual.
        </p>
      </div>
    </div>
  </div>
  );
}
