"use client";
import clsx from "clsx";
import { MapPin } from "lucide-react";
import { useExploreLocation } from "@/hooks/useExploreLocation";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/useToast";
import { useTranslation } from "@/i18n/context";
import { NAMESPACE } from "./i18n";
import { locationStatusMessage, useComunaDetection } from "./hooks/useComunaDetection";

/** One toast at a time, however often the pill is clicked. */
const FAILURE_TOAST_ID = "explore-location";

/**
 * "Exploring in: <comuna>" — the comuna the visitor browses from.
 *
 * Filled in silently when the geolocation permission is already granted (this
 * pill is the page's one background detector). A click asks for the location
 * (the browser's own prompt when it isn't granted yet) and uses it; when that
 * fails, a toast says why.
 */
export function LocationPicker({ className }: { className?: string }) {
  const { t } = useTranslation(NAMESPACE);
  const [language] = useLanguage();
  const [location] = useExploreLocation();
  const { status, detect } = useComunaDetection(language);
  const notify = useToast();
  const locating = status === "locating";

  const locate = async () => {
    if (locating) return;
    const result = await detect();
    if (result !== "detected") {
      notify.warning(locationStatusMessage(result, undefined, t), {
        toastId: FAILURE_TOAST_ID,
      });
    }
  };

  // Failures are announced by the toast; this covers progress and success.
  const announcement =
    status === "locating" || status === "detected"
      ? locationStatusMessage(status, location?.county, t)
      : "";

  return (
    <>
      <button
        type="button"
        onClick={() => void locate()}
        aria-busy={locating}
        title={t("location.update")}
        className={clsx("pill", className)}
      >
        <MapPin
          size={16}
          strokeWidth={2}
          aria-hidden
          className="shrink-0 text-foreground-tertiary"
        />
        {locating ? (
          <span className="shrink-0 text-foreground-secondary">
            {t("location.locating")}
          </span>
        ) : location ? (
          <>
            <span className="shrink-0 text-foreground-secondary">
              {t("location.exploring")}
            </span>{" "}
            <span className="min-w-0 max-w-56 truncate font-semibold text-secondary-dark">
              {location.county}
            </span>
          </>
        ) : (
          <span className="shrink-0 font-semibold text-secondary-dark">
            {t("location.useMyLocation")}
          </span>
        )}
      </button>
      <span role="status" className="sr-only">
        {announcement}
      </span>
    </>
  );
}
