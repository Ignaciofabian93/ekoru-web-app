/**
 * Turns a browser geolocation fix into an ISO 3166-1 alpha-2 country, offline.
 *
 * Reverse geocoding a coordinate properly needs border polygons or a call to a
 * third party — neither is worth it here, because the only thing this answer
 * feeds is the *language* a first-time visitor lands on (and their market, when
 * they are in one we serve). So instead of polygons we keep a table of
 * reference points and take the nearest: cheap, dependency-free, and it never
 * sends the visitor's coordinates anywhere.
 *
 * The list is deliberately dense along borders where the two sides disagree on
 * language or market (the 49th parallel, the Great Lakes, Quebec, the Rio
 * Grande) and thin where an approximate answer is enough. Countries whose
 * languages we don't serve are listed too: without them a visitor in Berlin
 * would match Brussels and be handed French.
 */

/** `[latitude, longitude, ISO country]` — a populated point inside the country. */
type ReferencePoint = readonly [number, number, string];

const REFERENCE_POINTS: readonly ReferencePoint[] = [
  // ── Canada ──────────────────────────────────────────────────────
  // Dense on purpose: along the border Canadian and US cities sit a few dozen
  // km apart, and Quebec is the one place in the Americas where the nearest
  // match decides `fr` over `en`.
  [49.28, -123.12, "CA"], // Vancouver
  [48.43, -123.37, "CA"], // Victoria
  [49.89, -119.5, "CA"], // Kelowna
  [51.05, -114.07, "CA"], // Calgary
  [53.55, -113.49, "CA"], // Edmonton
  [52.13, -106.67, "CA"], // Saskatoon
  [50.45, -104.62, "CA"], // Regina
  [49.9, -97.14, "CA"], // Winnipeg
  [48.38, -89.25, "CA"], // Thunder Bay
  [46.52, -84.33, "CA"], // Sault Ste. Marie
  [42.32, -83.04, "CA"], // Windsor
  [42.98, -81.25, "CA"], // London
  [43.65, -79.38, "CA"], // Toronto
  [43.09, -79.08, "CA"], // Niagara Falls
  [45.42, -75.7, "CA"], // Ottawa
  [45.5, -73.57, "CA"], // Montreal
  [45.4, -71.89, "CA"], // Sherbrooke
  [46.81, -71.21, "CA"], // Quebec City
  [48.45, -68.52, "CA"], // Rimouski
  [45.96, -66.64, "CA"], // Fredericton
  [44.65, -63.58, "CA"], // Halifax
  [47.56, -52.71, "CA"], // St. Johns
  [62.45, -114.37, "CA"], // Yellowknife
  [63.75, -68.52, "CA"], // Iqaluit

  // ── United States ───────────────────────────────────────────────
  [47.61, -122.33, "US"], // Seattle
  [45.52, -122.68, "US"], // Portland
  [47.66, -117.43, "US"], // Spokane
  [43.62, -116.2, "US"], // Boise
  [47.51, -111.3, "US"], // Great Falls
  [46.81, -100.78, "US"], // Bismarck
  [46.88, -96.79, "US"], // Fargo
  [46.79, -92.1, "US"], // Duluth
  [44.98, -93.27, "US"], // Minneapolis
  [46.55, -87.4, "US"], // Marquette
  [44.51, -88.02, "US"], // Green Bay
  [41.88, -87.63, "US"], // Chicago
  [42.33, -83.05, "US"], // Detroit
  [41.5, -81.69, "US"], // Cleveland
  [42.89, -78.88, "US"], // Buffalo
  [43.05, -76.15, "US"], // Syracuse
  [44.48, -73.21, "US"], // Burlington
  [43.66, -70.26, "US"], // Portland, ME
  [42.36, -71.06, "US"], // Boston
  [40.71, -74.01, "US"], // New York
  [38.9, -77.04, "US"], // Washington
  [35.23, -80.84, "US"], // Charlotte
  [33.75, -84.39, "US"], // Atlanta
  [25.76, -80.19, "US"], // Miami
  [29.95, -90.07, "US"], // New Orleans
  [29.76, -95.37, "US"], // Houston
  [29.42, -98.49, "US"], // San Antonio
  [31.77, -106.44, "US"], // El Paso
  [35.47, -97.52, "US"], // Oklahoma City
  [39.1, -94.58, "US"], // Kansas City
  [38.63, -90.2, "US"], // St. Louis
  [39.74, -104.99, "US"], // Denver
  [40.76, -111.89, "US"], // Salt Lake City
  [33.45, -112.07, "US"], // Phoenix
  [36.17, -115.14, "US"], // Las Vegas
  [34.05, -118.24, "US"], // Los Angeles
  [32.72, -117.16, "US"], // San Diego
  [37.77, -122.42, "US"], // San Francisco
  [61.22, -149.9, "US"], // Anchorage
  [21.31, -157.86, "US"], // Honolulu
  [18.47, -66.11, "US"], // San Juan, Puerto Rico

  // ── Mexico, Central America & the Caribbean ─────────────────────
  [32.51, -117.04, "MX"], // Tijuana
  [31.69, -106.42, "MX"], // Ciudad Juarez
  [29.07, -110.96, "MX"], // Hermosillo
  [27.51, -99.51, "MX"], // Nuevo Laredo
  [25.88, -97.5, "MX"], // Matamoros
  [25.69, -100.32, "MX"], // Monterrey
  [20.68, -103.35, "MX"], // Guadalajara
  [19.43, -99.13, "MX"], // Mexico City
  [16.75, -93.12, "MX"], // Tuxtla Gutierrez
  [20.97, -89.62, "MX"], // Merida
  [17.5, -88.2, "BZ"], // Belize City
  [14.63, -90.51, "GT"], // Guatemala City
  [13.69, -89.22, "SV"], // San Salvador
  [14.07, -87.19, "HN"], // Tegucigalpa
  [12.11, -86.24, "NI"], // Managua
  [9.93, -84.08, "CR"], // San Jose
  [8.98, -79.52, "PA"], // Panama City
  [23.11, -82.37, "CU"], // Havana
  [18.47, -69.9, "DO"], // Santo Domingo
  [18.59, -72.31, "HT"], // Port-au-Prince
  [17.97, -76.79, "JM"], // Kingston
  [25.05, -77.35, "BS"], // Nassau
  [10.65, -61.51, "TT"], // Port of Spain
  [16.27, -61.55, "FR"], // Guadeloupe (overseas departement)

  // ── South America ───────────────────────────────────────────────
  [10.49, -66.9, "VE"], // Caracas
  [4.71, -74.07, "CO"], // Bogota
  [6.24, -75.58, "CO"], // Medellin
  [-0.18, -78.47, "EC"], // Quito
  [-2.19, -79.89, "EC"], // Guayaquil
  [-12.05, -77.04, "PE"], // Lima
  [-16.41, -71.54, "PE"], // Arequipa
  [-16.5, -68.15, "BO"], // La Paz
  [-17.78, -63.18, "BO"], // Santa Cruz
  [-25.28, -57.64, "PY"], // Asuncion
  [-34.9, -56.16, "UY"], // Montevideo
  [-34.6, -58.38, "AR"], // Buenos Aires
  [-32.89, -68.84, "AR"], // Mendoza
  [-31.42, -64.19, "AR"], // Cordoba
  [-24.79, -65.41, "AR"], // Salta
  [-38.95, -68.06, "AR"], // Neuquen
  [-45.86, -67.5, "AR"], // Comodoro Rivadavia
  [-54.8, -68.3, "AR"], // Ushuaia
  [-18.48, -70.31, "CL"], // Arica
  [-23.65, -70.4, "CL"], // Antofagasta
  [-29.9, -71.25, "CL"], // La Serena
  [-33.45, -70.67, "CL"], // Santiago
  [-36.83, -73.05, "CL"], // Concepcion
  [-38.74, -72.6, "CL"], // Temuco
  [-41.47, -72.94, "CL"], // Puerto Montt
  [-45.57, -72.07, "CL"], // Coyhaique
  [-53.16, -70.91, "CL"], // Punta Arenas
  [-23.55, -46.63, "BR"], // Sao Paulo
  [-22.91, -43.17, "BR"], // Rio de Janeiro
  [-15.79, -47.88, "BR"], // Brasilia
  [-30.03, -51.23, "BR"], // Porto Alegre
  [-3.12, -60.02, "BR"], // Manaus
  [-8.05, -34.88, "BR"], // Recife
  [6.8, -58.16, "GY"], // Georgetown
  [5.85, -55.2, "SR"], // Paramaribo
  [4.92, -52.33, "FR"], // Cayenne (overseas departement)

  // ── Western & Southern Europe ───────────────────────────────────
  [40.42, -3.7, "ES"], // Madrid
  [41.39, 2.17, "ES"], // Barcelona
  [37.39, -5.98, "ES"], // Seville
  [43.26, -2.93, "ES"], // Bilbao
  [39.57, 2.65, "ES"], // Palma
  [28.12, -15.44, "ES"], // Las Palmas
  [38.72, -9.14, "PT"], // Lisbon
  [41.15, -8.61, "PT"], // Porto
  [42.51, 1.52, "AD"], // Andorra la Vella
  [48.86, 2.35, "FR"], // Paris
  [45.76, 4.84, "FR"], // Lyon
  [43.3, 5.37, "FR"], // Marseille
  [43.6, 1.44, "FR"], // Toulouse
  [44.84, -0.58, "FR"], // Bordeaux
  [48.11, -1.68, "FR"], // Rennes
  [50.63, 3.06, "FR"], // Lille
  [48.57, 7.75, "FR"], // Strasbourg
  [43.7, 7.27, "FR"], // Nice
  [41.93, 8.74, "FR"], // Ajaccio
  [43.73, 7.42, "MC"], // Monaco
  [50.85, 4.35, "BE"], // Brussels
  [51.22, 4.4, "BE"], // Antwerp
  [50.63, 5.57, "BE"], // Liege
  [49.61, 6.13, "LU"], // Luxembourg
  [46.2, 6.14, "CH"], // Geneva
  [46.95, 7.45, "CH"], // Bern
  [47.38, 8.54, "CH"], // Zurich
  [51.51, -0.13, "GB"], // London
  [53.48, -2.24, "GB"], // Manchester
  [55.95, -3.19, "GB"], // Edinburgh
  [54.6, -5.93, "GB"], // Belfast
  [51.48, -3.18, "GB"], // Cardiff
  [53.35, -6.26, "IE"], // Dublin
  [51.9, -8.47, "IE"], // Cork
  [52.37, 4.9, "NL"], // Amsterdam
  [52.52, 13.4, "DE"], // Berlin
  [50.94, 6.96, "DE"], // Cologne
  [48.14, 11.58, "DE"], // Munich
  [53.55, 9.99, "DE"], // Hamburg
  [48.21, 16.37, "AT"], // Vienna
  [45.46, 9.19, "IT"], // Milan
  [41.9, 12.5, "IT"], // Rome
  [40.85, 14.27, "IT"], // Naples
  [38.12, 13.36, "IT"], // Palermo
  [37.98, 23.73, "GR"], // Athens
  [64.15, -21.94, "IS"], // Reykjavik

  // ── Northern, Central & Eastern Europe ──────────────────────────
  [55.68, 12.57, "DK"], // Copenhagen
  [59.91, 10.75, "NO"], // Oslo
  [59.33, 18.07, "SE"], // Stockholm
  [60.17, 24.94, "FI"], // Helsinki
  [52.23, 21.01, "PL"], // Warsaw
  [50.08, 14.44, "CZ"], // Prague
  [47.5, 19.04, "HU"], // Budapest
  [44.43, 26.1, "RO"], // Bucharest
  [44.82, 20.46, "RS"], // Belgrade
  [50.45, 30.52, "UA"], // Kyiv
  [55.76, 37.62, "RU"], // Moscow
  [41.01, 28.98, "TR"], // Istanbul

  // ── Africa ──────────────────────────────────────────────────────
  [33.57, -7.59, "MA"], // Casablanca
  [36.75, 3.06, "DZ"], // Algiers
  [36.81, 10.18, "TN"], // Tunis
  [30.04, 31.24, "EG"], // Cairo
  [14.72, -17.47, "SN"], // Dakar
  [9.64, -13.58, "GN"], // Conakry
  [12.64, -8.0, "ML"], // Bamako
  [12.37, -1.53, "BF"], // Ouagadougou
  [13.51, 2.11, "NE"], // Niamey
  [5.36, -4.01, "CI"], // Abidjan
  [5.6, -0.19, "GH"], // Accra
  [6.17, 1.23, "TG"], // Lome
  [6.37, 2.42, "BJ"], // Cotonou
  [6.52, 3.38, "NG"], // Lagos
  [3.85, 11.5, "CM"], // Yaounde
  [0.42, 9.45, "GA"], // Libreville
  [-4.27, 15.28, "CG"], // Brazzaville
  [-4.44, 15.27, "CD"], // Kinshasa
  [-8.84, 13.23, "AO"], // Luanda
  [-1.29, 36.82, "KE"], // Nairobi
  [0.35, 32.58, "UG"], // Kampala
  [-6.79, 39.21, "TZ"], // Dar es Salaam
  [9.03, 38.74, "ET"], // Addis Ababa
  [-17.83, 31.05, "ZW"], // Harare
  [-25.97, 32.57, "MZ"], // Maputo
  [-26.2, 28.05, "ZA"], // Johannesburg
  [-33.92, 18.42, "ZA"], // Cape Town
  [-18.88, 47.51, "MG"], // Antananarivo
  [-20.16, 57.5, "MU"], // Port Louis
  [-20.88, 55.45, "FR"], // Reunion (overseas departement)

  // ── Asia & Oceania ──────────────────────────────────────────────
  [25.2, 55.27, "AE"], // Dubai
  [24.71, 46.68, "SA"], // Riyadh
  [32.09, 34.78, "IL"], // Tel Aviv
  [35.69, 51.39, "IR"], // Tehran
  [24.86, 67.01, "PK"], // Karachi
  [28.61, 77.21, "IN"], // Delhi
  [19.08, 72.88, "IN"], // Mumbai
  [12.97, 77.59, "IN"], // Bangalore
  [23.81, 90.41, "BD"], // Dhaka
  [6.93, 79.86, "LK"], // Colombo
  [13.76, 100.5, "TH"], // Bangkok
  [3.14, 101.69, "MY"], // Kuala Lumpur
  [1.35, 103.82, "SG"], // Singapore
  [-6.21, 106.85, "ID"], // Jakarta
  [14.6, 120.98, "PH"], // Manila
  [22.32, 114.17, "HK"], // Hong Kong
  [31.23, 121.47, "CN"], // Shanghai
  [39.9, 116.41, "CN"], // Beijing
  [37.57, 126.98, "KR"], // Seoul
  [35.68, 139.65, "JP"], // Tokyo
  [-31.95, 115.86, "AU"], // Perth
  [-34.93, 138.6, "AU"], // Adelaide
  [-37.81, 144.96, "AU"], // Melbourne
  [-33.87, 151.21, "AU"], // Sydney
  [-27.47, 153.03, "AU"], // Brisbane
  [-36.85, 174.76, "NZ"], // Auckland
  [-41.29, 174.78, "NZ"], // Wellington
];

