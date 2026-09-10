'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Languages, 
  MapPin, 
  Compass, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  UploadCloud,
  FileCheck,
  Sparkles
} from 'lucide-react';

export default function BecomeABuddyPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    fullName: '',
    phone: '',
    email: '',
    hometown: 'Araku Valley, Andhra Pradesh',
    yearsOfResidency: '20+',

    // Step 2: Languages
    primaryLanguage: 'Telugu',
    otherLanguages: 'Hindi, English, Tribal Dialect',
    communicationComfort: 'Fluent & Conversational',

    // Step 3: Local Knowledge
    specialties: ['Hidden trails', 'Local food', 'Tribal culture'],
    oralFolkloreNote: '',
    favoriteSecretSpot: '',

    // Step 4: Experience Creation
    experienceTitle: 'Eastern Ghats Coffee Trail & Secret Stream',
    duration: '3 hours',
    pricePerPerson: '600',
    groupCap: '4',

    // Step 5: Verification
    idType: 'Aadhaar / Voter ID',
    idNumber: '',
    agreedToEthics: true,
  });

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setSubmitted(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const steps = [
    { num: 1, label: 'Basic Information' },
    { num: 2, label: 'Languages' },
    { num: 3, label: 'Local Knowledge' },
    { num: 4, label: 'Experience Creation' },
    { num: 5, label: 'Verification' },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1D2521] pt-28 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-semibold tracking-[0.2em] text-[#B86B4B] uppercase block">
            Host Onboarding
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0D211A]">
            Become a Verified Local Mitra
          </h1>
          <p className="text-sm text-[#1D2521]/70 max-w-lg mx-auto">
            Share your hometown with conscious travellers, protect your local ecosystem, and earn 95% direct host payouts.
          </p>
        </div>

        {/* Clean Progress Indicator */}
        <div className="p-6 rounded-2xl bg-white border border-[#E8DFCF] shadow-sm space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-[#1D2521]/70">
            <span>Step {currentStep} of 5: <strong className="text-[#0D211A]">{steps[currentStep - 1].label}</strong></span>
            <span>{Math.round((currentStep / 5) * 100)}% Complete</span>
          </div>

          <div className="w-full h-2 rounded-full bg-[#F5F1E8] overflow-hidden flex">
            <div 
              className="h-full bg-[#16352A] transition-all duration-300"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>

          {/* Step Labels on larger screens */}
          <div className="hidden sm:grid grid-cols-5 gap-2 pt-1">
            {steps.map((s) => (
              <div 
                key={s.num} 
                className={`text-[11px] font-medium text-center ${
                  currentStep === s.num 
                    ? 'text-[#16352A] font-bold' 
                    : currentStep > s.num 
                    ? 'text-[#B8955A]' 
                    : 'text-[#1D2521]/40'
                }`}
              >
                {s.num}. {s.label}
              </div>
            ))}
          </div>
        </div>

        {/* Form Body */}
        <div className="p-8 rounded-2xl bg-white border border-[#E8DFCF] shadow-sm">
          {!submitted ? (
            <div className="space-y-6">
              {/* STEP 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <h2 className="font-serif text-xl font-bold text-[#0D211A]">
                    Step 1: Basic Information
                  </h2>
                  <p className="text-xs text-[#1D2521]/70">
                    We start with your primary contact details and connection to the region.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#0D211A] mb-1">Full Legal Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Sai Kumar Konda"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-md border border-[#E8DFCF] focus:outline-none focus:border-[#16352A] text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#0D211A] mb-1">Mobile Phone Number</label>
                        <input
                          type="tel"
                          placeholder="+91 98450 12345"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-md border border-[#E8DFCF] focus:outline-none focus:border-[#16352A] text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#0D211A] mb-1">Email Address</label>
                        <input
                          type="email"
                          placeholder="sai.kumar@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-md border border-[#E8DFCF] focus:outline-none focus:border-[#16352A] text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#0D211A] mb-1">Hometown / Village</label>
                        <input
                          type="text"
                          value={formData.hometown}
                          onChange={(e) => setFormData({ ...formData, hometown: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-md border border-[#E8DFCF] focus:outline-none focus:border-[#16352A] text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#0D211A] mb-1">Years Living in this Region</label>
                        <select
                          value={formData.yearsOfResidency}
                          onChange={(e) => setFormData({ ...formData, yearsOfResidency: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-md border border-[#E8DFCF] focus:outline-none focus:border-[#16352A] text-sm bg-white"
                        >
                          <option>Born & Raised (Lifelong native)</option>
                          <option>10+ Years</option>
                          <option>5 - 10 Years</option>
                          <option>Less than 5 Years</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Languages */}
              {currentStep === 2 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <h2 className="font-serif text-xl font-bold text-[#0D211A]">
                    Step 2: Languages & Communication
                  </h2>
                  <p className="text-xs text-[#1D2521]/70">
                    Effective, respectful storytelling helps travellers absorb native history without misunderstanding.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#0D211A] mb-1">Primary Mother Tongue / Native Dialect</label>
                      <input
                        type="text"
                        value={formData.primaryLanguage}
                        onChange={(e) => setFormData({ ...formData, primaryLanguage: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-md border border-[#E8DFCF] focus:outline-none focus:border-[#16352A] text-sm"
                        placeholder="e.g. Telugu, Bagata dialect"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#0D211A] mb-1">Additional Languages Spoken</label>
                      <input
                        type="text"
                        value={formData.otherLanguages}
                        onChange={(e) => setFormData({ ...formData, otherLanguages: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-md border border-[#E8DFCF] focus:outline-none focus:border-[#16352A] text-sm"
                        placeholder="e.g. Hindi, English, Odia"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#0D211A] mb-1">Comfort with Traveller Enquiries</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                        {['Fluent & Conversational', 'Basic Guidance', 'Requires Translator'].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setFormData({ ...formData, communicationComfort: opt })}
                            className={`p-3 rounded-xl border text-xs font-medium text-center transition-all ${
                              formData.communicationComfort === opt
                                ? 'border-[#16352A] bg-[#16352A] text-white'
                                : 'border-[#E8DFCF] bg-[#F5F1E8] text-[#1D2521]/80 hover:bg-white'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Local Knowledge */}
              {currentStep === 3 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <h2 className="font-serif text-xl font-bold text-[#0D211A]">
                    Step 3: Local Knowledge & Heritage
                  </h2>
                  <p className="text-xs text-[#1D2521]/70">
                    What unique local understanding or ancestral traditions can you share with conscious travellers?
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#0D211A] mb-2">Areas of Specialisation</label>
                      <div className="flex flex-wrap gap-2">
                        {['Hidden trails', 'Local food', 'Photography', 'Tribal culture', 'Ethnobotany & herbs', 'Coffee agronomy', 'Birdwatching'].map((s) => {
                          const active = formData.specialties.includes(s);
                          return (
                            <button
                              key={s}
                              type="button"
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  specialties: active
                                    ? formData.specialties.filter(x => x !== s)
                                    : [...formData.specialties, s]
                                });
                              }}
                              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                                active
                                  ? 'bg-[#16352A] text-white border-[#16352A]'
                                  : 'bg-[#F5F1E8] text-[#1D2521]/75 border-[#E8DFCF]'
                              }`}
                            >
                              {active ? '✓ ' : '+ '}{s}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#0D211A] mb-1">Your Personal Connection to This Land</label>
                      <textarea
                        rows={3}
                        placeholder="Tell us briefly how your family or community has lived here and what makes your area special."
                        value={formData.oralFolkloreNote}
                        onChange={(e) => setFormData({ ...formData, oralFolkloreNote: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-md border border-[#E8DFCF] focus:outline-none focus:border-[#16352A] text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Experience Creation */}
              {currentStep === 4 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <h2 className="font-serif text-xl font-bold text-[#0D211A]">
                    Step 4: Experience Creation
                  </h2>
                  <p className="text-xs text-[#1D2521]/70">
                    Draft your first micro-group experience. Remember: maximum 4–5 travellers per session.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#0D211A] mb-1">Experience Title</label>
                      <input
                        type="text"
                        value={formData.experienceTitle}
                        onChange={(e) => setFormData({ ...formData, experienceTitle: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-md border border-[#E8DFCF] focus:outline-none focus:border-[#16352A] text-sm"
                        placeholder="e.g. Katiki Forest Walk & Herbal Tea"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#0D211A] mb-1">Duration</label>
                        <select
                          value={formData.duration}
                          onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-md border border-[#E8DFCF] focus:outline-none focus:border-[#16352A] text-sm bg-white"
                        >
                          <option>2 hours</option>
                          <option>2.5 hours</option>
                          <option>3 hours</option>
                          <option>4 hours (Half-day)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#0D211A] mb-1">Price per Person (₹)</label>
                        <input
                          type="number"
                          value={formData.pricePerPerson}
                          onChange={(e) => setFormData({ ...formData, pricePerPerson: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-md border border-[#E8DFCF] focus:outline-none focus:border-[#16352A] text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#0D211A] mb-1">Max Group Size</label>
                        <select
                          value={formData.groupCap}
                          onChange={(e) => setFormData({ ...formData, groupCap: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-md border border-[#E8DFCF] focus:outline-none focus:border-[#16352A] text-sm bg-white"
                        >
                          <option>4 travellers</option>
                          <option>3 travellers</option>
                          <option>2 travellers (Couples/Solo only)</option>
                        </select>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#F5F1E8] border border-[#E8DFCF] text-xs space-y-1">
                      <span className="font-semibold text-[#16352A] block">Host Earnings Transparency:</span>
                      <p className="text-[#1D2521]/75">
                        At ₹{formData.pricePerPerson} / person for 4 guests, you earn <strong>₹{Math.round(Number(formData.pricePerPerson) * 4 * 0.95)}</strong> net directly into your bank account. ₹{Math.round(Number(formData.pricePerPerson) * 4 * 0.05)} supports the local tribal conservation fund.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: Verification */}
              {currentStep === 5 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <h2 className="font-serif text-xl font-bold text-[#0D211A]">
                    Step 5: Trust & Verification
                  </h2>
                  <p className="text-xs text-[#1D2521]/70">
                    To maintain traveller trust and safety, all Local Buddies undergo background checks and an oral native knowledge exam.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#0D211A] mb-1">Government ID Type</label>
                      <select
                        value={formData.idType}
                        onChange={(e) => setFormData({ ...formData, idType: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-md border border-[#E8DFCF] focus:outline-none focus:border-[#16352A] text-sm bg-white"
                      >
                        <option>Aadhaar Card (UIDAI)</option>
                        <option>Voter ID Card</option>
                        <option>Driving License</option>
                        <option>Tribal Residency Certificate</option>
                      </select>
                    </div>

                    <div className="border-2 border-dashed border-[#E8DFCF] rounded-xl p-6 text-center space-y-2 bg-[#F5F1E8]">
                      <UploadCloud className="w-8 h-8 text-[#16352A] mx-auto" />
                      <div className="text-xs text-[#0D211A] font-medium">
                        Upload ID document scan or photo
                      </div>
                      <span className="text-[11px] text-[#1D2521]/60 block">JPG, PNG, or PDF up to 5MB</span>
                    </div>

                    <div className="pt-2">
                      <label className="flex items-start gap-2.5 text-xs text-[#1D2521]/80 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.agreedToEthics}
                          onChange={(e) => setFormData({ ...formData, agreedToEthics: e.target.checked })}
                          className="mt-0.5 rounded text-[#16352A]"
                        />
                        <span>
                          I agree to uphold Yatra Mitra's Zero-Overtourism code, respect village privacy, and participate in the 30-minute oral geography verification call.
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-6 border-t border-[#E8DFCF]">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md border border-[#E8DFCF] text-xs font-semibold text-[#0D211A] hover:bg-[#F5F1E8]"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                ) : <div />}

                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md bg-[#16352A] hover:bg-[#0D211A] text-[#F5F1E8] text-xs font-bold shadow transition-colors"
                >
                  <span>{currentStep === 5 ? 'Submit Application' : 'Continue'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            /* Confirmation Screen */
            <div className="text-center py-10 space-y-5 animate-in zoom-in-95 duration-300">
              <div className="w-14 h-14 rounded-full bg-[#16352A]/10 text-[#16352A] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0D211A]">
                Application Submitted Successfully
              </h2>
              <p className="text-xs sm:text-sm text-[#1D2521]/75 max-w-md mx-auto leading-relaxed">
                Thank you for applying to become a Local Mitra in {formData.hometown}. Our regional coordinator will contact you via WhatsApp/Phone within 48 hours to schedule your oral assessment.
              </p>
              <div className="pt-4 flex justify-center gap-3">
                <Link
                  href="/"
                  className="px-6 py-2.5 rounded-md bg-[#16352A] text-[#F5F1E8] text-xs font-bold"
                >
                  Return to Home
                </Link>
                <Link
                  href="/dashboard"
                  className="px-6 py-2.5 rounded-md border border-[#E8DFCF] text-[#0D211A] text-xs font-semibold"
                >
                  View Portal
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
