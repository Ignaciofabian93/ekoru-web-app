"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  DEFAULT_EXPLORE_RADIUS_KM,
  EXPLORE_LOCATION_COOKIE,
  EXPLORE_RADIUS_COOKIE,
  type ExploreRadiusKm,
} from "@/constants/settings";
import { useExploreLocationSeed } from "@/context/ExploreLocationContext";
import { useCookieState } from "@/hooks/useCookieState";
import { getCookie, setCookie } from "@/utils/cookies";
import {
  isExploreRadius,
  parseExploreLocation,
  type ExploreLocation,
} from "@/utils/exploreLocation";

export type { ExploreLocation };

const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// `useSyncExternalStore` needs the same reference back while nothing changed,
// so the parsed value is cached against the raw cookie string.
let cachedRaw: string | null = null;
let cachedValue: ExploreLocation | null = null;

/** The stored location, read straight from the cookie. */
export function readExploreLocation(): ExploreLocation | null {
  const raw = getCookie(EXPLORE_LOCATION_COOKIE);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedValue = parseExploreLocation(raw);
  }
  return cachedValue;
}

export function useExploreLocation(): [
  ExploreLocation | null,
  (location: ExploreLocation) => void,
] {
  // The server has no `document.cookie`: it renders the comuna the page read
  // from the request (`ExploreLocationSeedProvider`), or none, and hydration
  // starts from the same value before the cookie takes over.
  const seed = useExploreLocationSeed();
  const location = useSyncExternalStore(
    subscribe,
    readExploreLocation,
    () => seed?.location ?? null,
  );

  const changeLocation = useCallback((next: ExploreLocation) => {
    setCookie(EXPLORE_LOCATION_COOKIE, encodeURIComponent(JSON.stringify(next)));
    listeners.forEach((listener) => listener());
  }, []);

  return [location, changeLocation];
}

/**
 * How far from the explored comuna the "near you" listings reach, in km. Kept
 * apart from the location so picking another comuna keeps the visitor's radius.
 */
export function useExploreRadius(): [ExploreRadiusKm, (km: ExploreRadiusKm) => void] {
  const seed = useExploreLocationSeed();
  const [raw, setRaw] = useCookieState(
    EXPLORE_RADIUS_COOKIE,
    String(DEFAULT_EXPLORE_RADIUS_KM),
    isExploreRadius,
    seed ? String(seed.radius) : undefined,
  );
  const setRadius = useCallback((km: ExploreRadiusKm) => setRaw(String(km)), [setRaw]);
  return [Number(raw) as ExploreRadiusKm, setRadius];
}
