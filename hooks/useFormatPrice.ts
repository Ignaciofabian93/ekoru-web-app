"use client";

import { useCallback } from "react";
import {
  CURRENCY_BY_COUNTRY,
  DEFAULT_CURRENCY,
  hasCountry,
} from "@/constants/settings";
import { useCountry } from "@/hooks/useCountry";
import { useLanguage } from "@/hooks/useLanguage";
import { formatPrice } from "@/utils/formatPrice";

/**
 * Price formatter bound to the visitor's locale and market: the `[lang]` route
 * segment plus the country cookie form the formatting locale (es-CL, fr-CA, …),
 * and the country picks the currency (CL→CLP, CA→CAD). Pass `currency` for
 * amounts that carry their own currency (e.g. cart lines), which keeps the
 * locale's separators/symbol placement but overrides the currency.
 */
export function useFormatPrice(): (price: number, currency?: string) => string {
  const [language] = useLanguage();
  const [country] = useCountry();

  return useCallback(
    (price: number, currency?: string) => {
      const marketCurrency = hasCountry(country)
        ? CURRENCY_BY_COUNTRY[country]
        : DEFAULT_CURRENCY;
      return formatPrice(price, currency ?? marketCurrency, `${language}-${country}`);
    },
    [language, country],
  );
}
