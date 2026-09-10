'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Users } from 'lucide-react';
import type { Experience } from '@/types';
import DemoBadge from './DemoBadge';

export default function ExperienceCard({ experience }: { experience: Experience }) {
  const exp = experience;
  return (
    <Link
      href={`/experiences/${exp.id}`}
      className="group rounded-2xl overflow-hidden bg-white border border-[#E8DFCF] flex flex-col hover:shadow-lg hover:border-[#B8955A]/50 transition-all duration-300 hover:-translate-y-0.5"
    >
      <div className="relative aspect-[16/10] w-full bg-[#E8DFCF] overflow-hidden">
        {exp.image ? (
          <Image
            src={exp.image}
            alt={exp.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 bg-topo-pattern flex items-center justify-center">
            <span className="font-serif text-3xl text-[#B8955A]">యా</span>
          </div>
        )}
        <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded bg-[#0D211A]/85 backdrop-blur-sm text-xs font-semibold text-[#F5F1E8] flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-[#DFB86C]" />
          {exp.durationLabel}
        </div>
        {exp.crowdLevel === 'Low' && (
          <div className="absolute top-3 left-3 px-2 py-1 rounded bg-forest-500/90 text-white text-[10px] font-bold uppercase tracking-wider">
            Low crowd
          </div>
        )}
      </div>

      <div className="p-5 space-y-2.5 flex-1 flex flex-col">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-bold text-[#B86B4B] uppercase tracking-wider truncate">
            {exp.placeName}
          </span>
          <span className="text-[10px] text-[#1D2521]/60 flex items-center gap-1 whitespace-nowrap">
            <Users className="w-3 h-3" /> Max {exp.groupCap}
          </span>
        </div>

        <h3 className="font-serif text-lg font-bold text-[#0D211A] leading-snug group-hover:text-[#16352A] transition-colors">
          {exp.title}
        </h3>
        <p className="text-xs text-[#1D2521]/70 leading-relaxed line-clamp-2 flex-1">{exp.summary}</p>

        <div className="pt-3 border-t border-[#E8DFCF]/70 flex items-center justify-between">
          <div>
            <span className="font-serif text-lg font-bold text-[#16352A]">₹{exp.pricePerPerson}</span>
            <span className="text-[10px] text-[#1D2521]/60"> / person</span>
          </div>
          <span className="text-[11px] font-bold text-[#16352A] group-hover:underline">View →</span>
        </div>
      </div>
    </Link>
  );
}
