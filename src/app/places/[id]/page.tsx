import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  MapPin, Clock, Star, ShieldCheck, Info, Compass, Landmark,
  ExternalLink, ArrowRight, AlertCircle, Users,
} from 'lucide-react';
import { getPlaceById, PLACES } from '@/data/places';
import { EXPERIENCES, getMitraById } from '@/data/experiences';
import ExperienceCard from '@/components/ui/ExperienceCard';
import { PLACE_CATEGORIES } from '@/types';

export function generateStaticParams() {
  return PLACES.map((p) => ({ id: p.id }));
}

export default function PlacePage({ params }: { params: { id: string } }) {
  const place = getPlaceById(params.id);
  if (!place) notFound();

  const placeExperiences = EXPERIENCES.filter((e) => e.placeId === place.id);
  const mitras = Array.from(new Set(placeExperiences.map((e) => e.mitraId)))
    .map((id) => getMitraById(id))
    .filter(Boolean);

  const pressureColor =
    place.tourismPressure === 'Low' ? '#2D7A4F' : place.tourismPressure === 'Medium' ? '#C5A059' : '#BD5338';

  return (
    <div className="space-y-14 sm:space-y-20 pb-20">
      {/* 1. Hero */}
      <section className="relative w-full min-h-[55vh] sm:min-h-[62vh] flex flex-col justify-end bg-[#0D211A] text-[#F5F1E8] overflow-hidden">
        <div className="absolute inset-0 z-0">
          {place.image ? (
            <Image src={place.image} alt={place.name} fill priority className="object-cover opacity-60" />
          ) : (
            <div className="absolute inset-0 bg-topo-pattern opacity-50" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D211A] via-[#0D211A]/50 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 w-full space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Link href="/" className="text-[#E8DFCF] hover:text-white">Home</Link>
            <span className="text-[#B8955A]">/</span>
            <Link href="/explore" className="text-[#E8DFCF] hover:text-white">Explore</Link>
            <span className="text-[#B8955A]">/</span>
            <span className="text-[#DFB86C] font-semibold">{place.name}</span>
          </div>

          <div className="space-y-2 max-w-4xl">
            <span className="text-xs font-bold uppercase tracking-widest text-[#DFB86C]">{place.category}</span>
            <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-white">
              {place.name}
            </h1>
            {place.teluguName && <p className="font-serif text-xl text-[#E8DFCF]">{place.teluguName}</p>}
            <p className="text-sm sm:text-lg text-[#E8DFCF] leading-relaxed max-w-2xl">{place.description}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold"
              style={{ backgroundColor: `${pressureColor}33`, color: '#F5F1E8', border: `1px solid ${pressureColor}` }}
            >
              <Users className="w-3.5 h-3.5" /> {place.tourismPressure} tourism pressure
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/20">
              <Clock className="w-3.5 h-3.5 text-[#DFB86C]" /> {place.recommendedDuration}
            </span>
            {place.latitude !== null && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/20">
                <MapPin className="w-3.5 h-3.5 text-[#B86B4B]" /> {place.latitude.toFixed(4)}° N, {place.longitude?.toFixed(4)}° E
              </span>
            )}
          </div>
        </div>
      </section>

      {/* 2. History body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-10">
            {/* History */}
            <section className="space-y-3">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950 flex items-center gap-2">
                <Landmark className="w-5 h-5 text-[#B86B4B]" /> History
              </h2>
              <p className="text-base text-charcoal-800 leading-relaxed">{place.historicalSummary}</p>
            </section>

            {/* Why it matters */}
            <section className="p-6 rounded-2xl bg-[#F5F1E8] border border-[#E8DFCF] space-y-2">
              <h2 className="font-serif text-xl font-bold text-forest-950 flex items-center gap-2">
                <Star className="w-4.5 h-4.5 text-[#B86B4B]" /> Why it matters
              </h2>
              <p className="text-sm text-charcoal-800 leading-relaxed">{place.whyItMatters}</p>
            </section>

            {/* Tourist explanation + What to notice */}
            <section className="space-y-4">
              <h2 className="font-serif text-2xl font-bold text-forest-950 flex items-center gap-2">
                <Compass className="w-5 h-5 text-forest-800" /> What to notice
              </h2>
              <p className="text-sm text-charcoal-700 leading-relaxed">{place.touristExplanation}</p>
              {place.whatToNotice.length > 0 && (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {place.whatToNotice.map((n, i) => (
                    <li key={i} className="flex items-start gap-2 p-3 rounded-xl bg-white border border-[#E8DFCF] text-xs text-charcoal-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#B86B4B] mt-1.5 shrink-0" />
                      {n}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Guide line */}
            {place.guideLine && (
              <section className="p-6 rounded-2xl bg-forest-900 text-[#F5F1E8] space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#DFB86C]">Guide line</span>
                <p className="font-serif text-lg italic leading-relaxed">&ldquo;{place.guideLine}&rdquo;</p>
              </section>
            )}

            {/* Verification notice for unverified places */}
            {place.contentStatus === 'requires_verification' && (
              <section className="p-5 rounded-2xl border-l-4 border-terracotta-500 bg-terracotta-50 space-y-2">
                <p className="text-sm font-bold text-terracotta-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> Verification pending
                </p>
                <p className="text-xs text-charcoal-700">{place.verificationNote}</p>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Practical info */}
            <div className="p-6 rounded-2xl bg-white border border-[#E8DFCF] shadow-sm space-y-4">
              <h3 className="font-serif text-lg font-bold text-forest-950">Plan your visit</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <p className="font-bold text-forest-950 uppercase tracking-wider text-[10px]">Best time</p>
                  <p className="text-charcoal-800 mt-0.5">{place.bestTime}</p>
                </div>
                <div>
                  <p className="font-bold text-forest-950 uppercase tracking-wider text-[10px]">Timings</p>
                  <p className="text-charcoal-800 mt-0.5">{place.timings ?? 'Check official source for latest information'}</p>
                </div>
                <div>
                  <p className="font-bold text-forest-950 uppercase tracking-wider text-[10px]">Entry</p>
                  <p className="text-charcoal-800 mt-0.5">{place.entryInfo ?? 'Check official source for latest information'}</p>
                </div>
                <div>
                  <p className="font-bold text-forest-950 uppercase tracking-wider text-[10px]">Tourism pressure</p>
                  <p className="text-charcoal-800 mt-0.5">{place.tourismPressure}</p>
                  <p className="text-[10px] text-charcoal-600 mt-0.5">{place.tourismPressureMethodology}</p>
                </div>
              </div>

              {place.officialSource && (
                <a
                  href={place.officialSource}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-terracotta-600 hover:underline"
                >
                  Official source <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            {/* Map mini-CTA */}
            {place.latitude !== null && (
              <div className="p-6 rounded-2xl bg-forest-900 text-[#F5F1E8] space-y-3">
                <h3 className="font-serif text-lg font-bold">See it on the map</h3>
                <p className="text-xs text-[#E8DFCF]/80">
                  Explore all 24 places and filter by the six heritage themes.
                </p>
                <Link
                  href="/explore"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#B8955A] hover:bg-[#a6844c] text-[#0D211A] text-xs font-bold transition-colors"
                >
                  Open interactive map <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Experiences here */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-terracotta-600">Bookable journeys</span>
          <h2 className="font-serif text-3xl font-bold text-forest-950">Yatra Mitra experiences at {place.name}</h2>
          <p className="text-xs text-charcoal-700">Small-group experiences hosted by local Mitras, with Fair Price ranges.</p>
        </div>

        {placeExperiences.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {placeExperiences.map((exp) => (
              <ExperienceCard key={exp.id} experience={exp} />
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-white border border-[#E8DFCF] text-center space-y-2">
            <p className="font-serif text-lg font-bold text-[#0D211A]">No curated experiences here yet.</p>
            <p className="text-xs text-[#1D2521]/70">
              This place is on the map for discovery. Check back as the pilot adds experiences, or browse
              experiences elsewhere.
            </p>
            <Link href="/explore" className="inline-block text-sm font-bold text-terracotta-600 hover:underline">
              Explore other places →
            </Link>
          </div>
        )}
      </section>

      {/* 4. Mitras */}
      {mitras.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-terracotta-600">Verified hosts</span>
            <h2 className="font-serif text-3xl font-bold text-forest-950">Mitras who guide here</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {mitras.map((m) => (
              <Link
                key={m!.id}
                href={`/mitras/${m!.id}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-[#E8DFCF] hover:border-[#B8955A] transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-forest-700" />
                <span className="text-sm font-semibold text-forest-950">{m!.name}</span>
                <span className="text-xs text-[#1D2521]/60">Trust {m!.trustScore}/100</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
