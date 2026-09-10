'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Compass, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  IndianRupee, 
  ArrowRight, 
  Users, 
  Sparkles, 
  Check, 
  Star,
  ChevronRight,
  Shield,
  FileCheck,
  Tag,
  AlertCircle
} from 'lucide-react';
import HeroSection from '@/components/hero/HeroSection';
import { ARAKU_HIDDEN_GEMS, MOCK_BUDDIES, MOCK_EXPERIENCES, MOCK_TRAVEL_MATCHES } from '@/data/mock-data';
import { HiddenGem } from '@/types';


export default function HomePage() {
  const [selectedGem, setSelectedGem] = useState<HiddenGem>(ARAKU_HIDDEN_GEMS[0]);
  const [selectedMatch, setSelectedMatch] = useState(MOCK_TRAVEL_MATCHES[0]);

  // Featured experiences for Hyderabad

const featuredExperiences = [
  MOCK_EXPERIENCES.find(e => e.id === 'hyderabad-old-city') || MOCK_EXPERIENCES[0],
  MOCK_EXPERIENCES.find(e => e.id === 'hyderabad-food-walk') || MOCK_EXPERIENCES[1],
  MOCK_EXPERIENCES.find(e => e.id === 'hyderabad-heritage-lanes') || MOCK_EXPERIENCES[2],
];

  // 3 Featured Local Mitras
  const featuredBuddies = [
    MOCK_BUDDIES.find(b => b.id === 'sai-kumar') || MOCK_BUDDIES[0],
    MOCK_BUDDIES.find(b => b.id === 'ayesha-khan') || MOCK_BUDDIES[1],
    MOCK_BUDDIES.find(b => b.id === 'rahul-naik') || MOCK_BUDDIES[2],
  ];

  return (
    <div className="bg-[#FAF8F5] text-[#1D2521] selection:bg-[#B86B4B] selection:text-white">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. "Beyond the tourist map." (Editorial Problem & Manifesto) */}
      <section id="beyond-map" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-3xl mb-16 space-y-4">
          <span className="text-xs font-semibold tracking-[0.2em] text-[#B86B4B] uppercase block">
            The Purpose
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#0D211A] tracking-tight leading-tight">
            Beyond the tourist map.
          </h2>
          <p className="text-base sm:text-lg text-[#1D2521]/80 leading-relaxed font-normal">
            Most travellers see the same landmarks, eat at the same restaurants and follow the same routes. Yatra Mitra helps them discover the places, stories and experiences that rarely appear on the usual itinerary.
          </p>
        </div>

        {/* 3 Editorial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-xl bg-[#F5F1E8] border border-[#E8DFCF] space-y-4 hover:border-[#B8955A]/50 transition-colors">
            <span className="font-serif text-3xl sm:text-4xl font-light text-[#B86B4B] block">
              01
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0D211A]">
              Hidden Places
            </h3>
            <p className="text-sm text-[#1D2521]/75 leading-relaxed">
              Quiet forest trails, unmapped freshwater springs, and heritage groves documented responsibly to prevent ecological strain and overtourism.
            </p>
          </div>

          <div className="p-8 rounded-xl bg-[#F5F1E8] border border-[#E8DFCF] space-y-4 hover:border-[#B8955A]/50 transition-colors">
            <span className="font-serif text-3xl sm:text-4xl font-light text-[#B86B4B] block">
              02
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0D211A]">
              Verified Local Mitras
            </h3>
            <p className="text-sm text-[#1D2521]/75 leading-relaxed">
              Lifelong residents who have undergone physical identity verification, native geography examinations, and wilderness ethics orientations.
            </p>
          </div>

          <div className="p-8 rounded-xl bg-[#F5F1E8] border border-[#E8DFCF] space-y-4 hover:border-[#B8955A]/50 transition-colors">
            <span className="font-serif text-3xl sm:text-4xl font-light text-[#B86B4B] block">
              03
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0D211A]">
              Authentic Experiences
            </h3>
            <p className="text-sm text-[#1D2521]/75 leading-relaxed">
              Host-crafted small-group immersions capped at 4–5 travellers. Direct resident earnings and 5% contribution to regional community funds.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Hidden Gems Section: "Hyderabad, beyond the obvious." */}
      <section className="py-24 bg-[#F5F1E8] border-y border-[#E8DFCF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14">
            <div className="space-y-3 max-w-2xl">
              <span className="text-xs font-semibold tracking-[0.2em] text-[#B86B4B] uppercase block">
                Featured Demonstration Hub
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0D211A]">
                Hyderabad, beyond the obvious.
              </h2>
              <p className="text-sm sm:text-base text-[#1D2521]/80">
                Discover Hyderabad’s hidden cultural spots, historic neighbourhoods, and local experiences beyond the usual tourist trail.
              </p>
            </div>
            <Link
              href="/place/hyderabad"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#16352A] hover:text-[#B86B4B] transition-colors"
            >
              <span>Explore full Hyderabad guide</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 4 Destination Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ARAKU_HIDDEN_GEMS.map((gem) => {
              const isSelected = selectedGem.id === gem.id;
              return (
                <div
                  key={gem.id}
                  onClick={() => setSelectedGem(gem)}
                  className={`group rounded-xl overflow-hidden bg-white border cursor-pointer transition-all duration-300 flex flex-col ${
                    isSelected
                      ? 'border-[#16352A] ring-2 ring-[#16352A]/20 shadow-lg -translate-y-1'
                      : 'border-[#E8DFCF] hover:border-[#B8955A] hover:shadow-md'
                  }`}
                >
                  {/* Card Image */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#E8DFCF]">
                    <Image
                      src={gem.image}
                      alt={gem.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded bg-[#0D211A]/80 backdrop-blur-sm text-xs font-medium text-[#F5F1E8]">
                      ₹{gem.estimatedPrice}
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <div className="text-[11px] font-semibold text-[#B86B4B] uppercase tracking-wider">
                        {gem.experienceType}
                      </div>
                      <h3 className="font-serif text-lg font-bold text-[#0D211A]">
                        {gem.name}
                      </h3>
                      <p className="text-xs text-[#1D2521]/75 leading-relaxed line-clamp-2">
                        {gem.shortDescription}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#E8DFCF]/60 flex items-center justify-between text-xs">
                      <span className="text-[#1D2521]/60 truncate max-w-[130px]">
                        {gem.location}
                      </span>
                      <span className={`font-semibold flex items-center gap-1 ${isSelected ? 'text-[#16352A]' : 'text-[#B86B4B]'}`}>
                        {isSelected ? 'Viewing' : 'Explore'}
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 4. "WHY THIS PLACE?" Context Area */}
          <div className="mt-12 p-8 sm:p-10 rounded-2xl bg-white border border-[#16352A]/20 shadow-sm">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-[#E8DFCF]">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#B86B4B]">
                  <Sparkles className="w-4 h-4" />
                  <span>Why this matches you</span>
                </div>
                <h4 className="font-serif text-2xl font-bold text-[#0D211A]">
                  {selectedGem.name} Insights
                </h4>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href={`/experience/${selectedGem.experienceId}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#16352A] hover:bg-[#0D211A] text-[#F5F1E8] text-sm font-semibold transition-colors"
                >
                  <span>Book with Local Mitra</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/place/hyderabad"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md border border-[#16352A]/30 text-[#0D211A] text-sm font-medium hover:bg-[#F5F1E8] transition-colors"
                >
                  <span>Place Details</span>
                </Link>
              </div>
            </div>

            {/* Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
              {selectedGem.whyMatchesYou.map((reason, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#16352A]/10 text-[#16352A] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <p className="text-xs sm:text-sm text-[#1D2521]/85 leading-snug">
                    {reason}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Local Mitra Section: "Don't just visit. Meet someone who knows." */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-2xl mb-14 space-y-3">
          <span className="text-xs font-semibold tracking-[0.2em] text-[#B86B4B] uppercase block">
            The Human Connection
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0D211A]">
            Don't just visit. Meet someone who knows.
          </h2>
          <p className="text-sm sm:text-base text-[#1D2521]/80">
            Every Local Mitra is a native resident carrying lifelong knowledge of local terrain, seasonal flora, and cultural traditions.
          </p>
        </div>

        {/* 3 Profile Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredBuddies.map((buddy) => (
            <div
              key={buddy.id}
              className="rounded-2xl bg-white border border-[#E8DFCF] p-6 shadow-sm flex flex-col justify-between space-y-6 hover:shadow-md transition-shadow"
            >
              <div className="space-y-5">
                {/* Header: Photo & Name */}
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#B8955A] shrink-0">
                    <Image
                      src={buddy.avatar}
                      alt={buddy.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#0D211A]">
                      {buddy.name}
                    </h3>
                    <p className="text-xs text-[#1D2521]/70">
                      {buddy.location}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="flex text-[#B8955A]">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-[#0D211A]">
                        {buddy.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Languages */}
                <div className="space-y-1">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-[#1D2521]/60 block">
                    Languages
                  </span>
                  <p className="text-xs font-medium text-[#0D211A]">
                    {buddy.languages.join(' · ')}
                  </p>
                </div>

                {/* Specialities */}
                <div className="space-y-2">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-[#1D2521]/60 block">
                    Specialities
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {buddy.specialties.map((spec, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md bg-[#F5F1E8] text-[#16352A] text-xs font-medium border border-[#E8DFCF]"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Verification Badge */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#16352A]/10 text-[#16352A] text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Local Mitra</span>
                </div>
              </div>

              {/* Action */}
              <div className="pt-4 border-t border-[#E8DFCF]">
                <Link
                  href={`/mitras/${buddy.id}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-md bg-[#16352A] hover:bg-[#0D211A] text-[#F5F1E8] text-sm font-semibold transition-colors"
                >
                  <span>View Mitra</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Experience Section: "Travel like a local." */}
      <section className="py-24 bg-[#F5F1E8] border-y border-[#E8DFCF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-14 space-y-3">
            <span className="text-xs font-semibold tracking-[0.2em] text-[#B86B4B] uppercase block">
              Host-Crafted Journeys
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0D211A]">
              Travel like a local.
            </h2>
            <p className="text-sm sm:text-base text-[#1D2521]/80">
              Thoughtfully paced small-group immersions guided by verified residents. Transparent pricing with community contributions built in.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredExperiences.map((exp) => (
              <div
                key={exp.id}
                className="rounded-2xl overflow-hidden bg-white border border-[#E8DFCF] flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
              >
                <div>
                  {/* Image */}
                  <div className="relative aspect-[16/10] w-full bg-[#E8DFCF]">
                    <Image
                      src={exp.image}
                      alt={exp.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded bg-[#0D211A]/85 backdrop-blur-sm text-xs font-semibold text-[#F5F1E8] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#B8955A]" />
                      <span>{exp.duration}</span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#B86B4B] uppercase tracking-wider">
                        ₹{exp.pricePerPerson} per person
                      </span>
                      <span className="text-xs text-[#1D2521]/60">
                        Max {exp.groupCap} travellers
                      </span>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-[#0D211A]">
                      {exp.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#1D2521]/75 leading-relaxed">
                      {exp.summary}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    href={exp.id === 'katiki' ? '/experience/katiki' : `/experiences/${exp.id}`}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-md border-2 border-[#16352A] text-[#16352A] hover:bg-[#16352A] hover:text-[#F5F1E8] text-sm font-bold transition-colors"
                  >
                    <span>View Experience</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Smart Matching: "Find people who travel like you." */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Explanation */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-semibold tracking-[0.2em] text-[#B86B4B] uppercase block">
              Smart Compatibility Matching
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0D211A] leading-tight">
              Find people who travel like you.
            </h2>
            <p className="text-sm sm:text-base text-[#1D2521]/80 leading-relaxed font-normal">
              Travelling solo shouldn’t mean travelling lonely or compromising on remote trail safety. Yatra Mitra connects compatible travellers based on:
            </p>

            <ul className="space-y-2.5 text-sm text-[#1D2521]/85">
              <li className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B86B4B]" />
                <span><strong>Interests:</strong> Indigenous agriculture, wildlife, tribal folklore, or photography.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B86B4B]" />
                <span><strong>Travel style:</strong> Slow walking, silent contemplation, or rustic homestays.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B86B4B]" />
                <span><strong>Budget & pace:</strong> Mutual alignment without awkward financial mismatch.</span>
              </li>
            </ul>

            <div className="pt-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-[#16352A] hover:bg-[#0D211A] text-[#F5F1E8] text-sm font-semibold shadow transition-colors"
              >
                <span>Find my travel match</span>
                <ArrowRight className="w-4 h-4 text-[#B8955A]" />
              </Link>
            </div>
          </div>

          {/* Right Example UI Card */}
          <div className="lg:col-span-6">
            <div className="p-8 sm:p-10 rounded-2xl bg-white border border-[#E8DFCF] shadow-lg space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E8DFCF]">
                <div>
                  <span className="text-xs text-[#B86B4B] uppercase tracking-wider font-semibold block">
                    Your travel match
                  </span>
                  <span className="text-xs text-[#1D2521]/60">Matched for Hyderabad</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#16352A]/10 text-[#16352A] font-bold text-xs">
                  {selectedMatch.matchPercentage}% match
                </span>
              </div>

              {/* Match Details */}
              <div className="flex items-center gap-5">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border border-[#E8DFCF] shrink-0">
                  <Image
                    src={selectedMatch.avatar}
                    alt={selectedMatch.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-serif text-xl font-bold text-[#0D211A]">
                    {selectedMatch.name} · {selectedMatch.city}
                  </h4>
                  <p className="text-xs text-[#1D2521]/70 mt-0.5">
                    {selectedMatch.travelStyle}
                  </p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {selectedMatch.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full bg-[#F5F1E8] text-xs font-semibold text-[#16352A]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Small Switcher for Demo */}
              <div className="pt-4 border-t border-[#E8DFCF] flex items-center justify-between text-xs text-[#1D2521]/60">
                <span>View other matches:</span>
                <div className="flex gap-2">
                  {MOCK_TRAVEL_MATCHES.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMatch(m)}
                      className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                        selectedMatch.id === m.id
                          ? 'bg-[#16352A] text-white'
                          : 'bg-[#F5F1E8] hover:bg-[#E8DFCF]'
                      }`}
                    >
                      {m.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Trust & Safety: "Built around trust." */}
      <section id="trust" className="py-24 bg-[#F5F1E8] border-y border-[#E8DFCF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-14 space-y-3">
            <span className="text-xs font-semibold tracking-[0.2em] text-[#B86B4B] uppercase block">
              Core Principles
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0D211A]">
              Built around trust.
            </h2>
            <p className="text-sm sm:text-base text-[#1D2521]/80">
              We replace opaque intermediary travel agents with transparent local verification and direct community accountability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="p-6 rounded-xl bg-white border border-[#E8DFCF] space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#16352A]/10 text-[#16352A] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#0D211A]">
                Verified Local Mitras
              </h3>
              <p className="text-xs text-[#1D2521]/75 leading-relaxed">
                Physical government ID verification, local residency confirmation, and native reference checks.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border border-[#E8DFCF] space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#16352A]/10 text-[#16352A] flex items-center justify-center">
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#0D211A]">
                Knowledge & Experience
              </h3>
              <p className="text-xs text-[#1D2521]/75 leading-relaxed">
                Oral geography test and wilderness safety assessment passed before any public experience is listed.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border border-[#E8DFCF] space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#16352A]/10 text-[#16352A] flex items-center justify-center">
                <Tag className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#0D211A]">
                Transparent Pricing
              </h3>
              <p className="text-xs text-[#1D2521]/75 leading-relaxed">
                Zero hidden commercial commissions. 95% goes to the Mitra; 5% directly funds local ecological trusts.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border border-[#E8DFCF] space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#16352A]/10 text-[#16352A] flex items-center justify-center">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#0D211A]">
                Report & Safety Tools
              </h3>
              <p className="text-xs text-[#1D2521]/75 leading-relaxed">
                Live Trip Mode checkpoints, local forest ranger contacts, and direct incident escalation tools.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border border-[#E8DFCF] space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#16352A]/10 text-[#16352A] flex items-center justify-center">
                <Star className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#0D211A]">
                Community Reputation
              </h3>
              <p className="text-xs text-[#1D2521]/75 leading-relaxed">
                Verified reviews from conscious travellers with genuine village impact tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. How It Works: 4 Simple Steps */}
      <section id="how-it-works" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-2xl mb-16 space-y-3">
          <span className="text-xs font-semibold tracking-[0.2em] text-[#B86B4B] uppercase block">
            The Flow
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0D211A]">
            How It Works
          </h2>
          <p className="text-sm sm:text-base text-[#1D2521]/80">
            Four simple steps to experience India beyond the standard tourist trail.
          </p>
        </div>

        {/* Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {/* Step 01 */}
          <div className="space-y-4 relative">
            <span className="font-serif text-4xl font-light text-[#B86B4B] block">
              01
            </span>
            <div className="h-0.5 w-12 bg-[#B86B4B]" />
            <h3 className="font-serif text-xl font-bold text-[#0D211A]">
              Tell us what you want
            </h3>
            <p className="text-xs sm:text-sm text-[#1D2521]/75 leading-relaxed">
              Select your crowd tolerance, regional interest, and travel rhythm.
            </p>
          </div>

          {/* Step 02 */}
          <div className="space-y-4 relative">
            <span className="font-serif text-4xl font-light text-[#B86B4B] block">
              02
            </span>
            <div className="h-0.5 w-12 bg-[#B86B4B]" />
            <h3 className="font-serif text-xl font-bold text-[#0D211A]">
              Discover hidden places
            </h3>
            <p className="text-xs sm:text-sm text-[#1D2521]/75 leading-relaxed">
              Explore curated, low-density ecosystems with uncommercialized local trails.
            </p>
          </div>

          {/* Step 03 */}
          <div className="space-y-4 relative">
            <span className="font-serif text-4xl font-light text-[#B86B4B] block">
              03
            </span>
            <div className="h-0.5 w-12 bg-[#B86B4B]" />
            <h3 className="font-serif text-xl font-bold text-[#0D211A]">
              Meet a verified local
            </h3>
            <p className="text-xs sm:text-sm text-[#1D2521]/75 leading-relaxed">
              Connect directly with vetted native guardians for intimate micro-group journeys.
            </p>
          </div>

          {/* Step 04 */}
          <div className="space-y-4 relative">
            <span className="font-serif text-4xl font-light text-[#B86B4B] block">
              04
            </span>
            <div className="h-0.5 w-12 bg-[#B86B4B]" />
            <h3 className="font-serif text-xl font-bold text-[#0D211A]">
              Experience India differently
            </h3>
            <p className="text-xs sm:text-sm text-[#1D2521]/75 leading-relaxed">
              Travel peacefully with live trail checkpoints and direct resident benefits.
            </p>
          </div>
        </div>
      </section>

      {/* 10. Become a Mitra CTA Section */}
      <section className="relative py-24 sm:py-32 bg-[#0D211A] text-[#F5F1E8] overflow-hidden">
        {/* Subtle Background Image */}
        <div className="absolute inset-0 opacity-25">
          <Image
            src="https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=2000&q=80"
            alt="Indian local community and village landscape"
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D211A] via-[#0D211A]/90 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-6">
            <span className="text-xs font-semibold tracking-[0.2em] text-[#B8955A] uppercase block">
              Community Stewardship
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#FFFFFF] leading-tight">
              Your hometown is someone's next adventure.
            </h2>
            <p className="text-base sm:text-lg text-[#E8DFCF] leading-relaxed">
              Share your local knowledge, create authentic experiences and earn from tourism in your community.
            </p>

            <div className="pt-2">
              <Link
                href="/become-a-mitra"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-md bg-[#B8955A] hover:bg-[#a6844c] text-[#0D211A] font-bold text-base shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                <span>Become a Local Mitra</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
