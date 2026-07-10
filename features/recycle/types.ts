// A recycling drop-off point sourced from OpenStreetMap (Overpass API),
// mirroring the shape used by the mobile app's RecycleMapScreen.
export type RecyclePoint = {
  id: number;
  lat: number;
  lon: number;
  name?: string;
  operator?: string;
  openingHours?: string;
  /** OSM `recycling:*` material keys accepted at this point. */
  materials: string[];
};

export type Coordinates = {
  lat: number;
  lng: number;
};

export type LocationStatus = "loading" | "denied" | "error" | "ready";
