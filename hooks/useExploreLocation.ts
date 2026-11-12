"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  DEFAULT_EXPLORE_RADIUS_KM,
  EXPLORE_LOCATION_COOKIE,
  EXPLORE_RADIUS_COOKIE,
  EXPLORE_RADIUS_OPTIONS_KM,
  type ExploreRadiusKm,
} from "@/constants/settings";
import { useCookieState } from "@/hooks/useCookieState";
import { getCookie, setCookie } from "@/utils/cookies";

/**
 * The comuna the visitor is exploring, shown in the header's "Exploring in"
 * picker and persisted in a cookie.
 *
 * `countyId` is only known when the comuna was picked from the backend's
 * region → city → comuna cascade: a geolocated comuna comes from a reverse
 * geocoder that knows names, not our ids. It carries the visitor's position
 * instead, which the backend's `countiesNear` takes as an origin just as well.
 */
export type ExploreLocation = {
  /** Comuna name, as shown in the header. */
  county: string;
  countyId?: number;
  /** The visitor's position, when the comuna came from geolocation. */
  latitude?: number;
  longitude?: number;
  /** How it was set — a detected comuna never overrides one picked by hand. */
  source: "geolocation" | "manual";
};

const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const finite = (value: unknown) =>
  typeof value === "number" && Number.isFinite(value) ? value : undefined;

function parse(raw: string | null): ExploreLocation | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<ExploreLocation>;
    if (typeof value.county !== "string" || !value.county) return null;
    const latitude = finite(value.latitude);
    const longitude = finite(value.longitude);
    const hasPoint = latitude !== undefined && longitude !== undefined;
    return {
      county: value.county,
      countyId: finite(value.countyId),
      latitude: hasPoint ? latitude : undefined,
      longitude: hasPoint ? longitude : undefined,
      source: value.source === "manual" ? "manual" : "geolocation",
    };
  } catch {
    return null;
  }
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
    cachedValue = parse(raw);
  }
  return cachedValue;
}

// SSR renders the "choose a comuna" state; the cookie takes over after hydration.
function getServerSnapshot(): ExploreLocation | null {
  return null;
}

export function useExploreLocation(): [
  ExploreLocation | null,
  (location: ExploreLocation) => void,
] {
  const location = useSyncExternalStore(
    subscribe,
    readExploreLocation,
    getServerSnapshot,
  );

  const changeLocation = useCallback((next: ExploreLocation) => {
    setCookie(EXPLORE_LOCATION_COOKIE, encodeURIComponent(JSON.stringify(next)));
    listeners.forEach((listener) => listener());
  }, []);

  return [location, changeLocation];
}

const isRadiusOption = (value: string) =>
  (EXPLORE_RADIUS_OPTIONS_KM as readonly number[]).includes(Number(value));

/**
 * How far from the explored comuna the "near you" listings reach, in km. Kept
 * apart from the location so picking another comuna keeps the visitor's radius.
 */
export function useExploreRadius(): [ExploreRadiusKm, (km: ExploreRadiusKm) => void] {
  const [raw, setRaw] = useCookieState(
    EXPLORE_RADIUS_COOKIE,
    String(DEFAULT_EXPLORE_RADIUS_KM),
    isRadiusOption,
  );
  const setRadius = useCallback((km: ExploreRadiusKm) => setRaw(String(km)), [setRaw]);
  return [Number(raw) as ExploreRadiusKm, setRadius];
}
