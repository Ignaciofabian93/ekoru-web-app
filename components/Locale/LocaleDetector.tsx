"use client";

import { useLocaleDetection } from "@/hooks/useLocaleDetection";

/**
 * Renders nothing — it exists so the one-time location prompt runs on every
 * route, including the ones that don't draw the navbar. Mounted in the `[lang]`
 * layout.
 */
export function LocaleDetector() {
  useLocaleDetection();
  return null;
}
