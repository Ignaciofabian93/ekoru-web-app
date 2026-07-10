import type { RecyclePoint } from "./types";

// OSM `recycling:*` keys we surface as material tags. Labels live in the
// feature dictionary under `materials.*` so they localize per language.
export const MATERIAL_KEYS = [
  "glass",
  "paper",
  "cardboard",
  "plastic",
  "plastic_bottles",
  "cans",
  "aluminium",
  "metal",
  "clothes",
  "batteries",
  "electronics",
  "organic",
  "wood",
] as const;

// Public Overpass mirrors, tried in order — the primary occasionally rate
// limits or 504s under load, so fallbacks keep the map usable.
const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
];

// Server-side query budget (seconds) — kept short so an overloaded mirror
// fails fast and we move on to the next one instead of hanging.
const QUERY_TIMEOUT_S = 12;

// Client-side cap per endpoint; slightly above the query budget so the
// server-side timeout is the norm and this is just the safety net.
const FETCH_TIMEOUT_MS = 15000;

export const SEARCH_RADIUS_METERS = 5000;

export const MAX_POINTS = 100;

function parseOverpassElements(json: {
  elements?: Record<string, unknown>[];
}): RecyclePoint[] {
  return (json.elements ?? []).map((el): RecyclePoint => {
    const tags = (el.tags ?? {}) as Record<string, string>;
    const materials = MATERIAL_KEYS.filter((k) => tags[`recycling:${k}`] === "yes");
    return {
      id: el.id as number,
      lat: el.lat as number,
      lon: el.lon as number,
      name: tags.name,
      operator: tags.operator,
      openingHours: tags.opening_hours,
      materials,
    };
  });
}

/**
 * Fetches recycling points (OSM `amenity=recycling` nodes) around a location,
 * falling back across Overpass mirrors when one fails.
 */
export async function fetchRecyclePoints(
  lat: number,
  lng: number,
  radiusMeters: number = SEARCH_RADIUS_METERS,
): Promise<RecyclePoint[]> {
  const query = `
    [out:json][timeout:${QUERY_TIMEOUT_S}];
    node[amenity=recycling](around:${radiusMeters},${lat},${lng});
    out body;
  `;
  const body = `data=${encodeURIComponent(query)}`;

  let lastError: unknown;
  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status} from ${endpoint}`);
      const json = await res.json();
      return parseOverpassElements(json);
    } catch (err) {
      console.warn(`[RecycleMap] Overpass endpoint failed: ${endpoint}`, err);
      lastError = err;
    }
  }
  throw lastError;
}

// Results barely change minute to minute, and the public mirrors rate limit
// per IP — cache per rounded location so reloads don't re-query Overpass.
const CACHE_TTL_MS = 10 * 60 * 1000;

function cacheKey(lat: number, lng: number, radiusMeters: number) {
  // 3 decimals ≈ 110 m — GPS jitter between loads still hits the same entry.
  return `recycle-points:${lat.toFixed(3)},${lng.toFixed(3)},${radiusMeters}`;
}

/**
 * `fetchRecyclePoints` with a sessionStorage cache in front. Falls back to a
 * plain fetch when storage is unavailable (SSR, privacy mode, quota).
 */
export async function fetchRecyclePointsCached(
  lat: number,
  lng: number,
  radiusMeters: number = SEARCH_RADIUS_METERS,
): Promise<RecyclePoint[]> {
  const key = cacheKey(lat, lng, radiusMeters);

  try {
    const raw = sessionStorage.getItem(key);
    if (raw) {
      const cached = JSON.parse(raw) as { at: number; points: RecyclePoint[] };
      if (Date.now() - cached.at < CACHE_TTL_MS) return cached.points;
    }
  } catch {
    // Unreadable/corrupt entry — fall through to a network fetch.
  }

  const points = await fetchRecyclePoints(lat, lng, radiusMeters);

  try {
    sessionStorage.setItem(key, JSON.stringify({ at: Date.now(), points }));
  } catch {
    // Storage full or blocked — caching is best-effort.
  }

  return points;
}
