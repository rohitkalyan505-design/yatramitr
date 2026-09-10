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
  MessageSquare,
  AlertTriangle
} from 'lucide-react';
import { MOCK_BUDDIES, MOCK_EXPERIENCES } from '@/data/mock-data';
import ExperienceCard from '@/components/experiences/ExperienceCard';
import VerificationBadge from '@/components/ui/VerificationBadge';

export function generateStaticParams() {
  return MOCK_BUDDIES.map((buddy) => ({
    id: buddy.id,
  }));
}

export default function BuddyProfilePage({ params }: { params: { id: string } }) {
  const buddy = MOCK_BUDDIES.find((b) => b.id === params.id);

  if (!buddy) {
    notFound();
  }

  // Experiences hosted by this buddy
  const hostedExperiences = MOCK_EXPERIENCES.filter((e) => e.hostBuddyId === buddy.id);
  const displayExperiences = hostedExperiences.length > 0 ? hostedExperiences : [MOCK_EXPERIENCES[0]];

  return (
    <div className="space-y-12 sm:space-y-16 pb-20">
      {/* 1. Profile Header with Cover & Avatar */}
      <section className="relative bg-sand-100 border-b border-sand-300">
        <div className="relative h-48 sm:h-64 w-full bg-forest-950 overflow-hidden">
          {buddy.coverImage && (
            <Image
              src={buddy.coverImage}
              alt={buddy.name}
              fill
              className="object-cover opacity-50"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-transparent to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 relative -mt-16 sm:-mt-20">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-4 border-sand-50 shadow-xl bg-sand-200 shrink-0">
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
                  <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest-950">
                    {buddy.name}
                  </h1>
                  <ShieldCheck className="w-6 h-6 text-forest-700 shrink-0" />
                </div>
                <div className="flex items-center gap-2 text-xs text-charcoal-700 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-terracotta-600" />
                  <span>{buddy.location}, {buddy.state}</span>
                  <span>•</span>
                  <span>{buddy.yearsOfResidency} Years Local Native</span>
                </div>
              </div>
            </div>

            {/* Knowledge Radial / Score Card */}
            <div className="p-4 rounded-xl bg-sand-50 border border-gold-500/40 shadow-sm flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-forest-900 border-2 border-gold-400 flex flex-col items-center justify-center text-gold-300 shadow">
                <span className="font-serif text-base font-black leading-none">{buddy.knowledgeScore}%</span>
                <span className="text-[8px] uppercase tracking-wider text-sand-300">Score</span>
              </div>
              <div className="text-xs">
                <p className="font-bold text-forest-950">Native Knowledge Exam</p>
                <p className="text-[11px] text-charcoal-600">Passed with distinction</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Detailed Body Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Bio, Story, Verification */}
          <div className="lg:col-span-8 space-y-10">
            {/* 3-Tier Verification Details */}
            <div className="p-6 rounded-2xl bg-sand-100 border border-sand-300 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold text-forest-950 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-forest-700" />
                  <span>Platform Verification Credentials</span>
                </h3>
                <span className="text-[11px] font-bold text-forest-800 bg-forest-100 px-2.5 py-0.5 rounded border border-forest-200">
                  Fully Vetted
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-sand-50 border border-sand-200 space-y-1">
                  <div className="flex items-center gap-1.5 text-forest-900 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-forest-700" />
                    <span>Identity Verified</span>
                  </div>
                  <p className="text-[11px] text-charcoal-600">Government ID & biometric address check confirmed.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-sand-50 border border-sand-200 space-y-1">
                  <div className="flex items-center gap-1.5 text-forest-900 font-bold">
                    <Award className="w-4 h-4 text-forest-700" />
                    <span>Knowledge Assessment</span>
                  </div>
                  <p className="text-[11px] text-charcoal-600">Scored {buddy.knowledgeScore}/100 in regional oral lore exam.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-sand-50 border border-sand-200 space-y-1">
                  <div className="flex items-center gap-1.5 text-forest-900 font-bold">
                    <HeartPulse className="w-4 h-4 text-forest-700" />
                    <span>Safety Orientation</span>
                  </div>
                  <p className="text-[11px] text-charcoal-600">{buddy.safetyCertifiedDate}.</p>
                </div>
              </div>

              <p className="text-[11px] text-charcoal-600 italic border-t border-sand-200 pt-2 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-terracotta-600 shrink-0" />
                <span>Notice: Verification confirms host background and training. We do not claim or guarantee 100% emergency response in wild terrains.</span>
              </p>
            </div>

            {/* About & Philosophy */}
            <div className="space-y-4">
              <h2 className="font-serif text-2xl font-bold text-forest-950">
                About {buddy.name}
              </h2>
              <p className="text-sm sm:text-base text-charcoal-800 leading-relaxed font-serif">
                {buddy.bio}
              </p>
              <div className="p-4 rounded-xl bg-forest-50 border-l-4 border-forest-800 text-xs text-forest-950">
                <p className="font-serif font-bold text-sm italic">
                  "{buddy.quote}"
                </p>
              </div>
            </div>

            {/* Heritage Connection */}
            <div className="space-y-3 border-t border-sand-300 pt-8">
              <h3 className="font-serif text-xl font-bold text-forest-950">
                Ancestral Roots & Regional Lineage
              </h3>
              <p className="text-sm text-charcoal-800 leading-relaxed">
                {buddy.heritageConnection}
              </p>
            </div>

            {/* Specialties & Fields of Knowledge */}
            <div className="space-y-3 border-t border-sand-300 pt-8">
              <h3 className="font-serif text-xl font-bold text-forest-950">
                Specialized Knowledge Areas
              </h3>
              <div className="flex flex-wrap gap-2">
                {buddy.specialties.map((specialty, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-lg bg-sand-100 text-forest-950 text-xs font-semibold border border-sand-300"
                  >
                    ★ {specialty}
                  </span>
                ))}
              </div>
            </div>

            {/* Experiences Hosted By this Buddy */}
            <div className="space-y-6 border-t border-sand-300 pt-8">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider font-bold text-terracotta-600">
                  Bookable Immersions
                </span>
                <h3 className="font-serif text-2xl font-bold text-forest-950">
                  Journeys Crafted by {buddy.name}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {displayExperiences.map((exp) => (
                  <ExperienceCard key={exp.id} experience={exp} />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Host Stats & Contact Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-2xl bg-sand-50 border border-forest-900/15 shadow-sm space-y-5 sticky top-24">
              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-wider font-bold text-charcoal-600">
                  Host Credentials
                </span>
                <h3 className="font-serif text-xl font-bold text-forest-950">
                  Community Reputation
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-sand-100 border border-sand-200">
                  <span className="text-charcoal-600 block text-[11px]">Rating</span>
                  <span className="font-serif text-lg font-bold text-forest-900 flex items-center gap-1">
                    <Star className="w-4 h-4 text-gold-500 fill-gold-500" />
                    {buddy.rating}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-sand-100 border border-sand-200">
                  <span className="text-charcoal-600 block text-[11px]">Reviews</span>
                  <span className="font-serif text-lg font-bold text-forest-900">
                    {buddy.reviewCount}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-sand-100 border border-sand-200">
                  <span className="text-charcoal-600 block text-[11px]">Travelers Hosted</span>
                  <span className="font-serif text-lg font-bold text-forest-900">
                    {buddy.hostedTravelersCount}+
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-sand-100 border border-sand-200">
                  <span className="text-charcoal-600 block text-[11px]">Residency</span>
                  <span className="font-serif text-lg font-bold text-forest-900">
                    {buddy.yearsOfResidency} yrs
                  </span>
                </div>
              </div>

              {/* Spoken Languages */}
              <div className="space-y-2 pt-2 border-t border-sand-200 text-xs">
                <div className="flex items-center gap-1.5 text-forest-950 font-bold">
                  <Languages className="w-4 h-4 text-terracotta-600" />
                  <span>Languages Spoken</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {buddy.languages.map((lang, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 rounded bg-sand-200 text-charcoal-800 font-medium text-[11px]"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              {/* Booking CTA */}
              <div className="pt-3 border-t border-sand-200 space-y-2">
                <Link
                  href={`/experiences/${displayExperiences[0].id}`}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-forest-900 hover:bg-forest-800 text-sand-50 font-bold text-xs shadow-md transition-colors"
                >
                  <span>Book Experience with {buddy.name.split(' ')[0]}</span>
                  <ArrowRight className="w-4 h-4 text-gold-400" />
                </Link>
                <p className="text-[10px] text-center text-charcoal-600">
                  Direct host connection • Fair community compensation
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
