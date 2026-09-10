import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  MapPin, 
  Star, 
  ShieldCheck, 
  Users, 
  Clock, 
  Compass, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Plane, 
  Train, 
  Car,
  Lightbulb,
  HeartHandshake
} from 'lucide-react';
import { MOCK_DESTINATIONS, MOCK_BUDDIES, MOCK_EXPERIENCES, ARAKU_HIDDEN_GEMS } from '@/data/mock-data';
import ExperienceCard from '@/components/experiences/ExperienceCard';
import BuddyCard from '@/components/buddies/BuddyCard';

export function generateStaticParams() {
  const ids = MOCK_DESTINATIONS.map((destination) => ({
    id: destination.id,
  }));
  return [...ids, { id: 'araku' }];
}

export default function PlaceDetailsPage({ params }: { params: { id: string } }) {
  const targetId = params.id === 'araku' ? 'araku-valley' : params.id;
  const destination = MOCK_DESTINATIONS.find((d) => d.id === targetId || d.id === params.id);

  if (!destination) {
    notFound();
  }

  // Related Buddies for this place
  const relatedBuddies = MOCK_BUDDIES.filter((b) => b.destinationId === destination.id || b.location.toLowerCase().includes('araku'));
  const displayBuddies = relatedBuddies.length > 0 ? relatedBuddies : [MOCK_BUDDIES[0]];

  // Related Experiences for this place
  const relatedExperiences = MOCK_EXPERIENCES.filter((e) => e.destinationId === destination.id || e.destinationName.toLowerCase().includes('araku'));
  const displayExperiences = relatedExperiences.length > 0 ? relatedExperiences : [MOCK_EXPERIENCES[0]];

  return (
    <div className="space-y-14 sm:space-y-20 pb-20 pt-16">
      {/* 1. Immersive Hero Banner */}
      <section className="relative w-full min-h-[55vh] sm:min-h-[65vh] flex flex-col justify-end bg-[#0D211A] text-[#F5F1E8] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={destination.heroImage}
            alt={destination.name}
            fill
            priority
            className="object-cover opacity-60 scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D211A] via-[#0D211A]/50 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 w-full space-y-4">
          {/* Breadcrumb & Verification Badge */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <Link href="/" className="text-[#E8DFCF] hover:text-[#FFFFFF]">Home</Link>
            <span className="text-[#B8955A]">/</span>
            <Link href="/discover" className="text-[#E8DFCF] hover:text-[#FFFFFF]">Destinations</Link>
            <span className="text-[#B8955A]">/</span>
            <span className="text-[#B8955A] font-semibold">{destination.name}</span>
            <span className="ml-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#16352A]/90 border border-[#B8955A]/40 text-[#B8955A] text-xs font-bold backdrop-blur-sm">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Local Route
            </span>
          </div>

          <div className="max-w-4xl space-y-2">
            <div className="flex items-baseline gap-3">
              <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-[#FFFFFF]">
                {destination.name}
              </h1>
              {destination.regionalName && (
                <span className="text-xl sm:text-2xl text-[#B8955A] font-serif">
                  {destination.regionalName}
                </span>
              )}
            </div>
            <p className="text-base sm:text-xl text-[#E8DFCF] leading-relaxed">
              {destination.headline}
            </p>
          </div>

          {/* Key Metrics Chips */}
          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-medium text-[#E8DFCF]">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10">
              <MapPin className="w-3.5 h-3.5 text-[#B86B4B]" />
              <span>{destination.state} ({destination.region})</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10">
              <Users className="w-3.5 h-3.5 text-[#B8955A]" />
              <span>Crowd Density: <strong className="text-[#FFFFFF]">{destination.crowdLevel}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10">
              <Star className="w-3.5 h-3.5 text-[#B8955A] fill-[#B8955A]" />
              <span>{destination.rating} ({destination.reviewCount} verified travelers)</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Editorial Why Visit & Local Secrets */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Narrative */}
          <div className="lg:col-span-8 space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#B86B4B]">
                Cultural Context & Geography
              </span>
              <h2 className="font-serif text-3xl font-bold text-[#0D211A]">
                The Living Heritage of {destination.name}
              </h2>
              <p className="text-base text-[#1D2521]/80 leading-relaxed">
                {destination.description}
              </p>
            </div>

            {/* Why Visit */}
            <div className="p-6 rounded-2xl bg-[#F5F1E8] border border-[#E8DFCF] space-y-3">
              <h3 className="font-serif text-xl font-bold text-[#0D211A] flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#16352A]" />
                Why Yatra Mitra Recommends This Destination
              </h3>
              <p className="text-sm text-[#1D2521]/80 leading-relaxed font-serif">
                {destination.whyVisit}
              </p>
            </div>

            {/* Local Oral Story */}
            <div className="space-y-3">
              <h3 className="font-serif text-2xl font-bold text-[#0D211A]">
                Local Oral Folklore & Ecological Wisdom
              </h3>
              <p className="text-sm text-[#1D2521]/80 leading-relaxed">
                {destination.localStory}
              </p>
              <p className="text-sm text-[#1D2521]/80 leading-relaxed">
                {destination.culturalSignificance}
              </p>
            </div>

            {/* 4 Hidden Gems Spotlight if Araku */}
            {destination.id === 'araku-valley' && (
              <div className="space-y-4 pt-4">
                <h3 className="font-serif text-2xl font-bold text-[#0D211A]">
                  Curated Unmapped Spots in Araku
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {ARAKU_HIDDEN_GEMS.map((gem) => (
                    <div key={gem.id} className="p-4 rounded-xl bg-white border border-[#E8DFCF] shadow-sm space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#B86B4B]">{gem.experienceType}</span>
                        <span className="font-bold text-[#0D211A]">₹{gem.estimatedPrice}</span>
                      </div>
                      <h4 className="font-serif font-bold text-base text-[#0D211A]">{gem.name}</h4>
                      <p className="text-xs text-[#1D2521]/70">{gem.shortDescription}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar: Access & Safety */}
          <div className="lg:col-span-4 space-y-6">
            {/* Best Season */}
            <div className="p-6 rounded-2xl bg-white border border-[#E8DFCF] shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#16352A]">
                <Clock className="w-4 h-4 text-[#B8955A]" />
                <span>Best Time to Experience</span>
              </div>
              <p className="text-sm font-semibold text-[#0D211A]">
                {destination.bestTimeToVisit}
              </p>
            </div>

            {/* Transit Guide */}
            <div className="p-6 rounded-2xl bg-white border border-[#E8DFCF] shadow-sm space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#0D211A]">
                How to Reach Responsibly
              </h3>
              <ul className="space-y-3 text-xs text-[#1D2521]/80">
                <li className="flex items-start gap-2.5">
                  <Plane className="w-4 h-4 text-[#16352A] shrink-0 mt-0.5" />
                  <span><strong>Airport:</strong> {destination.howToReach.nearestAirport}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Train className="w-4 h-4 text-[#16352A] shrink-0 mt-0.5" />
                  <span><strong>Rail:</strong> {destination.howToReach.nearestRailhead}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Car className="w-4 h-4 text-[#16352A] shrink-0 mt-0.5" />
                  <span><strong>Road:</strong> {destination.howToReach.roadAccess}</span>
                </li>
              </ul>
            </div>

            {/* Safety & Ecological Guidelines */}
            <div className="p-6 rounded-2xl bg-[#0D211A] text-[#F5F1E8] space-y-4 shadow-lg">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#B8955A]">
                <AlertCircle className="w-4 h-4 text-[#B8955A]" />
                <span>Zero-Overtourism Protocol</span>
              </div>
              <ul className="space-y-2.5 text-xs text-[#E8DFCF]">
                {destination.safetyGuidelines.map((guide, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B8955A] mt-1.5 shrink-0" />
                    <span>{guide}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Verified Local Buddies for this Destination */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#B86B4B]">
              Native Companions
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#0D211A]">
              Verified Local Buddies in {destination.name}
            </h2>
          </div>
          <Link
            href="/become-a-buddy"
            className="text-xs font-semibold text-[#16352A] hover:underline"
          >
            Apply to guide here →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayBuddies.map((buddy) => (
            <BuddyCard key={buddy.id} buddy={buddy} />
          ))}
        </div>
      </section>

      {/* 4. Small-Group Host-Crafted Experiences */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#B86B4B]">
            Low-Impact Journeys
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#0D211A]">
            Experiences in {destination.name}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayExperiences.map((exp) => (
            <ExperienceCard key={exp.id} experience={exp} />
          ))}
        </div>
      </section>
    </div>
  );
}
