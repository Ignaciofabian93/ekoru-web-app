import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { RecyclePoint } from "../types";
import { useRecyclePoints } from "../hooks/useRecyclePoints";

const { fetchRecyclePointsCached } = vi.hoisted(() => ({
  fetchRecyclePointsCached: vi.fn(),
}));
vi.mock("../lib/pointsClient", () => ({ fetchRecyclePointsCached }));

// Plaza de Armas, Santiago. One object, as the location hook hands it over.
const HERE = { lat: -33.4372, lng: -70.6506 };

const point = (id: number, dLat: number): RecyclePoint => ({
  id,
  lat: HERE.lat + dLat,
  lon: HERE.lng,
  materials: [],
});

// ~0.6 km, ~1.7 km, ~4.4 km and ~8.9 km north, nearest first as the server sends them.
const POINTS = [point(1, 0.005), point(2, 0.015), point(3, 0.04), point(4, 0.08)];

const ids = (points: RecyclePoint[]) => points.map((p) => p.id);

beforeEach(() => {
  fetchRecyclePointsCached.mockReset();
  fetchRecyclePointsCached.mockResolvedValue(POINTS);
});

describe("useRecyclePoints", () => {
  it("keeps the points within the chosen radius", async () => {
    const { result } = renderHook(() =>
      useRecyclePoints({ coords: HERE, radiusMeters: 5000 }),
    );

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(ids(result.current.points)).toEqual([1, 2, 3]);
  });

  it("re-filters on a new radius without asking the server again", async () => {
    const { result, rerender } = renderHook(
      ({ radius }) => useRecyclePoints({ coords: HERE, radiusMeters: radius }),
      { initialProps: { radius: 5000 } },
    );
    await waitFor(() => expect(result.current.loading).toBe(false));

    rerender({ radius: 1000 });
    expect(result.current.loading).toBe(false);
    expect(ids(result.current.points)).toEqual([1]);

    rerender({ radius: 10000 });
    expect(ids(result.current.points)).toEqual([1, 2, 3, 4]);

    expect(fetchRecyclePointsCached).toHaveBeenCalledTimes(1);
  });

  it("shows nothing until a position is known", () => {
    const { result } = renderHook(() =>
      useRecyclePoints({ coords: null, radiusMeters: 5000 }),
    );

    expect(result.current).toMatchObject({ points: [], loading: false, error: false });
    expect(fetchRecyclePointsCached).not.toHaveBeenCalled();
  });
});
