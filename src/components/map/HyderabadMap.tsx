'use client';

// ============================================================
// HYDERABAD MAP — MapLibre GL + MapTiler Cloud tiles
// ============================================================
// Map provider: MapTiler Cloud (NEXT_PUBLIC_MAPTILER_API_KEY).
// Marker data: ONLY the YitraMitr curated dataset (places + food).
// Routing: server API route /api/route (OSRM-backed; no hardcoding).
// Fallback: schematic SVG map when MapTiler is unavailable.
//
// Browser-only libraries (maplibre-gl) are loaded via dynamic
// import inside useEffect so Next.js SSR never touches them.
// ============================================================

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { X, Clock, Info, Navigation, LocateFixed, AlertTriangle, Route as RouteIcon, ArrowRight, Compass } from 'lucide-react';
import Link from 'next/link';
import type { Place, Experience, PlaceCategory, FoodEntry } from '@/types';
import { PLACE_CATEGORIES } from '@/types';
import { DEFAULT_MAP_CENTER } from '@/data/places';
import { cn } from '@/lib/utils';

export type GeographicView = 'india' | 'telangana' | 'hyderabad';

export const GEOGRAPHIC_VIEWS: Record<
  GeographicView,
  { label: string; icon: string; center: [number, number]; zoom: number; description: string }
> = {
  india: {
    label: 'India Context',
    icon: '🇮🇳',
    center: [79.2, 20.2],
    zoom: 4.8,
    description: 'National context: Deccan Plateau & Telangana within India',
  },
  telangana: {
    label: 'Telangana Region',
    icon: '🏛️',
    center: [78.95, 17.50],
    zoom: 7.7,
    description: 'Regional scope: 23 verified destinations across Telangana',
  },
  hyderabad: {
    label: 'Hyderabad City',
    icon: '📍',
    center: [78.4747, 17.3850],
    zoom: 11.8,
    description: 'Historic city centre: Charminar, Golconda, Hussain Sagar',
  },
};

export interface MapPlace extends Place {
  latitude: number;
  longitude: number;
}
export interface MapFood extends FoodEntry {
  latitude: number;
  longitude: number;
}

interface RouteResult {
  distanceKm: number;
  durationMin: number;
  geometry: [number, number][]; // [lng, lat]
  provider: string;
}

interface Props {
  places: Place[];
  experiences: Experience[];
  foods?: MapFood[];
  selectedCategory: PlaceCategory | 'All';
  onSelectCategory: (c: PlaceCategory | 'All') => void;
  onSelectPlace?: (place: MapPlace) => void;
  /** External search: center + highlight this place */
  focusPlaceId?: string | null;
  height?: string;
}

const PRESSURE_COLORS: Record<string, string> = {
  Low: '#2D7A4F',
  Medium: '#DFB86C',
  High: '#BD5338',
};

// MapTiler Cloud Streets style with verified geographic tiles
const MAPTILER_STYLE = (key: string): any => ({
  version: 8,
  sources: {
    'maptiler-streets': {
      type: 'raster',
      tiles: [`https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}.png?key=${key}`],
      tileSize: 256,
      attribution:
        '&copy; <a href="https://www.maptiler.com/copyright/" target="_blank">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap contributors</a>',
    },
  },
  layers: [
    {
      id: 'maptiler-streets-layer',
      type: 'raster',
      source: 'maptiler-streets',
      minzoom: 0,
      maxzoom: 20,
    },
  ],
});

