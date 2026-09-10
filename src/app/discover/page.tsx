'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  MapPin, 
  Star, 
  ShieldCheck, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  SlidersHorizontal,
  Compass,
  Clock,
  HeartHandshake
} from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import { MOCK_RECOMMENDATIONS } from '@/data/mock-data';

export default function DiscoverPage() {
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedInterest, setSelectedInterest] = useState<string>('All');
  const [selectedCrowd, setSelectedCrowd] = useState<string>('All');
  const [selectedBudget, setSelectedBudget] = useState<string>('All');
  const [selectedTime, setSelectedTime] = useState<string>('All');
  const [travelType, setTravelType] = useState<string>('Solo');

  const [recommendations, setRecommendations] = useState(MOCK_RECOMMENDATIONS);
  const [isFiltering, setIsFiltering] = useState(false);

  const handleFilterApply = () => {
    setIsFiltering(true);
    setTimeout(() => {
      setIsFiltering(false);
      if (selectedInterest === 'Nature & Waterfalls' || selectedRegion === 'Eastern Ghats') {
        setRecommendations([MOCK_RECOMMENDATIONS[0], MOCK_RECOMMENDATIONS[1]]);
      } else if (selectedInterest === 'Ancient Architecture' || selectedRegion === 'Deccan Plateau') {
        setRecommendations([MOCK_RECOMMENDATIONS[1], MOCK_RECOMMENDATIONS[0]]);
      } else {
        setRecommendations(MOCK_RECOMMENDATIONS);
      }
    }, 350);
  };

  const resetFilters = () => {
    setSelectedRegion('All');
    setSelectedInterest('All');
    setSelectedCrowd('All');
    setSelectedBudget('All');
    setSelectedTime('All');
    setRecommendations(MOCK_RECOMMENDATIONS);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-12">
      {/* Editorial Header */}
      <div className="space-y-3 max-w-3xl">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-terracotta-600">
          <Compass className="w-3.5 h-3.5" />
          <span>Contextual Route Matching</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-forest-950">
          Discover Hidden Places
        </h1>
        <p className="text-sm sm:text-base text-charcoal-700 leading-relaxed">
          Configure your travel preferences below. Our contextual framework pairs your personal rhythm with vetted lesser-known destinations and verified native custodians.
        </p>
      </div>

      {/* Filter Matrix Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-sand-100 border border-sand-300 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-sand-300 pb-4">
          <div className="flex items-center gap-2 text-forest-950 font-bold text-base">
            <SlidersHorizontal className="w-4 h-4 text-forest-800" />
            <span>Travel Preference Parameters</span>
          </div>
          <button
            onClick={resetFilters}
            className="text-xs font-semibold text-terracotta-600 hover:text-terracotta-700 underline"
          >
            Reset All
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs font-medium">
          {/* Region / Geography */}
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider font-bold text-charcoal-700 block">
              Geography / Region
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-sand-50 border border-sand-300 text-charcoal-800 text-xs font-semibold focus:outline-none focus:border-forest-800"
            >
              <option value="All">Any Region in India</option>
              <option value="Eastern Ghats">Eastern Ghats (Araku Valley)</option>
              <option value="Deccan Plateau">Deccan Plateau (Gandikota)</option>
              <option value="Northeast">Northeast (Ziro & Majuli)</option>
              <option value="Himalayas">Himalayas (Chopta Meadow)</option>
            </select>
          </div>

          {/* Core Cultural Interest */}
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider font-bold text-charcoal-700 block">
              Core Cultural Interest
            </label>
            <select
              value={selectedInterest}
              onChange={(e) => setSelectedInterest(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-sand-50 border border-sand-300 text-charcoal-800 text-xs font-semibold focus:outline-none focus:border-forest-800"
            >
              <option value="All">All Authentic Interests</option>
              <option value="Nature & Waterfalls">Nature & Waterfalls</option>
              <option value="Indigenous & Tribal Heritage">Indigenous & Tribal Heritage</option>
              <option value="Ancient Architecture">Ancient Architecture</option>
              <option value="High-Altitude Meadows">High-Altitude Meadows</option>
              <option value="Artisans & Handicrafts">Artisans & Handicrafts</option>
            </select>
          </div>

          {/* Crowd Preference */}
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider font-bold text-charcoal-700 block">
              Crowd Density Tolerance
            </label>
            <select
              value={selectedCrowd}
              onChange={(e) => setSelectedCrowd(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-sand-50 border border-sand-300 text-charcoal-800 text-xs font-semibold focus:outline-none focus:border-forest-800"
            >
              <option value="All">Any Low Density</option>
              <option value="Untouched">Untouched (Zero Commercial Noise)</option>
              <option value="Sparse">Sparse (Under 20 visitors/day)</option>
              <option value="Peaceful">Peaceful Village Setting</option>
            </select>
          </div>

          {/* Budget Range */}
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider font-bold text-charcoal-700 block">
              Budget Per Experience
            </label>
            <select
              value={selectedBudget}
              onChange={(e) => setSelectedBudget(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-sand-50 border border-sand-300 text-charcoal-800 text-xs font-semibold focus:outline-none focus:border-forest-800"
            >
              <option value="All">Any Budget</option>
              <option value="Under ₹800">Under ₹800 (Fair Community Rate)</option>
              <option value="₹800 - ₹1,500">₹800 - ₹1,500 (Extended Trail)</option>
              <option value="Above ₹1,500">Above ₹1,500 (Full-day Expedition)</option>
            </select>
          </div>

          {/* Available Time */}
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider font-bold text-charcoal-700 block">
              Time Commitment
            </label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-sand-50 border border-sand-300 text-charcoal-800 text-xs font-semibold focus:outline-none focus:border-forest-800"
            >
              <option value="All">Any Duration</option>
              <option value="Half Day">Half-Day Immersion (3-4 hours)</option>
              <option value="Full Day">Full-Day Trail (5-8 hours)</option>
              <option value="Multi-Day">2 Days Deep Residency</option>
            </select>
          </div>

          {/* Travel Party Type */}
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider font-bold text-charcoal-700 block">
              Travel Party
            </label>
            <select
              value={travelType}
              onChange={(e) => setTravelType(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-sand-50 border border-sand-300 text-charcoal-800 text-xs font-semibold focus:outline-none focus:border-forest-800"
            >
              <option value="Solo">Solo Conscious Traveler</option>
              <option value="Couple">Couple / Duet</option>
              <option value="Family">Family / Micro-Group (Max 4)</option>
            </select>
          </div>
        </div>

        {/* Filter Action */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={handleFilterApply}
            disabled={isFiltering}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-forest-900 hover:bg-forest-800 text-sand-50 text-xs font-bold shadow transition-colors disabled:opacity-50"
          >
            {isFiltering ? (
              <>
                <span className="w-4 h-4 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
                <span>Filtering Vetted Routes...</span>
              </>
            ) : (
              <>
                <Compass className="w-4 h-4 text-gold-400" />
                <span>Discover Hidden Places</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Matched Hidden Destinations */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950">
              Matched Hidden Destinations
            </h2>
            <p className="text-xs text-charcoal-700">
              Showing {recommendations.length} curated destinations matching your cultural vectors
            </p>
          </div>
          <div className="text-xs text-forest-900 font-semibold bg-sand-100 px-3 py-1.5 rounded-lg border border-sand-300">
            ✓ Community-Vetted Routes
          </div>
        </div>

        <div className="space-y-8">
          {recommendations.map((rec) => (
            <div
              key={rec.destination.id}
              className="rounded-2xl bg-sand-50 border border-sand-300 shadow-sm overflow-hidden hover:border-gold-500/40 transition-all duration-300"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* Visual Column */}
                <div className="lg:col-span-4 relative aspect-[16/11] lg:aspect-auto min-h-[260px] bg-sand-200">
                  <Image
                    src={rec.destination.heroImage}
                    alt={rec.destination.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-transparent to-transparent lg:hidden" />
                  
                  {/* Match Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-900 text-gold-300 text-xs font-bold shadow-md border border-gold-500/30">
                      <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
                      VETTED MATCH • {rec.matchScore}% ALIGNMENT
                    </span>
                  </div>

                  {/* Crowd level badge */}
                  <div className="absolute bottom-3 left-3 lg:hidden text-sand-50">
                    <span className="text-xs font-semibold px-2 py-1 rounded bg-forest-950/80">
                      ● {rec.destination.crowdLevel} Density
                    </span>
                  </div>
                </div>

                {/* Details Column */}
                <div className="lg:col-span-8 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    {/* Category, Rating, Location */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs uppercase font-bold tracking-wider text-terracotta-600">
                          {rec.destination.category}
                        </span>
                        <span className="text-charcoal-400">•</span>
                        <span className="text-xs text-charcoal-700 font-medium">
                          {rec.destination.state} ({rec.destination.region})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="hidden lg:inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full bg-sand-100 text-forest-900 border border-sand-300">
                          ● {rec.destination.crowdLevel} Density
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-forest-950 bg-sand-100 px-2 py-0.5 rounded">
                          <Star className="w-3.5 h-3.5 text-gold-500 fill-gold-500" />
                          {rec.destination.rating}
                        </span>
                      </div>
                    </div>

                    {/* Headline & Name */}
                    <div>
                      <h3 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950">
                        {rec.destination.name}
                      </h3>
                      <p className="text-xs text-charcoal-600 font-medium italic mt-0.5">
                        "{rec.destination.headline}"
                      </p>
                    </div>

                    <p className="text-sm text-charcoal-800 leading-relaxed font-serif">
                      {rec.destination.description}
                    </p>

                    {/* "Why this matches" Box */}
                    <div className="p-3.5 rounded-xl bg-forest-50 border border-forest-200/80 space-y-1">
                      <span className="text-[11px] uppercase tracking-wider font-bold text-forest-900 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-forest-700" />
                        Why this route fits your rhythm:
                      </span>
                      <p className="text-xs text-forest-950 leading-relaxed">
                        {rec.aiReasoning}
                      </p>
                    </div>

                    {/* "Verified Local Knowledge" Box */}
                    <div className="p-3.5 rounded-xl bg-sand-100 border border-sand-300 space-y-1">
                      <span className="text-[11px] uppercase tracking-wider font-bold text-terracotta-700 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-terracotta-600" />
                        Verified Local Wisdom from {rec.recommendedBuddy.name}:
                      </span>
                      <p className="text-xs text-charcoal-800 italic leading-relaxed">
                        "{rec.verifiedLocalTip}"
                      </p>
                    </div>
                  </div>

                  {/* Actions & Recommended Buddy row */}
                  <div className="pt-4 border-t border-sand-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gold-500/40">
                        <Image
                          src={rec.recommendedBuddy.avatar}
                          alt={rec.recommendedBuddy.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-forest-950">
                          {rec.recommendedBuddy.name}
                        </p>
                        <p className="text-[11px] text-forest-700 font-medium">
                          Knowledge Score: {rec.recommendedBuddy.knowledgeScore}% • {rec.recommendedBuddy.location}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Link
                        href={`/buddies/${rec.recommendedBuddy.id}`}
                        className="px-4 py-2 rounded-lg border border-forest-900/30 text-forest-900 text-xs font-semibold hover:bg-sand-200 transition-colors text-center"
                      >
                        Host Profile
                      </Link>
                      <Link
                        href={`/places/${rec.destination.id}`}
                        className="inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-lg bg-forest-900 hover:bg-forest-800 text-sand-50 text-xs font-bold shadow transition-colors"
                      >
                        <span>Explore Place</span>
                        <ArrowRight className="w-3.5 h-3.5 text-gold-400" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
