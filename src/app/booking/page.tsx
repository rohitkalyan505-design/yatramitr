'use client';

// ============================================================
// BOOKING — Experience → Date → Group size → Price summary →
// Confirm → Booking created (persisted; no payment in MVP)
// ============================================================

import React, { useState, Suspense, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import {
  CheckCircle2, MapPin, Calendar, Clock, Users, ShieldCheck,
  ArrowRight, ArrowLeft, Loader2, Sparkles,
} from 'lucide-react';
import { getExperienceById, getMitraById, EXPERIENCES } from '@/data/experiences';
import { useAuth } from '@/lib/auth-context';
import DemoBadge from '@/components/ui/DemoBadge';
import { formatCurrency, cn } from '@/lib/utils';
import type { Booking } from '@/types';

function BookingContent() {
  const searchParams = useSearchParams();
  const { user, isDemoSession } = useAuth();

  const experienceId = searchParams.get('experienceId') ?? EXPERIENCES[0].id;
  const experience = getExperienceById(experienceId) ?? EXPERIENCES[0];
  const mitra = getMitraById(experience.mitraId);

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [date, setDate] = useState('');
  const [slot, setSlot] = useState('Morning (08:00–11:00)');
  const [groupSize, setGroupSize] = useState(2);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    // Default date: tomorrow
    const d = new Date(Date.now() + 86400000);
    setDate(d.toISOString().slice(0, 10));
  }, []);

  const pricePerPerson = experience.pricePerPerson;
  const total = pricePerPerson * groupSize;
  const mitraShare = Math.round(total * 0.95);
  const communityShare = total - mitraShare;

  const confirm = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const userId = user?.id ?? 'demo-user-local';
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          experienceId: experience.id,
          date,
          timeSlot: slot,
          groupSize,
          email: user?.email,
          isDemo: isDemoSession || !user,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Booking failed');
      }
      const data = await res.json();
      setBooking(data.booking);
      setStep(4);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls =
    'w-full px-4 py-2.5 rounded-md border border-[#E8DFCF] text-sm focus:outline-none focus:border-[#16352A] bg-white';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {step !== 4 && (
        <div className="text-center space-y-2">
          <span className="text-xs font-semibold tracking-[0.2em] text-[#B86B4B] uppercase block">
            Responsible Booking
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0D211A]">Reserve your Yatra</h1>
          <div className="flex items-center justify-center gap-2 pt-2 text-xs text-[#1D2521]/60">
            {['Details', 'Date & group', 'Summary', 'Confirmed'].map((label, i) => (
              <React.Fragment key={label}>
                {i > 0 && <span>→</span>}
                <span className={step >= i + 1 ? 'font-bold text-[#16352A]' : ''}>{i + 1}. {label}</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* STEP 1 */}
      {step === 1 && (
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E8DFCF] shadow-sm space-y-6">
          <h2 className="font-serif text-2xl font-bold text-[#0D211A]">1. Experience details</h2>
          <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center p-4 rounded-xl bg-[#F5F1E8]">
            <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0">
              {experience.image ? (
                <Image src={experience.image} alt={experience.title} fill className="object-cover" />
              ) : (
                <div className="absolute inset-0 bg-topo-pattern" />
              )}
            </div>
            <div className="space-y-1">
              <span className="text-xs font-semibold text-[#B86B4B] uppercase tracking-wider">{experience.placeName}</span>
              <h3 className="font-serif text-xl font-bold text-[#0D211A]">{experience.title}</h3>
              <p className="text-xs text-[#1D2521]/70">
                {experience.durationLabel} · Max {experience.groupCap} · {experience.meetingPoint}
              </p>
              <p className="text-xs font-bold text-[#16352A]">{formatCurrency(pricePerPerson)} per person</p>
            </div>
          </div>

          {mitra && (
            <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-white border border-[#E8DFCF]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-forest-700" />
                <p className="text-xs font-bold text-[#0D211A]">
                  Mitra: {mitra.name} {mitra.isDemo && <DemoBadge />}
                </p>
              </div>
              <Link href={`/mitras/${mitra.id}`} className="text-[11px] font-bold text-[#16352A] hover:underline">
                Trust Passport →
              </Link>
            </div>
          )}

          {/* Availability honesty notice */}
          <div className="p-3.5 rounded-xl bg-terracotta-50 border border-terracotta-200 text-[11px] text-terracotta-700 space-y-1">
            <p className="font-bold">Prototype availability</p>
            <p>
              Experiences in this MVP run on prototype availability — no real-time inventory. Your booking
              request is recorded and the exact date is confirmed with your Mitra.
            </p>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md bg-[#16352A] hover:bg-[#0D211A] text-[#F5F1E8] text-xs font-bold transition-colors"
            >
              Next: Date & group <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E8DFCF] shadow-sm space-y-6">
          <h2 className="font-serif text-2xl font-bold text-[#0D211A]">2. Date & group size</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#0D211A] mb-1">Preferred date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} min={new Date().toISOString().slice(0, 10)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#0D211A] mb-1">Time slot</label>
              <select value={slot} onChange={(e) => setSlot(e.target.value)} className={cn(inputCls, 'bg-white')}>
                <option>Morning (08:00–11:00)</option>
                <option>Afternoon (14:00–17:00)</option>
                <option>Evening (17:00–20:00)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0D211A] mb-1">
              Travellers (max {experience.groupCap})
            </label>
            <div className="flex gap-3 pt-1">
              {[1, 2, 3, 4, 5].filter((n) => n <= experience.groupCap).map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setGroupSize(num)}
                  className={cn(
                    'w-12 h-10 rounded-lg text-xs font-bold border transition-colors',
                    groupSize === num
                      ? 'bg-[#16352A] text-white border-[#16352A]'
                      : 'bg-[#F5F1E8] text-[#0D211A] border-[#E8DFCF]'
                  )}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button onClick={() => setStep(1)} className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#0D211A] hover:underline">
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md bg-[#16352A] hover:bg-[#0D211A] text-[#F5F1E8] text-xs font-bold transition-colors"
            >
              Next: Summary <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E8DFCF] shadow-sm space-y-6">
          <h2 className="font-serif text-2xl font-bold text-[#0D211A]">3. Booking summary</h2>

          <div className="p-6 rounded-xl bg-[#F5F1E8] space-y-3 text-xs text-[#1D2521]">
            <div className="flex justify-between pb-2 border-b border-[#E8DFCF]">
              <span className="font-semibold text-[#0D211A]">Experience</span>
              <span className="text-right">{experience.title}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-[#E8DFCF]">
              <span className="font-semibold text-[#0D211A]">Mitra</span>
              <span>{mitra?.name ?? 'Assigned at check-in'}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-[#E8DFCF]">
              <span className="font-semibold text-[#0D211A]">Date & slot</span>
              <span>{date} · {slot}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-[#E8DFCF]">
              <span className="font-semibold text-[#0D211A]">Travellers</span>
              <span>{groupSize}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-[#E8DFCF]">
              <span className="font-semibold text-[#0D211A]">Mitra share (proposed model: 95%)</span>
              <span>₹{mitraShare}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-[#E8DFCF] text-forest-700 font-semibold">
              <span>Community contribution (proposed model: 5%)</span>
              <span>₹{communityShare}</span>
            </div>
            <div className="flex justify-between pt-2 text-base font-serif font-bold text-[#0D211A]">
              <span>Total (indicative)</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-forest-50 border border-forest-200 text-[11px] text-forest-950">
            <strong>Label:</strong> &ldquo;Proposed community distribution model&rdquo; — the 95/5 split is a
            prototype calculation, not an implemented real-world transaction. No payment is taken.
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-terracotta-50 border border-terracotta-200 text-xs text-terracotta-700">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between">
            <button onClick={() => setStep(2)} className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#0D211A] hover:underline">
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <button
              onClick={confirm}
              disabled={submitting || !date}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-md bg-[#16352A] hover:bg-[#0D211A] text-[#F5F1E8] text-sm font-bold shadow transition-colors disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> <span>Confirming…</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#DFB86C]" /> <span>Confirm booking request</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 4 — confirmation */}
      {step === 4 && booking && (
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#E8DFCF] shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-forest-50 text-forest-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="font-serif text-3xl font-bold text-[#0D211A]">Booking request confirmed</h2>
            <p className="text-xs text-[#1D2521]/70">
              Nothing has been charged — this MVP records booking requests. Your Mitra confirms the exact date.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#F5F1E8] border border-[#E8DFCF] max-w-sm mx-auto text-left space-y-3 text-sm">
            <div className="flex justify-between gap-3">
              <span className="text-[10px] text-[#B86B4B] uppercase font-bold tracking-wider pt-0.5">Booking ID</span>
              <strong className="font-mono text-xs text-[#0D211A]">{booking.id}</strong>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-[10px] text-[#1D2521]/60 uppercase font-bold tracking-wider pt-0.5">Experience</span>
              <span className="text-right font-medium text-[#0D211A]">{booking.experienceTitle}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-[10px] text-[#1D2521]/60 uppercase font-bold tracking-wider pt-0.5">Mitra</span>
              <span className="text-sm font-medium text-[#0D211A]">{booking.mitraName}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-[10px] text-[#1D2521]/60 uppercase font-bold tracking-wider pt-0.5">Date</span>
              <span className="text-sm font-medium text-[#0D211A]">{booking.date} · {booking.timeSlot}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-[10px] text-[#1D2521]/60 uppercase font-bold tracking-wider pt-0.5">Travellers</span>
              <span className="text-sm font-medium text-[#0D211A]">{booking.groupSize}</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-[#E8DFCF]">
              <span className="text-xs font-medium text-[#1D2521]/70">Total (indicative)</span>
              <strong className="font-serif text-xl text-forest-700">{formatCurrency(booking.totalAmount)}</strong>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={`/trip?bookingId=${booking.id}`}
              className="w-full sm:w-auto px-6 py-3 rounded-md bg-[#16352A] hover:bg-[#0D211A] text-[#F5F1E8] text-xs font-bold transition-colors"
            >
              Enter Live Trip Mode
            </Link>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-6 py-3 rounded-md border border-[#E8DFCF] text-[#0D211A] text-xs font-semibold hover:bg-[#F5F1E8] transition-colors"
            >
              Go to My Yatra
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-16">
      <Suspense fallback={<div className="text-center py-20 text-xs">Loading booking…</div>}>
        <BookingContent />
      </Suspense>
    </div>
  );
}
