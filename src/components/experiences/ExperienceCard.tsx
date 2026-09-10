import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Users, ShieldCheck, ArrowUpRight, Star } from 'lucide-react';
import { Experience } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface ExperienceCardProps {
  experience: Experience;
}

export default function ExperienceCard({ experience }: ExperienceCardProps) {
  return (
    <div className="group flex flex-col bg-sand-50 rounded-xl overflow-hidden border border-forest-900/10 hover:border-forest-800/40 hover:shadow-lg transition-all duration-300">
      {/* Image & Price Header */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-sand-200">
        <Image
          src={experience.image}
          alt={experience.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-forest-950/20 to-transparent" />

        {/* Price & Duration Badge */}
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1.5 rounded-lg bg-sand-50/95 text-forest-950 text-xs font-bold shadow-md backdrop-blur-sm flex items-center gap-1">
            <span className="text-forest-900 font-extrabold text-sm">
              {formatCurrency(experience.pricePerPerson)}
            </span>
            <span className="text-[11px] text-charcoal-700 font-normal">/ person</span>
          </span>
        </div>

        <div className="absolute bottom-3 inset-x-3 text-sand-50">
          <div className="flex items-center gap-3 text-xs text-sand-200 mb-1">
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-gold-400" />
              {experience.duration}
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-gold-400" />
              Max {experience.groupCap} travelers
            </span>
          </div>
          <h4 className="font-serif text-lg font-bold line-clamp-2 group-hover:text-gold-200 transition-colors">
            {experience.title}
          </h4>
        </div>
      </div>

      {/* Card Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <p className="text-xs text-terracotta-600 font-semibold uppercase tracking-wider mb-1.5">
            {experience.category}
          </p>
          <p className="text-sm text-charcoal-800 line-clamp-2 leading-relaxed">
            {experience.summary}
          </p>
        </div>

        {/* Host details */}
        <div className="pt-3 border-t border-sand-200/80 flex items-center justify-between">
          <Link
            href={`/buddies/${experience.hostBuddyId}`}
            className="flex items-center gap-2.5 group/host"
          >
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gold-500/40">
              <Image
                src={experience.hostAvatar}
                alt={experience.hostName}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-xs font-bold text-forest-950 group-hover/host:text-terracotta-600 transition-colors">
                {experience.hostName}
              </p>
              <div className="flex items-center gap-1 text-[11px] text-forest-700">
                <ShieldCheck className="w-3 h-3" />
                <span>Verified Host</span>
              </div>
            </div>
          </Link>

          <Link
            href={`/experiences/${experience.id}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-forest-900 hover:bg-forest-800 text-sand-50 text-xs font-semibold transition-colors"
          >
            <span>View</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-gold-300" />
          </Link>
        </div>
      </div>
    </div>
  );
}
