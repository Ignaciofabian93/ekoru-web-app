"use client";
import clsx from "clsx";
import { MapPin } from "lucide-react";
import { useState } from "react";
import { useExploreLocation } from "@/hooks/useExploreLocation";
import { useLanguage } from "@/hooks/useLanguage";
import { useTranslation } from "@/i18n/context";
import { NAMESPACE } from "./i18n";
import { useComunaDetection } from "./hooks/useComunaDetection";
import { LocationDialog } from "./LocationDialog";

/**
 * "Exploring in: <comuna>" — the comuna the visitor browses from.
 *
 * Filled in silently when the geolocation permission is already granted (this
 * picker is the page's one background detector). If not, opening the picker
 * asks for it (the browser's own prompt), and the dialog's comuna cascade is
 * always there to pick by hand.
 */
export function LocationPicker({ className }: { className?: string }) {
  const { t } = useTranslation(NAMESPACE);
  const [language] = useLanguage();
  const [location] = useExploreLocation();
  const { status, detect } = useComunaDetection(language);
  const [isOpen, setIsOpen] = useState(false);

  const open = () => {
    setIsOpen(true);
    // No comuna yet: the location is the first thing to try, so the prompt
    // shows up right away instead of behind a second click.
    if (!location) void detect();
  };

  const value =
    location?.county ??
    (status === "locating" ? t("location.locating") : t("location.choose"));

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-haspopup="dialog"
        className={clsx(
          "flex min-w-0 cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5",
          "font-sans text-sm outline-none transition-colors duration-100",
          "hover:bg-background-tertiary focus-visible:ring-2 focus-visible:ring-primary",
          className,
        )}
      >
        <MapPin
          size={16}
          strokeWidth={2}
          aria-hidden
          className="shrink-0 text-foreground-tertiary"
        />
        <span className="shrink-0 text-foreground-secondary">
          {t("location.exploring")}
        </span>
        <span className="min-w-0 max-w-56 truncate font-semibold text-secondary-dark">
          {value}
        </span>
      </button>

      <LocationDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        status={status}
        onDetect={() => void detect()}
      />
    </>
  );
}
