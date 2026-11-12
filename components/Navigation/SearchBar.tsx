"use client";
import clsx from "clsx";
import { Search } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useId, useState } from "react";
import { DEFAULT_LANGUAGE, hasLocale } from "@/constants/settings";
import { useTranslation } from "@/i18n/context";
import { NAMESPACE } from "./i18n";

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
    <form
      role="search"
      aria-label={label}
      onSubmit={handleSubmit}
      className={clsx("bg-transparent", className)}
    >
      <div className="flex h-10 flex-row">
        <div
          className={clsx(
            "flex min-w-0 flex-1 flex-row items-center rounded-l-md border-2 border-r-0 bg-white",
            "border-primary-dark/10 transition-colors duration-200 focus-within:border-primary",
          )}
        >
          <Search
            size={20}
            className="ml-3 shrink-0 text-input-placeholder"
            strokeWidth={2}
            aria-hidden
          />
          <input
            id={inputId}
            type="search"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder ?? t("search.placeholder")}
            aria-label={label}
            className={clsx(
              "h-full min-w-0 flex-1 px-2 text-base bg-white border-none outline-none",
              "text-foreground placeholder:text-input-placeholder placeholder:italic",
            )}
          />
        </div>
        <button
          type="submit"
          className={clsx(
            "h-full shrink-0 cursor-pointer rounded-r-md px-5",
            "bg-linear-90 from-primary-dark via-primary to-primary-light",
            "font-sans text-sm font-semibold text-on-primary",
            "hover:brightness-110",
            "transition-all duration-200 ease-in-out",
          )}
        >
          {t("search.submit")}
        </button>
      </div>
    </form>
  );
}
