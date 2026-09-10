'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  ArrowRight, 
  ShieldCheck, 
  Bookmark, 
  Sparkles, 
  Compass, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';
import { DEFAULT_BOOKING, ARAKU_HIDDEN_GEMS, MOCK_TRAVEL_MATCHES, MOCK_DESTINATIONS } from '@/data/mock-data';

export default function TravelerDashboard() {
  const savedPlaces = [MOCK_DESTINATIONS[0], MOCK_DESTINATIONS[1], MOCK_DESTINATIONS[2]];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1D2521] pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#E8DFCF]">
          <div>
            <span className="text-xs font-semibold tracking-[0.2em] text-[#B86B4B] uppercase block">
              Traveller Portal
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0D211A] mt-1">
              Welcome back, Aditi
            </h1>
            <p className="text-sm text-[#1D2521]/70 mt-1">
              Your conscious travel journeys and community connections in India.
            </p>
          </div>
          <Link
            href="/discover"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#16352A] text-[#F5F1E8] text-xs font-semibold hover:bg-[#0D211A] transition-colors"
          >
            <Compass className="w-3.5 h-3.5 text-[#B8955A]" />
            <span>Discover More Places</span>
          </Link>
        </div>

        {/* 1. Upcoming Experience */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-[#0D211A]">
              Upcoming Experience
            </h2>
            <span className="text-xs font-medium text-[#16352A] bg-[#16352A]/10 px-2.5 py-0.5 rounded-full">
              Confirmed Reservation
            </span>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E8DFCF] shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Experience Details */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2.5 py-0.5 rounded bg-[#B86B4B]/10 text-[#B86B4B] font-semibold">
                  Nature & Forest Walk
                </span>
                <span className="text-[#1D2521]/60">•</span>
                <span className="font-medium text-[#0D211A]">Booking Ref: {DEFAULT_BOOKING.id}</span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#0D211A]">
                Hyderabad Old City Heritage Walk with Arjun Reddy
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#1D2521]/80 pt-1">
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#F5F1E8]">
                  <Calendar className="w-4 h-4 text-[#16352A] shrink-0" />
                  <span>{DEFAULT_BOOKING.date}</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#F5F1E8]">
                  <Clock className="w-4 h-4 text-[#16352A] shrink-0" />
                  <span>07:30 AM - 10:30 AM</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#F5F1E8]">
                  <MapPin className="w-4 h-4 text-[#16352A] shrink-0" />
                  <span className="truncate">Charminar Area Meeting Point</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#B8955A] shrink-0">
                  <Image
                    src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80"
                    alt="Arjun Reddy"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <strong className="block text-xs text-[#0D211A]">Host: Arjun Reddy</strong>
                  <span className="text-[11px] text-[#1D2521]/60">Verified Local Mitra • 5.0 Rating</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="lg:col-span-4 flex flex-col gap-3">
              <Link
                href="/trip"
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-md bg-[#16352A] hover:bg-[#0D211A] text-[#F5F1E8] text-sm font-semibold shadow transition-colors"
              >
                <span>Enter Live Trip Mode</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/experiences/hyderabad-old-city"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-md border border-[#E8DFCF] hover:bg-[#F5F1E8] text-xs font-semibold text-[#0D211A] transition-colors"
              >
                <span>View Itinerary Details</span>
              </Link>
            </div>
          </div>
        </section>

        {/* 2. Recommended Hidden Gems */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-[#0D211A]">
              Recommended Hidden Gems
            </h2>
            <span className="text-xs text-[#1D2521]/60">Matched to your preference profile</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ARAKU_HIDDEN_GEMS.slice(1, 4).map((gem) => (
              <div key={gem.id} className="p-5 rounded-xl bg-white border border-[#E8DFCF] space-y-3 shadow-sm hover:border-[#B8955A] transition-colors">
                <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden bg-[#E8DFCF]">
                  <Image
                    src={gem.image}
                    alt={gem.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#B86B4B] uppercase tracking-wider">{gem.experienceType}</span>
                  <h3 className="font-serif text-lg font-bold text-[#0D211A]">{gem.name}</h3>
                  <p className="text-xs text-[#1D2521]/70 line-clamp-2 mt-1">{gem.shortDescription}</p>
                </div>
                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#0D211A]">Est. ₹{gem.estimatedPrice}</span>
                  <Link href="/place/hyderabad" className="text-[#16352A] font-bold hover:underline">
                    Explore →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Travel Matches & Saved Places Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Travel Matches (Solo compatibility) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl font-bold text-[#0D211A]">
                Travel Matches
              </h2>
              <span className="text-xs text-[#B86B4B] font-semibold">AI Compatible Travellers</span>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#E8DFCF] shadow-sm space-y-4">
              {MOCK_TRAVEL_MATCHES.map((match) => (
                <div key={match.id} className="flex items-center justify-between p-3 rounded-xl bg-[#F5F1E8]/70 border border-[#E8DFCF]/70">
                  <div className="flex items-center gap-3.5">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#E8DFCF] shrink-0">
                      <Image
                        src={match.avatar}
                        alt={match.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-sm text-[#0D211A]">
                        {match.name} · {match.city}
                      </h4>
                      <p className="text-[11px] text-[#1D2521]/70">{match.travelStyle}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#16352A] px-2.5 py-1 rounded bg-white border border-[#E8DFCF]">
                    {match.matchPercentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Saved Places */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl font-bold text-[#0D211A]">
                Saved Places
              </h2>
              <span className="text-xs text-[#1D2521]/60">3 bookmarked</span>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#E8DFCF] shadow-sm space-y-3">
              {savedPlaces.map((place) => (
                <div key={place.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-[#F5F1E8] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={place.heroImage}
                        alt={place.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-sm text-[#0D211A]">{place.name}</h4>
                      <span className="text-[11px] text-[#1D2521]/60">{place.region} • {place.crowdLevel} Crowd</span>
                    </div>
                  </div>
                  <Link
                    href={`/place/${place.id === 'araku-valley' ? 'araku' : place.id}`}
                    className="text-xs font-bold text-[#16352A] hover:underline"
                  >
                    View →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Recent Activity */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl font-bold text-[#0D211A]">
            Recent Activity
          </h2>
          <div className="p-6 rounded-2xl bg-white border border-[#E8DFCF] shadow-sm space-y-3 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-[#E8DFCF]/60">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#16352A]" />
                <span>Booking confirmed for <strong>Hyderabad Old City Heritage Walk</strong> (Ref: YM-2026-HYD-084)</span>
              </div>
              <span className="text-[#1D2521]/50">Today</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-[#E8DFCF]/60">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#B8955A]" />
                <span>Host Arjun Reddy verified the heritage walk details and meeting location.</span>
              </div>
              <span className="text-[#1D2521]/50">Yesterday</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-[#B86B4B]" />
                <span>Travel match found: Ananya from Chennai (92% compatibility)</span>
              </div>
              <span className="text-[#1D2521]/50">2 days ago</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
