import "server-only";
import { cookies } from "next/headers";
import { EXPLORE_LOCATION_COOKIE, EXPLORE_RADIUS_COOKIE } from "@/constants/settings";
import type { ExploreLocationSeed } from "@/context/ExploreLocationContext";
import { parseExploreLocation, parseExploreRadius } from "@/utils/exploreLocation";

/**
 * The visitor's explore comuna and radius, from this request's cookies.
 *
 * Reading cookies renders the home page per request instead of at build time.
 * That is the point: a returning visitor's "near you" rails (and the header's
 * "Exploring in" pill) come in the first HTML, where the static page could
 * only reserve room for the location prompt and then grow by a screen or two
 * once the cookie was read after hydration.
 */
export async function getExploreLocationSeed(): Promise<ExploreLocationSeed> {
  const store = await cookies();
  return {
    location: parseExploreLocation(store.get(EXPLORE_LOCATION_COOKIE)?.value),
    radius: parseExploreRadius(store.get(EXPLORE_RADIUS_COOKIE)?.value),
  };
}
