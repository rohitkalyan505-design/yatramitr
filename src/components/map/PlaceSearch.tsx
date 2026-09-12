'use client';

// ============================================================
// PLACE SEARCH — over the YitraMitr curated datasets ONLY
// ============================================================
// Source of truth is our own place + food data, never external
// geocoding. Supports exact/partial/case-insensitive matching and
// category filtering. Selecting a result focuses the map on it and
// highlights the marker; the full place page is one click away.
// ============================================================

import React, { useMemo, useState } from 'react';
import { Search, MapPin, UtensilsCrossed, X } from 'lucide-react';
import type { Place, FoodEntry } from '@/types';
import { PLACE_CATEGORIES, FOOD_CATEGORIES } from '@/types';
import Link from 'next/link';

interface SearchHit {
  kind: 'place' | 'food';
  id: string;
  name: string;
  subtitle: string;
  category: string;
  description: string;
  hasCoords: boolean;
}

interface Props {
  places: Place[];
  foods: FoodEntry[];
  onPick: (hit: SearchHit) => void;
}

function scoreHit(hit: SearchHit, q: string): number {
  const name = hit.name.toLowerCase();
  if (name === q) return 100;
  if (name.startsWith(q)) return 80;
  if (name.includes(q)) return 60;
  if (hit.category.toLowerCase().includes(q)) return 30;
  if (hit.description.toLowerCase().includes(q)) return 20;
  if (hit.subtitle.toLowerCase().includes(q)) return 10;
  return 0;
}

export default function PlaceSearch({ places, foods, onPick }: Props) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('All');
  const [open, setOpen] = useState(false);

  const hits = useMemo<SearchHit[]>(() => {
    const q = query.trim().toLowerCase();
    const placeHits: SearchHit[] = places.map((p) => ({
      kind: 'place',
      id: p.id,
      name: p.name,
      subtitle: p.teluguName ?? p.category,
      category: p.category,
      description: p.description,
      hasCoords: p.latitude !== null,
    }));
    const foodHits: SearchHit[] = foods.map((f) => ({
      kind: 'food',
      id: f.id,
      name: f.name,
      subtitle: f.location,
      category: f.category,
      description: f.description,
      hasCoords: f.latitude !== null,
    }));

    let pool = [...placeHits, ...foodHits];
    if (category !== 'All') {
      pool = pool.filter((h) => h.category === category);
    }
    if (!q) return pool.filter((h) => h.kind === 'place').slice(0, 6);

    return pool
      .map((h) => ({ hit: h, score: scoreHit(h, q) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((x) => x.hit);
  }, [places, foods, query, category]);

  const pick = (hit: SearchHit) => {
    onPick(hit);
    setOpen(false);
    setQuery('');
  };

  return (
    <div className="relative w-full max-w-xl">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1D2521]/40" />
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Search places & food — “Charminar”, “golconda”, “biryani”…"
          aria-label="Search YATRAMITR places and food"
          className="w-full pl-11 pr-10 py-3 rounded-xl bg-white border border-[#E8DFCF] text-sm text-[#0D211A] placeholder:text-[#1D2521]/40 focus:outline-none focus:ring-2 focus:ring-[#B8955A]/50 focus:border-[#B8955A] transition-all shadow-sm"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setCategory('All'); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-[#1D2521]/40 hover:text-[#1D2521]"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category filter — places categories + food categories */}
      <div className="flex flex-wrap gap-1.5 mt-2">
        <button
          onClick={() => setCategory('All')}
          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${
            category === 'All' ? 'bg-[#16352A] text-white border-[#16352A]' : 'bg-white text-[#16352A] border-[#E8DFCF] hover:border-[#B8955A]'
          }`}
        >
          All
        </button>
        {PLACE_CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${
              category === c ? 'bg-[#16352A] text-white border-[#16352A]' : 'bg-white text-[#16352A] border-[#E8DFCF] hover:border-[#B8955A]'
            }`}
          >
            {c}
          </button>
        ))}
        {FOOD_CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold border border-dashed transition-colors ${
              category === c ? 'bg-[#B86B4B] text-white border-[#B86B4B]' : 'bg-white text-[#B86B4B] border-[#B86B4B]/40 hover:border-[#B86B4B]'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Results */}
      {open && (query.trim().length > 0 || category !== 'All') && (
        <div className="absolute z-30 mt-2 w-full rounded-xl bg-white border border-[#E8DFCF] shadow-xl overflow-hidden animate-in max-h-[380px] overflow-y-auto">
          {hits.length === 0 ? (
            <div className="p-4 text-xs text-[#1D2521]/60">
              No curated places or food matched “{query}”. The search covers YATRAMITR&apos;s own dataset —
              try “Charminar”, “golconda”, “ramappa” or “biryani”.
            </div>
          ) : (
            hits.map((hit) => (
              <div
                key={`${hit.kind}-${hit.id}`}
                className="w-full flex items-start justify-between gap-3 p-3.5 hover:bg-[#F5F1E8] transition-colors border-b border-[#E8DFCF]/60 last:border-0 cursor-pointer"
                onClick={() => pick(hit)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && pick(hit)}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    {hit.kind === 'place' ? (
                      <MapPin className="w-3.5 h-3.5 text-forest-700 shrink-0" />
                    ) : (
                      <UtensilsCrossed className="w-3.5 h-3.5 text-[#B86B4B] shrink-0" />
                    )}
                    <span className="text-sm font-bold text-[#0D211A] truncate">{hit.name}</span>
                  </div>
                  <p className="text-[11px] text-[#1D2521]/60 mt-0.5">
                    <span className="font-semibold">{hit.category}</span>
                    {hit.subtitle ? ` · ${hit.subtitle}` : ''}
                  </p>
                  <p className="text-[11px] text-[#1D2521]/50 mt-0.5 line-clamp-1">{hit.description}</p>
                </div>
                <div className="shrink-0 flex flex-col items-end gap-1">
                  {hit.kind === 'place' ? (
                    <Link
                      href={`/places/${hit.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-[10px] font-bold text-[#B8955A] hover:underline"
                    >
                      Open page →
                    </Link>
                  ) : (
                    <span className="text-[9px] font-bold uppercase text-[#1D2521]/40">Food</span>
                  )}
                  {!hit.hasCoords && (
                    <span className="text-[9px] text-terracotta-600 font-semibold">Needs verification</span>
                  )}
                </div>
                </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