const EARTH_RADIUS_KM = 6371;

/**
 * Past this, "nearest" stops meaning anything — the visitor is mid-ocean, in
 * Antarctica, or somewhere the table doesn't reach. Wide enough that a fix in
 * the Canadian Arctic still resolves, tight enough that one in Central Asia
 * isn't handed the language of a country thousands of km away.
 */
const MAX_MATCH_KM = 2500;

const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;

/** Great-circle distance between two coordinates, in kilometres. */
function distanceKm(latA: number, lngA: number, latB: number, lngB: number): number {
  const dLat = toRadians(latB - latA);
  const dLng = toRadians(lngB - lngA);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(latA)) * Math.cos(toRadians(latB)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(a)));
}

/**
 * The country a coordinate most likely sits in, or `null` when no reference
 * point is close enough to be a credible answer — callers fall back to their
 * own default rather than acting on a guess.
 */
export function getCountryFromCoordinates(
  latitude: number,
  longitude: number,
): string | null {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;

  let nearest: string | null = null;
  let nearestKm = Infinity;

  for (const [lat, lng, country] of REFERENCE_POINTS) {
    const km = distanceKm(latitude, longitude, lat, lng);
    if (km < nearestKm) {
      nearestKm = km;
      nearest = country;
    }
  }

  return nearestKm <= MAX_MATCH_KM ? nearest : null;
}
