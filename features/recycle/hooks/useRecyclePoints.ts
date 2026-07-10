"use client";

import { useCallback, useEffect, useState } from "react";

import {
  fetchRecyclePointsCached,
  MAX_POINTS,
  SEARCH_RADIUS_METERS,
} from "../overpass";
import type { Coordinates, RecyclePoint } from "../types";

interface Params {
  coords: Coordinates | null;
  radiusMeters?: number;
}

interface PointsState {
  key: string;
  points?: RecyclePoint[];
  error?: boolean;
}

/**
 * Loads recycling points around the given coordinates from the Overpass API.
 * State is keyed by the request (coords + radius + attempt) so `loading` is
 * derived instead of set imperatively, and stale responses are discarded.
 */
export function useRecyclePoints({
  coords,
  radiusMeters = SEARCH_RADIUS_METERS,
}: Params) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<PointsState>({ key: "" });

  const key = coords
    ? `${coords.lat.toFixed(5)},${coords.lng.toFixed(5)},${radiusMeters},${attempt}`
    : "";

  useEffect(() => {
    if (!key || !coords) return;
    let cancelled = false;

    fetchRecyclePointsCached(coords.lat, coords.lng, radiusMeters)
      .then((points) => {
        if (!cancelled) setState({ key, points: points.slice(0, MAX_POINTS) });
      })
      .catch((err) => {
        console.error("[RecycleMap] Failed to load points:", err);
        if (!cancelled) setState({ key, error: true });
      });

    return () => {
      cancelled = true;
    };
  }, [key, coords, radiusMeters]);

  const retry = useCallback(() => setAttempt((a) => a + 1), []);

  const settled = key !== "" && state.key === key;

  return {
    points: settled ? (state.points ?? []) : [],
    loading: key !== "" && !settled,
    error: settled && Boolean(state.error),
    retry,
  };
}
