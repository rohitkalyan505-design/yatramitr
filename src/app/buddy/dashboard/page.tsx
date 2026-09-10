'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ShieldCheck, 
  Award, 
  Users, 
  Calendar, 
  Star, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  DollarSign, 
  PlusCircle, 
  MapPin, 
  Check, 
  X,
  FileCheck,
  AlertCircle
} from 'lucide-react';
import { MOCK_BUDDIES, MOCK_EXPERIENCES, DEFAULT_BOOKING } from '@/data/mock-data';
import { formatCurrency } from '@/lib/utils';

export default function BuddyDashboardPage() {
  const buddy = MOCK_BUDDIES[0]; // Subba Rao Konda
  const experiences = MOCK_EXPERIENCES.filter((e) => e.hostBuddyId === buddy.id);

  // Mock state for booking requests
  const [bookings, setBookings] = useState([
    {
      id: 'REQ-104',
      traveler: 'Rahul Deshmukh',
      party: 2,
      date: 'Oct 24, 2026',
      slot: '08:00 AM - 11:30 AM',
      experienceTitle: 'Hidden Araku Coffee & Waterfall Trail',
      status: 'Pending',
      amount: 1300,
    },
    {
      id: 'REQ-102',
      traveler: 'Aditi Sharma',
      party: 2,
      date: 'Oct 18, 2026',
      slot: '08:00 AM - 11:30 AM',
      experienceTitle: 'Hidden Araku Coffee & Waterfall Trail',
      status: 'Confirmed',
      amount: 1300,
    },
  ]);

  const handleAction = (id: string, newStatus: 'Confirmed' | 'Declined') => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      {/* Host Greeting & Top Verification Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-forest-950 text-sand-50 border border-gold-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-gold-400 shrink-0">
            <Image
              src={buddy.avatar}
              alt={buddy.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-sand-50">
                Namaskaram, {buddy.name}
              </h1>
              <ShieldCheck className="w-5 h-5 text-gold-400" />
            </div>
            <p className="text-xs text-sand-300">
              Verified Host • {buddy.location}, {buddy.state} • Tier 1 Local Custodian
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-forest-900 border border-gold-500/40 text-center">
            <span className="text-[10px] uppercase font-bold text-sand-300 block">Knowledge Score</span>
            <span className="font-serif text-xl font-black text-gold-300">{buddy.knowledgeScore}%</span>
          </div>
          <Link
            href="/places/araku-valley"
            className="px-4 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-forest-950 text-xs font-bold transition-colors"
          >
            View Public Profile
          </Link>
        </div>
      </div>

      {/* Verification Status Matrix */}
      <div className="p-5 rounded-2xl bg-sand-100 border border-sand-300 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-forest-950">
            Host Compliance & Verification Badges
          </span>
          <span className="text-xs font-semibold text-forest-800 bg-forest-100 px-2.5 py-0.5 rounded border border-forest-200">
            Active & Inspected
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-sand-50 border border-sand-200 flex items-center gap-2 text-forest-950">
            <CheckCircle2 className="w-4 h-4 text-forest-700 shrink-0" />
            <div>
              <strong className="block font-serif">Aadhaar ID Verified</strong>
              <span className="text-[10px] text-charcoal-600">Native residency confirmed</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-sand-50 border border-sand-200 flex items-center gap-2 text-forest-950">
            <Award className="w-4 h-4 text-forest-700 shrink-0" />
            <div>
              <strong className="block font-serif">Oral Exam Passed</strong>
              <span className="text-[10px] text-charcoal-600">Eastern Ghats botany & lore</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-sand-50 border border-sand-200 flex items-center gap-2 text-forest-950">
            <FileCheck className="w-4 h-4 text-forest-700 shrink-0" />
            <div>
              <strong className="block font-serif">First-Aid Certified</strong>
              <span className="text-[10px] text-charcoal-600">Valid through Nov 2026</span>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="p-5 rounded-2xl bg-sand-50 border border-sand-300 shadow-sm space-y-1">
          <span className="text-charcoal-600 font-medium">Total Travelers Hosted</span>
          <p className="font-serif text-2xl font-bold text-forest-950">{buddy.hostedTravelersCount}+</p>
          <span className="text-[10px] text-forest-700 font-semibold">↑ 14 this month</span>
        </div>
        <div className="p-5 rounded-2xl bg-sand-50 border border-sand-300 shadow-sm space-y-1">
          <span className="text-charcoal-600 font-medium">Community Rating</span>
          <p className="font-serif text-2xl font-bold text-forest-950 flex items-center gap-1">
            <Star className="w-5 h-5 text-gold-500 fill-gold-500" />
            {buddy.rating}
          </p>
          <span className="text-[10px] text-charcoal-600">Based on {buddy.reviewCount} reviews</span>
        </div>
        <div className="p-5 rounded-2xl bg-sand-50 border border-sand-300 shadow-sm space-y-1">
          <span className="text-charcoal-600 font-medium">Estimated Earnings</span>
          <p className="font-serif text-2xl font-bold text-forest-950">₹32,450</p>
          <span className="text-[10px] text-forest-700 font-semibold">95% payout direct</span>
        </div>
        <div className="p-5 rounded-2xl bg-sand-50 border border-sand-300 shadow-sm space-y-1">
          <span className="text-charcoal-600 font-medium">Tribal Fund Contribution</span>
          <p className="font-serif text-2xl font-bold text-terracotta-700">₹1,620</p>
          <span className="text-[10px] text-charcoal-600">5% to Araku cooperative</span>
        </div>
      </div>

      {/* Booking Requests & Experiences Management Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Pending Booking Requests */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold text-forest-950">
              Booking Requests
            </h3>
            <span className="text-xs text-charcoal-600">
              {bookings.length} upcoming reservations
            </span>
          </div>

          <div className="space-y-3">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="p-5 rounded-2xl bg-sand-50 border border-sand-300 shadow-sm space-y-3 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase font-bold text-charcoal-600">
                    {booking.id}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    booking.status === 'Confirmed'
                      ? 'bg-forest-100 text-forest-800'
                      : booking.status === 'Pending'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    ● {booking.status}
                  </span>
                </div>

                <div>
                  <h4 className="font-serif font-bold text-base text-forest-950">
                    {booking.experienceTitle}
                  </h4>
                  <p className="text-charcoal-700 font-medium">
                    Traveler: {booking.traveler} ({booking.party} Guests)
                  </p>
                </div>

                <div className="flex items-center gap-4 text-[11px] text-charcoal-700 pt-1 border-t border-sand-200">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-terracotta-600" />
                    {booking.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-forest-700" />
                    {booking.slot}
                  </span>
                  <span className="font-bold text-forest-950 ml-auto">
                    {formatCurrency(booking.amount)}
                  </span>
                </div>

                {booking.status === 'Pending' && (
                  <div className="pt-2 flex items-center gap-2 justify-end">
                    <button
                      onClick={() => handleAction(booking.id, 'Declined')}
                      className="px-3 py-1.5 rounded-lg border border-red-300 text-red-700 font-semibold hover:bg-red-50 text-xs"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleAction(booking.id, 'Confirmed')}
                      className="inline-flex items-center gap-1 px-4 py-1.5 rounded-lg bg-forest-900 text-sand-50 font-bold hover:bg-forest-800 text-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Accept Booking</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Hosted Experiences & Submitted Places */}
        <div className="lg:col-span-5 space-y-6">
          {/* Experiences Managed */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl font-bold text-forest-950">
                Your Published Experiences
              </h3>
              <button
                onClick={() => alert('Feature Preview: Experience creation modal opened.')}
                className="inline-flex items-center gap-1 text-xs font-bold text-terracotta-600 hover:text-terracotta-700"
              >
                <PlusCircle className="w-4 h-4" />
                <span>New Experience</span>
              </button>
            </div>

            <div className="space-y-3">
              {experiences.map((exp) => (
                <div
                  key={exp.id}
                  className="p-4 rounded-2xl bg-sand-50 border border-sand-300 shadow-sm flex items-center justify-between gap-3 text-xs"
                >
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-sand-300">
                    <Image
                      src={exp.image}
                      alt={exp.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-bold text-sm text-forest-950 truncate">
                      {exp.title}
                    </h4>
                    <p className="text-charcoal-600 text-[11px]">
                      {formatCurrency(exp.pricePerPerson)} • {exp.duration} • Cap: {exp.groupCap} guests
                    </p>
                  </div>
                  <Link
                    href={`/experiences/${exp.id}`}
                    className="p-2 rounded-lg hover:bg-sand-200 text-forest-900"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Submitted Hidden Places */}
          <div className="p-5 rounded-2xl bg-sand-100 border border-sand-300 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <h4 className="font-serif font-bold text-forest-950 text-sm">
                Submitted Hidden Places
              </h4>
              <span className="text-[10px] font-bold text-gold-700 bg-gold-400/20 px-2 py-0.5 rounded">
                Verified
              </span>
            </div>
            <p className="text-charcoal-700">
              <strong>Katiki Upper Tier Natural Spring:</strong> Documented without public geotags to protect indigenous flora and prevent overtourism.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
