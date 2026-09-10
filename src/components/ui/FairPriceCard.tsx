import React from 'react';
import { Tag, CheckCircle2, Info } from 'lucide-react';
import type { Experience } from '@/types';

export default function FairPriceCard({ experience }: { experience: Experience }) {
  const { pricePerPerson, typicalRange, priceNote, inclusions } = experience;
  const within = pricePerPerson >= typicalRange.min && pricePerPerson <= typicalRange.max;
  const above = pricePerPerson > typicalRange.max;

  const statusColor = within ? '#2D7A4F' : above ? '#BD5338' : '#C5A059';
  const statusLabel = within
    ? 'Within typical range'
    : above
      ? 'Above typical range'
      : 'Below typical range';

  return (
    <div className="rounded-2xl border border-[#E8DFCF] bg-white p-5 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#B86B4B]">
          <Tag className="w-3.5 h-3.5" />
          Fair Price Guide
        </div>
        <span
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold"
          style={{ backgroundColor: `${statusColor}1A`, color: statusColor }}
        >
          <CheckCircle2 className="w-3 h-3" />
          {statusLabel}
        </span>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="font-serif text-3xl font-extrabold text-[#0D211A]">₹{pricePerPerson}</span>
        <span className="text-xs text-[#1D2521]/60">/ person</span>
      </div>

      <div className="p-3 rounded-xl bg-[#F5F1E8] space-y-1">
        <p className="text-xs font-bold text-[#16352A]">
          Typical comparable range: ₹{typicalRange.min}–₹{typicalRange.max}
        </p>
        <p className="text-[10px] text-[#1D2521]/60 flex items-start gap-1">
          <Info className="w-3 h-3 shrink-0 mt-0.5" />
          {priceNote}
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#1D2521]/60">
          What is included — no hidden charges
        </p>
        <ul className="space-y-1.5">
          {inclusions.map((inc, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-[#1D2521]/85">
              <CheckCircle2 className="w-3.5 h-3.5 text-forest-700 shrink-0 mt-0.5" />
              {inc}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
