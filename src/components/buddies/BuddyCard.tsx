import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Award, Star, MapPin, CheckCircle, ArrowRight } from 'lucide-react';
import { LocalBuddy } from '@/types';

interface BuddyCardProps {
  buddy: LocalBuddy;
}

export default function BuddyCard({ buddy }: BuddyCardProps) {
  return (
    <div className="bg-sand-50 rounded-xl overflow-hidden border border-forest-900/10 hover:border-gold-500/50 hover:shadow-md transition-all duration-300 flex flex-col justify-between">
      <div className="p-5 space-y-4">
        {/* Header: Avatar, Name, Knowledge Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-forest-800 shadow-sm shrink-0">
              <Image
                src={buddy.avatar}
                alt={buddy.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-serif text-lg font-bold text-forest-950">
                  {buddy.name}
                </h4>
                <ShieldCheck className="w-4 h-4 text-forest-700 shrink-0" />
              </div>
              <div className="flex items-center gap-1 text-xs text-charcoal-700">
                <MapPin className="w-3 h-3 text-terracotta-600 shrink-0" />
                <span>{buddy.location}</span>
              </div>
            </div>
          </div>

          {/* Knowledge Score Badge */}
          <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-gold-400/15 border border-gold-500/30 text-center shrink-0">
            <span className="text-xs font-extrabold text-forest-900 font-serif">
              {buddy.knowledgeScore}%
            </span>
            <span className="text-[9px] uppercase tracking-wider text-forest-800 font-semibold">
              Knowledge
            </span>
          </div>
        </div>

        {/* Verification Checkmarks */}
        <div className="bg-sand-100/70 p-2.5 rounded-lg border border-sand-200/80 grid grid-cols-3 gap-1 text-[11px] text-forest-900 font-medium">
          <div className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-forest-700 shrink-0" />
            <span className="truncate">Identity</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-forest-700 shrink-0" />
            <span className="truncate">Exam Passed</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-forest-700 shrink-0" />
            <span className="truncate">First Aid</span>
          </div>
        </div>

        {/* Bio / Quote */}
        <p className="text-xs text-charcoal-800 italic line-clamp-2 leading-relaxed border-l-2 border-gold-400 pl-2">
          "{buddy.quote}"
        </p>

        {/* Specialties tags */}
        <div className="space-y-1.5">
          <p className="text-[11px] font-semibold text-forest-900 uppercase tracking-wider">
            Specialties
          </p>
          <div className="flex flex-wrap gap-1.5">
            {buddy.specialties.slice(0, 3).map((specialty, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded text-[11px] bg-sand-200/90 text-charcoal-800 font-medium border border-sand-300"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>

        {/* Languages & Experience */}
        <div className="text-xs text-charcoal-700 space-y-1 pt-1">
          <p>
            <strong className="text-forest-900 font-semibold">Languages:</strong>{' '}
            {buddy.languages.join(', ')}
          </p>
          <p>
            <strong className="text-forest-900 font-semibold">Native Residency:</strong>{' '}
            {buddy.yearsOfResidency} years in the region
          </p>
        </div>
      </div>

      {/* Footer link */}
      <div className="px-5 py-3 bg-sand-100/60 border-t border-sand-200 flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs font-semibold text-forest-900">
          <Star className="w-3.5 h-3.5 text-gold-500 fill-gold-500" />
          <span>{buddy.rating}</span>
          <span className="text-charcoal-600 font-normal">({buddy.reviewCount} reviews)</span>
        </div>
        <Link
          href={`/buddies/${buddy.id}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-terracotta-600 hover:text-terracotta-700 transition-colors"
        >
          <span>View Profile</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
