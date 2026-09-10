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
import { MOCK_DESTINATIONS, MOCK_BUDDIES, MOCK_EXPERIENCES } from '@/data/mock-data';
import ExperienceCard from '@/components/experiences/ExperienceCard';
import BuddyCard from '@/components/buddies/BuddyCard';

export function generateStaticParams() {
  return MOCK_DESTINATIONS.map((destination) => ({
    id: destination.id,
  }));
}

export default function PlaceDetailsPage({ params }: { params: { id: string } }) {
  const destination = MOCK_DESTINATIONS.find((d) => d.id === params.id);

  if (!destination) {
    notFound();
  }

  // Related Buddies for this place
  const relatedBuddies = MOCK_BUDDIES.filter((b) => b.destinationId === destination.id);
  // Fallback if no specific buddy mapped
  const displayBuddies = relatedBuddies.length > 0 ? relatedBuddies : [MOCK_BUDDIES[0]];

  // Related Experiences for this place
  const relatedExperiences = MOCK_EXPERIENCES.filter((e) => e.destinationId === destination.id);
  const displayExperiences = relatedExperiences.length > 0 ? relatedExperiences : [MOCK_EXPERIENCES[0]];

  return (
    <div className="space-y-14 sm:space-y-20 pb-20">
      {/* 1. Immersive Hero Banner */}
      <section className="relative w-full min-h-[55vh] sm:min-h-[65vh] flex flex-col justify-end bg-forest-950 text-sand-50 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={destination.heroImage}
            alt={destination.name}
            fill
            priority
            className="object-cover opacity-60 scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 w-full space-y-4">
          {/* Breadcrumb & Verification Badge */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <Link href="/" className="text-sand-300 hover:text-sand-50">Home</Link>
            <span className="text-sand-500">/</span>
            <Link href="/discover" className="text-sand-300 hover:text-sand-50">Destinations</Link>
            <span className="text-sand-500">/</span>
            <span className="text-gold-400 font-semibold">{destination.name}</span>
            <span className="ml-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-900/90 border border-gold-500/40 text-gold-300 text-xs font-bold backdrop-blur-sm">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Local Route
            </span>
          </div>

          <div className="max-w-4xl space-y-2">
            <div className="flex items-baseline gap-3">
              <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-sand-50">
                {destination.name}
              </h1>
              {destination.regionalName && (
                <span className="font-serif text-xl sm:text-2xl text-sand-300 italic">
                  ({destination.regionalName})
                </span>
              )}
            </div>

            <p className="font-serif text-lg sm:text-xl text-sand-200/95 italic max-w-2xl">
              "{destination.headline}"
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center gap-6 pt-3 text-xs text-sand-200 font-medium">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-terracotta-400" />
              <span>{destination.state} • {destination.region}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-forest-400 animate-pulse" />
              <span>Crowd Level: <strong className="text-sand-50">{destination.crowdLevel}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-gold-400 fill-gold-400" />
              <span>{destination.rating} ({destination.reviewCount} reviews)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-gold-400" />
              <span>{displayBuddies.length} Verified Buddies available</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Body Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column (Content & Local Secrets) */}
          <div className="lg:col-span-8 space-y-12">
            {/* Overview & Why Visit */}
            <div className="space-y-6">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950">
                Why Visit This Lesser-Known Place?
              </h2>
              <p className="text-base sm:text-lg text-charcoal-800 leading-relaxed font-serif">
                {destination.description}
              </p>
              <div className="p-5 rounded-2xl bg-sand-100 border border-sand-300 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-terracotta-600 block">
                  Cultural Significance & Value
                </span>
                <p className="text-sm text-charcoal-800 leading-relaxed">
                  {destination.whyVisit}
                </p>
              </div>
            </div>

            {/* Local Story & Living Tradition */}
            <div className="space-y-4 border-t border-sand-300 pt-8">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-forest-950 flex items-center gap-2">
                <Compass className="w-5 h-5 text-forest-800" />
                <span>The Indigenous Story & Heritage</span>
              </h3>
              <p className="text-sm sm:text-base text-charcoal-800 leading-relaxed">
                {destination.localStory}
              </p>
              <div className="p-4 rounded-xl bg-forest-50 border border-forest-200 text-xs text-forest-950 space-y-1">
                <strong>Living Heritage Note:</strong> {destination.culturalSignificance}
              </div>
            </div>

            {/* Local Tips Contributed by Verified Buddies */}
            <div className="space-y-5 border-t border-sand-300 pt-8">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-gold-600" />
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-forest-950">
                  Local Secrets from Verified Contributors
                </h3>
              </div>
              <p className="text-xs text-charcoal-700">
                Unpublished insights passed down by lifelong residents.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {destination.localSecrets.map((secret, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-xl bg-sand-100/90 border border-sand-300 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-bold text-sm text-forest-950">
                        {secret.title}
                      </span>
                      <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-forest-800 text-gold-300">
                        {secret.contributorBadge}
                      </span>
                    </div>
                    <p className="text-xs text-charcoal-800 italic leading-relaxed">
                      "{secret.tip}"
                    </p>
                    <p className="text-[11px] text-charcoal-600 font-medium">
                      Contributed by {secret.contributorName}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Access & How to Reach */}
            <div className="space-y-4 border-t border-sand-300 pt-8">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-forest-950">
                How to Reach & Access Route
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-sand-100 border border-sand-300 space-y-1.5">
                  <div className="flex items-center gap-2 text-forest-900 font-bold">
                    <Plane className="w-4 h-4 text-terracotta-600" />
                    <span>Nearest Airport</span>
                  </div>
                  <p className="text-charcoal-800">{destination.howToReach.nearestAirport}</p>
                </div>
                <div className="p-4 rounded-xl bg-sand-100 border border-sand-300 space-y-1.5">
                  <div className="flex items-center gap-2 text-forest-900 font-bold">
                    <Train className="w-4 h-4 text-forest-700" />
                    <span>Nearest Railhead</span>
                  </div>
                  <p className="text-charcoal-800">{destination.howToReach.nearestRailhead}</p>
                </div>
                <div className="p-4 rounded-xl bg-sand-100 border border-sand-300 space-y-1.5">
                  <div className="flex items-center gap-2 text-forest-900 font-bold">
                    <Car className="w-4 h-4 text-gold-600" />
                    <span>Road Access</span>
                  </div>
                  <p className="text-charcoal-800">{destination.howToReach.roadAccess}</p>
                </div>
              </div>
            </div>

            {/* Safety & Cultural Respect Protocol */}
            <div className="p-6 rounded-2xl bg-sand-100 border-l-4 border-terracotta-500 space-y-3">
              <div className="flex items-center gap-2 text-forest-950 font-bold text-sm">
                <AlertCircle className="w-4 h-4 text-terracotta-600" />
                <span>Safety Protocols & Cultural Respect</span>
              </div>
              <ul className="space-y-2 text-xs text-charcoal-800">
                {destination.safetyGuidelines.map((guideline, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-terracotta-500 mt-1.5 shrink-0" />
                    <span>{guideline}</span>
                  </li>
                ))}
              </ul>
              <p className="text-[11px] text-charcoal-600 italic pt-2 border-t border-sand-300">
                Notice: Terrain guides assist with wilderness orientation, but unexpected natural events can occur. Emergency services in interior valleys are community-coordinated.
              </p>
            </div>
          </div>

          {/* Right Column: Sticky Booking & Buddy Card Area */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Actions Card */}
            <div className="p-6 rounded-2xl bg-forest-900 text-sand-50 border border-gold-500/40 shadow-xl space-y-5 sticky top-24">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest font-bold text-gold-400">
                  Conscious Exploration
                </span>
                <h3 className="font-serif text-2xl font-bold text-sand-50">
                  Explore with a Local
                </h3>
                <p className="text-xs text-sand-200">
                  Experience {destination.name} safely and respectfully with verified residents.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <a
                  href="#available-experiences"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-forest-950 font-bold text-sm shadow-md transition-colors"
                >
                  <span>View Curated Experiences</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="#available-buddies"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-sand-50/10 hover:bg-sand-50/20 border border-sand-200/20 text-sand-50 font-semibold text-xs transition-colors"
                >
                  <Users className="w-4 h-4 text-gold-400" />
                  <span>Connect with Local Buddies</span>
                </a>
              </div>

              {/* Best Season */}
              <div className="pt-4 border-t border-forest-800 text-xs space-y-1">
                <span className="text-gold-300 font-bold uppercase tracking-wider text-[10px] block">
                  Optimal Season to Visit
                </span>
                <p className="text-sand-200">{destination.bestTimeToVisit}</p>
              </div>

              {/* Map & Coordinates Placeholder */}
              <div className="p-4 rounded-xl bg-forest-950/80 border border-forest-800 space-y-2 text-xs">
                <div className="flex items-center justify-between text-sand-300">
                  <span className="font-bold uppercase tracking-wider text-[10px]">Geographic Pin</span>
                  <span>{destination.coordinates.lat}° N, {destination.coordinates.lng}° E</span>
                </div>
                <div className="h-28 rounded-lg bg-forest-900/60 border border-forest-800 flex flex-col items-center justify-center text-center p-3 relative overflow-hidden">
                  <div className="absolute inset-0 bg-topo-pattern opacity-30" />
                  <MapPin className="w-6 h-6 text-terracotta-400 mb-1 z-10" />
                  <span className="text-[11px] font-semibold text-sand-100 z-10">
                    Offline Topo Route Ready
                  </span>
                  <span className="text-[9px] text-sand-400 z-10">
                    Available in Trip Mode once booked
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Nearby Curated Experiences Section */}
      <section id="available-experiences" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-8 border-t border-sand-300">
        <div className="space-y-1">
          <span className="text-xs uppercase tracking-wider font-bold text-terracotta-600">
            Bookable Journeys
          </span>
          <h2 className="font-serif text-3xl font-bold text-forest-950">
            Experiences at {destination.name}
          </h2>
          <p className="text-xs text-charcoal-700">
            Small-group immersions hosted directly by native contributors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayExperiences.map((exp) => (
            <ExperienceCard key={exp.id} experience={exp} />
          ))}
        </div>
      </section>

      {/* 4. Available Local Buddies Section */}
      <section id="available-buddies" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-8 border-t border-sand-300">
        <div className="space-y-1">
          <span className="text-xs uppercase tracking-wider font-bold text-terracotta-600">
            Verified Hosts
          </span>
          <h2 className="font-serif text-3xl font-bold text-forest-950">
            Meet the Local Buddies of {destination.name}
          </h2>
          <p className="text-xs text-charcoal-700">
            Vetted residents with deep cultural roots and field safety training.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayBuddies.map((buddy) => (
            <BuddyCard key={buddy.id} buddy={buddy} />
          ))}
        </div>
      </section>
    </div>
  );
}
