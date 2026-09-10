'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Compass, SearchX, ArrowRight } from 'lucide-react';
import ExperienceCard from '@/components/ui/ExperienceCard';
import { fetchExperiences } from '@/lib/data-service';
import type { Experience, PlaceCategory } from '@/types';
import { PLACE_CATEGORIES } from '@/types';
import { cn } from '@/lib/utils';

export default function ExperiencesPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<PlaceCategory | 'All'>('All');
  const [maxPrice, setMaxPrice] = useState<number>(2000);

  useEffect(() => {
    fetchExperiences()
      .then(setExperiences)
      .catch(() => setExperiences([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = experiences.filter(
    (e) => (category === 'All' || e.category === category) && e.pricePerPerson <= maxPrice
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-10">
      <div className="space-y-3 max-w-3xl">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-terracotta-600">
          <Compass className="w-3.5 h-3.5" />
          <span>Host-crafted journeys</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-forest-950">Experiences</h1>
        <p className="text-sm sm:text-base text-charcoal-700 leading-relaxed">
          Small-group immersions guided by local Mitras. Every price shows its typical range and exactly
          what&apos;s included — no hidden charges.
        </p>
      </div>

      {/* Filters */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E8DFCF] shadow-sm space-y-4">
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
        <div className="flex items-center gap-3 text-xs">
          <label className="font-semibold text-[#1D2521]/70 whitespace-nowrap">Max price:</label>
          <input
            type="range"
            min={400}
            max={2000}
            step={50}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="flex-1 max-w-xs accent-[#16352A]"
          />
          <span className="font-bold text-forest-950">₹{maxPrice}</span>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-2xl bg-white border border-[#E8DFCF] overflow-hidden animate-pulse">
              <div className="aspect-[16/10] bg-sand-200" />
              <div className="p-5 space-y-2">
                <div className="h-3 bg-sand-200 rounded w-1/3" />
                <div className="h-4 bg-sand-200 rounded w-3/4" />
                <div className="h-3 bg-sand-200 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-10 rounded-2xl bg-white border border-[#E8DFCF] text-center space-y-3">
          <SearchX className="w-10 h-10 text-[#B8955A] mx-auto" />
          <p className="font-serif text-xl font-bold text-[#0D211A]">No experiences match these filters.</p>
          <p className="text-sm text-[#1D2521]/70">Try a higher price limit or a different category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((exp) => (
            <ExperienceCard key={exp.id} experience={exp} />
          ))}
        </div>
      )}

      <div className="p-6 sm:p-8 rounded-2xl bg-[#0D211A] text-[#F5F1E8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="font-serif text-xl font-bold">Not sure which one fits?</p>
          <p className="text-sm text-[#E8DFCF]/80">Let the matching engine pair you in 60 seconds.</p>
        </div>
        <Link
          href="/find-my-yatra"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-[#B8955A] hover:bg-[#a6844c] text-[#0D211A] text-sm font-bold transition-colors whitespace-nowrap"
        >
          Find My Yatra <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
