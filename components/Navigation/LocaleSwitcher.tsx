"use client";
import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";
import { COUNTRIES_AVAILABLE, LANGUAGES_AVAILABLE } from "@/constants/settings";
import { getLanguagesForCountry } from "@/constants/language-data";
import { useCountry } from "@/hooks/useCountry";
import { useLanguage } from "@/hooks/useLanguage";
import { useTranslation } from "@/i18n/context";
import { NAMESPACE } from "./i18n";
import { Select } from "@/components/Primitives/Select";
import { FlagIcon } from "../Primitives/Flag";
import { Text } from "@/components/Primitives/Text";

/**
 * Combined country + language control. The trigger shows the selected country's
 * flag next to the active language. Opening it reveals two selects: country is
 * always editable; language only unlocks when the chosen country offers more
 * than one supported language (otherwise it's fixed and shown disabled).
 * Changing country keeps the language consistent with the new location.
 */
export default function LocaleSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const hintId = useId();
  const [country, changeCountry] = useCountry();
  const [language, changeLanguage] = useLanguage();
  const { t } = useTranslation(NAMESPACE);

  const close = () => setIsOpen(false);

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  // Escape closes the popover and returns focus to the trigger that opened it.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const allowed = getLanguagesForCountry(country);
  const languageOptions = LANGUAGES_AVAILABLE.filter((l) => allowed.includes(l.code));
  const languageLocked = languageOptions.length <= 1;

  // If the URL locale is out of sync with the country, reflect the country's
  // first valid language in the UI without forcing a redirect on mount.
  const activeLanguage = (allowed as string[]).includes(language)
    ? language
    : (languageOptions[0]?.code ?? language);

  const handleCountry = (code: string) => {
    changeCountry(code);
    const next = getLanguagesForCountry(code);
    if (!(next as string[]).includes(language)) changeLanguage(next[0]);
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger — flag of the selected country + active language */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={t("a11y.localeTrigger")}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-controls={panelId}
        className={clsx(
          "flex h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border bg-white/10",
          "pl-3 pr-2.5 outline-none transition-all duration-150",
          "hover:border-white/50 hover:bg-white/20 active:scale-95 active:bg-white/30",
          "focus-visible:border-white focus-visible:ring-2 focus-visible:ring-white/80",
          isOpen ? "border-white/50 bg-white/20" : "border-white/25",
        )}
      >
        <FlagIcon country={country} className="h-3 w-5" />
        <span className="text-sm font-semibold leading-none text-white">
          {activeLanguage.toUpperCase()}
        </span>
        <ChevronDown
          size={14}
          color="#fff"
          strokeWidth={2}
          aria-hidden
          className={clsx("transition-transform duration-200", isOpen && "rotate-180")}
        />
      </button>

      {/* Popover — country + language selects. Inert while collapsed so its
          controls stay out of the tab order and out of the accessibility tree. */}
      <div
        id={panelId}
        role="group"
        aria-label={t("a11y.localePanel")}
        inert={!isOpen}
        aria-hidden={!isOpen}
        className={clsx(
          "absolute -right-2/3 top-[calc(100%+10px)] z-50 w-64 rounded-xl border border-border-strong/60",
          "bg-surface p-4 shadow-xl",
          "origin-top-right transition-all duration-200",
          isOpen
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-2 scale-95 opacity-0",
        )}
      >
        {/* Country — flag shown in the trigger and every option */}
        <Select
          label={t("localeSwitcher.country")}
          ariaLabel={t("a11y.countrySelect")}
          options={COUNTRIES_AVAILABLE.map((c) => ({
            value: c.code,
            label: c.name,
            icon: <FlagIcon country={c.code} className="h-4 w-6" />,
          }))}
          value={country}
          searchEnabled={false}
          size="sm"
          onChange={(v) => handleCountry(v as string)}
        />

        {/* Language — unlocked only when the country offers more than one */}
        <div className="mt-3">
          <Select
            label={t("localeSwitcher.language")}
            ariaLabel={t("a11y.languageSelect")}
            ariaDescribedBy={languageLocked ? hintId : undefined}
            options={languageOptions.map((l) => ({ value: l.code, label: l.name }))}
            value={activeLanguage}
            searchEnabled={false}
            size="sm"
            disabled={languageLocked}
            onChange={(v) => changeLanguage(v as string)}
          />
        </div>

        {languageLocked && (
          <Text variant="small" size="xs" weight="semibold" className="mt-2">
            <span id={hintId}>{t("localeSwitcher.singleLanguage")}</span>
          </Text>
        )}
      </div>
    </div>
  );
}
