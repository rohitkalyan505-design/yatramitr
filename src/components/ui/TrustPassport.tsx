'use client';

// ============================================================
// TRUST PASSPORT — transparent verification display
// ============================================================
// Shows exactly which verification steps are complete, pending,
// or not started — and clearly distinguishes the prototype
// workflow from any government certification (which does not exist).
// ============================================================

import React from 'react';
import { ShieldCheck, Clock, XCircle, Info } from 'lucide-react';
import type { Mitra } from '@/types';
import { cn } from '@/lib/utils';

const STATUS_META = {
  verified: { label: 'Verified', icon: ShieldCheck, cls: 'bg-forest-50 text-forest-700 border-forest-200' },
  workflow_completed: { label: 'Workflow completed', icon: ShieldCheck, cls: 'bg-forest-50 text-forest-700 border-forest-200' },
  pending: { label: 'Pending', icon: Clock, cls: 'bg-gold-100 text-gold-700 border-gold-300' },
  not_verified: { label: 'Not verified', icon: XCircle, cls: 'bg-sand-100 text-charcoal-700 border-sand-300' },
} as const;

const STEPS = [
  { key: 'identityStatus', label: 'Identity', detail: 'Government ID matched to application' },
  { key: 'residencyStatus', label: 'Local residency', detail: 'Proof of residence in the guiding area' },
  { key: 'knowledgeStatus', label: 'Local knowledge', detail: 'Area & heritage knowledge assessment' },
  { key: 'safetyStatus', label: 'Safety orientation', detail: 'Traveller safety & emergency protocol training' },
  { key: 'referencesStatus', label: 'Community references', detail: 'References from local community members' },
] as const;

export default function TrustPassport({ mitra, compact = false }: { mitra: Mitra; compact?: boolean }) {
  return (
    <div className={cn('rounded-2xl border bg-white space-y-4', compact ? 'p-4 border-[#E8DFCF]' : 'p-6 border-[#B8955A]/40 shadow-sm')}>
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#B86B4B]">
            <ShieldCheck className="w-3.5 h-3.5" />
            Trust Passport
          </div>
          <h3 className={cn('font-serif font-bold text-[#0D211A]', compact ? 'text-base' : 'text-xl')}>
            {mitra.name}
          </h3>
        </div>

        {/* Transparent trust score */}
        <div className="text-center shrink-0">
          <div className="w-14 h-14 rounded-full border-4 border-[#16352A] flex items-center justify-center bg-[#F5F1E8]">
            <span className="font-serif text-lg font-bold text-[#16352A]">{mitra.trustScore}</span>
          </div>
          <span className="text-[9px] uppercase tracking-wider text-[#1D2521]/60 font-semibold block mt-1">
            /100 score
          </span>
        </div>
      </div>

      {/* Verification steps */}
      <div className="space-y-2">
        {STEPS.map((step) => {
          const status = mitra.verification[step.key];
          const meta = STATUS_META[status];
          const Icon = meta.icon;
          return (
            <div
              key={step.key}
              className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-[#FAF8F5] border border-[#E8DFCF]"
            >
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#0D211A]">{step.label}</p>
                {!compact && <p className="text-[10px] text-[#1D2521]/60 truncate">{step.detail}</p>}
              </div>
              <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-semibold whitespace-nowrap', meta.cls)}>
                <Icon className="w-3 h-3" />
                {meta.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Score explanation + honest disclaimer */}
      <div className="p-3 rounded-lg bg-[#F5F1E8] border border-[#E8DFCF] space-y-1.5">
        <p className="text-[11px] text-[#1D2521]/80 flex items-start gap-1.5">
          <Info className="w-3.5 h-3.5 text-[#B86B4B] shrink-0 mt-0.5" />
          {mitra.trustScoreNote}
        </p>
        <p className="text-[10px] text-[#1D2521]/60 leading-relaxed">
          Score formula: 20 points per completed verification step (identity, residency, knowledge, safety,
          references). This is a <strong>prototype verification workflow</strong> — not a government
          certification. DEMO profile for MVP demonstration.
        </p>
      </div>
    </div>
  );
}
