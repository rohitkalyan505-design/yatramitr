// ============================================================
// ROUTE API — server-side proxy for driving routes
// ============================================================
// Provider: OSRM (Open Source Routing Machine).
// - Default: the free public OSRM demo server (no API key, no
//   billing) — suitable for an SIH MVP.
// - Optional: point OSRM_BASE_URL at a self-hosted/other OSRM
//   instance; OSRM_API_KEY is appended if the provider needs one.
//
// SECURITY: runs only on the server; any routing credentials stay
// in server-only env vars (never NEXT_PUBLIC_*). The client never
// sees provider credentials — only the computed route.
//
// NO HARDCODED ROUTES: distance, duration and geometry always come
// from the routing provider's live response. If the provider fails,
// we return an error and the UI offers retry + navigation fallback.
// ============================================================

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const DEFAULT_OSRM = 'https://router.project-osrm.org';
const UA = 'YitraMitr-SIH2026-MVP/1.0';

interface OsrmResponse {
  code: string;
  routes?: {
    distance: number; // metres
    duration: number; // seconds
    geometry: { coordinates: [number, number][] }; // [lng, lat]
  }[];
}

async function handleRouteCalculation(
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number,
  mode: string
) {
  if (
    !Number.isFinite(fromLat) || !Number.isFinite(fromLng) ||
    !Number.isFinite(toLat) || !Number.isFinite(toLng)
  ) {
    return NextResponse.json({ error: 'Valid fromLat/fromLng/toLat/toLng are required.' }, { status: 400 });
  }

  const base = (process.env.OSRM_BASE_URL || DEFAULT_OSRM).replace(/\/+$/, '');
  const apiKey = process.env.OSRM_API_KEY || '';

  const activeMode = mode === 'walking' ? 'walking' : 'driving';
  const url =
    `${base}/route/v1/${activeMode}/${fromLng},${fromLat};${toLng},${toLat}` +
    `?overview=full&geometries=geojson${apiKey ? `&apikey=${encodeURIComponent(apiKey)}` : ''}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  let data: OsrmResponse;
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': UA },
    });
    if (!res.ok) {
      clearTimeout(timeout);
      return NextResponse.json(
        { error: `Routing service responded with status ${res.status}.` },
        { status: 502 }
      );
    }
    data = (await res.json()) as OsrmResponse;
  } catch {
    clearTimeout(timeout);
    return NextResponse.json(
      { error: 'Could not reach the routing service. Check your connection and retry.' },
      { status: 504 }
    );
  }
  clearTimeout(timeout);

  if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
    return NextResponse.json(
      { error: 'No road route was found between those two points.' },
      { status: 404 }
    );
  }

  const r = data.routes[0];
  // Downsample geometry for payload size (keep every point under 40km, else decimate)
  let coords = r.geometry.coordinates;
  if (coords.length > 600) {
    const step = Math.ceil(coords.length / 600);
    coords = coords.filter((_, i) => i % step === 0 || i === coords.length - 1);
  }

  return NextResponse.json({
    distanceKm: Math.round((r.distance / 1000) * 10) / 10,
    durationMin: Math.max(1, Math.round(r.duration / 60)),
    geometry: coords,
    mode: activeMode,
    provider: 'OSRM (Open Source Routing Machine)',
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const fromLat = Number(body?.fromLat);
    const fromLng = Number(body?.fromLng);
    const toLat = Number(body?.toLat);
    const toLng = Number(body?.toLng);
    const mode = body?.mode === 'walking' ? 'walking' : 'driving';
    return await handleRouteCalculation(fromLat, fromLng, toLat, toLng, mode);
  } catch {
    return NextResponse.json(
      { error: 'Unexpected server error while planning the route.' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const fromLat = Number(searchParams.get('fromLat'));
    const fromLng = Number(searchParams.get('fromLng'));
    const toLat = Number(searchParams.get('toLat'));
    const toLng = Number(searchParams.get('toLng'));
    const mode = searchParams.get('mode') === 'walking' ? 'walking' : 'driving';
    return await handleRouteCalculation(fromLat, fromLng, toLat, toLng, mode);
  } catch {
    return NextResponse.json(
      { error: 'Unexpected server error while planning the route.' },
      { status: 500 }
    );
  }
}
