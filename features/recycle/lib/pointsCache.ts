import "server-only";

import { MAX_POINTS, MAX_RADIUS_METERS } from "../constants/points";
import type { RecyclePoint } from "../types";
import { distanceMeters } from "./distance";
import { fetchRecyclePointsInBox, type BoundingBox } from "./overpass";

/**
 * The server's copy of the recycling points, so visitors never wait on
 * Overpass themselves.
 *
 * Public Overpass takes about a minute per query when it is busy, which is
 * most of the time. So the world is cut into tiles of TILE_DEG degrees (about
 * 11 km), and each tile is fetched once, with a margin wide enough to cover
 * the widest radius the map offers for anyone standing inside it. Everyone in
 * that tile is then answered from memory: the first visitor waits, the rest
 * don't.
 *
 * A tile is fresh for FRESH_MS. After that it is still served (points rarely
 * move) while a refresh runs in the background, up to KEEP_MS. Memory only,
 * so a restart empties it, like `RateWindow`.
 */
const TILE_DEG = 0.1;
const FRESH_MS = 24 * 60 * 60_000;
const KEEP_MS = 30 * 24 * 60 * 60_000;
const MAX_TILES = 1_000;

/** How long one tile fetch may keep retrying Overpass before giving up. */
const FETCH_BUDGET_MS = 3 * 60_000;

/** Upstream fetches running at once; past this, new areas wait their turn. */
const MAX_CONCURRENT_FETCHES = 4;

const METERS_PER_DEGREE_LAT = 111_320;

export type Tile = { key: string; box: BoundingBox };

export type PointsLookup =
  | { status: "ready"; points: RecyclePoint[] }
  /** Still being fetched; ask again. */
  | { status: "pending" }
  /** A new area, but this caller may not start another fetch right now. */
  | { status: "limited" }
  | { status: "failed" };

const tiles = new Map<string, { at: number; points: RecyclePoint[] }>();
const inFlight = new Map<string, Promise<RecyclePoint[]>>();

/** The tile a position falls in, and the box to fetch for it. */
export function tileFor(lat: number, lng: number): Tile {
  const row = Math.floor(lat / TILE_DEG);
  const col = Math.floor(lng / TILE_DEG);
  const south = row * TILE_DEG;
  const west = col * TILE_DEG;
  const north = south + TILE_DEG;
  const east = west + TILE_DEG;

  // A degree of longitude shrinks toward the poles, so the east-west margin
  // is widened at the tile's highest latitude. 5% extra for rounding.
  const latMargin = (MAX_RADIUS_METERS / METERS_PER_DEGREE_LAT) * 1.05;
  const widestLat = Math.min(Math.max(Math.abs(south), Math.abs(north)), 85);
  const lngMargin = latMargin / Math.cos((widestLat * Math.PI) / 180);

  return {
    key: `${row}:${col}`,
    box: {
      south: Math.max(south - latMargin, -90),
      north: Math.min(north + latMargin, 90),
      west: Math.max(west - lngMargin, -180),
      east: Math.min(east + lngMargin, 180),
    },
  };
}

/**
 * The points within the widest radius of a position, nearest first. Nearest
 * first matters beyond looks: if MAX_POINTS cuts the list, what is dropped is
 * the far end, so every smaller radius the page filters to stays complete.
 */
function nearest(points: RecyclePoint[], lat: number, lng: number): RecyclePoint[] {
  return points
    .map((point) => ({ point, d: distanceMeters(lat, lng, point.lat, point.lon) }))
    .filter(({ d }) => d <= MAX_RADIUS_METERS)
    .sort((a, b) => a.d - b.d)
    .slice(0, MAX_POINTS)
    .map(({ point }) => point);
}

function store(key: string, points: RecyclePoint[]) {
  // Re-inserting moves the key to the end, so the first key is always the
  // stalest tile and the one to drop.
  tiles.delete(key);
  if (tiles.size >= MAX_TILES) {
    const stalest = tiles.keys().next().value;
    if (stalest !== undefined) tiles.delete(stalest);
  }
  tiles.set(key, { at: Date.now(), points });
}

/** Starts fetching a tile, or joins the fetch already running for it. */
function refresh(tile: Tile): Promise<RecyclePoint[]> {
  const running = inFlight.get(tile.key);
  if (running) return running;

  const request = fetchRecyclePointsInBox(tile.box, FETCH_BUDGET_MS)
    .then((points) => {
      store(tile.key, points);
      return points;
    })
    .finally(() => inFlight.delete(tile.key));

  // Nobody may be waiting on it (a background refresh, or a visitor who left),
  // so the failure is logged here rather than left unhandled.
  request.catch((err) => {
    console.warn(`[recycle-points] Tile ${tile.key} fetch failed:`, err);
  });

  inFlight.set(tile.key, request);
  return request;
}

/**
 * The recycling points around a position. Answers from memory when the tile
 * is known; otherwise starts (or joins) its fetch and waits up to `waitMs`
 * for it, answering `pending` if it is still running so the caller can ask
 * again. A fetch keeps running after the caller stops waiting.
 *
 * `mayStartFetch` is asked only when a new upstream fetch would start, so
 * polling an area that is already loading costs nothing against a limit.
 */
export async function lookupRecyclePoints(
  lat: number,
  lng: number,
  { waitMs, mayStartFetch }: { waitMs: number; mayStartFetch: () => boolean },
): Promise<PointsLookup> {
  const tile = tileFor(lat, lng);
  const cached = tiles.get(tile.key);
  const age = cached ? Date.now() - cached.at : Infinity;

  if (cached && age < KEEP_MS) {
    if (age >= FRESH_MS) void refresh(tile).catch(() => {});
    return { status: "ready", points: nearest(cached.points, lat, lng) };
  }

  let pending = inFlight.get(tile.key);
  if (!pending) {
    if (inFlight.size >= MAX_CONCURRENT_FETCHES || !mayStartFetch()) {
      return { status: "limited" };
    }
    pending = refresh(tile);
  }

  let timer: ReturnType<typeof setTimeout> | undefined;
  const gaveUp = new Promise<PointsLookup>((resolve) => {
    timer = setTimeout(() => resolve({ status: "pending" }), waitMs);
  });
  try {
    return await Promise.race([
      pending.then(
        (points): PointsLookup => ({ status: "ready", points: nearest(points, lat, lng) }),
        (): PointsLookup => ({ status: "failed" }),
      ),
      gaveUp,
    ]);
  } finally {
    clearTimeout(timer);
  }
}

/** Test seam: forgets every tile and running fetch. */
export function resetRecyclePointsCache() {
  tiles.clear();
  inFlight.clear();
}
