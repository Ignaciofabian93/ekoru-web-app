"use client";

import clsx from "clsx";
import { Search } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useId, useState } from "react";
import { DEFAULT_LANGUAGE, hasLocale } from "@/constants/settings";
import { useTranslation } from "@/i18n/context";
import { NAMESPACE } from "./i18n";

/**
 * The navigation search bar: owns the query state and routes to /search.
 * The plain search *field* used inside filter forms lives in
 * `components/Primitives/Inputs` as `SearchInput`.
 */
export function SearchBar({
  placeholder,
  className,
}: {
  placeholder?: string;
  className?: string;
}) {
  const router = useRouter();
  const params = useParams();
  const [value, setValue] = useState("");
  const inputId = useId();
  const { t } = useTranslation(NAMESPACE);

  const raw = Array.isArray(params?.lang) ? params.lang[0] : params?.lang;
  const lang = raw && hasLocale(raw) ? raw : DEFAULT_LANGUAGE;

  const label = t("a11y.searchLabel");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    router.push(`/${lang}/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    // Naming the search landmark keeps it distinguishable when a page renders
    // more than one (e.g. the header bar plus an in-page filter).
    <form
      role="search"
      aria-label={label}
      onSubmit={handleSubmit}
      className={clsx("bg-transparent pt-1 pb-3", className)}
    >
      <div
        className={clsx(
          "flex flex-row items-center bg-surface rounded-md px-3 h-10 gap-2",
          "focus-within:ring-2 focus-within:ring-white/80",
        )}
      >
        <button
          type="submit"
          aria-label={t("a11y.searchSubmit")}
          className={clsx(
            "flex shrink-0 cursor-pointer items-center justify-center border-none bg-transparent p-0",
            "rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-primary",
          )}
        >
          <Search size={20} className="text-input-placeholder" strokeWidth={2} aria-hidden />
        </button>
        <input
          id={inputId}
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder ?? t("search.placeholder")}
          aria-label={label}
          className={clsx(
            "flex-1 text-base bg-transparent border-none outline-none p-0",
            "text-foreground placeholder:text-input-placeholder",
          )}
        />
      </div>
    </form>
  );
}
