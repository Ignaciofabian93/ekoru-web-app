"use client";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useTranslation } from "@/i18n/context";
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

  const { coords, status, retry: retryLocation } = useUserLocation();
  const {
    points,
    loading: loadingPoints,
    error: pointsError,
    retry: retryPoints,
  } = useRecyclePoints({ coords });

  const [selected, setSelected] = useState<RecyclePoint | null>(null);

  const countLabel =
    points.length === 1
      ? t("map.count", { count: "1" })
      : t("map.countPlural", { count: String(points.length) });

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 md:py-8">
      <header className="mb-5">
        <h1 className="text-foreground text-2xl font-bold md:text-3xl">
          {t("header.title")}
        </h1>
        <p className="text-foreground-secondary mt-1">{t("header.subtitle")}</p>
      </header>

      <div className="border-border-light bg-background-secondary relative h-[65vh] min-h-105 w-full overflow-hidden rounded-2xl border shadow-sm">
        {status === "loading" && <RecycleLocating />}
        {status === "denied" && <RecyclePermissionDenied onRetry={retryLocation} />}
        {status === "error" && <RecycleError onRetry={retryLocation} />}

        {status === "ready" && coords && pointsError && (
          <RecycleError onRetry={retryPoints} />
        )}

        {status === "ready" && coords && !pointsError && (
          <RecycleMap
            center={coords}
            user={coords}
            points={points}
            onSelect={setSelected}
            centerOnUserLabel={t("map.centerOnMe")}
          >
            {loadingPoints ? (
              <div className="bg-surface text-foreground absolute top-3 left-1/2 z-1000 flex -translate-x-1/2 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow-md">
                <Loader2
                  size={16}
                  strokeWidth={2}
                  className="text-primary animate-spin"
                />
                {t("map.loadingPoints")}
              </div>
            ) : (
              <div className="bg-primary-dark absolute top-3 left-1/2 z-1000 -translate-x-1/2 rounded-full px-3.5 py-1.5 text-xs font-semibold text-white shadow-md">
                {countLabel}
              </div>
            )}

            {selected && (
              <RecyclePointCard point={selected} onClose={() => setSelected(null)} />
            )}
          </RecycleMap>
        )}
      </div>
    </div>
  );
}
