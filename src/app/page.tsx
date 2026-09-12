'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  Check, 
  Star,
  ChevronRight,
  FileCheck,
  Tag,
  AlertCircle
} from 'lucide-react';
import HeroSection from '@/components/hero/HeroSection';
import HyderabadMap from '@/components/map/HyderabadMap';
import { PLACES } from '@/data/places';
import { EXPERIENCES, MITRAS, DEMO_TRAVELLERS } from '@/data/experiences';
import type { HiddenGem, TravelMatch, PlaceCategory } from '@/types';

// Homepage hidden-gem shortlist — derived from the real dataset
const HIDDEN_GEMS: HiddenGem[] = [
  {
    id: 'quiet-heritage-lanes',
    name: 'Quiet Heritage Lanes of the Old City',
    location: 'Old City, Hyderabad',
    shortDescription: 'Residential lanes, old courtyards and living workshops away from the busiest circuit.',
    experienceType: 'Heritage Walk',
    estimatedPrice: 600,
    image: '/images/experiences/quiet-heritage-lanes.jpg',
    whyMatchesYou: [
      'Quieter than the Charminar main circuit.',
      'Great for architecture lovers.',
      'Local stories from a lifelong resident.',
      'Small groups of max 3 travellers.'
    ],
    recommendedBuddyId: 'mitra-ayesha',
    experienceId: 'quiet-heritage-lanes'
  },
  {
    id: 'old-city-food-walk',
    name: 'Old City Food Trail',
    location: 'Old City, Hyderabad',
    shortDescription: 'A guided tasting trail through the old city\u2019s legendary food lanes.',
    experienceType: 'Food & Culture',
    estimatedPrice: 700,
    image: '/images/experiences/old-city-food-walk.jpg',
    whyMatchesYou: [
      'Discover Hyderabad\u2019s Deccani food traditions.',
      '5–6 guided tasting stops, food costs included.',
      'Learn the stories behind each dish.',
      'Hygiene-checked vendor selection.'
    ],
    recommendedBuddyId: 'mitra-arjun',
    experienceId: 'old-city-food-walk'
  },
  {
    id: 'crafts-makers-afternoon',
    name: 'Crafts & Makers Afternoon',
    location: 'Shilparamam, HITEC City',
    shortDescription: 'Meet Telangana\u2019s working artisans and buy direct from makers.',
    experienceType: 'Arts & Crafts',
    estimatedPrice: 550,
    image: '/images/experiences/crafts-makers-afternoon.jpg',
    whyMatchesYou: [
      'Meet 3–4 working artisan families.',
      'Watch crafts being made, not just sold.',
      'Fair-trade buying guidance.',
      'Supports lower-pressure craft neighbourhoods.'
    ],
    recommendedBuddyId: 'mitra-meera',
    experienceId: 'crafts-makers-afternoon'
  },
  {
    id: 'golconda-fort-deep-walk',
    name: 'Golconda Fort Deep Walk',
    location: 'Golconda, Hyderabad',
    shortDescription: 'Acoustics, water systems, royal apartments and the hilltop Bala Hisar.',
    experienceType: 'History & Architecture',
    estimatedPrice: 750,
    image: '/images/experiences/golconda-fort-deep-walk.jpg',
    whyMatchesYou: [
      'Qutb Shahi capital history in depth.',
      'The famous acoustic demonstration.',
      'Stories beyond the standard tourist route.',
      'Ends at the best viewpoint in Hyderabad.'
    ],
    recommendedBuddyId: 'mitra-rahul',
    experienceId: 'golconda-fort-deep-walk'
  }
];

const TRAVEL_MATCHES: TravelMatch[] = DEMO_TRAVELLERS.map((t) => ({
  id: t.id,
  name: t.displayName,
  city: t.city,
  tags: t.sharedInterests,
  matchPercentage: t.matchScore,
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  travelStyle: `${t.travelStyle} pace · ${t.languages.join(', ')}`,
  upcomingDestination: 'Hyderabad'
}));


