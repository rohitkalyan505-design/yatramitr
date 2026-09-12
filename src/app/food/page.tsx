'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Utensils, Search, MapPin, Sparkles, Compass, AlertCircle, ArrowUpRight } from 'lucide-react';
import { FOODS, FOOD_CATEGORIES_LIST } from '@/data/food';
import { cn } from '@/lib/utils';
import type { FoodEntry } from '@/types';

export default function FoodPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const filteredFoods = FOODS.filter((food) => {
    const matchesCategory = selectedCategory === 'All' || food.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch =
      food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      food.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      food.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      food.whatToTry.some((item) => item.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleImageError = (id: string) => {
    setImgErrors((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="min-h-screen bg-page-food pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#16352A] via-[#10271F] to-[#0D211A] text-[#F5F1E8] p-8 sm:p-12 shadow-xl border border-[#B8955A]/30">
          <div className="absolute top-0 right-0 translate-x-12 -translate-y-8 w-96 h-96 bg-[#B8955A]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B8955A]/20 border border-[#B8955A]/40 text-[#DFB86C] text-xs font-semibold tracking-wider uppercase">
              <Utensils className="w-3.5 h-3.5" />
              <span>Hyderabad Street Food & Culinary Heritage</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#F5F1E8] leading-tight">
              Flavours of the Nizam&apos;s City
            </h1>
            <p className="text-sm sm:text-base text-[#E8DFCF]/90 leading-relaxed">
              Curated street food institutions, century-old Irani bakeries, slow-cooked Dum Biryani, and late-night tiffins. Every venue is an authentic Hyderabad fixture with insider ordering tips.
            </p>
            <div className="flex flex-wrap gap-4 pt-2 text-xs text-[#DFB86C]">
              <span className="flex items-center gap-1.5 font-medium">✓ 8 Curated Culinary Landmarks</span>
              <span className="flex items-center gap-1.5 font-medium">✓ Transparent Price Bands (₹ / ₹₹)</span>
              <span className="flex items-center gap-1.5 font-medium">✓ Verified Local Specialties</span>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="p-6 rounded-2xl bg-card-elevated space-y-5">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            {/* Search Input */}
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1D2521]/40" />
              <input
                type="text"
                placeholder="Search Biryani, Chai, Gokul, Koti..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8DFCF] bg-[#FAF8F5]/50 text-sm text-[#0D211A] placeholder-[#1D2521]/40 focus:outline-none focus:ring-2 focus:ring-[#16352A]/20 focus:border-[#16352A]"
              />
            </div>
            <div className="text-xs font-semibold text-[#1D2521]/60">
              Showing {filteredFoods.length} of {FOODS.length} iconic food venues
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-[#E8DFCF]/60">
            {['All', ...FOOD_CATEGORIES_LIST].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  'px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-200',
                  selectedCategory === cat
                    ? 'bg-[#16352A] text-[#F5F1E8] border-[#16352A] shadow-sm'
                    : 'bg-[#FAF8F5] text-[#16352A] border-[#E8DFCF] hover:border-[#B8955A]/60 hover:bg-white'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Food Grid */}
        {filteredFoods.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#E8DFCF] p-8 space-y-3">
            <AlertCircle className="w-8 h-8 mx-auto text-[#B8955A]" />
            <h3 className="font-serif text-lg font-bold text-[#0D211A]">No food venues found</h3>
            <p className="text-xs text-[#1D2521]/70">Try searching for a different item or clear the category filter.</p>
            <button
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              className="mt-2 px-4 py-1.5 rounded-lg bg-[#16352A] text-white text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFoods.map((food) => (
              <div
                key={food.id}
                className="group rounded-2xl overflow-hidden bg-white border border-[#E8DFCF] flex flex-col hover:shadow-xl hover:border-[#B8955A]/50 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image Section */}
                <div className="relative aspect-[16/10] w-full bg-[#16352A] overflow-hidden">
                  {food.image && !imgErrors[food.id] ? (
                    <Image
                      src={food.image}
                      alt={food.name}
                      fill
                      onError={() => handleImageError(food.id)}
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#16352A] to-[#0D211A] flex flex-col items-center justify-center p-4 text-center">
                      <Utensils className="w-8 h-8 text-[#DFB86C] mb-2" />
                      <span className="font-serif text-xl text-[#DFB86C] font-bold">{food.name}</span>
                      <span className="text-[10px] text-[#E8DFCF]/70 uppercase tracking-widest mt-1">{food.category}</span>
                    </div>
                  )}
                  {/* Category Pill */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#0D211A]/85 backdrop-blur-sm text-[11px] font-semibold text-[#DFB86C] border border-[#B8955A]/30">
                    {food.category}
                  </div>
                  {/* Price Level & Indicative Range */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-sm text-xs font-bold text-[#16352A] shadow-sm flex items-center gap-1.5">
                    <span>{food.priceLevel}</span>
                    {food.indicativePriceRange && (
                      <span className="text-[11px] font-semibold text-[#B86B4B]">
                        · {food.indicativePriceRange}
                      </span>
                    )}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-1.5 text-[#B86B4B] font-semibold min-w-0">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{food.location}</span>
                      </div>
                      {food.indicativePriceRange && (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#FAF8F5] text-[#16352A] border border-[#E8DFCF] shrink-0">
                          Indicative {food.indicativePriceRange}
                        </span>
                      )}
                    </div>

                    <h2 className="font-serif text-xl font-bold text-[#0D211A] group-hover:text-[#16352A] transition-colors">
                      {food.name}
                    </h2>

                    <p className="text-xs text-[#1D2521]/75 leading-relaxed">
                      {food.description}
                    </p>

                    {/* What to try */}
                    <div className="space-y-1.5 pt-2">
                      <div className="text-[11px] font-bold text-[#16352A] uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#B8955A]" />
                        <span>Must Try</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {food.whatToTry.map((item, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-0.5 rounded-md bg-[#FAF8F5] border border-[#E8DFCF] text-[11px] font-medium text-[#1D2521]/80"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Tourist tip */}
                    {food.touristTip && (
                      <div className="p-3 rounded-xl bg-[#FAF8F5] border-l-2 border-[#B8955A] text-[11px] text-[#1D2521]/80 leading-relaxed italic">
                        &ldquo;{food.touristTip}&rdquo;
                      </div>
                    )}
                  </div>

                  {/* Footer actions */}
                  <div className="pt-4 border-t border-[#E8DFCF]/70 flex items-center justify-between gap-3">
                    <Link
                      href={`/explore?category=Heritage`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#16352A] hover:text-[#B8955A] transition-colors"
                    >
                      <span>Explore Nearby</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>

                    {food.latitude && food.longitude && (
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${food.latitude},${food.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#16352A]/5 hover:bg-[#16352A]/10 text-xs font-semibold text-[#16352A] transition-colors"
                      >
                        <Compass className="w-3.5 h-3.5 text-[#B8955A]" />
                        <span>Navigate</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Responsible Dining Banner */}
        <div className="rounded-2xl p-6 sm:p-8 bg-[#FAF8F5] border border-[#B8955A]/30 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#0D211A]">
              Authentic Local Flavours · Zero Commission Markups
            </h3>
            <p className="text-xs sm:text-sm text-[#1D2521]/75 leading-relaxed">
              YATRAMITR lists local family-run eateries, chai counters, and street-cart vendors with zero hidden commercial promotions. Prices shown reflect actual counter tariffs.
            </p>
          </div>
          <Link
            href="/find-my-yatra"
            className="shrink-0 px-6 py-3 rounded-xl bg-[#16352A] hover:bg-[#10271F] text-[#F5F1E8] font-semibold text-xs shadow-sm transition-all"
          >
            Plan a Food Yatra →
          </Link>
        </div>
      </div>
    </div>
  );
}
