import React from 'react';
import { ShieldCheck, Award, HeartPulse, CheckCircle2 } from 'lucide-react';
import { VerificationBadges } from '@/types';

interface VerificationBadgeProps {
  badges?: VerificationBadges;
  score?: number;
  compact?: boolean;
  className?: string;
}

export default function VerificationBadge({
  badges = { identityVerified: true, knowledgeAssessmentPassed: true, safetyTrainingCompleted: true },
  score,
  compact = false,
  className = '',
}: VerificationBadgeProps) {
  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-forest-50 text-forest-800 border border-forest-200/80 ${className}`}>
        <ShieldCheck className="w-3.5 h-3.5 text-forest-700 shrink-0" />
        <span>Verified Local Buddy</span>
        {score && (
          <span className="ml-1 px-1.5 py-0.5 rounded bg-forest-800 text-gold-300 font-semibold text-[10px]">
            {score}%
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-2.5 p-3.5 rounded-lg bg-sand-100/70 border border-sand-300/80 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wider text-forest-900 uppercase">
          Vetting & Verification
        </span>
        {score && (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-forest-800 bg-gold-400/20 px-2 py-0.5 rounded border border-gold-500/30">
            <Award className="w-3 h-3 text-gold-600" />
            Knowledge Score: {score}/100
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
        <div className="flex items-center gap-2 text-forest-900">
          <CheckCircle2 className="w-4 h-4 text-forest-700 shrink-0" />
          <span>Identity Verified</span>
        </div>
        <div className="flex items-center gap-2 text-forest-900">
          <Award className="w-4 h-4 text-forest-700 shrink-0" />
          <span>Local Knowledge Test</span>
        </div>
        <div className="flex items-center gap-2 text-forest-900">
          <HeartPulse className="w-4 h-4 text-forest-700 shrink-0" />
          <span>Safety & First Aid</span>
        </div>
      </div>
      <p className="text-[11px] text-charcoal-700 italic border-t border-sand-300/50 pt-1.5">
        * Verified through physical assessment & background check. Emergency response is community-supported and not guaranteed.
      </p>
    </div>
  );
}
