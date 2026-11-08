"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export const CATEGORY_PARAM = "category";

/**
 * The category filter of the browse pages (stores, services, community, blog),
 * kept in `?category=<slug>` so a filtered view can be shared or reloaded.
 *
 * Changes go through the history API, which Next's router picks up:
 * `useSearchParams` re-renders without a server round trip, so switching
 * categories neither refetches the page nor flashes its loading skeleton.
 *
 * Needs a <Suspense> boundary above it, since the [lang] pages are statically
 * rendered.
 */
export function useCategoryParam() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const category = searchParams.get(CATEGORY_PARAM) || null;

  const setCategory = useCallback(
    (slug: string | null) => {
      const params = new URLSearchParams(window.location.search);
      if (slug) params.set(CATEGORY_PARAM, slug);
      else params.delete(CATEGORY_PARAM);
      const query = params.toString();
      window.history.replaceState(null, "", query ? `${pathname}?${query}` : pathname);
    },
    [pathname],
  );

  return { category, setCategory };
}
