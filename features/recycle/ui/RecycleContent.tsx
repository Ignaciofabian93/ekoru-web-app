"use client";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { RadiusPicker } from "@/components/Patterns/RadiusPicker";
import { useTranslation } from "@/i18n/context";
import {
  DEFAULT_RADIUS_METERS,
  RADIUS_OPTIONS_METERS,
  type RadiusMeters,
} from "../constants/points";
import { useRecyclePoints } from "../hooks/useRecyclePoints";
import { useUserLocation } from "../hooks/useUserLocation";
import { NAMESPACE } from "../i18n";
import type { RecyclePoint } from "../types";
import { RecyclePointCard } from "./RecyclePointCard";
import { RecycleError, RecycleLocating, RecyclePermissionDenied } from "./RecycleStatus";

// Leaflet touches `window` at import time, so the map must never render on the server.
const RecycleMap = dynamic(() => import("./RecycleMap"), {
  ssr: false,
  loading: () => <RecycleLocating />,
});

export function RecycleContent() {
  const { t } = useTranslation(NAMESPACE);

  const [radius, setRadius] = useState<RadiusMeters>(DEFAULT_RADIUS_METERS);
  const { coords, status, retry: retryLocation } = useUserLocation();
  const {
    points,
    loading: loadingPoints,
    slow: slowPoints,
    error: pointsError,
    retry: retryPoints,
  } = useRecyclePoints({ coords, radiusMeters: radius });

  const [selected, setSelected] = useState<RecyclePoint | null>(null);
  // A narrower radius can leave the open card pointing at a point that is no
  // longer on the map; it closes with it.
  const selectedPoint =
    selected && points.some((p) => p.id === selected.id) ? selected : null;

  const km = (meters: number) => t("radius.option", { km: String(meters / 1000) });

  const countLabel =
    points.length === 1
      ? t("map.count", { count: "1", radius: km(radius) })
      : t("map.countPlural", { count: String(points.length), radius: km(radius) });

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 md:py-8">
      <header className="mb-5">
        <h1 className="text-foreground text-2xl font-bold md:text-3xl">
          {t("header.title")}
        </h1>
        <p className="text-foreground-secondary mt-1">{t("header.subtitle")}</p>
      </header>

      {/* Picking a distance only re-filters the points already loaded, so it
          never waits on the server. */}
      <div className="mb-3">
        <RadiusPicker
          options={RADIUS_OPTIONS_METERS}
          value={radius}
          onChange={setRadius}
          label={t("radius.label")}
          formatOption={km}
        />
      </div>

      <div className="border-border-light bg-background-secondary relative h-[65vh] min-h-105 w-full overflow-hidden rounded-2xl border shadow-sm">
        {status === "loading" && <RecycleLocating />}
        {status === "denied" && <RecyclePermissionDenied onRetry={retryLocation} />}
        {status === "error" && <RecycleError onRetry={retryLocation} />}

        {status === "ready" && coords && pointsError && (
          <RecycleError variant="points" onRetry={retryPoints} />
        )}

        {status === "ready" && coords && !pointsError && (
          <RecycleMap
            center={coords}
            radiusMeters={radius}
            user={coords}
            points={points}
            onSelect={setSelected}
            centerOnUserLabel={t("map.centerOnMe")}
          >
            {loadingPoints ? (
              <div
                role="status"
                className="bg-surface text-foreground absolute top-3 left-1/2 z-1000 flex w-max max-w-[calc(100%-2rem)] -translate-x-1/2 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow-md"
              >
                <Loader2
                  size={16}
                  strokeWidth={2}
                  className="text-primary shrink-0 animate-spin"
                />
                {/* The first visit to an area waits on Overpass, which can take
                    a minute; saying so keeps it from looking stuck. */}
                {slowPoints ? t("map.loadingSlow") : t("map.loadingPoints")}
              </div>
            ) : (
              <div className="bg-primary-dark absolute top-3 left-1/2 z-1000 -translate-x-1/2 rounded-full px-3.5 py-1.5 text-xs font-semibold text-white shadow-md">
                {countLabel}
              </div>
            )}

            {selectedPoint && (
              <RecyclePointCard point={selectedPoint} onClose={() => setSelected(null)} />
            )}
          </RecycleMap>
        )}
      </div>
    </div>
  );
}
