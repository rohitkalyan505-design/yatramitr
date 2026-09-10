'use client';

// ============================================================
// EXPLORE — interactive Hyderabad/Telangana map page
// ============================================================

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Compass, MapPin, ArrowRight, Info } from 'lucide-react';
import HyderabadMap from '@/components/map/HyderabadMap';
import { fetchMapPlaces, fetchExperiences } from '@/lib/data-service';
import type { Place, Experience, PlaceCategory } from '@/types';

type MapPlace = Place & { latitude: number; longitude: number };

export default function ExplorePage() {
  const [places, setPlaces] = useState<MapPlace[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [category, setCategory] = useState<PlaceCategory | 'All'>('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    Promise.all([fetchMapPlaces(), fetchExperiences()])
      .then(([p, e]) => {
        setPlaces(p as MapPlace[]);
        setExperiences(e);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const filtered = category === 'All' ? places : places.filter((p) => p.category === category);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-10">
      {/* Header */}
      <div className="space-y-3 max-w-3xl">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-terracotta-600">
          <Compass className="w-3.5 h-3.5" />
          <span>Explore Hyderabad & Telangana</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-forest-950">
          24 places. Six stories. One connected history.
        </h1>
        <p className="text-sm sm:text-base text-charcoal-700 leading-relaxed">
          From Qutb Shahi origins to living crafts villages — filter by theme, click a marker, and go from
          history to a bookable local experience in two clicks.
        </p>
      </div>

      {/* Tourism distribution concept */}
      <div className="p-5 sm:p-6 rounded-2xl bg-forest-50 border border-forest-200/80 space-y-2">
        <p className="text-xs font-bold uppercase tracking-wider text-forest-900">
          Why tourism distribution matters
        </p>
        <p className="text-sm text-forest-950 leading-relaxed">
          Most visitors concentrate on 2–3 famous landmarks. The coloured markers show where Yatra Mitra
          deliberately directs attention: quieter heritage, craft and landscape places get curated local
          experiences too — spreading spending to more neighbourhoods without shaming anyone for visiting
          the classics.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 animate-pulse">
          <div className="h-[520px] rounded-2xl bg-sand-200 lg:col-span-3" />
        </div>
      ) : error ? (
        <div className="p-10 rounded-2xl bg-white border border-[#E8DFCF] text-center space-y-2">
          <p className="font-serif text-xl font-bold text-[#0D211A]">The map couldn&apos;t load.</p>
          <p className="text-sm text-[#1D2521]/70">Check your connection and refresh the page.</p>
        </div>
      ) : (
        <HyderabadMap
          places={filtered}
          experiences={experiences}
          selectedCategory={category}
          onSelectCategory={setCategory}
          height="560px"
        />
      )}

      {/* Quick links to categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { cat: 'Qutb Shahi & Hyderabad Origins', desc: 'Charminar, Golconda, Mecca Masjid, royal tombs' },
          { cat: 'Kakatiya & Medieval Heritage', desc: 'Thousand Pillar Temple, UNESCO Ramappa, Bhongir' },
          { cat: 'Royal Hyderabad & Museums', desc: 'Salar Jung, Chowmahalla, Falaknuma' },
          { cat: 'Lakes, Reservoirs & Landscapes', desc: 'Hussain Sagar, Nagarjuna Sagar, Ananthagiri' },
          { cat: 'Spiritual & Living Religious Heritage', desc: 'Birla Mandir, Chilkur, Yadadri & more' },
          { cat: 'Culture, Crafts & Entertainment', desc: 'Shilparamam artisans, Ramoji Film City' },
        ].map(({ cat, desc }) => (
          <button
            key={cat}
            onClick={() => setCategory(cat as PlaceCategory)}
            className={`text-left p-5 rounded-2xl border transition-all ${
              category === cat
                ? 'bg-[#16352A] text-[#F5F1E8] border-[#16352A]'
                : 'bg-white border-[#E8DFCF] hover:border-[#B8955A]'
            }`}
          >
            <p className="font-serif font-bold text-base">{cat}</p>
            <p className={`text-xs mt-1 ${category === cat ? 'text-[#E8DFCF]' : 'text-[#1D2521]/60'}`}>{desc}</p>
          </button>
        ))}
      </div>

      {/* CTA */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0D211A] text-[#F5F1E8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="font-serif text-xl font-bold">Found a place you love?</p>
          <p className="text-sm text-[#E8DFCF]/80">Match with a local experience and a Fair Price in minutes.</p>
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
