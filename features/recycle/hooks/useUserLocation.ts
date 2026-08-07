"use client";

import { useCallback, useEffect, useState } from "react";

import type { Coordinates, LocationStatus } from "../types";

/**
 * `getCurrentPosition`'s `timeout` starts the moment it is called — and it
 * keeps running while the browser's permission prompt sits on screen waiting to
 * be answered. So the budget has to cover a person noticing the prompt and
 * deciding, not just the lookup: too short and the first visit fails with
 * TIMEOUT before "Allow" is ever clicked. Once permission is granted there is
 * no prompt and `maximumAge` returns the remembered fix immediately, which is
 * why a reload looked like it fixed things.
 *
 * Two budgets rather than one long one, so a genuine failure (no location
 * provider, say) still gives up promptly instead of stalling for a minute.
 */
const PROMPT_TIMEOUT_MS = 60000;
const GRANTED_TIMEOUT_MS = 15000;

/**
 * High accuracy is off deliberately: the search covers a 5 km radius, so a
 * GPS-grade fix buys nothing and is markedly slower — on desktop it can stall
 * or fail outright where the coarse wifi/IP lookup answers immediately.
 */
const GEO_OPTIONS: Omit<PositionOptions, "timeout"> = {
  enableHighAccuracy: false,
  maximumAge: 60000,
};

/**
 * Whether a prompt is likely, so the caller knows which budget to allow. The
 * Permissions API isn't universally available for geolocation, so an unknown
 * answer assumes a prompt — waiting too long is recoverable, timing out early
 * is the bug this exists to avoid.
 */
async function willPrompt(): Promise<boolean> {
  try {
    const status = await navigator.permissions.query({ name: "geolocation" });
    return status.state !== "granted";
  } catch {
    return true;
  }
}

/**
 * Requests the browser's geolocation once on mount and exposes the permission
 * lifecycle: loading → ready (coords available) | denied | error. `retry`
 * re-triggers the request (e.g. after the user re-enables the permission).
 */
export function useUserLocation() {
  const [status, setStatus] = useState<LocationStatus>("loading");
  const [coords, setCoords] = useState<Coordinates | null>(null);

  const locate = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      // Deferred so the mount effect never sets state synchronously.
      queueMicrotask(() => setStatus("error"));
      return;
    }

    const timeout = (await willPrompt()) ? PROMPT_TIMEOUT_MS : GRANTED_TIMEOUT_MS;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setStatus("ready");
      },
      (err) => {
        setStatus(err.code === err.PERMISSION_DENIED ? "denied" : "error");
      },
      { ...GEO_OPTIONS, timeout },
    );
  }, []);

  useEffect(() => {
    void locate();
  }, [locate]);

  const retry = useCallback(() => {
    setStatus("loading");
    void locate();
  }, [locate]);

  return { coords, status, retry };
}
