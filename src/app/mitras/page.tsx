'use client';

import React, { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import MitraCard from '@/components/ui/MitraCard';
import { fetchMitras } from '@/lib/data-service';
import type { Mitra, PlaceCategory } from '@/types';
import { PLACE_CATEGORIES } from '@/types';
import { cn } from '@/lib/utils';

export default function MitrasPage() {
  const [mitras, setMitras] = useState<Mitra[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<PlaceCategory | 'All'>('All');

  useEffect(() => {
    fetchMitras()
      .then(setMitras)
      .catch(() => setMitras([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = category === 'All' ? mitras : mitras.filter((m) => m.categories.includes(category));

  return (
    <div className="min-h-screen bg-page-mitras">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-10">
        <div className="space-y-3 max-w-3xl relative bg-motif-arch">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-terracotta-600">
            <Users className="w-3.5 h-3.5" />
            <span>The human connection</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-forest-950">
            Don&apos;t just visit. Meet someone who knows.
          </h1>
          <p className="text-sm sm:text-base text-charcoal-700 leading-relaxed">
            Every Mitra carries a transparent Trust Passport — you can see exactly which verification steps are
            complete, pending, or not started. No hidden claims.
          </p>
        </div>

      <div className="p-4 rounded-xl bg-terracotta-50 border border-terracotta-200 text-xs text-terracotta-700">
        <strong>Transparency note:</strong> Mitra profiles in this MVP build are clearly-labelled DEMO accounts
        created to demonstrate the matching and verification workflow. Verification statuses show the prototype
        workflow state — not government certification.
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap items-center gap-2">
        {(['All', ...PLACE_CATEGORIES] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat as PlaceCategory | 'All')}
            className={cn(
              'px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all',
              category === cat
                ? 'bg-[#16352A] text-[#F5F1E8] border-[#16352A]'
                : 'bg-white text-[#16352A] border-[#E8DFCF] hover:border-[#B8955A]'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-2xl bg-white border border-[#E8DFCF] p-6 space-y-4 animate-pulse">
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-full bg-sand-200" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-sand-200 rounded w-1/2" />
                  <div className="h-3 bg-sand-200 rounded w-1/3" />
                </div>
              </div>
              <div className="h-3 bg-sand-200 rounded w-full" />
              <div className="h-3 bg-sand-200 rounded w-5/6" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-10 rounded-2xl bg-white border border-[#E8DFCF] text-center space-y-2">
          <p className="font-serif text-xl font-bold text-[#0D211A]">No Mitras for this category yet.</p>
          <p className="text-sm text-[#1D2521]/70">Try another theme, or apply to become one yourself.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((m) => (
            <MitraCard key={m.id} mitra={m} />
          ))}
        </div>
      )}
    </div>
  </div>
  );
}
