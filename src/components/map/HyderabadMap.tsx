'use client';

// ============================================================
// HYDERABAD MAP — Mapbox GL with graceful offline fallback
// ============================================================
// When NEXT_PUBLIC_MAPBOX_TOKEN is present: full interactive
// Mapbox GL map with custom markers.
// When absent: a clean schematic SVG map of the Hyderabad metro
// area with positioned markers, so the demo never breaks.
// ============================================================

import React, { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { X, Clock, Info } from 'lucide-react';
import Link from 'next/link';
import type { Place, Experience, PlaceCategory } from '@/types';
import { PLACE_CATEGORIES } from '@/types';
import { DEFAULT_MAP_CENTER } from '@/data/places';
import { cn } from '@/lib/utils';

interface MapPlace extends Place {
  latitude: number;
  longitude: number;
}

interface Props {
  places: MapPlace[];
  experiences: Experience[];
  selectedCategory: PlaceCategory | 'All';
  onSelectCategory: (c: PlaceCategory | 'All') => void;
  onSelectPlace?: (place: MapPlace) => void;
  height?: string;
}

const PRESSURE_COLORS: Record<string, string> = {
  Low: '#2D7A4F',
  Medium: '#DFB86C',
  High: '#BD5338',
};

export default function HyderabadMap({
  places,
  experiences,
  selectedCategory,
  onSelectCategory,
  onSelectPlace,
  height = '520px',
}: Props) {
  const [selected, setSelected] = useState<MapPlace | null>(null);
  const mapboxToken =
    (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_MAPBOX_TOKEN) || '';

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState(false);

  const filtered = selectedCategory === 'All' ? places : places.filter((p) => p.category === selectedCategory);

  const selectPlace = useCallback(
    (place: MapPlace) => {
      setSelected(place);
      onSelectPlace?.(place);
    },
    [onSelectPlace]
  );

  // ----- Mapbox init -----
  useEffect(() => {
    if (!mapboxToken || mapRef.current || !containerRef.current) return;
    try {
      mapboxgl.accessToken = mapboxToken;
      const map = new mapboxgl.Map({
        container: containerRef.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [DEFAULT_MAP_CENTER.lng, DEFAULT_MAP_CENTER.lat],
        zoom: 10.2,
        attributionControl: true,
      });
      mapRef.current = map;
      map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-right');
      map.on('load', () => setMapReady(true));
      map.on('error', () => setMapError(true));
      return () => {
        map.remove();
        mapRef.current = null;
        setMapReady(false);
      };
    } catch {
      setMapError(true);
    }
  }, [mapboxToken]);

  // ----- Markers (Mapbox mode) -----
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    filtered.forEach((place) => {
      const el = document.createElement('button');
      el.className = 'ym-marker';
      el.style.setProperty('--marker-color', PRESSURE_COLORS[place.tourismPressure] ?? '#2D7A4F');
      el.setAttribute('aria-label', place.name);
      el.title = place.name;
      el.onclick = (e) => {
        e.stopPropagation();
        selectPlace(place);
        map.flyTo({ center: [place.longitude, place.latitude], zoom: 12, duration: 800 });
      };
      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([place.longitude, place.latitude])
        .addTo(map);
      markersRef.current.push(marker);
    });
  }, [filtered, mapReady, selectPlace]);

  const nearbyExperiences = selected
    ? experiences.filter((e) => e.placeId === selected.id)
    : [];

  return (
    <div className="space-y-4">
      {/* Category filter chips */}
      <div className="flex flex-wrap items-center gap-2">
        {(['All', ...PLACE_CATEGORIES] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat as PlaceCategory | 'All')}
            className={cn(
              'px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all',
              selectedCategory === cat
                ? 'bg-[#16352A] text-[#F5F1E8] border-[#16352A] shadow-sm'
                : 'bg-white text-[#16352A] border-[#E8DFCF] hover:border-[#B8955A]'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#1D2521]/70">
        <span className="font-semibold uppercase tracking-wider">Tourism pressure:</span>
        {Object.entries(PRESSURE_COLORS).map(([label, color]) => (
          <span key={label} className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
            {label}
          </span>
        ))}
        <span className="text-[#1D2521]/50">(Yatra Mitra editorial classification — not official statistics)</span>
      </div>

      {/* Map canvas */}
      <div
        className="relative w-full rounded-2xl overflow-hidden border border-[#E8DFCF] bg-[#0D211A]"
        style={{ height }}
      >
        {mapboxToken && !mapError ? (
          <>
            <div ref={containerRef} className="absolute inset-0" />
            {!mapReady && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-[#F5F1E8]">
                <div className="w-8 h-8 border-2 border-[#B8955A] border-t-transparent rounded-full animate-spin" />
                <span className="text-xs">Loading map…</span>
              </div>
            )}
          </>
        ) : (
          <SchematicMap places={filtered} onSelect={selectPlace} selectedId={selected?.id} />
        )}

        {/* Detail panel */}
        {selected && (
          <div className="absolute top-4 left-4 right-4 sm:right-auto sm:w-96 max-h-[85%] overflow-y-auto rounded-xl bg-white/97 backdrop-blur border border-[#E8DFCF] shadow-xl p-5 space-y-4 z-10">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 p-1 rounded text-[#1D2521]/50 hover:text-[#1D2521]"
              aria-label="Close details"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1.5 pr-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#B86B4B]">
                {selected.category}
              </span>
              <h3 className="font-serif text-xl font-bold text-[#0D211A]">{selected.name}</h3>
              <p className="text-xs text-[#1D2521]/75 leading-relaxed">{selected.touristExplanation}</p>
            </div>

            <div className="flex flex-wrap gap-2 text-[11px]">
              <span
                className="inline-flex items-center gap-1 px-2 py-1 rounded-full font-semibold"
                style={{
                  backgroundColor: `${PRESSURE_COLORS[selected.tourismPressure]}22`,
                  color: PRESSURE_COLORS[selected.tourismPressure],
                }}
              >
                <Info className="w-3 h-3" /> {selected.tourismPressure} pressure
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#F5F1E8] text-[#16352A] font-semibold">
                <Clock className="w-3 h-3" /> {selected.recommendedDuration}
              </span>
            </div>

            {/* Experiences & booking */}
            {nearbyExperiences.length > 0 ? (
              <div className="space-y-2 pt-2 border-t border-[#E8DFCF]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#1D2521]/60">
                  Yatra Mitra experiences here
                </span>
                {nearbyExperiences.slice(0, 3).map((exp) => (
                  <Link
                    key={exp.id}
                    href={`/experiences/${exp.id}`}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-[#F5F1E8] hover:bg-[#EBDDCB] transition-colors group"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#0D211A] truncate">{exp.title}</p>
                      <p className="text-[11px] text-[#1D2521]/60">
                        ₹{exp.pricePerPerson}/person · {exp.durationLabel}
                      </p>
                    </div>
                    <span className="text-[11px] font-bold text-[#16352A] group-hover:underline shrink-0 ml-2">
                      View →
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-[#F5F1E8] text-[11px] text-[#1D2521]/70 border border-[#E8DFCF]">
                No curated experiences at this place yet — check the place page for details and official sources.
              </div>
            )}

            <div className="pt-2 border-t border-[#E8DFCF] space-y-1.5">
              <Link
                href={`/places/${selected.id}`}
                className="block w-full text-center px-4 py-2.5 rounded-lg bg-[#16352A] text-[#F5F1E8] text-xs font-bold hover:bg-[#0D211A] transition-colors"
              >
                Open full place page
              </Link>
              <p className="text-[10px] text-[#1D2521]/50">
                Timings & tickets: check official source for latest information.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// SCHEMATIC FALLBACK MAP (no token required)
// ============================================================

function SchematicMap({
  places,
  onSelect,
  selectedId,
}: {
  places: MapPlace[];
  onSelect: (p: MapPlace) => void;
  selectedId?: string;
}) {
  // Bounding box around Hyderabad metro + Telangana sites
  const bounds = {
    minLat: 16.7,
    maxLat: 18.35,
    minLng: 77.75,
    maxLng: 80.05,
  };

  const project = (lat: number, lng: number) => ({
    x: ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 100,
    y: (1 - (lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * 100,
  });

  return (
    <div className="absolute inset-0 bg-gradient-to-br from-[#0D211A] via-[#14291F] to-[#1C3B2B]">
      {/* Decorative topo pattern */}
      <div className="absolute inset-0 bg-topo-pattern opacity-40" />

      {/* Musi river hint + label */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
        <path
          d="M 12,58 C 25,52 38,60 50,56 C 62,52 75,58 88,54"
          stroke="#3A6B54"
          strokeWidth="0.8"
          fill="none"
          opacity="0.7"
        />
      </svg>

      <div className="absolute top-4 left-4 text-[10px] uppercase tracking-[0.25em] text-[#B8955A] font-semibold">
        Hyderabad · Telangana
      </div>
      <div className="absolute bottom-4 right-4 flex items-center gap-1.5 text-[10px] text-[#E8DFCF]/60">
        <Info className="w-3 h-3" />
        Schematic view — add a Mapbox token for the full interactive map
      </div>

      {places.map((place) => {
        const pos = project(place.latitude, place.longitude);
        const color = PRESSURE_COLORS[place.tourismPressure] ?? '#2D7A4F';
        const isSelected = selectedId === place.id;
        return (
          <button
            key={place.id}
            onClick={() => onSelect(place)}
            className="absolute group -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            aria-label={place.name}
          >
            <span
              className={cn(
                'block w-3.5 h-3.5 rounded-full border-2 transition-all',
                isSelected ? 'scale-150 ring-2 ring-white/60' : 'group-hover:scale-125'
              )}
              style={{ backgroundColor: color, borderColor: '#FAF8F5' }}
            />
            <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 px-1.5 py-0.5 rounded bg-black/60 text-[9px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {place.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
