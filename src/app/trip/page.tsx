'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ShieldCheck, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Share2, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Radio, 
  ArrowLeft,
  X,
  Send,
  AlertCircle
} from 'lucide-react';
import { DEFAULT_BOOKING, MOCK_BUDDIES, MOCK_EXPERIENCES } from '@/data/mock-data';

export default function TripModePage() {
  const [activeStep, setActiveStep] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportText, setReportText] = useState('');
  const [reportSent, setReportSent] = useState(false);

  const buddy = MOCK_BUDDIES[0]; // Subba Rao Konda
  const experience = MOCK_EXPERIENCES[0];

  const checkpoints = [
    { id: 1, title: 'Assembly & Cultural Briefing', time: '08:00 AM', completed: activeStep > 1, current: activeStep === 1 },
    { id: 2, title: 'Tribal Shade Coffee Canopy Walk', time: '08:45 AM', completed: activeStep > 2, current: activeStep === 2 },
    { id: 3, title: 'Katiki Upper Tier Natural Spring', time: '09:45 AM', completed: activeStep > 3, current: activeStep === 3 },
    { id: 4, title: 'Village Ragi Sankati Breakfast & Farewell', time: '11:00 AM', completed: activeStep > 4, current: activeStep === 4 },
  ];

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReportSent(true);
    setTimeout(() => {
      setShowReportModal(false);
      setReportSent(false);
      setReportText('');
    }, 2000);
  };

  return (
    <div className="min-h-[85vh] bg-forest-950 text-sand-50 pb-20">
      {/* Top Live Banner */}
      <div className="border-b border-forest-800 bg-forest-900/90 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-1.5 rounded-lg hover:bg-forest-800 text-sand-300">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="font-serif text-base font-bold text-sand-50">
                Live Trip Mode
              </span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Active Check-in
              </span>
            </div>
          </div>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sand-50/10 hover:bg-sand-50/20 border border-sand-200/20 text-xs text-sand-100 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-gold-400" />
            <span>{copiedLink ? 'Link Copied!' : 'Share Live Trip'}</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Experience & Host Card */}
        <div className="p-6 rounded-3xl bg-forest-900/90 border border-gold-500/30 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-forest-800 pb-5">
            <div>
              <span className="text-[10px] uppercase font-bold text-gold-400 tracking-wider">
                Booking ID: {DEFAULT_BOOKING.id}
              </span>
              <h2 className="font-serif text-2xl font-bold text-sand-50 mt-0.5">
                {experience.title}
              </h2>
              <div className="flex items-center gap-2 text-xs text-sand-300 mt-1">
                <MapPin className="w-3.5 h-3.5 text-terracotta-400" />
                <span>{DEFAULT_BOOKING.destinationName}</span>
                <span>•</span>
                <span>{DEFAULT_BOOKING.guestCount} Travelers (Lead: {DEFAULT_BOOKING.travelerName})</span>
              </div>
            </div>

            <div className="flex items-center gap-2 self-stretch sm:self-auto">
              <button
                onClick={() => setShowReportModal(true)}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-terracotta-500/20 hover:bg-terracotta-500/30 border border-terracotta-500/40 text-terracotta-300 text-xs font-semibold transition-colors"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Report Discrepancy</span>
              </button>
            </div>
          </div>

          {/* Host Buddy Quick Action Module */}
          <div className="p-4 rounded-2xl bg-forest-950/80 border border-forest-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gold-400 shrink-0">
                <Image
                  src={buddy.avatar}
                  alt={buddy.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="font-serif font-bold text-base text-sand-50">{buddy.name}</p>
                  <ShieldCheck className="w-4 h-4 text-forest-400" />
                </div>
                <p className="text-xs text-sand-300">
                  Your Assigned Local Buddy • On-site with you
                </p>
              </div>
            </div>

            {/* Communication buttons */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <a
                href="tel:+919876543210"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-forest-800 hover:bg-forest-700 text-sand-50 text-xs font-semibold border border-forest-700 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-gold-400" />
                <span>Direct Call</span>
              </a>
              <button
                onClick={() => alert(`Simulated Chat: Buddy ${buddy.name} is awaiting you at the Banyan Tree landmark.`)}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-forest-950 text-xs font-bold transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Host Chat</span>
              </button>
            </div>
          </div>
        </div>

        {/* Trail Checkpoint Tracker */}
        <div className="p-6 sm:p-8 rounded-3xl bg-forest-900/60 border border-forest-800 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold text-sand-50 flex items-center gap-2">
              <Radio className="w-5 h-5 text-gold-400 animate-pulse" />
              <span>Trail Progress & Checkpoints</span>
            </h3>
            <span className="text-xs text-sand-300">
              Step {activeStep} of {checkpoints.length}
            </span>
          </div>

          <div className="space-y-4">
            {checkpoints.map((cp) => (
              <div
                key={cp.id}
                onClick={() => setActiveStep(cp.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                  cp.current
                    ? 'bg-forest-950 border-gold-500 shadow-md ring-1 ring-gold-400/50'
                    : cp.completed
                    ? 'bg-forest-950/40 border-forest-800 text-sand-400 opacity-75'
                    : 'bg-forest-950/20 border-forest-800/60 text-sand-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    cp.completed
                      ? 'bg-forest-700 text-sand-50'
                      : cp.current
                      ? 'bg-gold-500 text-forest-950 shadow-sm'
                      : 'bg-forest-900 text-sand-400'
                  }`}>
                    {cp.completed ? '✓' : cp.id}
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold ${cp.current ? 'text-sand-50' : 'text-sand-200'}`}>
                      {cp.title}
                    </h4>
                    <p className="text-[11px] text-sand-400">
                      Scheduled time: {cp.time}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                    cp.current
                      ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40'
                      : cp.completed
                      ? 'text-forest-400'
                      : 'text-sand-500'
                  }`}>
                    {cp.current ? 'Active Checkpoint' : cp.completed ? 'Passed' : 'Upcoming'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setActiveStep((prev) => (prev < 4 ? prev + 1 : 1))}
              className="px-4 py-2 rounded-xl bg-forest-800 hover:bg-forest-700 text-sand-50 text-xs font-semibold border border-forest-700 transition-colors"
            >
              Advance Checkpoint (Demo Action)
            </button>
          </div>
        </div>

        {/* Emergency Assistance Drawer */}
        <div className="p-6 rounded-3xl bg-sand-900/10 border border-sand-500/20 space-y-4">
          <div className="flex items-center gap-2 text-sand-100 font-bold text-sm">
            <AlertCircle className="w-5 h-5 text-terracotta-400" />
            <span>Emergency Assistance Contacts (Hyderabad Regional Hub)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-forest-950/80 border border-forest-800">
              <span className="text-sand-400 block text-[10px] uppercase font-bold">Local Police Outpost</span>
              <span className="font-bold text-sand-50">Hyderabad Central Station</span>
              <p className="text-[11px] text-gold-300 mt-1 font-mono">08936 - 249222 / 112</p>
            </div>
            <div className="p-3.5 rounded-xl bg-forest-950/80 border border-forest-800">
              <span className="text-sand-400 block text-[10px] uppercase font-bold">Forest Range Office</span>
              <span className="font-bold text-sand-50">Eastern Ghats Wildlife Div</span>
              <p className="text-[11px] text-gold-300 mt-1 font-mono">1926 (Toll-free)</p>
            </div>
            <div className="p-3.5 rounded-xl bg-forest-950/80 border border-forest-800">
              <span className="text-sand-400 block text-[10px] uppercase font-bold">Primary Health Center</span>
              <span className="font-bold text-sand-50">Hyderabad Community Hospital</span>
              <p className="text-[11px] text-gold-300 mt-1 font-mono">08936 - 249444 / 108</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-forest-950/90 border border-terracotta-500/30 text-[11px] text-sand-300/90 leading-relaxed">
            <strong className="text-sand-100">Safety & Transparency Notice:</strong> While Yatra Mitra equips verified Buddies with first-aid materials and route orientations, wilderness settings in mountainous terrain involve natural elements. We do not claim or guarantee 100% immediate emergency response. Please remain with your Buddy and heed local terrain instructions.
          </div>
        </div>
      </div>

      {/* Report Issue Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg p-6 rounded-2xl bg-sand-50 text-charcoal-900 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-sand-200 pb-3">
              <h4 className="font-serif font-bold text-lg text-forest-950 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-terracotta-600" />
                <span>Report Trail or Host Discrepancy</span>
              </h4>
              <button
                onClick={() => setShowReportModal(false)}
                className="p-1 rounded-lg text-charcoal-500 hover:bg-sand-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {reportSent ? (
              <div className="p-6 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-forest-700 mx-auto" />
                <p className="font-serif font-bold text-base text-forest-950">
                  Report Logged to Community Moderation
                </p>
                <p className="text-xs text-charcoal-700">
                  Our regional safety coordinator has received your notice and will follow up immediately.
                </p>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4 text-xs">
                <p className="text-charcoal-700 leading-relaxed">
                  Help us maintain integrity. If you observe unauthorized commercial diversions, safety protocol lapses, or route variations, let our audit team know.
                </p>

                <div className="space-y-1">
                  <label className="font-bold text-forest-950 uppercase tracking-wider block">
                    Issue Category
                  </label>
                  <select className="w-full p-2.5 rounded-lg bg-sand-100 border border-sand-300 text-charcoal-800 font-semibold focus:outline-none">
                    <option>Route Deviation / Unauthorized Stop</option>
                    <option>Safety Protocol Concern</option>
                    <option>Host Absence or Delay</option>
                    <option>Environmental Littering / Non-compliance</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-forest-950 uppercase tracking-wider block">
                    Description & Observations
                  </label>
                  <textarea
                    rows={4}
                    value={reportText}
                    onChange={(e) => setReportText(e.target.value)}
                    placeholder="Describe what occurred on the trail..."
                    className="w-full p-3 rounded-xl bg-sand-100 border border-sand-300 text-charcoal-800 font-medium focus:outline-none"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="px-4 py-2 rounded-lg border border-sand-300 text-charcoal-700 font-semibold hover:bg-sand-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-forest-900 hover:bg-forest-800 text-sand-50 font-bold shadow"
                  >
                    <Send className="w-3.5 h-3.5 text-gold-400" />
                    <span>Submit Report</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
