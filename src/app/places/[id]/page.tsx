import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  MapPin, Clock, Star, ShieldCheck, Compass, Landmark,
  ExternalLink, ArrowRight, AlertCircle, Users,
} from 'lucide-react';
import { getPlaceById, PLACES } from '@/data/places';
import { EXPERIENCES, getMitraById } from '@/data/experiences';
import { FOODS } from '@/data/food';
import ExperienceCard from '@/components/ui/ExperienceCard';
import ExpandableHistory from '@/components/ui/ExpandableHistory';

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

  // Food venues near this place (straight-line distance < 2.5 km)
  const nearbyFood =
    place.latitude !== null && place.longitude !== null
      ? FOODS.filter((f) => {
          if (f.latitude === null || f.longitude === null) return false;
          const dLat = (f.latitude - place.latitude!) * 111;
          const dLng = (f.longitude - place.longitude!) * 111 * Math.cos((place.latitude! * Math.PI) / 180);
          return Math.sqrt(dLat * dLat + dLng * dLng) < 2.5;
        })
      : [];

  const gmapsLink =
    place.latitude !== null && place.longitude !== null
      ? `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}&travelmode=driving`
      : null;

  // Static MapTiler static-image map (browser key; degrades gracefully)
  const staticMapUrl =
    place.latitude !== null &&
    place.longitude !== null &&
    process.env.NEXT_PUBLIC_MAPTILER_API_KEY
      ? `https://api.maptiler.com/maps/streets-v2/static/${place.longitude},${place.latitude},13/480x240.png?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`
      : null;

  return (
    <div className="min-h-screen bg-page-place space-y-14 sm:space-y-20 pb-20">
      {/* 1. Hero */}
      <section className="relative w-full min-h-[480px] sm:min-h-[55vh] flex flex-col justify-end pt-28 sm:pt-36 pb-12 bg-[#0D211A] text-[#F5F1E8] overflow-hidden">
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

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href={`/booking?placeId=${place.id}${placeExperiences[0] ? `&experienceId=${placeExperiences[0].id}` : ''}`}
              id="hero-book-mitra-btn"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#DFB86C] hover:bg-[#cfa554] text-[#0D211A] text-sm font-bold shadow-xl transition-all transform hover:scale-105 active:scale-95"
            >
              <ShieldCheck className="w-4 h-4 text-[#0D211A]" />
              <span>{`Book a Mitra for ${place.name}`}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
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
              <ExpandableHistory text={place.historicalSummary} />
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

            {/* What is this place famous for? */}
            <section className="p-6 rounded-2xl bg-white border border-[#E8DFCF] space-y-3">
              <h2 className="font-serif text-xl font-bold text-forest-950">What is this place famous for?</h2>
              <div className="flex flex-wrap gap-2">
                {place.tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#F5F1E8] text-[#16352A] text-xs font-semibold border border-[#E8DFCF]"
                  >
                    <Star className="w-3 h-3 text-[#B86B4B]" /> {t}
                  </span>
                ))}
              </div>
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
            {/* Prominent Book a Mitra Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0D211A] via-[#142D22] to-[#1C3B2B] text-[#F5F1E8] border border-[#DFB86C]/40 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#DFB86C] px-2.5 py-1 rounded-full bg-white/10 border border-[#DFB86C]/30">
                  Verified Local Guide
                </span>
                <span className="text-xs text-[#E8DFCF]/90 font-medium">From ₹{placeExperiences[0]?.pricePerPerson ?? 600}/person</span>
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-xl font-bold text-white">Experience {place.name} with a Mitra</h3>
                <p className="text-xs text-[#E8DFCF]/80 leading-relaxed">
                  Walk with a verified local resident who knows the stories, history, hidden courtyards, and fair prices.
                </p>
              </div>
              <Link
                href={`/booking?placeId=${place.id}${placeExperiences[0] ? `&experienceId=${placeExperiences[0].id}` : ''}`}
                id="sidebar-book-mitra-btn"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-[#DFB86C] hover:bg-[#cfa554] text-[#0D211A] font-bold text-sm shadow-md hover:shadow-lg transition-all transform active:scale-95"
              >
                <ShieldCheck className="w-4 h-4 text-[#0D211A]" />
                <span>Book a Mitra for this Place</span>
                <ArrowRight className="w-4 h-4 text-[#0D211A]" />
              </Link>
              <div className="flex items-center justify-center gap-3 text-[10px] text-[#E8DFCF]/70 pt-1">
                <span>✓ Fair Price Shield</span>
                <span>·</span>
                <span>✓ Verified Check-ins</span>
              </div>
            </div>

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

            {/* Mini map + directions */}
            {place.latitude !== null && (
              <div className="p-6 rounded-2xl bg-forest-900 text-[#F5F1E8] space-y-3">
                <h3 className="font-serif text-lg font-bold">See it on the map</h3>
                {staticMapUrl ? (
                  <a
                    href="/explore"
                    className="block rounded-xl overflow-hidden border border-white/15 hover:opacity-90 transition-opacity"
                    aria-label={`Open ${place.name} on the interactive map`}
                  >
                    <Image
                      src={staticMapUrl}
                      alt={`Map location of ${place.name}`}
                      width={480}
                      height={240}
                      className="w-full h-auto"
                      unoptimized
                    />
                  </a>
                ) : (
                  <p className="text-xs text-[#E8DFCF]/80">
                    Explore all 24 places and filter by the six heritage themes.
                  </p>
                )}
                <div className="flex flex-wrap gap-2 pt-1">
                  <Link
                    href="/explore"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#B8955A] hover:bg-[#a6844c] text-[#0D211A] text-xs font-bold transition-colors"
                  >
                    Open interactive map <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  {gmapsLink && (
                    <a
                      href={gmapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-white/25 text-[#F5F1E8] text-xs font-bold hover:bg-white/10 transition-colors"
                    >
                      Directions <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Food nearby (from the supplied street-food guide) */}
      {nearbyFood.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#B86B4B]">From the street-food guide</span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950">{`Food landmarks near ${place.name}`}</h2>
              <p className="text-xs text-charcoal-700">
                Distances are approximate straight-line estimates to venues from the supplied guide.
              </p>
            </div>
            <Link
              href="/food"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-800 hover:text-terracotta-600 transition-colors"
            >
              <span>View Full Street Food Guide</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {nearbyFood.map((f) => (
              <div
                key={f.id}
                className="flex flex-col sm:flex-row items-stretch overflow-hidden rounded-2xl bg-white border border-[#E8DFCF] hover:border-[#B8955A] shadow-sm hover:shadow-md transition-all group"
              >
                {f.image && (
                  <div className="relative w-full sm:w-44 h-40 sm:h-auto shrink-0 bg-[#0D211A] overflow-hidden">
                    <img
                      src={f.image}
                      alt={f.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#0D211A]/80 backdrop-blur-sm text-[10px] font-bold text-[#DFB86C]">
                      {f.category}
                    </div>
                  </div>
                )}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-serif text-lg font-bold text-forest-950">{f.name}</p>
                      <span className="text-xs font-bold text-[#B86B4B]">{f.indicativePriceRange}</span>
                    </div>
                    <p className="text-[11px] text-charcoal-600">{f.location}</p>
                    <p className="text-xs text-charcoal-800 leading-relaxed line-clamp-2">{f.description}</p>
                  </div>
                  <div className="pt-2 border-t border-[#E8DFCF]/70 flex items-center justify-between text-[11px]">
                    <span className="text-forest-800 font-medium">
                      <strong>Must try:</strong> {f.whatToTry.slice(0, 2).join(', ')}
                    </span>
                    <Link href="/food" className="text-terracotta-600 hover:underline font-bold">
                      Explore →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. Experiences here */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-terracotta-600">Bookable journeys</span>
          <h2 className="font-serif text-3xl font-bold text-forest-950">YATRAMITR experiences at {place.name}</h2>
          <p className="text-xs text-charcoal-700">Small-group experiences hosted by local Mitras, with Fair Price ranges.</p>
        </div>

        {placeExperiences.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {placeExperiences.map((exp) => (
              <ExperienceCard key={exp.id} experience={exp} />
            ))}
          </div>
        ) : (
          <div className="p-8 sm:p-10 rounded-2xl bg-white border border-[#E8DFCF] text-center space-y-4 shadow-sm max-w-2xl mx-auto">
            <div className="w-12 h-12 mx-auto rounded-full bg-forest-50 border border-forest-200 flex items-center justify-center text-forest-800">
              <ShieldCheck className="w-6 h-6 text-[#B86B4B]" />
            </div>
            <div className="space-y-1">
              <p className="font-serif text-xl font-bold text-[#0D211A]">Curate a Custom Yatra with a Mitra</p>
              <p className="text-xs text-[#1D2521]/70 max-w-md mx-auto leading-relaxed">
                Connect with an accredited local Mitra to guide your visit to {place.name} with verified heritage context and fair pricing.
              </p>
            </div>
            <Link
              href={`/booking?placeId=${place.id}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-forest-900 hover:bg-forest-950 text-[#DFB86C] font-bold text-xs shadow-md transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-[#DFB86C]" />
              <span>Book a Verified Mitra for {place.name}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </section>

      {/* 4. Mitras */}
      {mitras.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-terracotta-600">Verified hosts</span>
            <h2 className="font-serif text-3xl font-bold text-forest-950">Mitras who guide here</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mitras.map((m) => (
              <Link
                key={m!.id}
                href={`/mitras/${m!.id}`}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-[#E8DFCF] hover:border-[#B8955A] shadow-sm hover:shadow-md transition-all group"
              >
                <img
                  src={m!.avatar}
                  alt={m!.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#B8955A]/40 group-hover:border-[#B8955A] transition-colors shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-serif font-bold text-forest-950 truncate group-hover:text-terracotta-600 transition-colors">
                      {m!.name}
                    </p>
                    <ShieldCheck className="w-4 h-4 text-forest-700 shrink-0" />
                  </div>
                  <p className="text-xs text-charcoal-600 truncate">{m!.specialities?.[0] || m!.bio}</p>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-charcoal-700">
                    <span className="font-semibold text-forest-800">Trust {m!.trustScore}/100</span>
                    <span>·</span>
                    <span>{m!.languages.slice(0, 2).join(', ')}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
