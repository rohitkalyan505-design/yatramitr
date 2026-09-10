'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronDown, MapPin, Compass } from 'lucide-react';

const Hero3DCanvas = dynamic(() => import('./Hero3DCanvas'), {
  ssr: false,
  loading: () => null,
});

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden bg-[#0D211A] text-[#F5F1E8]">
      {/* 1. Cinematic Hyderabad Landscape Photo Base */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=2000&q=85"
          alt="Hyderabad city landscape"
          fill
          priority
          className="object-cover object-center opacity-40 mix-blend-luminosity scale-105 transition-transform duration-1000 ease-out"
        />
      </div>

      {/* 2. Sophisticated 3D Topographic Terrain Mesh Layer */}
      <div className="absolute inset-0 z-10 opacity-70 pointer-events-auto">
        <Hero3DCanvas />
      </div>

      {/* 3. Subtle Editorial Dark Vignette & Gradient Overlays for Readability */}
      <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-t from-[#0D211A] via-[#0D211A]/60 to-transparent" />
      <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-r from-[#0D211A]/90 via-[#0D211A]/40 to-transparent" />

      {/* 4. Main Editorial Hero Content */}
      <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 sm:pt-44 pb-20 flex-1 flex flex-col justify-center">
        <div className="max-w-3xl space-y-6">
          {/* Location Indicator */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16352A]/80 border border-[#B8955A]/40 text-[#B8955A] text-xs font-semibold tracking-widest uppercase backdrop-blur-sm">
            <MapPin className="w-3.5 h-3.5 text-[#B8955A]" />
            <span>HYDERABAD · TELANGANA</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#FFFFFF] leading-[1.08]">
            Discover Hyderabad beyond the usual.
          </h1>

          {/* Supporting Text */}
          <p className="text-base sm:text-xl text-[#E8DFCF] leading-relaxed font-normal max-w-2xl">
            Discover Hyderabad's hidden gems, meet trusted Mitras, and experience the city beyond the usual tourist trail.
          </p>

          {/* Dual Action CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link
              href="/place/hyderabad"
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-md bg-[#B8955A] hover:bg-[#a6844c] text-[#0D211A] font-bold text-base shadow-md transition-all transform hover:-translate-y-0.5"
            >
              <span>Explore Hyderabad</span>
              <ArrowRight className="w-4 h-4 text-[#0D211A]" />
            </Link>

            <Link
              href="/become-mitra"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-md bg-white/10 hover:bg-white/20 border border-white/20 text-[#FFFFFF] font-medium text-base backdrop-blur-sm transition-colors"
            >
              <span>Become a Local Mitra</span>
            </Link>
          </div>

          {/* Quiet Trust Footnote */}
          <div className="pt-2 flex items-center gap-2 text-xs text-[#E8DFCF]/70 font-medium">
            <Compass className="w-4 h-4 text-[#B8955A]" />
            <span>Curated micro-groups • Verified native custodians • Zero commercial rush</span>
          </div>
        </div>
      </div>

      {/* 5. Subtle Scroll Indicator */}
      <div className="relative z-30 pb-8 flex flex-col items-center justify-center text-[#E8DFCF]/60 pointer-events-none">
        <span className="text-[11px] tracking-[0.2em] uppercase font-semibold text-[#B8955A] mb-1">
          Scroll to explore
        </span>
        <ChevronDown className="w-4 h-4 animate-bounce text-[#B8955A]" />
      </div>
    </section>
  );
}
