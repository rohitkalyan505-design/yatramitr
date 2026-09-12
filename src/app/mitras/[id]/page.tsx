import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, Languages, ArrowRight, Quote } from 'lucide-react';
import { getMitraById, EXPERIENCES } from '@/data/experiences';
import { getPlaceById } from '@/data/places';
import TrustPassport from '@/components/ui/TrustPassport';
import ExperienceCard from '@/components/ui/ExperienceCard';
import DemoBadge from '@/components/ui/DemoBadge';

export function generateStaticParams() {
  // All mitras are demo profiles; expose their ids statically.
  return ['mitra-arjun', 'mitra-ayesha', 'mitra-rahul', 'mitra-meera'].map((id) => ({ id }));
}

export default function MitraPage({ params }: { params: { id: string } }) {
  const mitra = getMitraById(params.id);
  if (!mitra) notFound();

  const experiences = EXPERIENCES.filter((e) => e.mitraId === mitra.id);
  const homePlace = getPlaceById(mitra.homePlaceId);

  return (
    <div className="min-h-screen bg-page-mitras space-y-12 pb-20">
      {/* Hero */}
      <section className="bg-[#0D211A] text-[#F5F1E8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 space-y-4">
            <div className="flex items-center gap-2 text-xs">
              <Link href="/mitras" className="text-[#E8DFCF] hover:text-white">Mitras</Link>
              <span className="text-[#B8955A]">/</span>
              <span className="text-[#DFB86C] font-semibold">{mitra.name}</span>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white">{mitra.name}</h1>
              {mitra.isDemo && <DemoBadge label="Demo profile" />}
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-[#E8DFCF]">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/20">
                <MapPin className="w-3.5 h-3.5 text-[#DFB86C]" /> {mitra.location}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/20">
                <Languages className="w-3.5 h-3.5 text-[#DFB86C]" /> {mitra.languages.join(', ')}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/20">
                {mitra.experienceYears} years hosting
              </span>
            </div>
            <p className="text-sm sm:text-base text-[#E8DFCF] leading-relaxed max-w-2xl">{mitra.bio}</p>
            {mitra.quote && (
              <div className="flex items-start gap-2 text-sm italic text-[#DFB86C] pt-1">
                <Quote className="w-4 h-4 mt-1 shrink-0" />
                <span>{mitra.quote}</span>
              </div>
            )}
          </div>

          <div className="md:col-span-4">
            <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-[#B8955A] mx-auto">
              {mitra.avatar ? (
                <Image src={mitra.avatar} alt={mitra.name} fill className="object-cover" />
              ) : (
                <div className="absolute inset-0 bg-forest-900 flex items-center justify-center text-6xl font-serif text-[#DFB86C]">
                  {mitra.name.charAt(0)}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          {/* Experiences */}
          <section className="space-y-6">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950">Experiences hosted by {mitra.name.split(' ')[0]}</h2>
            {experiences.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {experiences.map((exp) => (
                  <ExperienceCard key={exp.id} experience={exp} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-charcoal-700">No live experiences yet — this Mitra is completing verification.</p>
            )}
          </section>

          {/* Specialities */}
          <section className="space-y-3">
            <h2 className="font-serif text-2xl font-bold text-forest-950">Specialities</h2>
            <div className="flex flex-wrap gap-2">
              {mitra.specialities.map((s, i) => (
                <span key={i} className="px-3 py-1.5 rounded-full bg-[#F5F1E8] border border-[#E8DFCF] text-xs font-semibold text-forest-900">
                  {s}
                </span>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <TrustPassport mitra={mitra} />

          {homePlace && (
            <div className="p-6 rounded-2xl bg-white border border-[#E8DFCF] space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#1D2521]/60">Home turf</p>
              <p className="font-serif text-lg font-bold text-forest-950">{homePlace.name}</p>
              <p className="text-xs text-[#1D2521]/70 line-clamp-2">{homePlace.touristExplanation}</p>
              <Link
                href={`/places/${homePlace.id}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-terracotta-600 hover:underline"
              >
                Explore {homePlace.name} <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
