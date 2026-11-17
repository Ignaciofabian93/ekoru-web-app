"use client";

import { Loader2, MapPin, X } from "lucide-react";
import type { ReactNode } from "react";

import { useTranslation } from "@/i18n/context";

import { NAMESPACE } from "../i18n";

function Centered({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-8 text-center">
      {children}
    </div>
  );
}

function RetryButton({ label, onRetry }: { label: string; onRetry: () => void }) {
  return (
    <button
      type="button"
      onClick={onRetry}
      className="bg-primary hover:bg-primary-active mt-2 rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition-colors"
    >
      {label}
    </button>
  );
}

export function RecycleLocating() {
  const { t } = useTranslation(NAMESPACE);
  return (
    <Centered>
      <Loader2 size={36} strokeWidth={2} className="text-primary animate-spin" />
      <p className="text-foreground-secondary text-sm">{t("map.locating")}</p>
    </Centered>
  );
}

export function RecyclePermissionDenied({ onRetry }: { onRetry: () => void }) {
  const { t } = useTranslation(NAMESPACE);
  return (
    <Centered>
      <MapPin size={52} strokeWidth={1.5} className="text-foreground-muted" />
      <p className="text-foreground mt-2 font-semibold">{t("permission.title")}</p>
      <p className="text-foreground-secondary max-w-sm text-sm">{t("permission.hint")}</p>
      <RetryButton label={t("permission.retry")} onRetry={onRetry} />
    </Centered>
  );
}

/**
 * `location`: the position couldn't be found. `points`: the position is known
 * but the points service didn't answer, which is rarely the visitor's
 * connection, so it says so instead of blaming it.
 */
export function RecycleError({
  onRetry,
  variant = "location",
}: {
  onRetry: () => void;
  variant?: "location" | "points";
}) {
  const { t } = useTranslation(NAMESPACE);
  const copy =
    variant === "points"
      ? { title: t("error.pointsTitle"), hint: t("error.pointsHint") }
      : { title: t("error.title"), hint: t("error.hint") };
  return (
    <Centered>
      <X size={52} strokeWidth={1.5} className="text-danger" />
      <p className="text-foreground mt-2 font-semibold">{copy.title}</p>
      <p className="text-foreground-secondary max-w-sm text-sm">{copy.hint}</p>
      <RetryButton label={t("error.retry")} onRetry={onRetry} />
    </Centered>
  );
}
