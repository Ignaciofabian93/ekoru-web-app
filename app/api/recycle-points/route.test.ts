// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MAX_RADIUS_METERS } from "@/features/recycle/constants/points";
import { distanceMeters } from "@/features/recycle/lib/distance";
import type * as PointsCache from "@/features/recycle/lib/pointsCache";
import type { RecyclePoint } from "@/features/recycle/types";

vi.mock("server-only", () => ({}));

const { fetchRecyclePointsInBox } = vi.hoisted(() => ({
  fetchRecyclePointsInBox: vi.fn(),
}));
vi.mock("@/features/recycle/lib/overpass", () => ({ fetchRecyclePointsInBox }));

// The cache and the per-visitor counter live in module scope, so each test
// loads fresh copies (see beforeEach).
let GET: (req: Request) => Promise<Response>;
let tileFor: typeof PointsCache.tileFor;

// Plaza de Armas, Santiago.
const HERE = { lat: -33.4372, lng: -70.6506 };

const point = (id: number, dLat: number): RecyclePoint => ({
  id,
  lat: HERE.lat + dLat,
  lon: HERE.lng,
  materials: [],
});
const NEAR = point(1, 0.001); // ~110 m
const MID = point(2, 0.01); // ~1.1 km
const FAR = point(3, 0.1); // ~11 km, past the widest radius (10 km)

const get = (lat: number | string, lng: number | string, ip = "203.0.113.7") =>
  GET(
    new Request(`http://localhost/api/recycle-points?lat=${lat}&lng=${lng}`, {
      headers: { "x-real-ip": ip },
    }),
  );

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

beforeEach(async () => {
  vi.resetModules();
  fetchRecyclePointsInBox.mockReset();
  ({ GET } = await import("./route"));
  ({ tileFor } = await import("@/features/recycle/lib/pointsCache"));
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("GET /api/recycle-points", () => {
  it("refuses missing or out-of-range coordinates", async () => {
    expect((await get("", HERE.lng)).status).toBe(400);
    expect((await get("abc", HERE.lng)).status).toBe(400);
    expect((await get(91, HERE.lng)).status).toBe(400);
    expect((await get(HERE.lat, 181)).status).toBe(400);
    expect(fetchRecyclePointsInBox).not.toHaveBeenCalled();
  });

  it("answers the points within the widest radius, nearest first", async () => {
    fetchRecyclePointsInBox.mockResolvedValue([FAR, MID, NEAR]);

    const res = await get(HERE.lat, HERE.lng);

    expect(res.status).toBe(200);
    const { points } = (await res.json()) as { points: RecyclePoint[] };
    expect(points.map((p) => p.id)).toEqual([NEAR.id, MID.id]);
  });

  it("answers everyone in the same area from one upstream fetch", async () => {
    fetchRecyclePointsInBox.mockResolvedValue([NEAR, MID]);

    await get(HERE.lat, HERE.lng, "198.51.100.1");
    const res = await get(HERE.lat + 0.002, HERE.lng + 0.002, "198.51.100.2");

    expect(res.status).toBe(200);
    expect(fetchRecyclePointsInBox).toHaveBeenCalledTimes(1);
  });

  it("answers 202 while the area loads, then the points once it lands", async () => {
    vi.useFakeTimers();
    const upstream = deferred<RecyclePoint[]>();
    fetchRecyclePointsInBox.mockReturnValue(upstream.promise);

    const first = get(HERE.lat, HERE.lng);
    await vi.advanceTimersByTimeAsync(20_000);
    expect((await first).status).toBe(202);

    // Polling joins the running fetch instead of starting another.
    const second = get(HERE.lat, HERE.lng);
    upstream.resolve([NEAR]);
    const res = await second;
    expect(res.status).toBe(200);
    expect(fetchRecyclePointsInBox).toHaveBeenCalledTimes(1);
  });

  it("answers 503 when Overpass can't be reached", async () => {
    fetchRecyclePointsInBox.mockRejectedValue(new Error("HTTP 502"));
    vi.spyOn(console, "warn").mockImplementation(() => {});

    expect((await get(HERE.lat, HERE.lng)).status).toBe(503);
  });

  it("limits how many new areas one visitor can start loading", async () => {
    fetchRecyclePointsInBox.mockResolvedValue([]);

    // Ten distinct tiles, a tenth of a degree apart.
    for (let i = 0; i < 10; i++) {
      expect((await get(HERE.lat, HERE.lng + i * 0.1)).status).toBe(200);
    }
    expect((await get(HERE.lat, HERE.lng + 1)).status).toBe(429);
    // Areas already loaded stay free.
    expect((await get(HERE.lat, HERE.lng)).status).toBe(200);
    // And another visitor isn't affected.
    expect((await get(HERE.lat, HERE.lng + 1, "192.0.2.9")).status).toBe(200);
  });
});

describe("tileFor", () => {
  it("covers the widest radius of anyone inside the tile", () => {
    // Corners of the tile, where the margin matters most, here and far north.
    for (const [lat, lng] of [
      [-33.4999, -70.6999],
      [-33.4001, -70.6001],
      [64.8999, -147.7999],
    ]) {
      const { box } = tileFor(lat, lng);
      expect(distanceMeters(lat, lng, box.south, lng)).toBeGreaterThanOrEqual(MAX_RADIUS_METERS);
      expect(distanceMeters(lat, lng, box.north, lng)).toBeGreaterThanOrEqual(MAX_RADIUS_METERS);
      expect(distanceMeters(lat, lng, lat, box.west)).toBeGreaterThanOrEqual(MAX_RADIUS_METERS);
      expect(distanceMeters(lat, lng, lat, box.east)).toBeGreaterThanOrEqual(MAX_RADIUS_METERS);
    }
  });
});
