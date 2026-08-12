"use client";
import { Button } from "@/components/Primitives/Button";
import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";
import { EmptyState } from "@/components/Feedback/EmptyState";
import { ConfirmDialog } from "@/components/Overlays";
import { DEFAULT_LANGUAGE, type SupportedLanguage } from "@/constants/settings";
import { useTranslation } from "@/i18n/context";
import clsx from "clsx";
import { CalendarClock, CalendarX } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

import { NAMESPACE } from "../i18n";
import { useMyBookings, type BookingStatus } from "../hooks/useServiceRequests";

const STATUS_TONE: Record<BookingStatus, string> = {
  PENDING: "bg-warning/10 text-warning",
  CONFIRMED: "bg-info/10 text-info",
  IN_PROGRESS: "bg-info/10 text-info",
  COMPLETED: "bg-success/10 text-success",
  CANCELLED: "bg-danger/10 text-danger",
};

/** A booking can only be called off while it has not started or finished. */
const CANCELLABLE: BookingStatus[] = ["PENDING", "CONFIRMED"];

function formatDate(iso: string, lang: string) {
  try {
    return new Intl.DateTimeFormat(lang, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function formatMoney(value: number, lang: string) {
  try {
    return new Intl.NumberFormat(lang, {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `CLP ${value}`;
  }
}

export function BookingsList() {
  const { t } = useTranslation(NAMESPACE);
  const params = useParams<{ lang?: SupportedLanguage }>();
  const lang = params.lang ?? DEFAULT_LANGUAGE;
  const { bookings, loading, error, cancel, cancelling } = useMyBookings();
  const [toCancel, setToCancel] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex flex-col gap-4" aria-busy="true">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-2xl border border-border-light bg-background-secondary"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        variant="prominent"
        icon={CalendarX}
        title={t("bookings.error.title")}
        description={t("bookings.error.description")}
      />
    );
  }

  if (bookings.length === 0) {
    return (
      <EmptyState
        variant="prominent"
        icon={CalendarClock}
        title={t("bookings.empty.title")}
        description={t("bookings.empty.description")}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {bookings.map((booking) => (
        <article
          key={booking.id}
          className="flex flex-col gap-3 rounded-2xl border border-border-light bg-surface p-5"
        >
          <header className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex flex-col gap-1">
              <Title level="h3" size="h6" weight="semibold">
                {booking.service ? (
                  <Link
                    href={`/${lang}/service/${booking.service.id}`}
                    className="hover:underline"
                  >
                    {booking.service.name}
                  </Link>
                ) : (
                  t("bookings.card.unknownService")
                )}
              </Title>
              <Text variant="span" size="xs" color="tertiary">
                {t("bookings.card.scheduledFor")} {formatDate(booking.scheduledDate, lang)}
                {booking.scheduledTimeSlot ? ` · ${booking.scheduledTimeSlot}` : ""}
              </Text>
            </div>
            <span
              className={clsx(
                "rounded-full px-2.5 py-1 text-xs font-semibold",
                STATUS_TONE[booking.status],
              )}
            >
              {t(`bookings.status.${booking.status}`)}
            </span>
          </header>

          {booking.clientNotes && (
            <Text variant="p" size="sm" color="tertiary">
              {booking.clientNotes}
            </Text>
          )}

          {booking.cancellationReason && (
            <Text variant="p" size="sm" color="tertiary">
              {t("bookings.card.cancelReason")}: {booking.cancellationReason}
            </Text>
          )}

          <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border-light pt-3">
            <div className="flex flex-col">
              <Text variant="span" size="xs" color="tertiary">
                {t("bookings.card.agreedPrice")}
              </Text>
              <Text variant="span" weight="bold">
                {formatMoney(booking.agreedPrice, lang)}
              </Text>
            </div>
            {CANCELLABLE.includes(booking.status) && (
              <Button
                text={t("bookings.card.cancel")}
                variant="outline"
                size="sm"
                onClick={() => setToCancel(booking.id)}
              />
            )}
          </footer>
        </article>
      ))}

      <ConfirmDialog
        isOpen={toCancel !== null}
        onClose={() => setToCancel(null)}
        onConfirm={async () => {
          if (toCancel) await cancel(toCancel, t("bookings.cancelDialog.defaultReason"));
          setToCancel(null);
        }}
        title={t("bookings.cancelDialog.title")}
        description={t("bookings.cancelDialog.description")}
        confirmLabel={t("bookings.cancelDialog.confirm")}
        cancelLabel={t("bookings.cancelDialog.cancel")}
        loading={cancelling}
        icon={CalendarX}
      />
    </div>
  );
}