// High-definition geographic OpenStreetMap raster fallback (clean, reliable, no watermark)
const OSM_RASTER_STYLE: any = {
  version: 8,
  sources: {
    'osm-tiles': {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
  },
  layers: [
    {
      id: 'osm-tiles-layer',
      type: 'raster',
      source: 'osm-tiles',
      minzoom: 0,
      maxzoom: 19,
    },
  ],
};

const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_API_KEY || '';

export default function HyderabadMap({
  places,
  experiences,
  foods = [],
  selectedCategory,
  onSelectCategory,
  onSelectPlace,
  focusPlaceId,
  height = '520px',
}: Props) {
  const [selected, setSelected] = useState<MapPlace | null>(null);
  const [selectedFood, setSelectedFood] = useState<MapFood | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState(false);

  // ---- Routing state ----
  const [originLabel, setOriginLabel] = useState('');
  const [originCoord, setOriginCoord] = useState<{ lat: number; lng: number } | null>(null);
  const [route, setRoute] = useState<RouteResult | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);
  const [locationDenied, setLocationDenied] = useState(false);
  const [locating, setLocating] = useState(false);
  const [travelMode, setTravelMode] = useState<'driving' | 'walking'>('driving');

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const maplibreModuleRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const mapable = places.filter(
    (p) =>
      p.showOnMap !== false &&
      !p.requiresVerification &&
      p.latitude !== null &&
      p.longitude !== null
  ) as MapPlace[];
  const filtered = selectedCategory === 'All' ? mapable : mapable.filter((p) => p.category === selectedCategory);
  const filteredFoods =
    selectedCategory === 'All'
      ? foods
      : foods.filter((f) => (selectedCategory as string) === f.category);

  const selectPlace = useCallback(
    (place: MapPlace) => {
      setSelectedFood(null);
      setSelected(place);
      onSelectPlace?.(place);
      (mapRef.current as any)?.flyTo({ center: [place.longitude, place.latitude], zoom: 13.5, duration: 900 });
    },
    [onSelectPlace]
  );

  const selectFood = useCallback((food: MapFood) => {
    setSelected(null);
    setSelectedFood(food);
    (mapRef.current as any)?.flyTo({ center: [food.longitude, food.latitude], zoom: 14, duration: 900 });
  }, []);

  // ----- Map init (dynamic import; SSR-safe; resilient raster fallback) -----
  useEffect(() => {
    if (mapRef.current || !containerRef.current) return;
    let cancelled = false;
    let map: any = null;

    (async () => {
      try {
        const maplibreglModule = await import('maplibre-gl');
        const maplibregl = (maplibreglModule as any).default || maplibreglModule;
        maplibreModuleRef.current = maplibregl;

        if (cancelled || !containerRef.current) return;

        const effectiveStyle =
          MAPTILER_KEY && MAPTILER_KEY.length > 5
            ? MAPTILER_STYLE(MAPTILER_KEY)
            : OSM_RASTER_STYLE;

        const MapClass = maplibregl.Map || (maplibregl as any).default?.Map || (maplibreglModule as any).Map;

        map = new MapClass({
          container: containerRef.current,
          style: effectiveStyle,
          center: GEOGRAPHIC_VIEWS.telangana.center,
          zoom: GEOGRAPHIC_VIEWS.telangana.zoom,
          attributionControl: false,
        });
        mapRef.current = map;
        if (typeof window !== 'undefined') {
          (window as any).__ymMap = map;
        }

        const NavClass = maplibregl.NavigationControl || (maplibregl as any).default?.NavigationControl || (maplibreglModule as any).NavigationControl;
        if (NavClass) {
          map.addControl(new NavClass({ showCompass: true }), 'bottom-right');
        }

        map.once('style.load', () => {
          if (!cancelled) {
            setMapReady(true);
            setMapError(false);
            setTimeout(() => {
              try { map?.resize(); } catch {}
            }, 100);
          }
        });

        map.on('load', () => {
          if (!cancelled) {
            setMapReady(true);
            setMapError(false);
          }
        });

        // Failover only if the style itself fails (e.g. 401, 403, or fatal network failure)
        map.on('error', (e: any) => {
          const status = e?.error?.status || e?.status;
          if ((status === 401 || status === 403) && !mapReady) {
            try {
              map?.setStyle(OSM_RASTER_STYLE);
            } catch {
              // ignore
            }
          }
        });

        let resizeObs: ResizeObserver | null = null;
        if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
          resizeObs = new ResizeObserver(() => {
            try { map?.resize(); } catch {}
          });
          resizeObs.observe(containerRef.current);
        }

        if (map.isStyleLoaded()) {
          setMapReady(true);
          setMapError(false);
        }
      } catch (err) {
        console.error('MapLibre init error:', err);
        if (!cancelled) setMapError(true);
      }
    })();

    return () => {
      cancelled = true;
      if (map) {
        try { map.remove(); } catch { /* noop */ }
      }
      mapRef.current = null;
      setMapReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----- Markers (MapLibre DOM markers) -----
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const addMarker = (
      lng: number,
      lat: number,
      label: string,
      color: string,
      onClick: () => void,
      isSelected: boolean,
      itemData?: { id: string; name: string; type: 'place' | 'food'; category?: string; explanation?: string }
    ) => {
      const el = document.createElement('button');
      el.className = cn('ym-marker', isSelected && 'ym-marker-selected');
      el.style.setProperty('--marker-color', color);
      el.setAttribute('aria-label', label);
      el.title = label;

      const maplibregl = maplibreModuleRef.current;
      if (!maplibregl) return;
      const marker = new maplibregl.Marker({ element: el });

      if (itemData) {
        const isPlace = itemData.type === 'place';
        const popupHtml = `
          <div class="ym-marker-popup" style="font-family: inherit; min-width: 190px; max-width: 250px;">
            <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: ${color}; letter-spacing: 0.05em; margin-bottom: 2px;">
              ${itemData.category || (isPlace ? 'Heritage Site' : 'Local Food')}
            </div>
            <div style="font-size: 13px; font-weight: 700; color: #0D211A; line-height: 1.25; margin-bottom: 4px;">
              ${itemData.name}
            </div>
            ${itemData.explanation ? `<div style="font-size: 11px; color: #4A5550; line-height: 1.35; margin-bottom: 8px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${itemData.explanation}</div>` : ''}
            <div style="display: flex; gap: 8px; border-top: 1px solid #E8DFCF; padding-top: 6px; margin-top: 4px;">
              ${isPlace ? `
                <a href="/places/${itemData.id}" style="font-size: 11px; font-weight: 700; color: #16352A; text-decoration: underline;">Open Place Page</a>
                <a href="/booking?placeId=${itemData.id}" style="font-size: 11px; font-weight: 700; color: #B8955A; text-decoration: underline; margin-left: auto;">Book a Mitra</a>
              ` : `
                <a href="/food#${itemData.id}" style="font-size: 11px; font-weight: 700; color: #B86B4B; text-decoration: underline;">View in Food Guide</a>
              `}
            </div>
          </div>
        `;
        const popup = new maplibregl.Popup({ offset: 16, closeButton: true, maxWidth: '280px' })
          .setHTML(popupHtml);
        marker.setPopup(popup);
      }

      el.onclick = (e) => {
        e.stopPropagation();
        onClick();
        marker.togglePopup();
      };

      marker.setLngLat([lng, lat]).addTo(map);
      markersRef.current.push(marker);
    };

    filtered.forEach((place) => {
      addMarker(
        place.longitude,
        place.latitude,
        place.name,
        PRESSURE_COLORS[place.tourismPressure] ?? '#2D7A4F',
        () => selectPlace(place),
        selected?.id === place.id,
        {
          id: place.id,
          name: place.name,
          type: 'place',
          category: place.category,
          explanation: place.touristExplanation,
        }
      );
    });
    filteredFoods.forEach((food) => {
      addMarker(
        food.longitude,
        food.latitude,
        food.name,
        '#B86B4B',
        () => selectFood(food),
        selectedFood?.id === food.id,
        {
          id: food.id,
          name: food.name,
          type: 'food',
          category: food.category,
          explanation: food.description,
        }
      );
    });
  }, [filtered, filteredFoods, mapReady, selectPlace, selectFood, selected, selectedFood]);

  // ----- External focus (search result) -----
  useEffect(() => {
    if (!focusPlaceId) return;
    const p = mapable.find((x) => x.id === focusPlaceId);
    if (p) selectPlace(p);
  }, [focusPlaceId, mapable, selectPlace]);

  // ----- Draw route line -----
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;
    const drawRoute = async () => {
      if (!route) {
        if (map.getLayer('ym-route-line')) map.removeLayer('ym-route-line');
        if (map.getSource('ym-route')) map.removeSource('ym-route');
        return;
      }
      const maplibregl = await import('maplibre-gl');
      const geojson = {
        type: 'FeatureCollection' as const,
        features: [
          {
            type: 'Feature' as const,
            properties: {},
            geometry: { type: 'LineString' as const, coordinates: route.geometry },
          },
        ],
      };
      if (map.getSource('ym-route')) {
        (map.getSource('ym-route') as { setData: (d: unknown) => void }).setData(geojson);
      } else {
        map.addSource('ym-route', { type: 'geojson', data: geojson });
        map.addLayer({
          id: 'ym-route-line',
          type: 'line',
          source: 'ym-route',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': '#B8955A',
            'line-width': 5,
            'line-opacity': 0.9,
          },
        });
      }
      void maplibregl;
      const coords = route.geometry;
      if (coords.length > 1) {
        const lons = coords.map((c) => c[0]);
        const lats = coords.map((c) => c[1]);
        map.fitBounds(
          [
            [Math.min(...lons), Math.min(...lats)],
            [Math.max(...lons), Math.max(...lats)],
          ],
          { padding: 60, duration: 800 }
        );
      }
    };
    drawRoute();
  }, [route, mapReady]);

  // ----- Routing actions -----
  const setManualOrigin = () => {
    const label = window.prompt(
      'Starting point:\nType a starting place name (e.g. "Charminar", "Golconda Fort") or "lat, lng" coordinates.'
    );
    if (!label) return;
    const coordMatch = label.match(/^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/);
    if (coordMatch) {
      setOriginCoord({ lat: parseFloat(coordMatch[1]), lng: parseFloat(coordMatch[2]) });
      setOriginLabel(`${coordMatch[1]}, ${coordMatch[2]}`);
      setLocationDenied(false);
      setRoute(null);
      return;
    }
    // Search curated places first
    const target = searchCurated(label, places as Place[]);
    if (target) {
      setOriginCoord({ lat: target.latitude, lng: target.longitude });
      setOriginLabel(target.name);
      setLocationDenied(false);
      setRoute(null);
    } else {
      setRouteError(`Starting place "${label}" was not found in the YATRAMITR curated dataset. Try a place name like "Charminar" or coordinates "17.36, 78.47".`);
    }
  };

  const detectMyLocation = () => {
    if (!('geolocation' in navigator)) {
      setRouteError('Geolocation is not supported by this browser. Select a starting place manually.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setOriginCoord({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setOriginLabel('My location');
        setLocationDenied(false);
        setRouteError(null);
        setLocating(false);
        mapRef.current?.flyTo({ center: [pos.coords.longitude, pos.coords.latitude], zoom: 12, duration: 800 });
      },
      () => {
        setLocating(false);
        setLocationDenied(true);
      },
      { timeout: 10000 }
    );
  };

  const requestRoute = async (dest: { lat: number; lng: number; name: string }) => {
    if (!originCoord) {
      setRouteError('Choose a starting point first — use your location or select a starting place.');
      return;
    }
    setRouteLoading(true);
    setRouteError(null);
    try {
      const res = await fetch('/api/route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromLat: originCoord.lat,
          fromLng: originCoord.lng,
          toLat: dest.lat,
          toLng: dest.lng,
          mode: travelMode,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.distanceKm) {
        throw new Error(data?.error || 'Routing service did not return a route.');
      }
      setRoute({
        distanceKm: data.distanceKm,
        durationMin: data.durationMin,
        geometry: data.geometry,
        provider: data.provider,
      });
    } catch (err) {
      setRoute(err instanceof Error && err.message === 'aborted' ? route : null);
      setRouteError(
        err instanceof Error && err.message !== 'aborted'
          ? `${err.message} You can retry, or open Google Maps for turn-by-turn navigation.`
          : 'Routing failed. You can retry, or open Google Maps for turn-by-turn navigation.'
      );
    } finally {
      setRouteLoading(false);
    }
  };

  const gmapsDirections = (dest: { lat: number; lng: number }) => {
    const from = originCoord ? `${originCoord.lat},${originCoord.lng}` : '';
    return `https://www.google.com/maps/dir/?api=1${from ? `&origin=${from}` : ''}&destination=${dest.lat},${dest.lng}&travelmode=driving`;
  };

  const nearbyExperiences = selected ? experiences.filter((e) => e.placeId === selected.id) : [];

  const [geoView, setGeoView] = useState<GeographicView>('telangana');

  const switchGeoView = useCallback((viewKey: GeographicView) => {
    setGeoView(viewKey);
    const view = GEOGRAPHIC_VIEWS[viewKey];
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: view.center,
        zoom: view.zoom,
        duration: 1100,
        essential: true,
      });
    }
  }, []);

  const fitAllDestinations = useCallback(() => {
    if (!mapRef.current || mapable.length === 0) return;
    const lons = mapable.map((p) => p.longitude);
    const lats = mapable.map((p) => p.latitude);
    mapRef.current.fitBounds(
      [
        [Math.min(...lons) - 0.08, Math.min(...lats) - 0.08],
        [Math.max(...lons) + 0.08, Math.max(...lats) + 0.08],
      ],
      { padding: 50, duration: 1000 }
    );
    setGeoView('telangana');
  }, [mapable]);

  return (
    <div className="space-y-4">
      {/* Geographic Context Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-white/90 border border-[#E8DFCF] shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-forest-950 flex items-center gap-1.5 mr-1">
            <Compass className="w-4 h-4 text-[#B8955A]" />
            <span>Map Scope:</span>
          </span>
          <div className="inline-flex rounded-xl p-1 bg-[#F5F1E8] border border-[#E8DFCF] gap-1">
            {(['india', 'telangana', 'hyderabad'] as const).map((vKey) => {
              const v = GEOGRAPHIC_VIEWS[vKey];
              const isActive = geoView === vKey;
              return (
                <button
                  key={vKey}
                  type="button"
                  onClick={() => switchGeoView(vKey)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5',
                    isActive
                      ? 'bg-[#16352A] text-[#FAF8F5] shadow-xs'
                      : 'text-[#1D2521]/75 hover:text-[#16352A] hover:bg-white/70'
                  )}
                >
                  <span>{v.icon}</span>
                  <span>{v.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fitAllDestinations}
            className="px-3.5 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#E8DFCF] text-xs font-semibold text-[#16352A] hover:border-[#B8955A] hover:bg-white shadow-xs transition-colors"
          >
            Fit 23 Destinations
          </button>
          <span className="text-xs font-semibold text-[#16352A]/70 hidden sm:inline">
            23 Verified Pins Plotted
          </span>
        </div>
      </div>

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
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#B86B4B' }} />
          Food
        </span>
        <span className="text-[#1D2521]/50">
          (YATRAMITR editorial classification — not official statistics)
        </span>
      </div>

      {/* Map canvas */}
      <div
        className="relative w-full rounded-2xl overflow-hidden border border-[#E8DFCF] bg-[#FAF8F5]"
        style={{ height }}
      >
        <div ref={containerRef} className="absolute inset-0 w-full h-full" style={{ height: '100%', minHeight: height }} />
        {!mapReady && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#FAF8F5]/80 text-[#16352A] backdrop-blur-sm z-10">
            <div className="w-8 h-8 border-2 border-[#16352A] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-semibold">Loading Hyderabad Map…</span>
          </div>
        )}

        {/* Detail panel — place */}
        {selected && (
          <div className="absolute top-4 left-4 right-4 sm:right-auto sm:w-96 max-h-[85%] overflow-y-auto rounded-xl bg-white/97 backdrop-blur border border-[#E8DFCF] shadow-xl p-5 space-y-4 z-10 animate-in">
            <button
              onClick={() => { setSelected(null); setRoute(null); setRouteError(null); }}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 text-[#1D2521]/70 hover:text-[#1D2521] shadow-sm z-10"
              aria-label="Close details"
            >
              <X className="w-4 h-4" />
            </button>

            {selected.image && (
              <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden bg-[#16352A] shadow-sm">
                <img
                  src={selected.image}
                  alt={selected.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

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

            {/* ---- Routing ---- */}
            <div className="space-y-3 pt-3 border-t border-[#E8DFCF]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1D2521]/60 flex items-center gap-1">
                <RouteIcon className="w-3.5 h-3.5 text-[#B86B4B]" /> Plan Route to {selected.name}
              </span>

              {/* Starting place dropdown */}
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-[#1D2521]/70 block">
                  Starting point (From):
                </label>
                <select
                  value={originLabel === 'My location' ? '__my_loc__' : (mapable.find((p) => p.name === originLabel)?.id || '')}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '__my_loc__') {
                      detectMyLocation();
                    } else if (val) {
                      const p = mapable.find((item) => item.id === val);
                      if (p) {
                        setOriginCoord({ lat: p.latitude, lng: p.longitude });
                        setOriginLabel(p.name);
                        setLocationDenied(false);
                        setRoute(null);
                        setRouteError(null);
                      }
                    } else {
                      setOriginCoord(null);
                      setOriginLabel('');
                      setRoute(null);
                    }
                  }}
                  className="w-full text-xs p-2 rounded-lg border border-[#E8DFCF] bg-[#FAF8F5] text-[#16352A] font-medium focus:ring-2 focus:ring-[#16352A]/20"
                >
                  <option value="">-- Choose Starting Point --</option>
                  <option value="__my_loc__">📍 Use My Current Location</option>
                  {mapable.map((p) => (
                    <option key={p.id} value={p.id} disabled={p.id === selected.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Travel mode selector */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setTravelMode('driving')}
                    className={cn(
                      'px-2.5 py-1 rounded-md text-[11px] font-bold transition-all',
                      travelMode === 'driving'
                        ? 'bg-[#16352A] text-white shadow-sm'
                        : 'bg-[#F5F1E8] text-[#16352A] border border-[#E8DFCF] hover:bg-white'
                    )}
                  >
                    🚗 Drive
                  </button>
                  <button
                    type="button"
                    onClick={() => setTravelMode('walking')}
                    className={cn(
                      'px-2.5 py-1 rounded-md text-[11px] font-bold transition-all',
                      travelMode === 'walking'
                        ? 'bg-[#16352A] text-white shadow-sm'
                        : 'bg-[#F5F1E8] text-[#16352A] border border-[#E8DFCF] hover:bg-white'
                    )}
                  >
                    🚶 Walk
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => requestRoute({ lat: selected.latitude, lng: selected.longitude, name: selected.name })}
                    disabled={routeLoading || !originCoord}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-[#B8955A] text-[#0D211A] text-[11px] font-bold hover:bg-[#a6844c] transition-colors disabled:opacity-50"
                  >
                    <Navigation className="w-3 h-3" />
                    {routeLoading ? 'Routing…' : 'Calculate Route'}
                  </button>
                  {route && (
                    <button
                      onClick={() => { setRoute(null); setRouteError(null); }}
                      className="px-2 py-1.5 rounded-md border border-[#E8DFCF] text-[#1D2521]/70 hover:text-[#1D2521] text-[10px] font-bold"
                      title="Clear Route"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {locationDenied && (
                <p className="text-[11px] text-terracotta-700 bg-terracotta-50 border-l-2 border-terracotta-500 px-2.5 py-1.5 rounded">
                  Location access was not granted. Please select a starting place from the dropdown above.
                </p>
              )}

              {originLabel && !locationDenied && (
                <p className="text-[11px] text-[#1D2521]/75">
                  From: <span className="font-bold text-[#16352A]">{originLabel}</span> → to{' '}
                  <span className="font-bold text-[#16352A]">{selected.name}</span>
                </p>
              )}

              {route && (
                <div className="p-3 rounded-xl bg-forest-50 border border-forest-200 text-[11px] space-y-1.5 animate-in">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-forest-950 text-xs">
                      {route.distanceKm.toFixed(1)} km · ~{route.durationMin} min ({travelMode})
                    </p>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-forest-200/60 text-forest-900 font-medium">
                      OSRM Live
                    </span>
                  </div>
                  <p className="text-forest-900/70 text-[10px]">
                    Live geographic routing line plotted across Hyderabad road network.
                  </p>
                </div>
              )}

              {routeError && (
                <div className="p-3 rounded-xl bg-terracotta-50 border-l-2 border-terracotta-500 text-[11px] text-terracotta-800 space-y-1.5">
                  <p className="flex items-center gap-1.5 font-bold">
                    <AlertTriangle className="w-3 h-3" /> Routing unavailable
                  </p>
                  <p>{routeError}</p>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => requestRoute({ lat: selected.latitude, lng: selected.longitude, name: selected.name })}
                      className="px-2.5 py-1 rounded bg-terracotta-600 text-white font-bold text-[10px] hover:bg-terracotta-700"
                    >
                      Retry
                    </button>
                    <a
                      href={gmapsDirections({ lat: selected.latitude, lng: selected.longitude })}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded border border-terracotta-600 text-terracotta-700 font-bold text-[10px] hover:bg-terracotta-50"
                    >
                      Google Maps fallback
                    </a>
                  </div>
                </div>
              )}

              <a
                href={gmapsDirections({ lat: selected.latitude, lng: selected.longitude })}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#16352A] hover:text-[#B8955A] transition-colors pt-1"
              >
                <span>Open in Google Maps for turn-by-turn</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>

            {/* Experiences & booking */}
            {nearbyExperiences.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-[#E8DFCF]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#1D2521]/60">
                  YATRAMITR experiences here
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
            )}

            <div className="pt-3 border-t border-[#E8DFCF] space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href={`/places/${selected.id}`}
                  className="inline-flex items-center justify-center px-3 py-2.5 rounded-lg border border-[#16352A] text-[#16352A] text-xs font-bold hover:bg-[#16352A]/5 transition-colors text-center"
                >
                  Open Place Page
                </Link>
                <Link
                  href={`/booking?placeId=${selected.id}`}
                  className="inline-flex items-center justify-center px-3 py-2.5 rounded-lg bg-[#B8955A] text-[#0D211A] text-xs font-bold hover:bg-[#a6844c] shadow-xs transition-colors text-center"
                >
                  Book a Mitra
                </Link>
              </div>
              <p className="text-[10px] text-[#1D2521]/50 text-center">
                Timings & tickets: check official source for latest information.
              </p>
            </div>
          </div>
        )}

        {/* Detail panel — food */}
        {selectedFood && (
          <div className="absolute top-4 left-4 right-4 sm:right-auto sm:w-96 max-h-[85%] overflow-y-auto rounded-xl bg-white/97 backdrop-blur border border-[#E8DFCF] shadow-xl p-5 space-y-3 z-10 animate-in">
            <button
              onClick={() => { setSelectedFood(null); setRoute(null); setRouteError(null); }}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 text-[#1D2521]/70 hover:text-[#1D2521] shadow-sm z-10"
              aria-label="Close details"
            >
              <X className="w-4 h-4" />
            </button>

            {selectedFood.image && (
              <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden bg-[#16352A] shadow-sm">
                <img
                  src={selectedFood.image}
                  alt={selectedFood.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="space-y-1 pr-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#B86B4B]">
                {selectedFood.category}
              </span>
              <h3 className="font-serif text-xl font-bold text-[#0D211A]">{selectedFood.name}</h3>
              <p className="text-[11px] text-[#1D2521]/60">{selectedFood.location}</p>
              <p className="text-xs text-[#1D2521]/75 leading-relaxed">{selectedFood.description}</p>
            </div>

            <div className="space-y-3 pt-3 border-t border-[#E8DFCF]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1D2521]/60 flex items-center gap-1">
                <RouteIcon className="w-3.5 h-3.5 text-[#B86B4B]" /> Plan Route to {selectedFood.name}
              </span>

              {/* Starting place dropdown */}
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-[#1D2521]/70 block">
                  Starting point (From):
                </label>
                <select
                  value={originLabel === 'My location' ? '__my_loc__' : (mapable.find((p) => p.name === originLabel)?.id || '')}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '__my_loc__') {
                      detectMyLocation();
                    } else if (val) {
                      const p = mapable.find((item) => item.id === val);
                      if (p) {
                        setOriginCoord({ lat: p.latitude, lng: p.longitude });
                        setOriginLabel(p.name);
                        setLocationDenied(false);
                        setRoute(null);
                        setRouteError(null);
                      }
                    } else {
                      setOriginCoord(null);
                      setOriginLabel('');
                      setRoute(null);
                    }
                  }}
                  className="w-full text-xs p-2 rounded-lg border border-[#E8DFCF] bg-[#FAF8F5] text-[#16352A] font-medium focus:ring-2 focus:ring-[#16352A]/20"
                >
                  <option value="">-- Choose Starting Point --</option>
                  <option value="__my_loc__">📍 Use My Current Location</option>
                  {mapable.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Travel mode selector */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setTravelMode('driving')}
                    className={cn(
                      'px-2.5 py-1 rounded-md text-[11px] font-bold transition-all',
                      travelMode === 'driving'
                        ? 'bg-[#16352A] text-white shadow-sm'
                        : 'bg-[#F5F1E8] text-[#16352A] border border-[#E8DFCF] hover:bg-white'
                    )}
                  >
                    🚗 Drive
                  </button>
                  <button
                    type="button"
                    onClick={() => setTravelMode('walking')}
                    className={cn(
                      'px-2.5 py-1 rounded-md text-[11px] font-bold transition-all',
                      travelMode === 'walking'
                        ? 'bg-[#16352A] text-white shadow-sm'
                        : 'bg-[#F5F1E8] text-[#16352A] border border-[#E8DFCF] hover:bg-white'
                    )}
                  >
                    🚶 Walk
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => requestRoute({ lat: selectedFood.latitude, lng: selectedFood.longitude, name: selectedFood.name })}
                    disabled={routeLoading || !originCoord}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-[#B8955A] text-[#0D211A] text-[11px] font-bold hover:bg-[#a6844c] transition-colors disabled:opacity-50"
                  >
                    <Navigation className="w-3 h-3" />
                    {routeLoading ? 'Routing…' : 'Calculate Route'}
                  </button>
                  {route && (
                    <button
                      onClick={() => { setRoute(null); setRouteError(null); }}
                      className="px-2 py-1.5 rounded-md border border-[#E8DFCF] text-[#1D2521]/70 hover:text-[#1D2521] text-[10px] font-bold"
                      title="Clear Route"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {locationDenied && (
                <p className="text-[11px] text-terracotta-700 bg-terracotta-50 border-l-2 border-terracotta-500 px-2.5 py-1.5 rounded">
                  Location access was not granted. Please select a starting place from the dropdown above.
                </p>
              )}

              {originLabel && !locationDenied && (
                <p className="text-[11px] text-[#1D2521]/75">
                  From: <span className="font-bold text-[#16352A]">{originLabel}</span> → to{' '}
                  <span className="font-bold text-[#16352A]">{selectedFood.name}</span>
                </p>
              )}

              {route && (
                <div className="p-3 rounded-xl bg-forest-50 border border-forest-200 text-[11px] space-y-1.5 animate-in">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-forest-950 text-xs">
                      {route.distanceKm.toFixed(1)} km · ~{route.durationMin} min ({travelMode})
                    </p>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-forest-200/60 text-forest-900 font-medium">
                      OSRM Live
                    </span>
                  </div>
                  <p className="text-forest-900/70 text-[10px]">
                    Live geographic routing line plotted across Hyderabad road network.
                  </p>
                </div>
              )}

              {routeError && (
                <div className="p-3 rounded-xl bg-terracotta-50 border-l-2 border-terracotta-500 text-[11px] text-terracotta-800 space-y-1.5">
                  <p className="flex items-center gap-1.5 font-bold">
                    <AlertTriangle className="w-3 h-3" /> Routing unavailable
                  </p>
                  <p>{routeError}</p>
                  <button
                    onClick={() => requestRoute({ lat: selectedFood.latitude, lng: selectedFood.longitude, name: selectedFood.name })}
                    className="mt-1.5 px-2.5 py-1 rounded bg-terracotta-600 text-white font-bold text-[10px] hover:bg-terracotta-700"
                  >
                    Retry
                  </button>
                </div>
              )}

              <a
                href={gmapsDirections({ lat: selectedFood.latitude, lng: selectedFood.longitude })}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#16352A] hover:text-[#B8955A] transition-colors pt-1"
              >
                <span>Open in Google Maps for turn-by-turn</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- small helpers ----------

function MapPinIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

/** Simple curated-dataset search used for manual origin entry. */
export function searchCurated(
  query: string,
  places: Place[]
): (Place & { latitude: number; longitude: number }) | null {
  const q = query.trim().toLowerCase();
  if (!q) return null;
  const exact = places.find((p) => p.name.toLowerCase() === q);
  if (exact && exact.latitude !== null && exact.longitude !== null) {
    return exact as Place & { latitude: number; longitude: number };
  }
  const partial = places.find(
    (p) =>
      p.name.toLowerCase().includes(q) &&
      p.latitude !== null &&
      p.longitude !== null
  );
  if (partial) return partial as Place & { latitude: number; longitude: number };
  return null;
}


