"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { ExploreRadiusKm } from "@/constants/settings";
import type { ExploreLocation } from "@/utils/exploreLocation";

/** The explore cookies as the server read them for this request. */
export interface ExploreLocationSeed {
  location: ExploreLocation | null;
  radius: ExploreRadiusKm;
}

const ExploreLocationSeedContext = createContext<ExploreLocationSeed | null>(null);

/**
 * Hands the explore cookies the server read to `useExploreLocation` and
 * `useExploreRadius`, which render from them on the server and while
 * hydrating. A page that reads the cookies (the home page) then paints the
 * visitor's own comuna and radius in its first HTML, instead of a placeholder
 * that grows into them after hydration and pushes the page down.
 *
 * Without it the hooks render the "no comuna yet" state until hydration, as
 * every statically generated page must.
 */
export function ExploreLocationSeedProvider({
  seed,
  children,
}: {
  seed: ExploreLocationSeed;
  children: ReactNode;
}) {
  return (
    <ExploreLocationSeedContext.Provider value={seed}>
      {children}
    </ExploreLocationSeedContext.Provider>
  );
}

export function useExploreLocationSeed() {
  return useContext(ExploreLocationSeedContext);
}
