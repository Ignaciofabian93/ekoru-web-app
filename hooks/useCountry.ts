"use client";

import { useCallback, useSyncExternalStore } from "react";
import { COUNTRY_COOKIE, DEFAULT_COUNTRY, hasCountry } from "@/constants/settings";
import { getCookie, setCookie } from "@/utils/cookies";

/**
 * Guest country selection (ISO code), persisted in a cookie. The value is passed
 * as the `country` arg on the federated `search` query so logged-out users get
 * results scoped to their market. Authenticated users are scoped by their
 * account country instead, so the search subgraph ignores this for them.
 *
 * Sent as a GraphQL arg (not a header/cookie-forward) so the mobile app, which
 * calls the gateway directly, uses the exact same mechanism.
 */

const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): string {
  const saved = getCookie(COUNTRY_COOKIE);
  return saved && hasCountry(saved) ? saved : DEFAULT_COUNTRY;
}

// SSR renders the default; the cookie value takes over after hydration.
function getServerSnapshot(): string {
  return DEFAULT_COUNTRY;
}

export function useCountry(): [string, (code: string) => void] {
  const country = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const changeCountry = useCallback((code: string) => {
    if (!hasCountry(code) || code === getSnapshot()) return;
    setCookie(COUNTRY_COOKIE, code);
    listeners.forEach((listener) => listener());
  }, []);

  return [country, changeCountry];
}
