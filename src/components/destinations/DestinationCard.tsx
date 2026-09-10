import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Star, ShieldCheck, Users } from 'lucide-react';
import { Destination } from '@/types';

interface DestinationCardProps {
  destination: Destination;
  featured?: boolean;
}

export default function DestinationCard({ destination, featured = false }: DestinationCardProps) {
  // Color code crowd levels subtly
  const crowdBadgeColor = {
    Untouched: 'bg-forest-900 text-gold-300 border-gold-500/30',
    Sparse: 'bg-forest-100 text-forest-900 border-forest-300',
    Peaceful: 'bg-sand-200 text-forest-950 border-sand-400',
    Moderate: 'bg-amber-100 text-amber-900 border-amber-300',
  }[destination.crowdLevel] || 'bg-sand-100 text-charcoal-800';

  return (
    <Link
      href={`/places/${destination.id}`}
      className="group flex flex-col bg-sand-50 rounded-xl overflow-hidden border border-forest-900/10 hover:border-gold-500/50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* Visual Header */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-sand-200">
        <Image
          src={destination.heroImage}
          alt={destination.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-forest-950/20 to-transparent opacity-80 group-hover:opacity-70 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide border shadow-sm ${crowdBadgeColor}`}>
            ● {destination.crowdLevel} Density
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-sand-50/90 text-forest-950 text-xs font-semibold backdrop-blur-sm shadow-sm">
            <Star className="w-3.5 h-3.5 text-gold-500 fill-gold-500" />
            {destination.rating}
          </span>
        </div>

        {/* Bottom overlay in image */}
        <div className="absolute bottom-3 inset-x-3">
          <p className="text-xs uppercase tracking-wider text-sand-200 font-medium">
            {destination.category}
          </p>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-sand-50 leading-snug">
            {destination.name}
          </h3>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-charcoal-700 font-medium mb-2">
            <MapPin className="w-3.5 h-3.5 text-terracotta-600 shrink-0" />
            <span>{destination.state} • {destination.region}</span>
          </div>

          <p className="text-sm text-charcoal-800 line-clamp-2 leading-relaxed">
            {destination.description}
          </p>
        </div>

        {/* Verification & Buddies Indicator */}
        <div className="pt-3 border-t border-sand-200/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-forest-800 font-medium">
            <ShieldCheck className="w-4 h-4 text-forest-700" />
            <span>Verified Local Route</span>
          </div>
          <div className="flex items-center gap-1 text-charcoal-700 font-semibold">
            <Users className="w-3.5 h-3.5 text-forest-900" />
            <span>{destination.buddiesCount} Local Buddies</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
