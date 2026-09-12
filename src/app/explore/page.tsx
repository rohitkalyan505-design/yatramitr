'use client';

// ============================================================
// EXPLORE — curated map + search over YitraMitr datasets
// ============================================================

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Compass, ArrowRight, UtensilsCrossed, Clock, MapPin, ArrowUpRight } from 'lucide-react';
import HyderabadMap from '@/components/map/HyderabadMap';
import PlaceSearch from '@/components/map/PlaceSearch';
import { fetchPlaces, fetchExperiences } from '@/lib/data-service';
import { FOODS } from '@/data/food';
import { PLACES } from '@/data/places';
import { EXPERIENCES } from '@/data/experiences';
import type { Place, Experience, PlaceCategory } from '@/types';

export default function ExplorePage() {
  const router = useRouter();
  const [places, setPlaces] = useState<Place[]>(PLACES);
  const [experiences, setExperiences] = useState<Experience[]>(EXPERIENCES);
  const [category, setCategory] = useState<PlaceCategory | 'All'>('All');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [focusPlaceId, setFocusPlaceId] = useState<string | null>(null);
  const [mapKey, setMapKey] = useState(0);

  useEffect(() => {
    // Non-blocking enrichment in background
    Promise.all([fetchPlaces(), fetchExperiences()])
      .then(([p, e]) => {
        if (p && p.length > 0) setPlaces(p);
        if (e && e.length > 0) setExperiences(e);
      })
      .catch(() => {
        // Keep canonical local data
      });
  }, []);

  const handleSearchPick = (hit: { kind: 'place' | 'food'; id: string }) => {
    if (hit.kind === 'food') {
      const el = document.getElementById(`food-${hit.id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('ring-2', 'ring-[#B8955A]');
        setTimeout(() => el.classList.remove('ring-2', 'ring-[#B8955A]'), 2000);
      } else {
        window.location.href = `/food`;
      }
      return;
    }
    const targetPlace = places.find((p) => p.id === hit.id);
    if (targetPlace && (targetPlace.latitude === null || targetPlace.showOnMap === false)) {
      const card = document.getElementById(`place-${hit.id}`);
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        card.classList.add('ring-2', 'ring-[#B8955A]');
        setTimeout(() => card.classList.remove('ring-2', 'ring-[#B8955A]'), 2000);
      }
      return;
    }
    setCategory('All');
    setFocusPlaceId(hit.id);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const filtered = category === 'All' ? places : places.filter((p) => p.category === category);

  return (
    <div className="min-h-screen bg-page-explore">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-10">
        {/* Header */}
        <div className="space-y-3 max-w-3xl relative bg-motif-arch">
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

        {/* Search over curated data */}
        <PlaceSearch places={places} foods={FOODS} onPick={handleSearchPick} />

        {/* Tourism distribution concept */}
        <div className="p-5 sm:p-6 rounded-2xl bg-forest-50/90 border border-forest-200/80 shadow-sm space-y-2">
        <p className="text-xs font-bold uppercase tracking-wider text-forest-900">
          Why tourism distribution matters
        </p>
        <p className="text-sm text-forest-950 leading-relaxed">
          Most visitors concentrate on 2–3 famous landmarks. The coloured markers show where YATRAMITR
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
          key={mapKey}
          places={filtered}
          experiences={experiences}
          foods={[]}
          selectedCategory={category}
          onSelectCategory={setCategory}
          focusPlaceId={focusPlaceId}
          height="560px"
        />
      )}

      {/* Food strip — category-first discovery */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#B86B4B] inline-flex items-center gap-1.5">
              <UtensilsCrossed className="w-3.5 h-3.5" /> Food — the supplied street-food guide
            </span>
            <h2 className="font-serif text-2xl font-bold text-forest-950">
              Eight Hyderabad food landmarks
            </h2>
          </div>
          <Link
            href="/food"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#16352A] hover:text-[#B8955A] transition-colors"
          >
            <span>View Full Food Guide</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {FOODS.slice(0, 8).map((f) => (
            <div
              key={f.id}
              id={`food-${f.id}`}
              className="p-4 rounded-xl bg-white border border-[#E8DFCF] hover:border-[#B8955A] transition-colors cursor-pointer"
              onClick={() => handleSearchPick({ kind: 'food', id: f.id })}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchPick({ kind: 'food', id: f.id })}
            >
              <p className="text-xs font-bold text-[#0D211A]">{f.name}</p>
              <p className="text-[10px] text-[#1D2521]/60 mt-0.5">{f.category}</p>
              <p className="text-[10px] text-[#1D2521]/50 mt-1">{f.location}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Destination Cards Grid */}
      <section className="space-y-6 pt-4 border-t border-[#E8DFCF]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#B86B4B]">
              Heritage Directory
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950">
              {category === 'All' ? 'All Curated Places in Hyderabad & Telangana' : `${category}`}
            </h2>
          </div>
          <span className="text-xs font-semibold text-[#1D2521]/60">
            Showing {filtered.length} places
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((place) => (
            <div
              key={place.id}
              id={`place-${place.id}`}
              onClick={() => router.push(`/places/${place.id}`)}
              className="group rounded-2xl overflow-hidden bg-white border border-[#E8DFCF] flex flex-col hover:shadow-xl hover:border-[#B8955A]/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            >
              {/* Card Image */}
              <Link
                href={`/places/${place.id}`}
                onClick={(e) => e.stopPropagation()}
                className="relative aspect-[16/10] w-full bg-[#16352A] overflow-hidden block"
              >
                {place.image ? (
                  <img
                    src={place.image}
                    alt={place.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#16352A] to-[#0D211A] flex flex-col items-center justify-center p-4 text-center">
                    <span className="font-serif text-3xl text-[#DFB86C] font-bold">యా</span>
                    <span className="text-[10px] text-[#E8DFCF]/70 uppercase tracking-widest mt-1">YATRAMITR Heritage</span>
                  </div>
                )}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#0D211A]/85 backdrop-blur-sm text-[10px] font-bold text-[#DFB86C] border border-[#B8955A]/30">
                  {place.category}
                </div>
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-sm text-[10px] font-bold text-[#16352A] shadow-sm">
                  {place.tourismPressure} pressure
                </div>
              </Link>

              {/* Card Body */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-serif text-lg font-bold text-[#0D211A]">
                      <Link
                        href={`/places/${place.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="hover:text-[#16352A] transition-colors"
                      >
                        {place.name}
                      </Link>
                    </h3>
                    {place.teluguName && (
                      <span className="font-serif text-xs text-[#B86B4B] font-semibold">{place.teluguName}</span>
                    )}
                  </div>
                  <p className="text-xs text-[#1D2521]/75 leading-relaxed line-clamp-2">
                    {place.description}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-[#1D2521]/60 pt-1">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#B8955A]" /> {place.recommendedDuration}
                    </span>
                    {place.latitude !== null && place.showOnMap !== false && (
                      <span className="flex items-center gap-1 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-[#16352A]" /> Map verified
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E8DFCF]/70 flex items-center justify-between gap-2" onClick={(e) => e.stopPropagation()}>
                  {place.latitude !== null && place.showOnMap !== false ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSearchPick({ kind: 'place', id: place.id });
                      }}
                      className="text-xs font-semibold text-[#16352A] hover:text-[#B8955A] transition-colors"
                    >
                      Focus on Map
                    </button>
                  ) : (
                    <span className="text-[11px] font-medium text-[#B86B4B]">
                      Verification pending · Not on map
                    </span>
                  )}
                  <Link
                    href={`/places/${place.id}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#16352A]/5 hover:bg-[#16352A] hover:text-[#F5F1E8] text-xs font-bold text-[#16352A] transition-all"
                  >
                    <span>View Place</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

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
  </div>
  );
}
