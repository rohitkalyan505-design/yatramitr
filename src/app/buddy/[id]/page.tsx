import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  ShieldCheck, 
  Award, 
  HeartPulse, 
  Star, 
  MapPin, 
  Languages, 
  Calendar, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { MOCK_BUDDIES, MOCK_EXPERIENCES } from '@/data/mock-data';
import ExperienceCard from '@/components/experiences/ExperienceCard';
import VerificationBadge from '@/components/ui/VerificationBadge';

export function generateStaticParams() {
  const ids = MOCK_BUDDIES.map((b) => ({ id: b.id }));
  return [...ids, { id: 'sai-kumar' }];
}

export default function BuddyProfilePage({ params }: { params: { id: string } }) {
  const targetId = params.id === 'sai-kumar' ? 'sai-kumar' : params.id;
  const buddy = MOCK_BUDDIES.find((b) => b.id === targetId || b.id === params.id) || MOCK_BUDDIES[0];

  if (!buddy) {
    notFound();
  }

  // Experiences hosted by this buddy
  const hostedExperiences = MOCK_EXPERIENCES.filter((e) => e.hostBuddyId === buddy.id || (buddy.id === 'arjun-reddy' && e.destinationId === 'hyderabad'));
  const displayExperiences = hostedExperiences.length > 0 ? hostedExperiences : [MOCK_EXPERIENCES[0]];

  return (
    <div className="space-y-12 sm:space-y-16 pb-20 pt-16">
      {/* 1. Profile Header with Cover & Avatar */}
      <section className="relative bg-[#F5F1E8] border-b border-[#E8DFCF]">
        <div className="relative h-48 sm:h-64 w-full bg-[#0D211A] overflow-hidden">
          {buddy.coverImage && (
            <Image
              src={buddy.coverImage}
              alt={buddy.name}
              fill
              className="object-cover opacity-50"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D211A] via-transparent to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 relative -mt-16 sm:-mt-20">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-4 border-[#FAF8F5] shadow-xl bg-[#E8DFCF] shrink-0">
                <Image
                  src={buddy.avatar}
                  alt={buddy.name}
                  fill
                  priority
                  className="object-cover"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0D211A]">
                    {buddy.name}
                  </h1>
                  <ShieldCheck className="w-6 h-6 text-[#16352A] shrink-0" />
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-[#1D2521]/75">
                  <span className="flex items-center gap-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#B86B4B]" />
                    {buddy.location}, {buddy.state}
                  </span>
                  <span>•</span>
                  <span>Lifelong Native ({buddy.yearsOfResidency} yrs)</span>
                </div>
              </div>
            </div>

            {/* Quick Rating & Primary CTA */}
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="p-3.5 rounded-xl bg-white border border-[#E8DFCF] text-center shrink-0">
                <div className="flex items-center justify-center gap-1 text-[#B8955A]">
                  <Star className="w-4 h-4 fill-[#B8955A]" />
                  <span className="font-serif text-xl font-bold text-[#0D211A]">{buddy.rating.toFixed(1)}</span>
                </div>
                <span className="text-[10px] text-[#1D2521]/60 block">{buddy.reviewCount} Reviews</span>
              </div>

              <Link
                href={`/booking?experienceId=${displayExperiences[0]?.id || 'katiki'}`}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-md bg-[#16352A] hover:bg-[#0D211A] text-[#F5F1E8] font-semibold text-sm shadow transition-colors"
              >
                <span>Request Journey</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Three-Tier Trust Verification Badges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 rounded-2xl bg-white border border-[#E8DFCF] shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-[#B86B4B] block mb-4">
            Three-Tier Trust & Integrity Verification
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-[#16352A]/10 text-[#16352A] shrink-0 mt-0.5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-serif font-bold text-sm text-[#0D211A]">1. Physical Identity Verified</h4>
                <p className="text-xs text-[#1D2521]/75">Govt Aadhaar + Voter ID checked against local village residency panchayat records.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-[#16352A]/10 text-[#16352A] shrink-0 mt-0.5">
                <Award className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-serif font-bold text-sm text-[#0D211A]">2. Native Geography Examination ({buddy.knowledgeScore}%)</h4>
                <p className="text-xs text-[#1D2521]/75">Tested on oral tribal history, non-tourist trails, medicinal flora, and sacred grove codes.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-[#16352A]/10 text-[#16352A] shrink-0 mt-0.5">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-serif font-bold text-sm text-[#0D211A]">3. Terrain & Wilderness Safety Protocol</h4>
                <p className="text-xs text-[#1D2521]/75">{buddy.safetyCertifiedDate}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Bio & Heritage Connection */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-8">
            <div className="space-y-3">
              <h2 className="font-serif text-2xl font-bold text-[#0D211A]">
                About {buddy.name}
              </h2>
              <p className="text-base text-[#1D2521]/80 leading-relaxed font-serif">
                "{buddy.quote}"
              </p>
              <p className="text-sm sm:text-base text-[#1D2521]/80 leading-relaxed">
                {buddy.bio}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F5F1E8] border-l-4 border-[#16352A] space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#16352A] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#B8955A]" />
                Generational Heritage Tie
              </span>
              <p className="text-sm text-[#1D2521]/80 leading-relaxed">
                {buddy.heritageConnection}
              </p>
            </div>

            {/* Experiences Hosted */}
            <div className="space-y-6 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-2xl font-bold text-[#0D211A]">
                  Experiences Hosted by {buddy.name}
                </h3>
                <span className="text-xs text-[#1D2521]/60">Micro-groups capped at 4</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {displayExperiences.map((exp) => (
                  <ExperienceCard key={exp.id} experience={exp} />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-[#E8DFCF] shadow-sm space-y-5">
              <h3 className="font-serif text-lg font-bold text-[#0D211A]">
                Credentials & Languages
              </h3>

              <div className="space-y-1.5">
                <span className="text-xs text-[#1D2521]/60 font-semibold uppercase tracking-wider block">Languages Spoken</span>
                <p className="text-sm font-medium text-[#0D211A]">{buddy.languages.join(', ')}</p>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs text-[#1D2521]/60 font-semibold uppercase tracking-wider block">Specialties</span>
                <div className="flex flex-wrap gap-1.5">
                  {buddy.specialties.map((s, i) => (
                    <span key={i} className="px-2.5 py-1 rounded bg-[#F5F1E8] text-xs font-semibold text-[#16352A] border border-[#E8DFCF]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5 pt-3 border-t border-[#E8DFCF]">
                <span className="text-xs text-[#1D2521]/60 font-semibold uppercase tracking-wider block">Travelers Hosted</span>
                <p className="font-serif text-xl font-bold text-[#0D211A]">{buddy.hostedTravelersCount}+ conscious guests</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
