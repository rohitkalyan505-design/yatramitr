'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Languages, Star } from 'lucide-react';
import type { Mitra } from '@/types';
import DemoBadge from './DemoBadge';

export default function MitraCard({ mitra }: { mitra: Mitra }) {
  return (
    <div className="rounded-2xl bg-white border border-[#E8DFCF] p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col space-y-5">
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#B8955A] shrink-0">
            {mitra.avatar ? (
              <Image src={mitra.avatar} alt={mitra.name} fill className="object-cover" />
            ) : (
              <div className="absolute inset-0 bg-[#16352A] flex items-center justify-center text-[#DFB86C] font-serif text-xl font-bold">
                {mitra.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-serif text-xl font-bold text-[#0D211A]">{mitra.name}</h3>
              {mitra.isDemo && <DemoBadge label="DEMO PROFILE" />}
            </div>
            <p className="text-xs text-[#1D2521]/70">{mitra.location}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <Star className="w-3.5 h-3.5 text-[#C5A059] fill-[#C5A059]" />
              <span className="text-xs font-bold text-[#0D211A]">
                Trust Score {mitra.trustScore}/100
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs text-[#1D2521]/75 leading-relaxed line-clamp-2">{mitra.bio}</p>

        <div className="space-y-1.5">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-[#1D2521]/60 flex items-center gap-1">
            <Languages className="w-3 h-3" /> Languages
          </span>
          <p className="text-xs font-medium text-[#0D211A]">{mitra.languages.join(' · ')}</p>
        </div>

        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-[#1D2521]/60 block">
            Specialities
          </span>
          <div className="flex flex-wrap gap-1.5">
            {mitra.specialities.slice(0, 4).map((spec, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-md bg-[#F5F1E8] text-[#16352A] text-xs font-medium border border-[#E8DFCF]"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F5F1E8] text-[#16352A] text-xs font-semibold border border-[#E8DFCF]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Verification workflow: {mitra.verificationStatus.replace('_', ' ')}</span>
        </div>
      </div>

      <div className="pt-4 border-t border-[#E8DFCF] flex gap-2">
        <Link
          href={`/mitras/${mitra.id}`}
          className="flex-1 text-center py-2.5 rounded-lg border border-[#16352A] text-[#16352A] hover:bg-[#16352A]/5 text-xs font-bold transition-colors"
        >
          View Trust Passport
        </Link>
        <Link
          href={`/booking?mitraId=${mitra.id}`}
          className="flex-1 text-center py-2.5 rounded-lg bg-[#B8955A] hover:bg-[#a6844c] text-[#0D211A] text-xs font-bold shadow-xs transition-colors"
        >
          Book Mitra
        </Link>
      </div>
    </div>
  );
}
