"use client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import SearchBar from "@/components/SearchBar/SearchBar";
import { DEFAULT_LANGUAGE, hasLocale } from "@/constants/settings";

/**
 * The header search box. On submit it navigates to `/{lang}/search?q=...`,
 * where the results page runs the federated query scoped to the user's locale
 * (URL) and country (cookie, via useCountry). Locale is read from the route so
 * the bar works on every page without prop drilling.
 */
export function NavSearchBar({ placeholder }: { placeholder?: string }) {
  const router = useRouter();
  const params = useParams();
  const [value, setValue] = useState("");

  const raw = Array.isArray(params?.lang) ? params.lang[0] : params?.lang;
  const lang = raw && hasLocale(raw) ? raw : DEFAULT_LANGUAGE;

  const submit = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    router.push(`/${lang}/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <SearchBar
      value={value}
      onChange={setValue}
      onSubmit={submit}
      placeholder={placeholder}
    />
  );
}
