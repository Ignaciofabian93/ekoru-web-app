import {
  DEFAULT_EXPLORE_RADIUS_KM,
  EXPLORE_RADIUS_OPTIONS_KM,
  type ExploreRadiusKm,
} from "@/constants/settings";

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

const finite = (value: unknown) =>
  typeof value === "number" && Number.isFinite(value) ? value : undefined;

/**
 * The location cookie's (already URL-decoded) value, or null when it is
 * missing, malformed or tampered with. Shared by the client hook and the
 * server, which reads the same cookie to render the visitor's comuna.
 */
export function parseExploreLocation(
  raw: string | null | undefined,
): ExploreLocation | null {
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

/** Whether a radius cookie value is one of the offered radii. */
export const isExploreRadius = (value: string) =>
  (EXPLORE_RADIUS_OPTIONS_KM as readonly number[]).includes(Number(value));

/** The radius cookie's value, or the default when it is missing or invalid. */
export function parseExploreRadius(raw: string | null | undefined): ExploreRadiusKm {
  return raw && isExploreRadius(raw)
    ? (Number(raw) as ExploreRadiusKm)
    : DEFAULT_EXPLORE_RADIUS_KM;
}
