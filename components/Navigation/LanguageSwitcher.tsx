"use client";
import { useId } from "react";
import { Check, ChevronDown } from "lucide-react";
import clsx from "clsx";
import { LANGUAGES_AVAILABLE } from "@/constants/settings";
import { useLanguage } from "@/hooks/useLanguage";
import { useTranslation } from "@/i18n/context";
import { NAMESPACE } from "./i18n";
import {
  DropdownPanel,
  useDropdown,
  useRovingFocus,
} from "@/components/Overlays/Dropdown";
import { Text } from "@/components/Primitives/Text";

/**
 * Language control for the navbar. Every supported language is always on offer
 * — the visitor's country is detected separately (see `useLocaleDetection`) and
 * no longer narrows the list, since where someone is says little about what
 * they read.
 *
 * Options carry their own native name, so they need no translating.
 */
export default function LanguageSwitcher() {
  const menuId = useId();
  const [language, changeLanguage] = useLanguage();
  const { t } = useTranslation(NAMESPACE);

  const { isOpen, close, toggle, containerRef, triggerRef } =
    useDropdown<HTMLButtonElement>();
  const { itemRef, handleKeyDown } = useRovingFocus(
    isOpen,
    LANGUAGES_AVAILABLE.length,
    close,
  );

  const handleSelect = (code: string) => {
    close();
    changeLanguage(code);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={toggle}
        aria-label={t("a11y.languageTrigger")}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls={menuId}
        className={clsx(
          "flex h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border bg-white/10",
          "pl-3 pr-2.5 outline-none transition-all duration-150",
          "hover:border-white/50 hover:bg-white/20 active:scale-95 active:bg-white/30",
          "focus-visible:border-white focus-visible:ring-2 focus-visible:ring-white/80",
          isOpen ? "border-white/50 bg-white/20" : "border-white/25",
        )}
      >
        <span className="text-sm font-semibold leading-none text-white">
          {language.toUpperCase()}
        </span>
        <ChevronDown
          size={14}
          color="#fff"
          strokeWidth={2}
          aria-hidden
          className={clsx("transition-transform duration-200", isOpen && "rotate-180")}
        />
      </button>

      {/* keepMounted so the panel animates, staying inert (and out of the
          screen reader's reach) while collapsed. */}
      <DropdownPanel
        id={menuId}
        isOpen={isOpen}
        keepMounted
        width="min-w-44"
        className="top-[calc(100%+10px)]"
      >
        {/* Decorative: the menu's own `aria-label` already names this list. */}
        <p
          aria-hidden
          className="px-3 pt-3 pb-1 font-sans text-xs font-semibold tracking-wide text-foreground-tertiary uppercase"
        >
          {t("languageSwitcher.heading")}
        </p>

        <div role="menu" aria-label={t("a11y.languageSelect")} className="py-1.5">
          {LANGUAGES_AVAILABLE.map(({ code, name }, index) => {
            const isActive = code === language;
            return (
              <button
                key={code}
                ref={itemRef(index)}
                type="button"
                role="menuitemradio"
                aria-checked={isActive}
                onClick={() => handleSelect(code)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={clsx(
                  "group flex w-full cursor-pointer items-center gap-2.5 border-none px-3 py-2.5 text-left",
                  "transition-colors duration-150 outline-none",
                  "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary",
                  isActive
                    ? "bg-primary/10 text-primary hover:bg-primary/15 focus-visible:bg-primary/15"
                    : "text-foreground hover:bg-surface-hover focus-visible:bg-surface-hover",
                )}
              >
                {/* Always rendered so the labels line up whether or not the row
                    is the active one. */}
                <Check
                  size={14}
                  color="currentColor"
                  strokeWidth={2.5}
                  aria-hidden
                  className={clsx("shrink-0", !isActive && "invisible")}
                />
                <Text
                  variant="span"
                  size="sm"
                  weight="medium"
                  color={isActive ? "primary" : "secondary"}
                >
                  {name}
                </Text>
                <span className="ml-auto text-xs font-semibold text-foreground-tertiary uppercase">
                  {code}
                </span>
              </button>
            );
          })}
        </div>
      </DropdownPanel>
    </div>
  );
}
