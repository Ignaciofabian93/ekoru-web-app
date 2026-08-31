"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { DEFAULT_LANGUAGE, LANGUAGE_COOKIE } from "@/constants/settings";
import { getLanguagesForCountry } from "@/constants/language-data";
import { getCountryFromCoordinates } from "@/constants/country-locations";
import { useCountry } from "@/hooks/useCountry";
import { getCookie, setCookie } from "@/utils/cookies";

/**
 * `getCurrentPosition`'s timeout starts ticking while the browser's permission
 * prompt is still on screen, so the budget has to cover a person noticing the
 * prompt and answering it — not just the lookup. Mirrors the reasoning in
 * `features/recycle/hooks/useUserLocation`.
 */
const PROMPT_TIMEOUT_MS = 60000;

/**
 * Street-level accuracy buys nothing when the answer is a country, and the
 * coarse wifi/IP fix comes back far faster. A day-old fix is just as good.
 */
const GEO_OPTIONS: PositionOptions = {
  enableHighAccuracy: false,
  maximumAge: 24 * 60 * 60 * 1000,
  timeout: PROMPT_TIMEOUT_MS,
};

/** The best supported language for a country, honouring the browser's order. */
function preferredLanguageFor(country: string): string {
  const allowed = getLanguagesForCountry(country) as readonly string[];
  const preferred = (navigator.languages ?? [navigator.language ?? ""])
    .map((tag) => tag.split("-")[0]?.toLowerCase())
    .find((code) => code && allowed.includes(code));

  return preferred ?? allowed[0] ?? DEFAULT_LANGUAGE;
}

/**
 * Picks the language for a first-time visitor from where they actually are.
 *
 * Runs once per visitor: it asks for the geolocation permission, resolves the
 * fix to a country and switches to that country's language (also seeding the
 * market cookie when we serve that country). Denied, dismissed, unsupported or
 * unresolvable all land on {@link DEFAULT_LANGUAGE}.
 *
 * Both outcomes write the language cookie, which is also what an explicit pick
 * in the LanguageSwitcher writes — so the prompt never appears twice, and a
 * visitor who has chosen a language is never overridden.
 */
export function useLocaleDetection(): void {
  const router = useRouter();
  const pathname = usePathname();
  const [, changeCountry] = useCountry();

  useEffect(() => {
    if (getCookie(LANGUAGE_COOKIE)) return;

    let cancelled = false;

    const apply = (language: string, country?: string | null) => {
      if (cancelled) return;
      // No-ops for countries outside the served markets, which keep the default.
      if (country) changeCountry(country);
      setCookie(LANGUAGE_COOKIE, language);

      const segments = pathname.split("/");
      if (segments[1] === language) return;
      segments[1] = language; // swap the leading `/[lang]` segment
      router.replace(`${segments.join("/")}${window.location.search}`);
    };

    if (typeof navigator === "undefined" || !navigator.geolocation) {
      apply(DEFAULT_LANGUAGE);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const country = getCountryFromCoordinates(coords.latitude, coords.longitude);
        if (!country) {
          apply(DEFAULT_LANGUAGE);
          return;
        }
        apply(preferredLanguageFor(country), country);
      },
      // Denied, position unavailable or timed out — all the same answer.
      () => apply(DEFAULT_LANGUAGE),
      GEO_OPTIONS,
    );

    return () => {
      cancelled = true;
    };
  }, [pathname, router, changeCountry]);
}
