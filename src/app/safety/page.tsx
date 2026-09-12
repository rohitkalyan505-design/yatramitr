'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldAlert, PhoneCall, HeartPulse, UserCheck, Compass,
  MapPin, CheckCircle2, Share2, Copy, Check, Info, ArrowRight,
  ExternalLink
} from 'lucide-react';

const EMERGENCY_CONTACTS = [
  {
    number: '112',
    tel: 'tel:112',
    name: 'National Emergency',
    tag: 'Police · Fire · Rescue',
    desc: 'Unified 24/7 all-India emergency response system for immediate crisis intervention.',
    color: 'border-red-500/40 bg-red-950/20 text-red-100',
    btnColor: 'bg-red-600 hover:bg-red-700 text-white',
  },
  {
    number: '108',
    tel: 'tel:108',
    name: 'Ambulance Service',
    tag: 'Medical Emergencies',
    desc: 'Telangana Government 24/7 emergency medical transport and immediate trauma support.',
    color: 'border-amber-500/40 bg-amber-950/20 text-amber-100',
    btnColor: 'bg-amber-600 hover:bg-amber-700 text-white',
  },
  {
    number: '1091',
    tel: 'tel:1091',
    name: 'Women Helpline',
    tag: 'Safety & She Teams',
    desc: 'Dedicated 24/7 helpline connecting directly to Hyderabad She Teams & rapid protection.',
    color: 'border-rose-500/40 bg-rose-950/20 text-rose-100',
    btnColor: 'bg-rose-600 hover:bg-rose-700 text-white',
  },
  {
    number: '1363',
    tel: 'tel:1363',
    name: 'Tourist Helpline',
    tag: 'Ministry of Tourism',
    desc: 'Multilingual round-the-clock tourist guidance, advisory, and emergency distress coordination.',
    color: 'border-[#B8955A]/50 bg-[#16352A]/40 text-[#F5F1E8]',
    btnColor: 'bg-[#B8955A] hover:bg-[#a6844c] text-[#0D211A]',
  },
];

const SAFETY_PILLARS = [
  {
    icon: UserCheck,
    title: 'Identity-Verified Mitras',
    desc: 'Every Mitra completes in-person document screening, police verification compliance, and code of conduct certification before guiding any Yatra.',
  },
  {
    icon: Compass,
    title: 'Live Journey Check-Ins',
    desc: 'Active trips record milestone check-ins along the designated route. Tourists and families can track itinerary progress in real time.',
  },
  {
    icon: HeartPulse,
    title: 'Fair Price Shield',
    desc: 'No aggressive upselling or commissions. All pilot experiences adhere to predetermined Fair Price bands vetted against local benchmarks.',
  },
  {
    icon: ShieldAlert,
    title: 'Direct Helpline Access',
    desc: 'Independent of internet connectivity or AI, essential statutory emergency phone lines are always accessible in one tap.',
  },
];

