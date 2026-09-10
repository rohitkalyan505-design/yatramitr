import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  Clock, 
  Users, 
  ShieldCheck, 
  MapPin, 
  Star, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Sparkles,
  Calendar,
  Compass
} from 'lucide-react';
import { MOCK_EXPERIENCES, MOCK_BUDDIES } from '@/data/mock-data';

export function generateStaticParams() {
  const ids = MOCK_EXPERIENCES.map((e) => ({ id: e.id }));
  return [...ids, { id: 'katiki' }];
}

export default function ExperienceDetailsPage({ params }: { params: { id: string } }) {
  const targetId = params.id === 'katiki' ? 'katiki' : params.id;
  const experience = MOCK_EXPERIENCES.find((e) => e.id === targetId || e.id === params.id) || MOCK_EXPERIENCES[0];

  if (!experience) {
    notFound();
  }

  const hostBuddy = MOCK_BUDDIES.find((b) => b.id === experience.hostBuddyId) || MOCK_BUDDIES[0];

  return (
    <div className="space-y-12 sm:space-y-16 pb-20 pt-16">
      {/* 1. Header & Hero Image */}
      <section className="relative w-full min-h-[50vh] sm:min-h-[60vh] flex flex-col justify-end bg-[#0D211A] text-[#F5F1E8] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={experience.image}
            alt={experience.title}
            fill
            priority
            className="object-cover opacity-60 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D211A] via-[#0D211A]/50 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 w-full space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <Link href="/" className="text-[#E8DFCF] hover:text-[#FFFFFF]">Home</Link>
            <span className="text-[#B8955A]">/</span>
            <Link href="/place/araku" className="text-[#E8DFCF] hover:text-[#FFFFFF]">
              {experience.destinationName}
            </Link>
            <span className="text-[#B8955A]">/</span>
            <span className="text-[#B8955A] font-semibold truncate">{experience.title}</span>
          </div>

          <div className="max-w-4xl space-y-2">
            <span className="text-xs uppercase tracking-wider font-bold text-[#B86B4B]">
              {experience.category}
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#FFFFFF]">
              {experience.title}
            </h1>
            <p className="text-sm sm:text-base text-[#E8DFCF] leading-relaxed max-w-3xl">
              {experience.summary}
            </p>
          </div>

          {/* Key Metric Chips */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 text-xs text-[#E8DFCF]">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#B8955A]" />
              <span>Duration: <strong className="text-[#FFFFFF]">{experience.duration}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#B8955A]" />
              <span>Capped at: <strong className="text-[#FFFFFF]">{experience.groupCap} travellers max</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-[#B8955A] fill-[#B8955A]" />
              <span>{experience.rating} ({experience.reviewCount} reviews)</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Content & Booking Widget */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-10">
            {/* Host Presentation */}
            <div className="p-6 rounded-2xl bg-[#F5F1E8] border border-[#E8DFCF] flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#B8955A] shrink-0">
                  <Image
                    src={hostBuddy.avatar}
                    alt={hostBuddy.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <span className="text-xs text-[#B86B4B] uppercase font-bold tracking-wider block">
                    Hosted by Verified Local
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#0D211A]">
                    {hostBuddy.name}
                  </h3>
                  <p className="text-xs text-[#1D2521]/70">
                    {hostBuddy.location} • Native Knowledge Score: {hostBuddy.knowledgeScore}%
                  </p>
                </div>
              </div>

              <Link
                href={`/buddy/${hostBuddy.id}`}
                className="hidden sm:inline-flex items-center gap-1 px-4 py-2 rounded-md border border-[#16352A]/30 text-xs font-semibold text-[#16352A] hover:bg-white transition-colors"
              >
                <span>View Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h2 className="font-serif text-2xl font-bold text-[#0D211A]">
                The Journey Experience
              </h2>
              <p className="text-sm sm:text-base text-[#1D2521]/80 leading-relaxed font-serif">
                {experience.description}
              </p>
            </div>

            {/* Itinerary Timeline */}
            <div className="space-y-6">
              <h3 className="font-serif text-2xl font-bold text-[#0D211A]">
                Step-by-Step Flow
              </h3>
              <div className="space-y-4 border-l-2 border-[#B8955A]/40 pl-6 ml-2">
                {experience.itinerary.map((step, idx) => (
                  <div key={idx} className="relative space-y-1">
                    <span className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-[#16352A] border-2 border-[#FAF8F5]" />
                    <span className="text-xs font-bold text-[#B86B4B] uppercase tracking-wider block">
                      {step.timeSlot}
                    </span>
                    <h4 className="font-serif font-bold text-base text-[#0D211A]">
                      {step.activity}
                    </h4>
                    <p className="text-xs sm:text-sm text-[#1D2521]/75 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Inclusions */}
            <div className="space-y-4">
              <h3 className="font-serif text-2xl font-bold text-[#0D211A]">
                What is Included
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                {experience.inclusions.map((inc, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-[#E8DFCF]">
                    <CheckCircle2 className="w-4 h-4 text-[#16352A] shrink-0 mt-0.5" />
                    <span>{inc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Meeting Point */}
            <div className="p-6 rounded-2xl bg-white border border-[#E8DFCF] space-y-2">
              <h4 className="font-serif font-bold text-base text-[#0D211A] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#B86B4B]" />
                Exact Meeting Point
              </h4>
              <p className="text-sm font-semibold text-[#0D211A]">
                {experience.meetingPoint.title}
              </p>
              <p className="text-xs text-[#1D2521]/70">
                {experience.meetingPoint.landmark} ({experience.meetingPoint.coordinatesText})
              </p>
            </div>
          </div>

          {/* Booking Card Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 p-6 sm:p-8 rounded-2xl bg-white border border-[#E8DFCF] shadow-xl space-y-6">
              <div className="flex items-baseline justify-between pb-4 border-b border-[#E8DFCF]">
                <div>
                  <span className="font-serif text-3xl font-bold text-[#0D211A]">
                    ₹{experience.pricePerPerson}
                  </span>
                  <span className="text-xs text-[#1D2521]/60"> / person</span>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-[#16352A]/10 text-[#16352A]">
                  Direct Local Rate
                </span>
              </div>

              {/* Price Breakdown Preview */}
              <div className="space-y-2.5 text-xs text-[#1D2521]/75">
                <div className="flex justify-between">
                  <span>Host payout (95%)</span>
                  <span>₹{Math.round(experience.pricePerPerson * 0.95)}</span>
                </div>
                <div className="flex justify-between text-[#16352A] font-medium">
                  <span>Tribal Eco & Artisan Fund (5%)</span>
                  <span>₹{Math.round(experience.pricePerPerson * 0.05)}</span>
                </div>
              </div>

              <Link
                href={`/booking?experienceId=${experience.id}`}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-md bg-[#16352A] hover:bg-[#0D211A] text-[#F5F1E8] font-bold text-sm shadow transition-colors"
              >
                <span>Reserve with {hostBuddy.name}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <p className="text-[11px] text-center text-[#1D2521]/60 leading-relaxed">
                Zero booking fees. Strictly limited to {experience.groupCap} guests to respect rural life.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
