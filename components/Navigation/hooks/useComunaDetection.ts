"use client";

import { useCallback, useEffect, useState } from "react";
import { readExploreLocation, useExploreLocation } from "@/hooks/useExploreLocation";

/**
 * Where an explicit "use my location" request stands. Background detection
 * never reports here: it is invisible unless it succeeds.
 */
export type ComunaDetectionStatus =
  | "idle"
  | "locating"
  | "detected"
  | "denied"
  | "unsupported"
  | "error";

type Outcome =
  | { county: string; latitude: number; longitude: number }
  | { error: Exclude<ComunaDetectionStatus, "idle" | "locating" | "detected"> };

/**
 * Same two budgets as `features/recycle/hooks/useUserLocation`: the timeout
 * keeps running while the permission prompt waits for an answer, so a likely
 * prompt gets a minute, an already-granted lookup gets fifteen seconds.
 */
const PROMPT_TIMEOUT_MS = 60000;
const GRANTED_TIMEOUT_MS = 15000;

/** A comuna is kilometres wide: the coarse wifi/IP fix is plenty, and faster. */
const GEO_OPTIONS: Omit<PositionOptions, "timeout"> = {
  enableHighAccuracy: false,
  maximumAge: 10 * 60 * 1000,
};

const GEOCODE_TIMEOUT_MS = 10000;

/**
 * OpenStreetMap's reverse geocoder, for the comuna's name. Our location API
 * has no point → comuna lookup, so the name comes from OSM, which the recycle
 * map already relies on (Overpass); the coordinates themselves are what the
 * "near you" listings search from. `zoom=10` asks for the city-level feature,
 * which in Chile is the comuna boundary.
 */
const NOMINATIM_REVERSE_URL = "https://nominatim.openstreetmap.org/reverse";

type NominatimReverse = {
  name?: string;
  address?: Partial<Record<"city" | "town" | "village" | "municipality", string>>;
};

async function reverseGeocodeComuna(
  lat: number,
  lng: number,
  language: string,
): Promise<string | null> {
  const params = new URLSearchParams({
    format: "jsonv2",
    lat: String(lat),
    lon: String(lng),
    zoom: "10",
    addressdetails: "1",
    "accept-language": language,
  });
  const res = await fetch(`${NOMINATIM_REVERSE_URL}?${params}`, {
    signal: AbortSignal.timeout(GEOCODE_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} from Nominatim`);
  const { name, address = {} } = (await res.json()) as NominatimReverse;
  return (
    name ||
    address.city ||
    address.town ||
    address.village ||
    address.municipality ||
    null
  );
}

/** Unknown (no Permissions API) is treated as a likely prompt — see the budgets. */
async function isGranted(): Promise<boolean> {
  try {
    const status = await navigator.permissions.query({ name: "geolocation" });
    return status.state === "granted";
  } catch {
    return false;
  }
}

function getPosition(timeout: number): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      ...GEO_OPTIONS,
      timeout,
    }),
  );
}

/** Asks the browser for a fix (prompting if needed) and names its comuna. */
async function locateComuna(language: string): Promise<Outcome> {
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    return { error: "unsupported" };
  }
  try {
    const timeout = (await isGranted()) ? GRANTED_TIMEOUT_MS : PROMPT_TIMEOUT_MS;
    const { coords } = await getPosition(timeout);
    const { latitude, longitude } = coords;
    const county = await reverseGeocodeComuna(latitude, longitude, language);
    return county ? { county, latitude, longitude } : { error: "error" };
  } catch (err) {
    const denied =
      typeof GeolocationPositionError !== "undefined" &&
      err instanceof GeolocationPositionError &&
      err.code === err.PERMISSION_DENIED;
    return { error: denied ? "denied" : "error" };
  }
}

/**
 * The lookup in flight, shared by every mounted instance: the header picker
 * and the home page's "near you" prompt both detect, and a click in one while
 * the other is locating should wait on that run, not start a second one.
 */
let pending: Promise<Outcome> | null = null;

function run(language: string): Promise<Outcome> {
  pending ??= locateComuna(language).finally(() => {
    pending = null;
  });
  return pending;
}

/**
 * Fills in the visitor's comuna (and position) from their location.
 *
 * - **In the background**, whenever the geolocation permission is (or becomes)
 *   granted and no comuna is stored yet. It never prompts, never overrides a
 *   stored comuna and stays silent when it fails. Only one instance on the
 *   page should do this; others pass `{ background: false }`.
 * - **On request** (`detect`), which may show the browser's permission prompt,
 *   replaces whatever is stored and reports progress through `status`.
 */
export function useComunaDetection(
  language: string,
  { background = true }: { background?: boolean } = {},
) {
  const [, setLocation] = useExploreLocation();
  const [status, setStatus] = useState<ComunaDetectionStatus>("idle");

  const detect = useCallback(async () => {
    setStatus("locating");
    const outcome = await run(language);
    if ("county" in outcome) {
      setLocation({ ...outcome, source: "geolocation" });
      setStatus("detected");
    } else {
      setStatus(outcome.error);
    }
  }, [language, setLocation]);

  const detectInBackground = useCallback(async () => {
    if (readExploreLocation()) return;
    const outcome = await run(language);
    // Re-checked: a comuna may have been picked while the lookup ran.
    if ("county" in outcome && !readExploreLocation()) {
      setLocation({ ...outcome, source: "geolocation" });
    }
  }, [language, setLocation]);

  useEffect(() => {
    if (!background) return;
    if (typeof navigator === "undefined" || !navigator.permissions) return;
    let cancelled = false;
    let permission: PermissionStatus | null = null;
    // Covers the permission being granted elsewhere on the page, e.g. the
    // first-visit language detection prompt.
    const onChange = () => {
      if (permission?.state === "granted") void detectInBackground();
    };

    navigator.permissions
      .query({ name: "geolocation" })
      .then((result) => {
        if (cancelled) return;
        permission = result;
        result.addEventListener("change", onChange);
        if (result.state === "granted") void detectInBackground();
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      permission?.removeEventListener("change", onChange);
    };
  }, [background, detectInBackground]);

  return { status, detect };
}