export default function SafetyPage() {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'YATRAMITR Safety & Emergency Hub',
        text: 'Emergency Helplines: 112 (Emergency), 108 (Ambulance), 1091 (Women Helpline), 1363 (Tourist Helpline).',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(
        'YATRAMITR Emergency Numbers: 112 (Emergency), 108 (Ambulance), 1091 (Women Helpline), 1363 (Tourist Helpline).'
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-page-safety text-charcoal-900 pb-20">
      {/* 1. Hero */}
      <section className="relative bg-[#0D211A] text-[#F5F1E8] pt-32 pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#B8955A]/25">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-[#B8955A]/40 text-xs font-semibold text-[#DFB86C]">
            <ShieldAlert className="w-3.5 h-3.5 text-[#DFB86C]" />
            <span>Official Emergency & Safety Protocol</span>
          </div>

          <div className="space-y-3 max-w-3xl">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
              Emergency & Traveler Safety
            </h1>
            <p className="text-base sm:text-lg text-[#E8DFCF] leading-relaxed">
              Immediate statutory hotlines for Hyderabad & Telangana. All numbers work directly over cellular voice
              without reliance on data connection or AI assistants.
            </p>
          </div>

          {/* Share / Copy Quick Strip */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 border border-white/25 text-xs font-bold text-white transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Numbers Copied to Clipboard</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-[#DFB86C]" />
                  <span>Share Emergency Hub Info</span>
                </>
              )}
            </button>
            <Link
              href="/trip"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#DFB86C] hover:bg-[#cfa557] text-[#0D211A] text-xs font-bold transition-colors"
            >
              <Compass className="w-3.5 h-3.5 text-[#0D211A]" />
              <span>Open Active Live Trip</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Emergency Dial Grid — The 4 Canonical Numbers */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {EMERGENCY_CONTACTS.map((item) => (
            <div
              key={item.number}
              className="rounded-2xl bg-white border border-[#E8DFCF] shadow-lg p-5 flex flex-col justify-between space-y-4 hover:border-[#B8955A] transition-all hover:-translate-y-1"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-3xl font-extrabold text-[#16352A] tracking-tight">
                    {item.number}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#F5F1E8] text-[#B86B4B]">
                    {item.tag}
                  </span>
                </div>
                <h2 className="font-serif font-bold text-lg text-[#16352A]">{item.name}</h2>
                <p className="text-xs text-charcoal-700 leading-relaxed">{item.desc}</p>
              </div>

              <a
                href={item.tel}
                className={`w-full py-3 rounded-xl font-bold text-sm text-center flex items-center justify-center gap-2 shadow-sm transition-all transform active:scale-95 ${item.btnColor}`}
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call {item.number}</span>
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Safety Guidance & Protocols */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#B86B4B]">Responsible Protocol</span>
          <h2 className="font-serif text-3xl font-bold text-[#16352A]">How YATRAMITR Keeps You Safe</h2>
          <p className="text-sm text-charcoal-700">
            Our multi-layered safety framework combines verified community guides, transparent fares, and clear statutory escalation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SAFETY_PILLARS.map((p, i) => {
            const Icon = p.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white border border-[#E8DFCF] shadow-sm space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-[#F5F1E8] border border-[#B8955A]/30 flex items-center justify-center text-[#16352A]">
                  <Icon className="w-5 h-5 text-[#B86B4B]" />
                </div>
                <h3 className="font-serif font-bold text-base text-[#16352A]">{p.title}</h3>
                <p className="text-xs text-charcoal-700 leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>

        {/* 4. Telangana Tourist & She Teams Guidance */}
        <div className="rounded-2xl bg-gradient-to-br from-[#0D211A] to-[#16352A] text-[#F5F1E8] p-6 sm:p-8 border border-[#B8955A]/30 shadow-xl space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#DFB86C]/20 border border-[#DFB86C]/40 flex items-center justify-center shrink-0">
              <Info className="w-6 h-6 text-[#DFB86C]" />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                Hyderabad Tourist Police & She Teams Infrastructure
              </h3>
              <p className="text-xs sm:text-sm text-[#E8DFCF] leading-relaxed max-w-3xl">
                Hyderabad has dedicated police outposts stationed at major heritage clusters including Charminar,
                Golconda Fort, Salar Jung Museum, and Hussain Sagar. Women travelers are protected by plainclothes
                She Teams monitoring public transport and heritage walkways 24/7.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <p className="text-xs font-bold text-[#DFB86C]">Heritage Hub Kiosks</p>
              <p className="text-[11px] text-[#E8DFCF]">
                Police assistance booths are situated at Charminar South Gate and Golconda Fort entry plaza.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <p className="text-xs font-bold text-[#DFB86C]">Licensed Metered Transit</p>
              <p className="text-[11px] text-[#E8DFCF]">
                Use TSRTC electric AC buses, Hyderabad Metro Rail, or pre-vetted auto stands near MGBS and Secunderabad.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <p className="text-xs font-bold text-[#DFB86C]">Fair Price Verification</p>
              <p className="text-[11px] text-[#E8DFCF]">
                Always cross-check street guide rates on our Fair Price tool before committing to private hire.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10 text-xs">
            <p className="text-[#E8DFCF]/80">
              For real-time incident reports, always dial <strong>112</strong> immediately.
            </p>
            <div className="flex items-center gap-3">
              <Link
                href="/price-check"
                className="text-[#DFB86C] hover:underline font-semibold flex items-center gap-1"
              >
                <span>Check Fair Price</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/mitras"
                className="text-[#DFB86C] hover:underline font-semibold flex items-center gap-1"
              >
                <span>View Certified Mitras</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
