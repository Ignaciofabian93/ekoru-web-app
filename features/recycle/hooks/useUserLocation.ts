"use client";

import { useCallback, useEffect, useState } from "react";

import type { Coordinates, LocationStatus } from "../types";

const GEO_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 60000,
};

/**
 * Requests the browser's geolocation once on mount and exposes the permission
 * lifecycle: loading → ready (coords available) | denied | error. `retry`
 * re-triggers the request (e.g. after the user re-enables the permission).
 */
export function useUserLocation() {
  const [status, setStatus] = useState<LocationStatus>("loading");
  const [coords, setCoords] = useState<Coordinates | null>(null);

  const locate = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      // Deferred so the mount effect never sets state synchronously.
      queueMicrotask(() => setStatus("error"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setStatus("ready");
      },
      (err) => {
        setStatus(err.code === err.PERMISSION_DENIED ? "denied" : "error");
      },
      GEO_OPTIONS,
    );
  }, []);

  useEffect(() => {
    locate();
  }, [locate]);

  const retry = useCallback(() => {
    setStatus("loading");
    locate();
  }, [locate]);

  return { coords, status, retry };
}
