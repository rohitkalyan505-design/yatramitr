'use client';

// ============================================================
// MY YATRA — traveller dashboard
// Sections: Upcoming Yatra · Bookings · Live Trip · Impact ·
// Matches · Saved · Profile. Trip lifecycle: BEFORE (discover,
// match, book) → DURING (live trip) → AFTER (impact, review).
// ============================================================

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Calendar, Clock, Users, ArrowRight, Sparkles,
  Compass, CheckCircle2, Star, Loader2, HeartHandshake, Route, User,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import {
  fetchBookingsForUser,
  fetchTripForBooking,
  fetchTravellerMatches,
  loadTravellerPreferences,
  recordTravelMatchSession,
} from '@/lib/data-service';
import DemoBadge from '@/components/ui/DemoBadge';
import { formatCurrency, cn } from '@/lib/utils';
import type { Booking, Trip, TravellerMatch, TravellerPreferences } from '@/types';

function DashboardContent() {
  const searchParams = useSearchParams();
  const { user, isDemoSession, logout } = useAuth();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [trips, setTrips] = useState<Record<string, Trip>>({});
  const [matches, setMatches] = useState<TravellerMatch[]>([]);
  const [prefs, setPrefs] = useState<TravellerPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [impactBooking, setImpactBooking] = useState<Booking | null>(null);
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewDone, setReviewDone] = useState<string | null>(null);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      const userId = user?.id ?? 'demo-user-local';
      const [bks, mts, p] = await Promise.all([
        fetchBookingsForUser(userId),
        fetchTravellerMatches(await loadTravellerPreferences(userId)),
        loadTravellerPreferences(userId),
      ]);
      setBookings(bks.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
      setMatches(mts);
      setPrefs(p);
      // Best-effort audit trail in Firestore (no-op in demo mode):
      void recordTravelMatchSession(userId, p, mts);

      const tripMap: Record<string, Trip> = {};
      for (const b of bks) {
        const t = await fetchTripForBooking(b.id);
        if (t) tripMap[b.id] = t;
      }
      setTrips(tripMap);

      const impactId = searchParams.get('impact');
      if (impactId) {
        const b = bks.find((x) => x.id === impactId);
        if (b) setImpactBooking(b);
      }
      setLoading(false);
    };
    load();
  }, [user, searchParams]);

  const submitReviewFor = useCallback(
    async (b: Booking) => {
      setReviewSubmitting(true);
      try {
        const res = await fetch('/api/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bookingId: b.id,
            userId: user?.id ?? 'demo-user-local',
            rating: reviewRating,
            comment: reviewText,
          }),
        });
        const data = await res.json();
        if (res.ok) {
          setReviewDone(b.id);
          setReviewBooking(null);
          setReviewText('');
        } else {
          alert(data.error ?? 'Review failed');
        }
      } catch {
        alert('Review failed — try again.');
      } finally {
        setReviewSubmitting(false);
      }
    },
    [reviewRating, reviewText, user]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-page-dashboard flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#16352A]" />
      </div>
    );
  }

  const displayName = user?.name ?? 'Traveller';
  const upcoming = bookings.filter((b) => b.status !== 'completed');
  const past = bookings.filter((b) => b.status === 'completed');
  const totalSpend = bookings.reduce((s, b) => s + b.totalAmount, 0);
  const totalCommunity = bookings.reduce((s, b) => s + b.communityContribution, 0);

  return (
    <div className="min-h-screen bg-page-dashboard text-[#1D2521] pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#E8DFCF]">
          <div>
            <span className="text-xs font-semibold tracking-[0.2em] text-[#B86B4B] uppercase block">
              My Yatra
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0D211A] mt-1">
              Welcome, {displayName.split(' ')[0]}
            </h1>
            <p className="text-sm text-[#1D2521]/70 mt-1 flex items-center gap-2">
              Your journeys through Hyderabad.
              {isDemoSession && <DemoBadge label="Demo session" />}
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/find-my-yatra"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#16352A] text-[#F5F1E8] text-xs font-semibold hover:bg-[#0D211A] transition-colors"
            >
              <Compass className="w-3.5 h-3.5 text-[#DFB86C]" /> Find my next Yatra
            </Link>
            <button
              onClick={logout}
              className="px-4 py-2 rounded-md border border-[#E8DFCF] text-xs font-semibold hover:bg-[#F5F1E8] transition-colors"
            >
              Log out
            </button>
          </div>
        </div>

        {/* Quick Product Navigation */}
        <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-white border border-[#E8DFCF] shadow-sm text-xs font-semibold">
          <span className="text-[10px] uppercase tracking-wider text-[#1D2521]/60 px-2 font-bold">Quick Jump:</span>
          <Link href="/explore" className="px-3 py-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#16352A] hover:text-[#F5F1E8] border border-[#E8DFCF] transition-colors">
            🗺️ Explore Map
          </Link>
          <Link href="/find-my-yatra" className="px-3 py-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#16352A] hover:text-[#F5F1E8] border border-[#E8DFCF] transition-colors">
            🧭 Find My Yatra
          </Link>
          <Link href="/experiences" className="px-3 py-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#16352A] hover:text-[#F5F1E8] border border-[#E8DFCF] transition-colors">
            🎒 Experiences
          </Link>
          <Link href="/food" className="px-3 py-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#16352A] hover:text-[#F5F1E8] border border-[#E8DFCF] transition-colors">
            🍲 Street Food Guide
          </Link>
          <Link href="/mitras" className="px-3 py-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#16352A] hover:text-[#F5F1E8] border border-[#E8DFCF] transition-colors">
            👥 Local Mitras
          </Link>
          <Link href="/price-check" className="px-3 py-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#16352A] hover:text-[#F5F1E8] border border-[#E8DFCF] transition-colors">
            🏷️ Fair Price Check
          </Link>
        </div>

        {/* Impact section (after trip completion via ?impact= or any completed trip) */}
        {(impactBooking || past.length > 0) && (
          <section className="p-6 sm:p-8 rounded-2xl bg-forest-900 text-[#F5F1E8] space-y-4">
            <div className="flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-[#DFB86C]" />
              <h2 className="font-serif text-xl font-bold">Your Yatra impact</h2>
              <span className="px-2 py-0.5 rounded-full bg-[#B8955A]/20 text-[#DFB86C] text-[10px] font-bold uppercase tracking-wider">
                Illustrative impact — proposed model
              </span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Traveller spend (indicative)', value: formatCurrency(totalSpend) },
                { label: 'Mitra share (95%)', value: formatCurrency(Math.round(totalSpend * 0.95)) },
                { label: 'Community contribution (5%)', value: formatCurrency(totalCommunity) },
                { label: 'Local stops per experience', value: '3–6' },
              ].map((s) => (
                <div key={s.label} className="p-4 rounded-xl bg-forest-950/70 border border-forest-800">
                  <p className="font-serif text-xl font-bold text-[#DFB86C]">{s.value}</p>
                  <p className="text-[10px] text-[#E8DFCF]/70 mt-1 leading-snug">{s.label}</p>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-[#E8DFCF]/60 leading-relaxed">
              These figures are calculated from the proposed 95/5 community distribution model applied to your
              indicative booking totals. They are prototype calculations — not measured real-world impact. No
              payments have been processed in this MVP.
            </p>
            {impactBooking && !(reviewDone && reviewDone.includes(impactBooking.id)) && (
              <button
                onClick={() => setReviewBooking(impactBooking)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#B8955A] hover:bg-[#a6844c] text-forest-950 text-xs font-bold transition-colors"
              >
                <Star className="w-3.5 h-3.5" /> Leave a verified review
              </button>
            )}
            {reviewDone && (
              <p className="text-xs text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Review recorded with ✓ Verified Yatra badge.
              </p>
            )}
          </section>
        )}

        {/* Upcoming */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl font-bold text-[#0D211A]">Upcoming Yatras</h2>
          {upcoming.length === 0 ? (
            <div className="p-10 rounded-2xl bg-white border border-[#E8DFCF] text-center space-y-3">
              <Route className="w-10 h-10 text-[#B8955A] mx-auto" />
              <p className="font-serif text-lg font-bold text-[#0D211A]">No upcoming Yatras yet.</p>
              <p className="text-xs text-[#1D2521]/70">Find an experience matched to how you travel.</p>
              <Link href="/find-my-yatra" className="inline-block text-sm font-bold text-terracotta-600 hover:underline">
                Find My Yatra →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {upcoming.map((b) => {
                const trip = trips[b.id];
                return (
                  <div key={b.id} className="p-6 rounded-2xl bg-white border border-[#E8DFCF] shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    <div className="lg:col-span-8 space-y-3">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="px-2.5 py-0.5 rounded bg-forest-50 text-forest-700 font-semibold">
                          {b.status === 'booking_request_confirmed' ? 'Booking request confirmed' : b.status}
                        </span>
                        <span className="text-[#1D2521]/60">·</span>
                        <span className="font-mono text-[11px] text-[#1D2521]/60">{b.id}</span>
                        {b.isDemoBooking && <DemoBadge label="Demo booking" />}
                      </div>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0D211A]">{b.experienceTitle}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-[#1D2521]/80">
                        <span className="flex items-center gap-2 p-2.5 rounded-lg bg-[#F5F1E8]"><Calendar className="w-4 h-4 text-forest-700 shrink-0" />{b.date}</span>
                        <span className="flex items-center gap-2 p-2.5 rounded-lg bg-[#F5F1E8]"><Clock className="w-4 h-4 text-forest-700 shrink-0" />{b.timeSlot}</span>
                        <span className="flex items-center gap-2 p-2.5 rounded-lg bg-[#F5F1E8]"><Users className="w-4 h-4 text-forest-700 shrink-0" />{b.groupSize} traveller{b.groupSize > 1 ? 's' : ''}</span>
                      </div>
                      <p className="text-xs text-[#1D2521]/60">
                        Mitra: <strong>{b.mitraName}</strong> · Total (indicative): <strong>{formatCurrency(b.totalAmount)}</strong>
                      </p>
                    </div>
                    <div className="lg:col-span-4 flex flex-col gap-2.5">
                      {trip?.status === 'active' ? (
                        <Link
                          href={`/trip?bookingId=${b.id}`}
                          className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-md bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs font-bold transition-colors"
                        >
                          Resume Live Trip <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      ) : (
                        <Link
                          href={`/trip?bookingId=${b.id}`}
                          className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-md bg-[#16352A] hover:bg-[#0D211A] text-[#F5F1E8] text-xs font-bold transition-colors"
                        >
                          Enter Live Trip Mode <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                      <Link
                        href={`/experiences/${b.experienceId}`}
                        className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-md border border-[#E8DFCF] hover:bg-[#F5F1E8] text-xs font-semibold text-[#0D211A] transition-colors"
                      >
                        View experience details
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Past + matches */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 space-y-4">
            <h2 className="font-serif text-xl font-bold text-[#0D211A]">Past Yatras</h2>
            {past.length === 0 ? (
              <div className="p-8 rounded-2xl bg-white border border-[#E8DFCF] text-center">
                <p className="text-sm text-[#1D2521]/60">Completed Yatras will appear here with your verified reviews and impact.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {past.map((b) => (
                  <div key={b.id} className="p-4 rounded-2xl bg-white border border-[#E8DFCF] flex items-center justify-between gap-4">
                    <div>
                      <p className="font-serif font-bold text-sm text-[#0D211A]">{b.experienceTitle}</p>
                      <p className="text-[11px] text-[#1D2521]/60">{b.date} · {formatCurrency(b.totalAmount)}</p>
                    </div>
                    {reviewDone === b.id ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-forest-700 px-2 py-1 rounded-full bg-forest-50 border border-forest-200">
                        <CheckCircle2 className="w-3 h-3" /> ✓ Verified Yatra reviewed
                      </span>
                    ) : (
                      <button
                        onClick={() => setReviewBooking(b)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#16352A] text-[#F5F1E8] text-[11px] font-bold hover:bg-[#0D211A] transition-colors"
                      >
                        <Star className="w-3 h-3" /> Review
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-6 space-y-4">
            <h2 className="font-serif text-xl font-bold text-[#0D211A]">Travel matches</h2>
            <div className="p-6 rounded-2xl bg-white border border-[#E8DFCF] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#1D2521]/60">
                  Compatible travellers
                </span>
                <DemoBadge label="Demo pool" />
              </div>
              {matches.map((m) => (
                <div key={m.id} className="flex items-center justify-between p-3 rounded-xl bg-[#F5F1E8]/70 border border-[#E8DFCF]/70">
                  <div className="min-w-0">
                    <h4 className="font-serif font-bold text-sm text-[#0D211A]">{m.displayName} · {m.city}</h4>
                    <p className="text-[11px] text-[#1D2521]/70 truncate">
                      {m.sharedInterests.join(', ')} · {m.travelStyle}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-forest-700 px-2.5 py-1 rounded bg-white border border-[#E8DFCF] shrink-0 ml-2">
                    {m.matchScore}%
                  </span>
                </div>
              ))}
              <p className="text-[10px] text-[#1D2521]/50 leading-relaxed">
                Deterministic matching on shared interests, style and language. All pool members are clearly
                labelled DEMO accounts — no real user profiles are exposed.
              </p>
            </div>
          </div>
        </div>

        {/* Profile & preferences */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="p-6 rounded-2xl bg-white border border-[#E8DFCF] space-y-4">
            <h2 className="font-serif text-xl font-bold text-[#0D211A] flex items-center gap-2">
              <User className="w-5 h-5 text-[#B86B4B]" /> Profile
            </h2>
            <div className="space-y-2 text-sm">
              <p><span className="text-[#1D2521]/60 text-xs uppercase font-bold tracking-wider block">Name</span>{displayName}{user?.isDemo && <DemoBadge className="ml-2" />}</p>
              <p><span className="text-[#1D2521]/60 text-xs uppercase font-bold tracking-wider block">Email</span>{user?.email ?? '—'}</p>
              <p><span className="text-[#1D2521]/60 text-xs uppercase font-bold tracking-wider block">Role</span><span className="capitalize">{user?.role ?? 'traveller'}</span></p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#E8DFCF] space-y-4">
            <h2 className="font-serif text-xl font-bold text-[#0D211A] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#B86B4B]" /> Travel preferences
            </h2>
            {prefs ? (
              <div className="flex flex-wrap gap-2 text-xs">
                {prefs.interests.map((i) => (
                  <span key={i} className="px-3 py-1.5 rounded-full bg-forest-50 text-forest-700 font-semibold border border-forest-200">{i}</span>
                ))}
                <span className="px-3 py-1.5 rounded-full bg-[#F5F1E8] font-semibold">₹{prefs.budget} budget</span>
                <span className="px-3 py-1.5 rounded-full bg-[#F5F1E8] font-semibold">{prefs.crowdPreference} crowds</span>
                <span className="px-3 py-1.5 rounded-full bg-[#F5F1E8] font-semibold">{prefs.travelStyle} pace</span>
                <span className="px-3 py-1.5 rounded-full bg-[#F5F1E8] font-semibold">{prefs.durationPreference}</span>
                <span className="px-3 py-1.5 rounded-full bg-[#F5F1E8] font-semibold">{prefs.groupPreference}</span>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-[#1D2521]/60">No preferences saved yet.</p>
                <Link href="/find-my-yatra" className="inline-block text-sm font-bold text-terracotta-600 hover:underline">
                  Set them now →
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Review modal */}
      {reviewBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#FAF8F5] shadow-2xl space-y-4">
            <h3 className="font-serif text-xl font-bold text-forest-950">Review your Yatra</h3>
            <p className="text-xs text-[#1D2521]/70">
              <strong>{reviewBooking.experienceTitle}</strong> with {reviewBooking.mitraName}
            </p>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setReviewRating(n)}
                  className="p-1"
                  aria-label={`${n} stars`}
                >
                  <Star className={cn('w-7 h-7 transition-colors', n <= reviewRating ? 'text-[#C5A059] fill-[#C5A059]' : 'text-[#E8DFCF]')} />
                </button>
              ))}
            </div>
            <textarea
              rows={3}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="What stood out? (optional)"
              className="w-full px-4 py-2.5 rounded-xl border border-[#E8DFCF] text-sm focus:outline-none focus:border-forest-800"
            />
            <div className="flex items-center justify-between gap-3">
              <button onClick={() => setReviewBooking(null)} className="px-4 py-2 text-xs font-semibold text-[#1D2521]/70 hover:underline">
                Cancel
              </button>
              <button
                onClick={() => submitReviewFor(reviewBooking)}
                disabled={reviewSubmitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-forest-900 text-[#F5F1E8] text-xs font-bold hover:bg-forest-800 transition-colors disabled:opacity-50"
              >
                {reviewSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Submit verified review
              </button>
            </div>
            <p className="text-[10px] text-[#1D2521]/50">
              Reviews are only possible for completed bookings — every review carries a ✓ Verified Yatra badge.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#FAF8F5]" />}>
      <DashboardContent />
    </React.Suspense>
  );
}
