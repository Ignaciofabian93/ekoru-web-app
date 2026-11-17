"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { distanceMeters } from "../lib/distance";
import { fetchRecyclePointsCached } from "../lib/pointsClient";
import type { Coordinates, RecyclePoint } from "../types";

/** After this long the loading pill says that the first load of an area is slow. */
const SLOW_AFTER_MS = 8_000;

interface PointsState {
  key: string;
  points?: RecyclePoint[];
  error?: boolean;
}

/**
 * Loads the recycling points around the given coordinates from
 * `/api/recycle-points` and keeps the ones within `radiusMeters`.
 *
 * The server always answers out to the widest radius, so the radius is not
 * part of the request: changing it only re-filters what is already here.
 * State is keyed by the request (coords + attempt) so `loading` is derived
 * instead of set imperatively, and stale responses are discarded. `slow`
 * turns on when the server is still loading the area.
 */
export function useRecyclePoints({
  coords,
  radiusMeters,
}: {
  coords: Coordinates | null;
  radiusMeters: number;
}) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<PointsState>({ key: "" });
  const [slowKey, setSlowKey] = useState("");

  const key = coords
    ? `${coords.lat.toFixed(5)},${coords.lng.toFixed(5)},${attempt}`
    : "";

  useEffect(() => {
    if (!key || !coords) return;
    let cancelled = false;

    fetchRecyclePointsCached(coords.lat, coords.lng)
      .then((points) => {
        if (!cancelled) setState({ key, points });
      })
      .catch((err) => {
        console.error("[RecycleMap] Failed to load points:", err);
        if (!cancelled) setState({ key, error: true });
      });

    return () => {
      cancelled = true;
    };
  }, [key, coords]);

  useEffect(() => {
    if (!key) return;
    const timer = setTimeout(() => setSlowKey(key), SLOW_AFTER_MS);
    return () => clearTimeout(timer);
  }, [key]);

  const retry = useCallback(() => setAttempt((a) => a + 1), []);

  const settled = key !== "" && state.key === key;
  const loading = key !== "" && !settled;
  const loaded = settled ? state.points : undefined;

  const points = useMemo(
    () =>
      loaded && coords
        ? loaded.filter(
            (p) => distanceMeters(coords.lat, coords.lng, p.lat, p.lon) <= radiusMeters,
          )
        : [],
    [loaded, coords, radiusMeters],
  );

  return {
    points,
    loading,
    slow: loading && slowKey === key,
    error: settled && Boolean(state.error),
    retry,
  };
}