export default function HomePage() {
  const [selectedGem, setSelectedGem] = useState<HiddenGem>(HIDDEN_GEMS[0]);
  const [selectedMatch, setSelectedMatch] = useState(TRAVEL_MATCHES[0]);
  const [mapCategory, setMapCategory] = useState<PlaceCategory | 'All'>('All');

  const filteredMapPlaces = mapCategory === 'All' ? PLACES : PLACES.filter(p => p.category === mapCategory);

  // Featured experiences for Hyderabad
  const featuredExperiences = [
    EXPERIENCES.find(e => e.id === 'old-city-heritage-walk') ?? EXPERIENCES[0],
    EXPERIENCES.find(e => e.id === 'golconda-fort-deep-walk') ?? EXPERIENCES[1],
    EXPERIENCES.find(e => e.id === 'crafts-makers-afternoon') ?? EXPERIENCES[2],
  ];

  // 3 Featured Local Mitras (demo profiles)
  const featuredBuddies = [
    MITRAS.find(b => b.id === 'mitra-arjun') ?? MITRAS[0],
    MITRAS.find(b => b.id === 'mitra-ayesha') ?? MITRAS[1],
    MITRAS.find(b => b.id === 'mitra-rahul') ?? MITRAS[2],
  ];

  return (
    <div className="bg-page-home text-[#1D2521] selection:bg-[#B86B4B] selection:text-white">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. "Beyond the tourist map." (Editorial Problem & Manifesto) */}
      <section id="beyond-map" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-motif-arch">
        <div className="max-w-3xl mb-16 space-y-4">
          <span className="text-xs font-semibold tracking-[0.2em] text-[#B86B4B] uppercase block">
            The Purpose
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#0D211A] tracking-tight leading-tight">
            Beyond the tourist map.
          </h2>
          <p className="text-base sm:text-lg text-[#1D2521]/80 leading-relaxed font-normal">
            Most travellers see the same landmarks, eat at the same restaurants and follow the same routes. YATRAMITR helps them discover the places, stories and experiences that rarely appear on the usual itinerary.
          </p>
        </div>

        {/* 3 Editorial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-card-elevated space-y-4 hover:border-[#B8955A]/50 transition-colors">
            <span className="font-serif text-3xl sm:text-4xl font-light text-[#B86B4B] block">
              01
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0D211A]">
              Hidden Places
            </h3>
            <p className="text-sm text-[#1D2521]/75 leading-relaxed">
              Quieter heritage lanes, working artisan studios, and living food traditions — curated with local Mitras so your spending reaches more neighbourhoods.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-card-elevated space-y-4 hover:border-[#B8955A]/50 transition-colors">
            <span className="font-serif text-3xl sm:text-4xl font-light text-[#B86B4B] block">
              02
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0D211A]">
              Verified Local Mitras
            </h3>
            <p className="text-sm text-[#1D2521]/75 leading-relaxed">
              Lifelong residents progressing through a transparent five-step verification workflow — identity, residency, knowledge, safety and community references, all visible on their Trust Passport.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-card-elevated space-y-4 hover:border-[#B8955A]/50 transition-colors">
            <span className="font-serif text-3xl sm:text-4xl font-light text-[#B86B4B] block">
              03
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0D211A]">
              Authentic Experiences
            </h3>
            <p className="text-sm text-[#1D2521]/75 leading-relaxed">
              Host-crafted small-group immersions capped at 3–5 travellers, with Fair Price ranges and a proposed 95% Mitra / 5% community contribution model.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Hidden Gems Section: "Hyderabad, beyond the obvious." */}
      <section className="py-24 bg-section-cream border-y border-[#E8DFCF] bg-motif-jali">
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
              href="/explore"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#16352A] hover:text-[#B86B4B] transition-colors"
            >
              <span>Explore full Hyderabad guide</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 4 Destination Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {HIDDEN_GEMS.map((gem) => {
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
                  href={`/experiences/${selectedGem.experienceId}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#16352A] hover:bg-[#0D211A] text-[#F5F1E8] text-sm font-semibold transition-colors"
                >
                  <span>Book with Local Mitra</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href={`/places/${selectedGem.id === 'golconda-fort-deep-walk' ? 'golconda-fort' : selectedGem.id === 'crafts-makers-afternoon' ? 'shilparamam' : 'charminar'}`}
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

      {/* 4. Interactive Yatra Map Section */}
      <section id="interactive-map" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-semibold tracking-[0.2em] text-[#B86B4B] uppercase block">
              Geographic Discovery
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0D211A]">
              Interactive Yatra Map
            </h2>
            <p className="text-sm sm:text-base text-[#1D2521]/80 leading-relaxed">
              Explore 23 verified destinations across Hyderabad and Telangana. Switch between India national context, regional Telangana scope, and historic Hyderabad city center with live pin interactions.
            </p>
          </div>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#16352A] hover:bg-[#0D211A] text-[#FAF8F5] text-sm font-bold shadow-sm transition-colors shrink-0"
          >
            <span>Explore the Full Map</span>
            <ArrowRight className="w-4 h-4 text-[#DFB86C]" />
          </Link>
        </div>

        <div className="rounded-2xl overflow-hidden border border-[#E8DFCF] bg-white p-4 shadow-sm space-y-4">
          <HyderabadMap
            places={filteredMapPlaces}
            experiences={EXPERIENCES}
            foods={[]}
            selectedCategory={mapCategory}
            onSelectCategory={setMapCategory}
            height="500px"
          />
        </div>
      </section>

      {/* 5. Local Mitra Section: "Don't just visit. Meet someone who knows." */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative bg-motif-arch">
        <div className="max-w-2xl mb-14 space-y-3">
          <span className="text-xs font-semibold tracking-[0.2em] text-[#B86B4B] uppercase block">
            The Human Connection
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0D211A]">
            Don&apos;t just visit. Meet someone who knows.
          </h2>
          <p className="text-sm sm:text-base text-[#1D2521]/80">
            Every Mitra carries a transparent Trust Passport — see exactly which verification steps are complete, pending, or not started. No hidden claims, no fake badges.
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
                        Trust {buddy.trustScore}/100
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
                    {buddy.specialities.map((spec: string, i: number) => (
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
                <div className="flex items-center gap-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#16352A]/10 text-[#16352A] text-xs font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified Workflow</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#F5F1E8] border border-[#E8DFCF] text-[#16352A] text-[10px] font-bold uppercase tracking-wider">
                    Demo Profile
                  </span>
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
      <section className="py-24 bg-section-warm border-y border-[#E8DFCF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-14 space-y-3">
            <span className="text-xs font-semibold tracking-[0.2em] text-[#B86B4B] uppercase block">
              Host-Crafted Journeys
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0D211A]">
              Travel like a local.
            </h2>              <p className="text-sm sm:text-base text-[#1D2521]/80">
                Small-group experiences guided by local Mitras. Transparent Fair Price ranges with the proposed community contribution built in.
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
                      <span>{exp.durationLabel}</span>
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
                    href={`/experiences/${exp.id}`}
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
              Travelling solo shouldn’t mean travelling lonely or compromising on remote trail safety. YATRAMITR connects compatible travellers based on:
            </p>

            <ul className="space-y-2.5 text-sm text-[#1D2521]/85">
              <li className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B86B4B]" />
                <span><strong>Interests:</strong> heritage, food, crafts, architecture, photography or local stories.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B86B4B]" />
                <span><strong>Travel style:</strong> slow wandering, balanced exploring, or fast discovery.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B86B4B]" />
                <span><strong>Budget & pace:</strong> mutual alignment without awkward financial mismatch.</span>
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
                  <span className="text-xs text-[#1D2521]/60">Demo pool · matched for Hyderabad</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#16352A]/10 text-[#16352A] font-bold text-xs">
                  {selectedMatch.matchPercentage}% match · demo
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
                  {TRAVEL_MATCHES.map((m) => (
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
      <section id="trust" className="py-24 bg-section-cream border-y border-[#E8DFCF] bg-motif-jali">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-14 space-y-3">
            <span className="text-xs font-semibold tracking-[0.2em] text-[#B86B4B] uppercase block">
              Core Principles
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0D211A]">
              Built around trust.
            </h2>
            <p className="text-sm sm:text-base text-[#1D2521]/80 leading-relaxed">
              We replace opaque intermediaries with transparent verification, fair price guidance and direct community accountability.
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
                Oral geography test and safety assessment steps in the Mitra verification workflow, completed before any experience goes live.
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
                Zero hidden commercial commissions. Under the proposed model, 95% goes to the Mitra; 5% supports local community initiatives.
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
                Live Trip Mode checkpoints, verified emergency numbers (112 / 108), and direct incident escalation tools.
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
                Verified reviews linked to completed bookings only — every review carries a ✓ Verified Yatra badge. No fabricated social proof.
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
          <p className="text-sm text-[#1D2521]/80">
            Four simple steps to experience Hyderabad beyond the standard tourist trail.
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
              Select your interests, budget, crowd preference and travel rhythm — get matched in seconds.
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
              Explore 24 real places across six heritage themes, filtered your way.
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
              Connect directly with local Mitras for small-group journeys with transparent trust information.
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
              Travel with Live Trip checkpoints, fair price guidance and visible community impact.
            </p>
          </div>
        </div>
      </section>

      {/* 9b. Verified Reviews: 4 Cards in 1 Row on Desktop */}
      <section className="py-20 bg-section-warm border-y border-[#E8DFCF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div className="space-y-2 max-w-2xl">
              <span className="text-xs font-semibold tracking-[0.2em] text-[#B86B4B] uppercase block">
                Community Verification
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0D211A]">
                Traveller Stories & Verified Reviews
              </h2>
              <p className="text-xs sm:text-sm text-[#1D2521]/75">
                Every review originates from a completed booking with verified checkpoint stamps — zero fabricated social proof.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-forest-100 border border-forest-300 text-forest-900 text-xs font-bold shrink-0 self-start sm:self-auto">
              <ShieldCheck className="w-4 h-4 text-forest-700" />
              <span>100% Completed Yatras</span>
            </span>
          </div>

          {/* 4 Cards strictly in 1 Row on Desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                name: 'Priya Sharma',
                origin: 'Bengaluru',
                experience: 'Quiet Heritage Lanes',
                mitra: 'Mitra Ayesha',
                rating: 5,
                text: 'The residential courtyards around Charminar showed us an unhurried, living heritage side of Hyderabad we never knew existed.',
              },
              {
                name: 'Rahul Verma',
                origin: 'Mumbai',
                experience: 'Golconda Fort Deep Walk',
                mitra: 'Mitra Rahul',
                rating: 5,
                text: 'Hearing the clapping acoustics echo to Bala Hisar with someone who grew up studying the fort was truly unforgettable.',
              },
              {
                name: 'Ananya Sen',
                origin: 'Kolkata',
                experience: 'Crafts & Makers Afternoon',
                mitra: 'Mitra Meera',
                rating: 5,
                text: 'Meeting working Bidriware and Cheriyal scroll artisans directly, with zero commercial rush. Authentic and transparent.',
              },
              {
                name: 'David Miller',
                origin: 'London',
                experience: 'Old City Food Trail',
                mitra: 'Mitra Arjun',
                rating: 5,
                text: 'The Irani chai and Nizami breakfast tasting stops were vetted and hygienic. An extraordinary, respectful cultural morning.',
              },
            ].map((review, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-white border border-[#E8DFCF] shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-forest-50 text-forest-800 text-[10px] font-bold">
                      ✓ Verified Yatra
                    </span>
                    <span className="text-xs text-[#B8955A] font-bold">{'★'.repeat(review.rating)}</span>
                  </div>
                  <p className="text-xs text-[#1D2521]/80 leading-relaxed italic">
                    &ldquo;{review.text}&rdquo;
                  </p>
                </div>
                <div className="pt-3 border-t border-[#E8DFCF]/70">
                  <p className="text-xs font-bold text-[#0D211A]">{review.name}</p>
                  <p className="text-[10px] text-[#1D2521]/60">{review.origin} · {review.experience}</p>
                  <p className="text-[10px] text-forest-700 font-semibold mt-0.5">{review.mitra}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9c. Emergency & Safety Section */}
      <section id="emergency-safety-section" className="py-20 bg-section-paper border-b border-[#E8DFCF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <span className="text-xs font-semibold tracking-[0.2em] text-[#B86B4B] uppercase block">
                Traveler Protection & Crisis Response
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0D211A]">
                Emergency & Safety Assistance
              </h2>
              <p className="text-xs sm:text-sm text-[#1D2521]/75">
                Official Telangana and national statutory emergency hotlines. Accessible 24/7 over cellular voice without requiring internet connectivity.
              </p>
            </div>
            <Link
              href="/safety"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-forest-900 text-[#DFB86C] text-xs font-bold hover:bg-forest-950 transition-colors shrink-0 self-start sm:self-auto"
            >
              <span>Full Safety Protocol</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                number: '112',
                tel: 'tel:112',
                title: 'National Emergency',
                desc: 'Police, fire and immediate rescue operations across Hyderabad & Telangana.',
                color: 'text-red-700 bg-red-50 border-red-200 hover:border-red-400',
                btnColor: 'bg-red-600 hover:bg-red-700 text-white',
              },
              {
                number: '108',
                tel: 'tel:108',
                title: 'Ambulance Service',
                desc: 'Telangana Government 24/7 medical emergencies and paramedic dispatch.',
                color: 'text-amber-800 bg-amber-50 border-amber-200 hover:border-amber-400',
                btnColor: 'bg-amber-600 hover:bg-amber-700 text-white',
              },
              {
                number: '1091',
                tel: 'tel:1091',
                title: 'Women Helpline',
                desc: 'Direct access to Hyderabad Police She Teams for round-the-clock safety.',
                color: 'text-rose-800 bg-rose-50 border-rose-200 hover:border-rose-400',
                btnColor: 'bg-rose-600 hover:bg-rose-700 text-white',
              },
              {
                number: '1363',
                tel: 'tel:1363',
                title: 'Tourist Helpline',
                desc: 'Ministry of Tourism multilingual helpline for visitor advisories and aid.',
                color: 'text-forest-900 bg-forest-50 border-forest-200 hover:border-forest-400',
                btnColor: 'bg-[#B8955A] hover:bg-[#a6844c] text-[#0D211A]',
              },
            ].map((item) => (
              <div
                key={item.number}
                className="p-5 rounded-2xl bg-white border border-[#E8DFCF] shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-all hover:-translate-y-0.5"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-3xl font-black text-forest-950 tracking-tight">
                      {item.number}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.color}`}>
                      24/7 Hotline
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-base text-forest-950">{item.title}</h3>
                  <p className="text-xs text-charcoal-700 leading-relaxed">{item.desc}</p>
                </div>
                <a
                  href={item.tel}
                  className={`w-full py-2.5 rounded-xl text-center text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 active:scale-95 ${item.btnColor}`}
                >
                  <span>Dial {item.number}</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Become a Mitra CTA Section */}
      <section className="relative py-24 sm:py-32 bg-section-forest text-[#F5F1E8] overflow-hidden">
        {/* Subtle Background Image */}
        <div className="absolute inset-0 opacity-25">
          <Image
            src="/images/places/chowmahalla-palace.jpg"
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
              Your hometown is someone&apos;s next adventure.
            </h2>
            <p className="text-base sm:text-lg text-[#E8DFCF] leading-relaxed">
              Share your local knowledge, create authentic experiences and earn from tourism in your neighbourhood.
            </p>

            <div className="pt-2">
              <Link
                href="/become-mitra"
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
