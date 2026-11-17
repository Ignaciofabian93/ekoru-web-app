// OSM `recycling:*` keys we surface as material tags. Labels live in the
// feature dictionary under `materials.*` so they localize per language.
export const MATERIAL_KEYS = [
  "glass",
  "paper",
  "cardboard",
  "plastic",
  "plastic_bottles",
  "cans",
  "aluminium",
  "metal",
  "clothes",
  "batteries",
  "electronics",
  "organic",
  "wood",
] as const;

/**
 * The distances a visitor can pick on the map, smallest first. The server
 * always loads out to the widest one and the page filters down, so switching
 * between them never waits on the network.
 */
export const RADIUS_OPTIONS_METERS = [1000, 2000, 5000, 10000] as const;

export type RadiusMeters = (typeof RADIUS_OPTIONS_METERS)[number];

export const DEFAULT_RADIUS_METERS: RadiusMeters = 5000;

export const MAX_RADIUS_METERS: RadiusMeters =
  RADIUS_OPTIONS_METERS[RADIUS_OPTIONS_METERS.length - 1];

/**
 * The most points the server sends, nearest first. Central Santiago has about
 * 60 within 5 km, so this leaves room for the widest radius in a dense city
 * without burying the map.
 */
export const MAX_POINTS = 500;
