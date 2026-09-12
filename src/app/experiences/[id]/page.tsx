import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Clock, Users, MapPin, ShieldCheck, CheckCircle2,
  ArrowRight, Info, Languages,
} from 'lucide-react';
import { getExperienceById, getMitraById, EXPERIENCES } from '@/data/experiences';
import { getPlaceById } from '@/data/places';
import FairPriceCard from '@/components/ui/FairPriceCard';
import TrustPassport from '@/components/ui/TrustPassport';
import ExperienceCard from '@/components/ui/ExperienceCard';
import DemoBadge from '@/components/ui/DemoBadge';
import { formatCurrency } from '@/lib/utils';

export function generateStaticParams() {
  return EXPERIENCES.map((e) => ({ id: e.id }));
}

export default function ExperiencePage({ params }: { params: { id: string } }) {
  const experience = getExperienceById(params.id);
  if (!experience) notFound();

  const mitra = getMitraById(experience.mitraId);
  const place = getPlaceById(experience.placeId);

  const pressureColor =
    experience.crowdLevel === 'Low' ? '#2D7A4F' : experience.crowdLevel === 'Medium' ? '#C5A059' : '#BD5338';

  return (
    <div className="min-h-screen bg-page-experiences space-y-12 sm:space-y-16 pb-20">
      {/* 1. Hero */}
      <section className="relative w-full min-h-[50vh] sm:min-h-[58vh] flex flex-col justify-end bg-forest-950 text-[#F5F1E8] overflow-hidden">
        <div className="absolute inset-0 z-0">
          {experience.image ? (
            <Image src={experience.image} alt={experience.title} fill priority className="object-cover opacity-60" />
          ) : (
            <div className="absolute inset-0 bg-topo-pattern opacity-40" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 w-full space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Link href="/" className="text-[#E8DFCF] hover:text-white">Home</Link>
            <span className="text-[#B8955A]">/</span>
            <Link href={`/places/${experience.placeId}`} className="text-[#E8DFCF] hover:text-white">
              {experience.placeName}
            </Link>
            <span className="text-[#B8955A]">/</span>
            <span className="text-[#DFB86C] font-semibold truncate">{experience.title}</span>
          </div>

          <div className="space-y-2 max-w-4xl">
            <span className="text-xs font-bold uppercase tracking-widest text-[#DFB86C]">{experience.category}</span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white">{experience.title}</h1>
            <p className="text-sm sm:text-base text-[#E8DFCF] leading-relaxed max-w-3xl">{experience.summary}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/20">
              <Clock className="w-3.5 h-3.5 text-[#DFB86C]" /> {experience.durationLabel}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/20">
              <Users className="w-3.5 h-3.5 text-[#DFB86C]" /> Max {experience.groupCap} travellers
            </span>
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-semibold"
              style={{ backgroundColor: `${pressureColor}33`, border: `1px solid ${pressureColor}` }}
            >
              {experience.crowdLevel} crowd
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/20">
              <Languages className="w-3.5 h-3.5 text-[#DFB86C]" /> {experience.languages.join(', ')}
            </span>
          </div>
        </div>
      </section>

      {/* 2. Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left */}
          <div className="lg:col-span-8 space-y-10">
            {/* Mitra banner */}
            {mitra && (
              <div className="p-5 rounded-2xl bg-[#F5F1E8] border border-[#E8DFCF] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-forest-800 shrink-0">
                    {mitra.avatar ? (
                      <Image src={mitra.avatar} alt={mitra.name} fill className="object-cover" />
                    ) : (
                      <div className="absolute inset-0 bg-forest-800 flex items-center justify-center text-[#DFB86C] font-serif font-bold">
                        {mitra.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-serif text-lg font-bold text-forest-950">Hosted by {mitra.name}</h3>
                      {mitra.isDemo && <DemoBadge />}
                    </div>
                    <p className="text-xs text-charcoal-700">{mitra.location} · Trust Score {mitra.trustScore}/100</p>
                  </div>
                </div>
                <Link
                  href={`/mitras/${mitra.id}`}
                  className="px-4 py-2 rounded-lg border border-forest-900/30 text-forest-900 text-xs font-semibold hover:bg-white/60 transition-colors shrink-0"
                >
                  View Trust Passport
                </Link>
              </div>
            )}

            {/* Description */}
            <section className="space-y-3">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950">The experience</h2>
              <p className="text-base text-charcoal-800 leading-relaxed">{experience.description}</p>
              {place && (
                <div className="p-4 rounded-xl bg-forest-50 border border-forest-200/80 text-xs text-forest-950 space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" /> About {place.name}
                  </p>
                  <p className="leading-relaxed">{place.touristExplanation}</p>
                  <Link href={`/places/${place.id}`} className="inline-flex items-center gap-1 font-bold text-terracotta-600 hover:underline mt-1">
                    Full history & why it matters <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )}
            </section>

            {/* Inclusions */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-[#F5F1E8] border border-[#E8DFCF] space-y-3">
                <h4 className="font-serif text-lg font-bold text-forest-950 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-forest-700" /> What is included
                </h4>
                <ul className="space-y-2 text-xs text-charcoal-800">
                  {experience.inclusions.map((inc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-forest-700 mt-1.5 shrink-0" />
                      {inc}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-6 rounded-2xl bg-[#F5F1E8] border border-[#E8DFCF] space-y-3">
                <h4 className="font-serif text-lg font-bold text-forest-950 flex items-center gap-2">
                  <Info className="w-5 h-5 text-terracotta-600" /> Good to know
                </h4>
                <ul className="space-y-2 text-xs text-charcoal-800">
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-terracotta-600 mt-1.5 shrink-0" /> Meeting point: {experience.meetingPoint}</li>
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-terracotta-600 mt-1.5 shrink-0" /> Availability status: {experience.status === 'prototype_availability' ? 'Prototype availability — dates confirmed by your Mitra after booking request' : 'Available'}</li>
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-terracotta-600 mt-1.5 shrink-0" /> Entry tickets to monuments are not included unless stated</li>
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-terracotta-600 mt-1.5 shrink-0" /> No payment is taken in this MVP — bookings are requests</li>
                </ul>
              </div>
            </section>

            {/* Safety */}
            <section className="p-5 rounded-2xl bg-[#F5F1E8] border-l-4 border-forest-800 space-y-2 text-xs text-charcoal-800">
              <p className="font-bold text-forest-950 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Safety information
              </p>
              <p>• Stay with your Mitra in crowded bazaar areas and follow their route guidance.</p>
              <p>• Emergency services India-wide: <strong>112</strong>. Ambulance: <strong>108</strong>. These are also available inside Live Trip Mode.</p>
              <p>• Respect dress codes at religious sites; your Mitra will brief you before each stop.</p>
              <p>• Share your trip with a trusted contact using Live Trip Mode&apos;s SHARE TRIP.</p>
            </section>

            {/* Verified Reviews Section */}
            <section className="space-y-4 pt-4 border-t border-[#E8DFCF]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-forest-950">Verified Yatra Reviews</h3>
                  <p className="text-xs text-charcoal-700 mt-0.5">
                    Reviews can only be left by travellers who completed this booking and stamped Live Trip checkpoints.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-50 border border-forest-200 text-forest-900 text-xs font-bold shrink-0 self-start sm:self-auto">
                  <CheckCircle2 className="w-3.5 h-3.5 text-forest-700" /> 100% Verified Reviews
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-[#F5F1E8] border border-[#E8DFCF] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#16352A] text-[#DFB86C] font-bold text-xs flex items-center justify-center">
                        P
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#0D211A]">Priya S.</p>
                        <p className="text-[10px] text-[#1D2521]/60">Travelled with {mitra?.name ?? 'Mitra'}</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-forest-100 text-forest-800 text-[10px] font-bold">
                      ✓ Verified Yatra
                    </span>
                  </div>
                  <div className="flex text-[#DFB86C] text-xs">★★★★★</div>
                  <p className="text-xs text-[#1D2521]/80 leading-relaxed">
                    &ldquo;An authentic immersion! Navigating the quieter courtyards around {experience.placeName} with our Mitra gave us cultural depth we never would have discovered on our own.&rdquo;
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#F5F1E8] border border-[#E8DFCF] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#B86B4B] text-white font-bold text-xs flex items-center justify-center">
                        R
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#0D211A]">Rahul V.</p>
                        <p className="text-[10px] text-[#1D2521]/60">Verified Traveller</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-forest-100 text-forest-800 text-[10px] font-bold">
                      ✓ Verified Yatra
                    </span>
                  </div>
                  <div className="flex text-[#DFB86C] text-xs">★★★★★</div>
                  <p className="text-xs text-[#1D2521]/80 leading-relaxed">
                    &ldquo;The small group cap of max {experience.groupCap} travellers made all the difference. Respectful, unhurried, and our Mitra explained the historical details with genuine passion.&rdquo;
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Right — sticky booking rail */}
          <div className="lg:col-span-4 space-y-6">
            <div className="space-y-6 lg:sticky lg:top-24">
              <FairPriceCard experience={experience} />

              {/* Booking card */}
              <div className="p-6 rounded-2xl bg-forest-900 text-[#F5F1E8] space-y-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-[#DFB86C]">Book this Yatra</span>
                  <span className="font-serif text-2xl font-extrabold">{formatCurrency(experience.pricePerPerson)}</span>
                </div>
                <p className="text-[11px] text-[#E8DFCF]/80 leading-relaxed">
                  Booking request confirmed instantly in this MVP — no payment gateway, nothing charged. Your
                  Mitra confirms the exact date afterwards.
                </p>
                <Link
                  href={`/booking?experienceId=${experience.id}`}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#B8955A] hover:bg-[#a6844c] text-forest-950 font-bold text-sm shadow-md transition-colors"
                >
                  Book experience <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="text-[10px] text-center text-[#E8DFCF]/60">
                  Prototype availability — dates confirmed by your Mitra
                </p>
              </div>

              {/* Trust passport */}
              {mitra && <TrustPassport mitra={mitra} compact />}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Related */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950">More experiences like this</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {EXPERIENCES.filter((e) => e.id !== experience.id && e.category === experience.category)
            .concat(EXPERIENCES.filter((e) => e.id !== experience.id && e.category !== experience.category))
            .slice(0, 3)
            .map((exp) => (
              <ExperienceCard key={exp.id} experience={exp} />
            ))}
        </div>
      </section>
    </div>
  );
}
