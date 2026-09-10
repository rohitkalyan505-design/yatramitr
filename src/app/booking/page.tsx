'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  ShieldCheck, 
  ArrowRight,
  ArrowLeft,
  HeartHandshake
} from 'lucide-react';
import { MOCK_EXPERIENCES, MOCK_BUDDIES } from '@/data/mock-data';

function BookingContent() {
  const searchParams = useSearchParams();
  const experienceId = searchParams.get('experienceId') || 'katiki';

  const experience = MOCK_EXPERIENCES.find((e) => e.id === experienceId) || MOCK_EXPERIENCES[0];
  const hostBuddy = MOCK_BUDDIES.find((b) => b.id === experience.hostBuddyId) || MOCK_BUDDIES[0];

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedDate, setSelectedDate] = useState('2026-10-18');
  const [selectedSlot, setSelectedSlot] = useState('07:30 AM - 10:30 AM');
  const [guestCount, setGuestCount] = useState(1);
  const [travelerName, setTravelerName] = useState('Aditi Sharma');
  const [travelerPhone, setTravelerPhone] = useState('+91 98450 12345');
  const [travelerEmail, setTravelerEmail] = useState('aditi.sharma@example.com');
  const [specialNote, setSpecialNote] = useState('Interested in local herbal plants.');

  const pricePerPerson = experience.pricePerPerson;
  const total = pricePerPerson * guestCount;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {step !== 5 && (
        <div className="text-center space-y-2">
          <span className="text-xs font-semibold tracking-[0.2em] text-[#B86B4B] uppercase block">
            Responsible Booking
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0D211A]">
            Reserve Your Experience
          </h1>
          <div className="flex items-center justify-center gap-2 pt-2 text-xs text-[#1D2521]/60">
            <span className={step >= 1 ? 'font-bold text-[#16352A]' : ''}>1. Details</span>
            <span>→</span>
            <span className={step >= 2 ? 'font-bold text-[#16352A]' : ''}>2. Traveller Info</span>
            <span>→</span>
            <span className={step >= 3 ? 'font-bold text-[#16352A]' : ''}>3. Date & Time</span>
            <span>→</span>
            <span className={step >= 4 ? 'font-bold text-[#16352A]' : ''}>4. Summary</span>
          </div>
        </div>
      )}

      {/* STEP 1: Experience Details */}
      {step === 1 && (
        <div className="p-8 rounded-2xl bg-white border border-[#E8DFCF] shadow-sm space-y-6">
          <h2 className="font-serif text-2xl font-bold text-[#0D211A]">
            1. Experience Details
          </h2>

          <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center p-4 rounded-xl bg-[#F5F1E8]">
            <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0">
              <Image
                src={experience.image}
                alt={experience.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-semibold text-[#B86B4B] uppercase tracking-wider">{experience.category}</span>
              <h3 className="font-serif text-xl font-bold text-[#0D211A]">{experience.title}</h3>
              <p className="text-xs text-[#1D2521]/70">{experience.destinationName} • Hosted by {hostBuddy.name}</p>
              <p className="text-xs font-bold text-[#16352A]">₹{experience.pricePerPerson} per person • {experience.duration}</p>
            </div>
          </div>

          <div className="space-y-2 text-xs text-[#1D2521]/80">
            <h4 className="font-semibold text-[#0D211A]">Meeting Location:</h4>
            <p>{experience.meetingPoint.title} ({experience.meetingPoint.landmark})</p>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md bg-[#16352A] hover:bg-[#0D211A] text-[#F5F1E8] text-xs font-bold transition-colors"
            >
              <span>Next: Traveller Info</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Traveller Information */}
      {step === 2 && (
        <div className="p-8 rounded-2xl bg-white border border-[#E8DFCF] shadow-sm space-y-6">
          <h2 className="font-serif text-2xl font-bold text-[#0D211A]">
            2. Traveller Information
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#0D211A] mb-1">Your Full Name</label>
              <input
                type="text"
                value={travelerName}
                onChange={(e) => setTravelerName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-md border border-[#E8DFCF] text-sm focus:outline-none focus:border-[#16352A]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#0D211A] mb-1">Phone Number (WhatsApp for Trip Mode)</label>
                <input
                  type="tel"
                  value={travelerPhone}
                  onChange={(e) => setTravelerPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-md border border-[#E8DFCF] text-sm focus:outline-none focus:border-[#16352A]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0D211A] mb-1">Email Address</label>
                <input
                  type="email"
                  value={travelerEmail}
                  onChange={(e) => setTravelerEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-md border border-[#E8DFCF] text-sm focus:outline-none focus:border-[#16352A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0D211A] mb-1">Special Preferences / Diet / Physical Notes</label>
              <textarea
                rows={2}
                value={specialNote}
                onChange={(e) => setSpecialNote(e.target.value)}
                className="w-full px-4 py-2.5 rounded-md border border-[#E8DFCF] text-sm focus:outline-none focus:border-[#16352A]"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#0D211A] hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md bg-[#16352A] hover:bg-[#0D211A] text-[#F5F1E8] text-xs font-bold transition-colors"
            >
              <span>Next: Date & Time</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Date & Time Selection */}
      {step === 3 && (
        <div className="p-8 rounded-2xl bg-white border border-[#E8DFCF] shadow-sm space-y-6">
          <h2 className="font-serif text-2xl font-bold text-[#0D211A]">
            3. Date & Time Selection
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#0D211A] mb-1">Select Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-md border border-[#E8DFCF] text-sm focus:outline-none focus:border-[#16352A]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0D211A] mb-1">Select Time Slot</label>
                <select
                  value={selectedSlot}
                  onChange={(e) => setSelectedSlot(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-md border border-[#E8DFCF] text-sm focus:outline-none focus:border-[#16352A] bg-white"
                >
                  <option>07:30 AM - 10:30 AM (Morning crisp air)</option>
                  <option>02:00 PM - 05:00 PM (Afternoon shade)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0D211A] mb-1">Number of Travellers (Max {experience.groupCap})</label>
              <div className="flex gap-3 pt-1">
                {[1, 2, 3, 4].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setGuestCount(num)}
                    className={`w-12 h-10 rounded-lg text-xs font-bold border transition-colors ${
                      guestCount === num 
                        ? 'bg-[#16352A] text-white border-[#16352A]' 
                        : 'bg-[#F5F1E8] text-[#0D211A] border-[#E8DFCF]'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#0D211A] hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <button
              onClick={() => setStep(4)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md bg-[#16352A] hover:bg-[#0D211A] text-[#F5F1E8] text-xs font-bold transition-colors"
            >
              <span>Next: Booking Summary</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Booking Summary */}
      {step === 4 && (
        <div className="p-8 rounded-2xl bg-white border border-[#E8DFCF] shadow-sm space-y-6">
          <h2 className="font-serif text-2xl font-bold text-[#0D211A]">
            4. Booking Summary
          </h2>

          <div className="p-6 rounded-xl bg-[#F5F1E8] space-y-3 text-xs text-[#1D2521]">
            <div className="flex justify-between pb-2 border-b border-[#E8DFCF]">
              <span className="font-semibold text-[#0D211A]">Experience:</span>
              <span>{experience.title}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-[#E8DFCF]">
              <span className="font-semibold text-[#0D211A]">Local Mitra:</span>
              <span>{hostBuddy.name}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-[#E8DFCF]">
              <span className="font-semibold text-[#0D211A]">Date & Time:</span>
              <span>{selectedDate} • {selectedSlot}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-[#E8DFCF]">
              <span className="font-semibold text-[#0D211A]">Guests:</span>
              <span>{guestCount} Traveller{guestCount > 1 ? 's' : ''}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-[#E8DFCF]">
              <span className="font-semibold text-[#0D211A]">Host direct rate (95%):</span>
              <span>₹{Math.round(total * 0.95)}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-[#E8DFCF] text-[#16352A] font-semibold">
              <span>Tribal Ecology Fund (5%):</span>
              <span>₹{Math.round(total * 0.05)}</span>
            </div>
            <div className="flex justify-between pt-2 text-sm font-serif font-bold text-[#0D211A]">
              <span>Total Payable:</span>
              <span>₹{total}</span>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#0D211A] hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <button
              onClick={() => setStep(5)}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-md bg-[#16352A] hover:bg-[#0D211A] text-[#F5F1E8] text-sm font-bold shadow transition-colors"
            >
              <span>Confirm & Reserve</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Confirmation Screen (Example confirmation from prompt) */}
      {step === 5 && (
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#E8DFCF] shadow-xl text-center space-y-6 animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-full bg-[#16352A]/10 text-[#16352A] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="font-serif text-3xl font-bold text-[#0D211A]">
              You're going to experience Araku differently.
            </h2>
            <p className="text-xs text-[#1D2521]/70">
              Your reservation is registered directly with your Local Mitra.
            </p>
          </div>

          {/* Core confirmation badge */}
          <div className="p-6 rounded-2xl bg-[#F5F1E8] border border-[#E8DFCF] max-w-sm mx-auto text-left space-y-3">
            <div>
              <span className="text-[10px] text-[#B86B4B] uppercase font-bold tracking-wider block">Experience</span>
              <strong className="font-serif text-lg text-[#0D211A]">{experience.title}</strong>
            </div>
            <div>
              <span className="text-[10px] text-[#1D2521]/60 uppercase font-bold tracking-wider block">Host Buddy</span>
              <p className="text-sm font-medium text-[#0D211A]">{hostBuddy.name}</p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-[#E8DFCF]">
              <span className="text-xs font-medium text-[#1D2521]/70">Total Rate</span>
              <strong className="font-serif text-xl text-[#16352A]">₹{total}</strong>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/trip"
              className="w-full sm:w-auto px-6 py-3 rounded-md bg-[#16352A] hover:bg-[#0D211A] text-[#F5F1E8] text-xs font-bold transition-colors"
            >
              Enter Live Trip Mode
            </Link>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-6 py-3 rounded-md border border-[#E8DFCF] text-[#0D211A] text-xs font-semibold hover:bg-[#F5F1E8] transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-20">
      <Suspense fallback={<div className="text-center py-20 text-xs">Loading booking...</div>}>
        <BookingContent />
      </Suspense>
    </div>
  );
}
