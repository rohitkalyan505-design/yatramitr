'use client';

// ============================================================
// LIVE TRIP MODE — checkpoints, check-in, safety, emergency
// ============================================================
// Transparent prototype: checkpoints update via the check-in API
// (persisted to Firestore or local echo). Browser location
// permission is optional and only used to show the traveller's
// own position — it is NOT production-grade GPS tracking.
// ============================================================

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ShieldCheck, MapPin, Phone, Share2, AlertTriangle, CheckCircle2,
  Radio, ArrowLeft, X, AlertCircle, Loader2,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { fetchBookingsForUser, fetchBookingById, fetchTripForBooking, createTripForBooking } from '@/lib/data-service';
import DemoBadge from '@/components/ui/DemoBadge';
import { cn } from '@/lib/utils';
import type { Booking, Trip } from '@/types';

function TripContent() {
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [checkingIn, setCheckingIn] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const [locating, setLocating] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Load the most recent active/confirmed booking (or ?bookingId=)
  useEffect(() => {
    const load = async () => {
      const requestedId = searchParams.get('bookingId');
      let bookings: Booking[] = [];
      try {
        bookings = await fetchBookingsForUser(user?.id ?? 'demo-user-local');
      } catch {
        bookings = [];
      }

      let target: Booking | undefined;
      if (requestedId) {
        target = bookings.find((b) => b.id === requestedId);
        if (!target) {
          target = await fetchBookingById(requestedId);
        }
      }
      if (!target) {
        // Prefer an existing trip, then upcoming bookings, then the latest booking
        for (const b of bookings) {
          const t = await fetchTripForBooking(b.id);
          if (t && t.status === 'active') {
            setBooking(b);
            setTrip(t);
            setLoading(false);
            return;
          }
        }
        target =
          bookings.find((b) => b.status !== 'completed') ??
          bookings.sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
      }

      if (target) {
        setBooking(target);
        let t = await fetchTripForBooking(target.id);
        if (!t) t = await createTripForBooking(target);
        setTrip(t ?? null);
      }
      setLoading(false);
    };
    load();
  }, [searchParams, user]);

  const checkIn = async (checkpointId: string) => {
    if (!trip) return;
    setCheckingIn(checkpointId);
    try {
      const res = await fetch(`/api/trips/${trip.id}/checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checkpointId }),
      });
      const data = await res.json();
      if (res.ok && data.trip) {
        setTrip(data.trip);
        setMessage('Check-in recorded.');
        setTimeout(() => setMessage(null), 2500);
      } else {
        setMessage(data.error ?? 'Check-in failed — try again.');
      }
    } catch {
      setMessage('Check-in failed — you may be offline. Try again.');
    } finally {
      setCheckingIn(null);
    }
  };

  const shareTrip = useCallback(async () => {
    try {
      await navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setMessage('Could not copy the link.');
    }
  }, []);

  const shareLocation = () => {
    if (!navigator.geolocation) {
      setMessage('Location sharing is not supported on this device.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
        setMessage(
          `Location captured (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}). Share it with your trusted contact from the emergency panel.`
        );
        setTimeout(() => setMessage(null), 5000);
      },
      () => {
        setLocating(false);
        setMessage('Location permission denied — continuing without it.');
        setTimeout(() => setMessage(null), 4000);
      },
      { timeout: 8000 }
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-page-trip flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-[#F5F1E8]">
          <Loader2 className="w-8 h-8 animate-spin text-[#DFB86C]" />
          <span className="text-xs">Loading your trip…</span>
        </div>
      </div>
    );
  }

  if (!booking || !trip) {
    return (
      <div className="min-h-screen bg-page-trip flex items-center justify-center px-4 pt-20 pb-20 bg-motif-arch">
        <div className="max-w-md text-center space-y-4 text-[#F5F1E8]">
          <AlertCircle className="w-12 h-12 text-[#DFB86C] mx-auto" />
          <h1 className="font-serif text-2xl font-bold">No active trip found</h1>
          <p className="text-sm text-[#E8DFCF]/80">
            Live Trip Mode starts from a booking. Book an experience first, then come back here.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/find-my-yatra" className="px-6 py-3 rounded-md bg-[#B8955A] text-forest-950 text-xs font-bold hover:bg-[#a6844c] transition-colors">
              Find My Yatra
            </Link>
            <Link href="/dashboard" className="px-6 py-3 rounded-md border border-white/30 text-xs font-semibold hover:bg-white/10 transition-colors">
              My Yatra
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const completedCount = trip.checkpoints.filter((c) => c.state === 'completed').length;
  const isComplete = trip.status === 'completed';

  return (
    <div className="min-h-screen bg-page-trip text-[#F5F1E8] pt-20 sm:pt-24 pb-20">
      {/* Top banner */}
      <div className="border-b border-forest-800 bg-forest-900/90 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="p-1.5 rounded-lg hover:bg-forest-800 text-[#E8DFCF]" aria-label="Back to dashboard">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                {!isComplete && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />}
                <span className={cn('relative inline-flex rounded-full h-3 w-3', isComplete ? 'bg-forest-500' : 'bg-emerald-500')} />
              </span>
              <span className="font-serif text-base font-bold">Live Trip Mode</span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {isComplete ? 'Completed' : 'Active'}
              </span>
            </div>
          </div>

          {/* EMERGENCY — always visible */}
          <button
            onClick={() => setShowEmergency(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs font-bold shadow transition-colors"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            EMERGENCY
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Trip card */}
        <div className="p-6 rounded-3xl bg-forest-900/90 border border-[#B8955A]/30 shadow-xl space-y-5">
          <div className="border-b border-forest-800 pb-5 space-y-2">
            <span className="text-[10px] uppercase font-bold text-[#DFB86C] tracking-wider">Booking {booking.id}</span>
            <h2 className="font-serif text-2xl font-bold">{booking.experienceTitle}</h2>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#E8DFCF]/80">
              <span className="inline-flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-terracotta-400" /> {booking.placeName}</span>
              <span>•</span>
              <span>{booking.date} · {booking.timeSlot}</span>
              <span>•</span>
              <span>{booking.groupSize} traveller{booking.groupSize > 1 ? 's' : ''}</span>
            </div>
            {booking.isDemoBooking && <DemoBadge label="Demo booking" />}
          </div>

          {/* Mitra card */}
          <div className="p-4 rounded-2xl bg-forest-950/80 border border-forest-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-forest-800 border border-[#B8955A] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-[#DFB86C]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <p className="font-serif font-bold text-base">{trip.mitraName}</p>
                  <DemoBadge label="Demo mitra" />
                </div>
                <p className="text-xs text-[#E8DFCF]/70">Your Mitra · on-site with the group</p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <a
                href="tel:112"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-forest-800 hover:bg-forest-700 text-xs font-semibold border border-forest-700 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#DFB86C]" /> Call Mitra
              </a>
            </div>
          </div>

          {/* Prototype transparency notice */}
          <p className="text-[11px] text-[#E8DFCF]/60 leading-relaxed">
            <strong>How this works:</strong> checkpoint progress is a transparent prototype system — you (or
            your Mitra) tap CHECK IN at each stage. This MVP does not run background GPS tracking. Location
            sharing only happens when you explicitly request it.
          </p>
        </div>

        {/* Checkpoints */}
        <div className="p-6 sm:p-8 rounded-3xl bg-forest-900/60 border border-forest-800 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold flex items-center gap-2">
              <Radio className={cn('w-5 h-5 text-[#DFB86C]', !isComplete && 'animate-pulse')} />
              Trip progress
            </h3>
            <span className="text-xs text-[#E8DFCF]/70">
              {completedCount} of {trip.checkpoints.length} checkpoints · {trip.lastCheckInAt ? `last check-in ${new Date(trip.lastCheckInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'no check-ins yet'}
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-2 rounded-full bg-forest-950 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-forest-500 to-[#DFB86C] transition-all duration-700"
              style={{ width: `${(completedCount / trip.checkpoints.length) * 100}%` }}
            />
          </div>

          <div className="space-y-3">
            {trip.checkpoints.map((cp) => (
              <div
                key={cp.id}
                className={cn(
                  'p-4 rounded-2xl border flex items-center justify-between gap-4 transition-all',
                  cp.state === 'current' && 'bg-forest-950 border-[#B8955A] ring-1 ring-[#DFB86C]/50',
                  cp.state === 'completed' && 'bg-forest-950/40 border-forest-800',
                  cp.state === 'upcoming' && 'bg-forest-950/20 border-forest-800/60'
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
                      cp.state === 'completed' && 'bg-forest-500 text-white',
                      cp.state === 'current' && 'bg-[#B8955A] text-forest-950',
                      cp.state === 'upcoming' && 'bg-forest-900 text-[#E8DFCF]/50'
                    )}
                  >
                    {cp.state === 'completed' ? '✓' : cp.id.replace('cp-', '')}
                  </div>
                  <div className="min-w-0">
                    <h4 className={cn('text-sm font-bold truncate', cp.state === 'upcoming' ? 'text-[#E8DFCF]/60' : 'text-white')}>
                      {cp.title}
                    </h4>
                    <p className="text-[11px] text-[#E8DFCF]/50">
                      {cp.scheduledTime}
                      {cp.checkedInAt && ` · checked in ${new Date(cp.checkedInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                    </p>
                  </div>
                </div>

                {cp.state === 'current' && !isComplete && (
                  <button
                    onClick={() => checkIn(cp.id)}
                    disabled={checkingIn === cp.id}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#B8955A] hover:bg-[#a6844c] text-forest-950 text-xs font-bold transition-colors disabled:opacity-50 shrink-0"
                  >
                    {checkingIn === cp.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    )}
                    CHECK IN
                  </button>
                )}
                {cp.state === 'completed' && (
                  <span className="text-[10px] uppercase font-bold text-emerald-400 whitespace-nowrap">Recorded</span>
                )}
              </div>
            ))}
          </div>

          {message && (
            <div className="p-3 rounded-xl bg-forest-950 border border-[#B8955A]/40 text-xs text-[#DFB86C]">
              {message}
            </div>
          )}

          {/* Completion → impact */}
          {isComplete && (
            <div className="p-5 rounded-2xl bg-forest-50 text-forest-950 space-y-3">
              <p className="font-serif text-lg font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> Yatra complete!
              </p>
              <p className="text-xs leading-relaxed">
                Your trip is recorded. See your community impact and leave a verified review.
              </p>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/dashboard?impact=${booking.id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-forest-900 text-[#F5F1E8] text-xs font-bold hover:bg-forest-800 transition-colors"
                >
                  View my Yatra impact
                </Link>
              </div>
            </div>
          )}

          {!isComplete && (
            <div className="flex justify-end">
              <button
                onClick={shareTrip}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-forest-800 hover:bg-forest-700 text-xs font-semibold border border-forest-700 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5 text-[#DFB86C]" />
                {copied ? 'Link copied!' : 'SHARE TRIP'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Emergency drawer */}
      {showEmergency && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#FAF8F5] text-charcoal-900 shadow-2xl space-y-4 p-6">
            <div className="flex items-center justify-between border-b border-sand-200 pb-3">
              <h4 className="font-serif font-bold text-lg text-forest-950 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-terracotta-600" /> Emergency assistance
              </h4>
              <button onClick={() => setShowEmergency(false)} className="p-1 rounded-lg text-charcoal-500 hover:bg-sand-200" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Primary emergency actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a href="tel:112" className="p-4 rounded-xl bg-terracotta-500 text-white text-center font-bold text-sm hover:bg-terracotta-600 transition-colors">
                📞 Call 112 (Emergency)
              </a>
              <a href="tel:108" className="p-4 rounded-xl bg-forest-800 text-white text-center font-bold text-sm hover:bg-forest-700 transition-colors">
                🚑 Call 108 (Ambulance)
              </a>
              <button onClick={shareLocation} className="p-4 rounded-xl bg-white border border-[#E8DFCF] text-sm font-bold text-forest-950 hover:bg-sand-100 transition-colors">
                {locating ? 'Locating…' : '📍 Share my location'}
              </button>
              <a href={`tel:${'112'}`} className="p-4 rounded-xl bg-white border border-[#E8DFCF] text-sm font-bold text-forest-950 hover:bg-sand-100 transition-colors">
                🧑‍🤝‍🧑 Contact Mitra
              </a>
            </div>

            {coords && (
              <div className="p-3 rounded-xl bg-forest-50 border border-forest-200 text-[11px] text-forest-950 font-mono">
                Your location: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
              </div>
            )}

            {/* Static verified numbers */}
            <div className="p-3.5 rounded-xl bg-sand-100 border border-sand-300 text-[11px] text-charcoal-800 space-y-1.5">
              <p className="font-bold text-forest-950">Verified emergency numbers (India):</p>
              <p>• <strong>112</strong> — unified emergency (police / fire / medical)</p>
              <p>• <strong>108</strong> — ambulance</p>
              <p>• <strong>1091</strong> — women&apos;s helpline</p>
              <p>• <strong>1363</strong> — tourist helpline</p>
            </div>

            <p className="text-[10px] text-charcoal-600 leading-relaxed">
              These safety actions are static platform features and do not depend on AI. YATRAMITR does not
              operate emergency services — in a real emergency, always call 112 first.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TripPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-forest-950" />}>
      <TripContent />
    </Suspense>
  );
}
