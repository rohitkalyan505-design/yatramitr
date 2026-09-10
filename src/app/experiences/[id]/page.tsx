import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  Clock, 
  Users, 
  ShieldCheck, 
  MapPin, 
  Star, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Sparkles,
  HeartHandshake,
  Calendar,
  Compass
} from 'lucide-react';
import { MOCK_EXPERIENCES, MOCK_BUDDIES } from '@/data/mock-data';
import { formatCurrency } from '@/lib/utils';

export function generateStaticParams() {
  return MOCK_EXPERIENCES.map((experience) => ({
    id: experience.id,
  }));
}

export default function ExperienceDetailsPage({ params }: { params: { id: string } }) {
  const experience = MOCK_EXPERIENCES.find((e) => e.id === params.id);

  if (!experience) {
    notFound();
  }

  const hostBuddy = MOCK_BUDDIES.find((b) => b.id === experience.hostBuddyId) || MOCK_BUDDIES[0];

  return (
    <div className="space-y-12 sm:space-y-16 pb-20">
      {/* 1. Header & Hero Image */}
      <section className="relative w-full min-h-[50vh] sm:min-h-[60vh] flex flex-col justify-end bg-forest-950 text-sand-50 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={experience.image}
            alt={experience.title}
            fill
            priority
            className="object-cover opacity-60 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 w-full space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <Link href="/" className="text-sand-300 hover:text-sand-50">Home</Link>
            <span className="text-sand-500">/</span>
            <Link href={`/places/${experience.destinationId}`} className="text-sand-300 hover:text-sand-50">
              {experience.destinationName}
            </Link>
            <span className="text-sand-500">/</span>
            <span className="text-gold-400 font-semibold truncate">{experience.title}</span>
          </div>

          <div className="max-w-4xl space-y-2">
            <span className="text-xs uppercase tracking-wider font-bold text-terracotta-400">
              {experience.category}
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-sand-50">
              {experience.title}
            </h1>
            <p className="text-sm sm:text-base text-sand-200 leading-relaxed max-w-3xl">
              {experience.summary}
            </p>
          </div>

          {/* Key Metric Chips */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 text-xs text-sand-200">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-gold-400" />
              <span>Duration: <strong className="text-sand-50">{experience.duration}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-gold-400" />
              <span>Group Cap: <strong className="text-sand-50">Max {experience.groupCap} travelers</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-gold-400 fill-gold-400" />
              <span>{experience.rating} ({experience.reviewCount} reviews)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-forest-400" />
              <span>Community Protected Trail</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Content & Sticky Booking Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Description, Itinerary, Inclusions */}
          <div className="lg:col-span-8 space-y-12">
            {/* Host Banner */}
            <div className="p-5 rounded-2xl bg-sand-100 border border-sand-300 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-forest-800 shrink-0">
                  <Image
                    src={hostBuddy.avatar}
                    alt={hostBuddy.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-lg font-bold text-forest-950">
                      Hosted by {hostBuddy.name}
                    </h3>
                    <ShieldCheck className="w-4 h-4 text-forest-700" />
                  </div>
                  <p className="text-xs text-charcoal-700">
                    Native of {hostBuddy.location} • Knowledge Score: {hostBuddy.knowledgeScore}%
                  </p>
                </div>
              </div>
              <Link
                href={`/buddies/${hostBuddy.id}`}
                className="px-4 py-2 rounded-lg border border-forest-900/30 text-forest-900 text-xs font-semibold hover:bg-sand-200 transition-colors shrink-0"
              >
                View Profile
              </Link>
            </div>

            {/* Deep Journey Description */}
            <div className="space-y-4">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950">
                The Journey & Cultural Context
              </h2>
              <p className="text-base text-charcoal-800 leading-relaxed font-serif">
                {experience.description}
              </p>
              <div className="p-4 rounded-xl bg-forest-50 border border-forest-200 text-xs text-forest-950">
                <strong>Why this is authentic:</strong> We avoid commercial jeep stops and shopping souvenir hubs. Your host guides you through community-managed ecosystems where local livelihoods are directly supported.
              </div>
            </div>

            {/* Step-by-Step Itinerary */}
            <div className="space-y-6 border-t border-sand-300 pt-8">
              <h3 className="font-serif text-2xl font-bold text-forest-950 flex items-center gap-2">
                <Compass className="w-5 h-5 text-forest-800" />
                <span>Trail Itinerary</span>
              </h3>

              <div className="space-y-4">
                {experience.itinerary.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-4 sm:p-5 rounded-xl bg-sand-100/80 border border-sand-300 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-terracotta-700 uppercase tracking-wider">
                        {step.timeSlot}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-sand-200 text-charcoal-700">
                        Step {idx + 1}
                      </span>
                    </div>
                    <h4 className="font-serif text-lg font-bold text-forest-950">
                      {step.activity}
                    </h4>
                    <p className="text-xs sm:text-sm text-charcoal-800 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Inclusions & Requirements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-sand-300 pt-8">
              <div className="p-6 rounded-2xl bg-sand-100 border border-sand-300 space-y-3">
                <h4 className="font-serif text-lg font-bold text-forest-950 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-forest-700" />
                  <span>What is Included</span>
                </h4>
                <ul className="space-y-2 text-xs text-charcoal-800">
                  {experience.inclusions.map((inc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-forest-700 mt-1.5 shrink-0" />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-sand-100 border border-sand-300 space-y-3">
                <h4 className="font-serif text-lg font-bold text-forest-950 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-terracotta-600" />
                  <span>What to Bring & Prepare</span>
                </h4>
                <ul className="space-y-2 text-xs text-charcoal-800">
                  {experience.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-terracotta-600 mt-1.5 shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Meeting Point Coordinates */}
            <div className="p-6 rounded-2xl bg-sand-100 border border-sand-300 space-y-3">
              <div className="flex items-center gap-2 text-forest-950 font-bold text-sm">
                <MapPin className="w-4 h-4 text-terracotta-600" />
                <span>Exact Meeting Point & Assembly</span>
              </div>
              <p className="font-serif font-bold text-base text-forest-950">
                {experience.meetingPoint.title}
              </p>
              <p className="text-xs text-charcoal-700">
                {experience.meetingPoint.landmark}
              </p>
              <div className="inline-flex items-center gap-2 text-xs font-mono bg-sand-50 px-3 py-1 rounded border border-sand-300 text-forest-900">
                GPS: {experience.meetingPoint.coordinatesText}
              </div>
            </div>

            {/* Safety & Protocol notes */}
            <div className="p-5 rounded-2xl bg-sand-100 border-l-4 border-forest-800 space-y-2 text-xs text-charcoal-800">
              <p className="font-bold text-forest-950">Safety & Environmental Notice:</p>
              {experience.safetyNotes.map((note, i) => (
                <p key={i}>• {note}</p>
              ))}
              <p className="text-[11px] text-charcoal-600 italic pt-1">
                Notice: Yatra Mitra certifies training protocols, but unpredictable natural terrain demands personal attentiveness.
              </p>
            </div>
          </div>

          {/* Right Column: Sticky Booking Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-2xl bg-sand-50 border border-forest-900/20 shadow-xl space-y-5 sticky top-24">
              <div className="flex items-baseline justify-between border-b border-sand-200 pb-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-charcoal-600 tracking-wider">
                    Community Rate
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-serif text-3xl font-extrabold text-forest-950">
                      {formatCurrency(experience.pricePerPerson)}
                    </span>
                    <span className="text-xs text-charcoal-700">/ person</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-forest-100 text-forest-900 border border-forest-200">
                  Micro-Group
                </span>
              </div>

              {/* Group Size and Community Fund breakdown */}
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between text-charcoal-800">
                  <span>Group Size Cap</span>
                  <strong className="text-forest-950">{experience.groupCap} travelers max</strong>
                </div>
                <div className="flex items-center justify-between text-charcoal-800">
                  <span>Local Host Direct Share</span>
                  <strong className="text-forest-950">95%</strong>
                </div>
                <div className="flex items-center justify-between text-charcoal-800">
                  <span>Tribal Artisan & Eco Fund</span>
                  <strong className="text-forest-950">5% included</strong>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-sand-100 border border-sand-300 text-xs text-charcoal-700 space-y-1">
                <p className="font-bold text-forest-950">Available Schedule:</p>
                <p>Daily slots at 08:00 AM & 02:30 PM</p>
                <p className="text-[11px] italic text-charcoal-600">Advance booking required for village entry permits.</p>
              </div>

              {/* Booking CTA Button */}
              <Link
                href={`/booking?experienceId=${experience.id}`}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-forest-900 hover:bg-forest-800 text-sand-50 font-bold text-sm shadow-md transition-colors"
              >
                <span>Book Experience</span>
                <ArrowRight className="w-4 h-4 text-gold-400" />
              </Link>

              <p className="text-[11px] text-center text-charcoal-600">
                Instant confirmation • Full refund up to 24h prior
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
