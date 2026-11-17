import type { RecyclePoint } from "../types";

/**
 * Browser side of `/api/recycle-points`. The route answers 202 while an area
 * is still loading on the server, so this keeps asking until the points
 * arrive, the server reports a failure, or POLL_DEADLINE_MS passes. Each 202
 * already took the server up to 20 s, so the pause between asks is short.
 */
const POLL_DEADLINE_MS = 4 * 60_000; // the server's 3-minute upstream budget, plus slack
const POLL_PAUSE_MS = 1_000;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchRecyclePoints(lat: number, lng: number): Promise<RecyclePoint[]> {
  const url = `/api/recycle-points?lat=${lat.toFixed(5)}&lng=${lng.toFixed(5)}`;
  const deadline = Date.now() + POLL_DEADLINE_MS;

  while (Date.now() < deadline) {
    const res = await fetch(url, { cache: "no-store" });
    if (res.status === 202) {
      await wait(POLL_PAUSE_MS);
      continue;
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} from /api/recycle-points`);
    const json = (await res.json()) as { points?: RecyclePoint[] };
    return json.points ?? [];
  }
  throw new Error("Gave up waiting for recycle points");
}

// The server keeps its own copy for a day; this one only spares a reload the
// round trip.
const CACHE_TTL_MS = 10 * 60 * 1000;

function cacheKey(lat: number, lng: number) {
  // 3 decimals ≈ 110 m — GPS jitter between loads still hits the same entry.
  // v2: lists now reach the widest radius (10 km), not a fixed 5 km.
  return `recycle-points:v2:${lat.toFixed(3)},${lng.toFixed(3)}`;
}

/**
 * Requests currently on the wire, keyed like the cache. React's StrictMode
 * runs effects twice on mount in development, and any remount repeats the
 * request while the first is still polling; sharing the promise makes those
 * callers wait on one request instead of starting a second.
 */
const inFlight = new Map<string, Promise<RecyclePoint[]>>();

/**
 * `fetchRecyclePoints` with a sessionStorage cache and in-flight de-duplication
 * in front. Falls back to a plain fetch when storage is unavailable (privacy
 * mode, quota).
 */
export async function fetchRecyclePointsCached(
  lat: number,
  lng: number,
): Promise<RecyclePoint[]> {
  const key = cacheKey(lat, lng);

  try {
    const raw = sessionStorage.getItem(key);
    if (raw) {
      const cached = JSON.parse(raw) as { at: number; points: RecyclePoint[] };
      if (Date.now() - cached.at < CACHE_TTL_MS) return cached.points;
    }
  } catch {
    // Unreadable/corrupt entry — fall through to a network fetch.
  }

  const pending = inFlight.get(key);
  if (pending) return pending;

  const request = fetchRecyclePoints(lat, lng)
    .then((points) => {
      try {
        sessionStorage.setItem(key, JSON.stringify({ at: Date.now(), points }));
      } catch {
        // Storage full or blocked — caching is best-effort.
      }
      return points;
    })
    .finally(() => {
      // Cleared either way: a failure must not be remembered as pending, or the
      // retry button would hand back the same rejected promise forever.
      inFlight.delete(key);
    });

  inFlight.set(key, request);
  return request;
}
