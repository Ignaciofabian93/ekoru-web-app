"use client";

import { useEffect, useState } from "react";
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
export function useCountry(): [string, (code: string) => void] {
  const [country, setCountry] = useState<string>(DEFAULT_COUNTRY);

  useEffect(() => {
    const saved = getCookie(COUNTRY_COOKIE);
    if (saved && hasCountry(saved)) setCountry(saved);
  }, []);

  const changeCountry = (code: string) => {
    if (code === country || !hasCountry(code)) return;
    setCookie(COUNTRY_COOKIE, code);
    setCountry(code);
  };

  return [country, changeCountry];
}
