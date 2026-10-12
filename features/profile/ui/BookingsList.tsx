"use client";
import { Button } from "@/components/Primitives/Button";
import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";
import { EmptyState } from "@/components/Feedback/EmptyState";
import { ConfirmDialog } from "@/components/Overlays";
import { DEFAULT_LANGUAGE, type SupportedLanguage } from "@/constants/settings";
import { useDisplayName } from "@/hooks/useSellerData";
import { useTranslation } from "@/i18n/context";
import type { Seller } from "@/types/user";
import clsx from "clsx";
import {
  CalendarCheck,
  CalendarClock,
  CalendarX,
  CheckCircle2,
  Play,
  Store,
  UserX,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, type ReactNode } from "react";

import { NAMESPACE } from "../i18n";
import {
  PROVIDER_MOVES,
  useMyBookings,
  useProviderBookings,
  type BookingStatus,
  type ProviderMove,
  type ReceivedBooking,
  type ServiceBooking,
} from "../hooks/useServiceRequests";

const STATUS_TONE: Record<BookingStatus, string> = {
  PENDING: "bg-warning/10 text-warning",
  CONFIRMED: "bg-info/10 text-info",
  IN_PROGRESS: "bg-info/10 text-info",
  COMPLETED: "bg-success/10 text-success",
  NO_SHOW: "bg-foreground-tertiary/10 text-foreground-secondary",
  CANCELLED: "bg-danger/10 text-danger",
};

/** A booking can only be called off while it has not started or finished. */
const CANCELLABLE: BookingStatus[] = ["PENDING", "CONFIRMED"];

type Tab = "made" | "received";

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

function Skeletons() {
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

/**
 * One booking, as either side sees it: service, date, status, notes, price and
 * how it is paid. `extra` and `actions` carry what only one side gets.
 */
function BookingCard({
  booking,
  lang,
  extra,
  actions,
}: {
  booking: ServiceBooking;
  lang: string;
  extra?: ReactNode;
  actions?: ReactNode;
}) {
  const { t } = useTranslation(NAMESPACE);
  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-border-light bg-surface p-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <Title level="h3" size="h6" weight="semibold">
            {booking.service ? (
              <Link href={`/${lang}/service/${booking.service.id}`} className="hover:underline">
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

      {extra}

      {booking.clientNotes && (
        <Text variant="p" size="sm" color="tertiary">
          {t("bookings.card.clientNotes")}: {booking.clientNotes}
        </Text>
      )}

      {booking.cancellationReason && (
        <Text variant="p" size="sm" color="tertiary">
          {t("bookings.card.cancelReason")}: {booking.cancellationReason}
        </Text>
      )}

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border-light pt-3">
        <div className="flex flex-col gap-0.5">
          <Text variant="span" size="xs" color="tertiary">
            {t("bookings.card.agreedPrice")}
          </Text>
          <Text variant="span" weight="bold">
            {formatMoney(booking.agreedPrice, lang)}
          </Text>
          {/* D7: nothing is charged on EKORU; the client pays on site. */}
          <span className="inline-flex items-center gap-1 text-xs text-foreground-secondary">
            <Store size={12} aria-hidden />
            {t("bookings.card.payOnSite")}
          </span>
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </footer>
    </article>
  );
}

/** Who booked: name and how to reach them about the appointment. */
function ClientLine({ client }: { client: ReceivedBooking["client"] }) {
  const { t } = useTranslation(NAMESPACE);
  const name = useDisplayName(client as Seller | null | undefined);
  if (!client) return null;
  return (
    <Text variant="p" size="sm">
      {t("bookings.card.client")}: <strong>{name || "—"}</strong>
      {client.phone ? ` · ${client.phone}` : ""}
      {client.email ? ` · ${client.email}` : ""}
    </Text>
  );
}

function MadeTab({ lang }: { lang: string }) {
  const { t } = useTranslation(NAMESPACE);
  const { bookings, loading, error, cancel, cancelling } = useMyBookings();
  const [toCancel, setToCancel] = useState<string | null>(null);

  if (loading) return <Skeletons />;
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
        <BookingCard
          key={booking.id}
          booking={booking}
          lang={lang}
          actions={
            CANCELLABLE.includes(booking.status) && (
              <Button
                text={t("bookings.card.cancel")}
                variant="outline"
                size="sm"
                onClick={() => setToCancel(booking.id)}
              />
            )
          }
        />
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

/** Moves that close the booking are confirmed first; the rest apply at once. */
type Pending = { id: string; action: "COMPLETED" | "NO_SHOW" | "CANCEL" };

const MOVE_ICON: Record<ProviderMove, typeof Play> = {
  CONFIRMED: CalendarCheck,
  IN_PROGRESS: Play,
  COMPLETED: CheckCircle2,
  NO_SHOW: UserX,
};

function ReceivedTab({ lang, received }: { lang: string; received: ReturnType<typeof useProviderBookings> }) {
  const { t } = useTranslation(NAMESPACE);
  const { bookings, loading, error, move, cancel, busy } = received;
  const [pending, setPending] = useState<Pending | null>(null);

  if (loading) return <Skeletons />;
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
        title={t("bookings.received.emptyTitle")}
        description={t("bookings.received.emptyDescription")}
      />
    );
  }

  const confirmPending = async () => {
    if (!pending) return;
    const ok =
      pending.action === "CANCEL"
        ? await cancel(pending.id, t("bookings.received.defaultCancelReason"))
        : await move(pending.id, pending.action);
    if (ok) setPending(null);
  };

  return (
    <div className="flex flex-col gap-4">
      {bookings.map((booking) => {
        const moves = PROVIDER_MOVES[booking.status] ?? [];
        return (
          <BookingCard
            key={booking.id}
            booking={booking}
            lang={lang}
            extra={<ClientLine client={booking.client} />}
            actions={
              <>
                {moves.map((to) => (
                  <Button
                    key={to}
                    text={t(`bookings.received.actions.${to}`)}
                    leftIcon={MOVE_ICON[to]}
                    size="sm"
                    variant={to === "NO_SHOW" ? "ghost" : to === "IN_PROGRESS" ? "outline" : "primary"}
                    disabled={busy}
                    onClick={() =>
                      to === "COMPLETED" || to === "NO_SHOW"
                        ? setPending({ id: booking.id, action: to })
                        : void move(booking.id, to)
                    }
                  />
                ))}
                {CANCELLABLE.includes(booking.status) && (
                  <Button
                    text={t("bookings.received.actions.CANCEL")}
                    variant="outline"
                    size="sm"
                    disabled={busy}
                    onClick={() => setPending({ id: booking.id, action: "CANCEL" })}
                  />
                )}
              </>
            }
          />
        );
      })}

      <ConfirmDialog
        isOpen={pending !== null}
        onClose={() => setPending(null)}
        onConfirm={() => void confirmPending()}
        title={pending ? t(`bookings.received.confirm.${pending.action}.title`) : ""}
        description={pending ? t(`bookings.received.confirm.${pending.action}.description`) : ""}
        confirmLabel={pending ? t(`bookings.received.confirm.${pending.action}.confirm`) : ""}
        cancelLabel={t("bookings.cancelDialog.cancel")}
        loading={busy}
        tone={pending?.action === "COMPLETED" ? "primary" : "danger"}
        icon={pending?.action === "COMPLETED" ? CheckCircle2 : pending?.action === "NO_SHOW" ? UserX : CalendarX}
      />
    </div>
  );
}

/**
 * Bookings from both sides (WEB-5). A seller books services as a client and,
 * as a provider, receives bookings to confirm and complete, so the page splits
 * them into tabs like the quotes inbox. Bookings are paid on site (D7).
 */
export function BookingsList() {
  const { t } = useTranslation(NAMESPACE);
  const params = useParams<{ lang?: SupportedLanguage }>();
  const lang = params.lang ?? DEFAULT_LANGUAGE;
  const [tab, setTab] = useState<Tab>("made");
  // Loaded up front so the tab can show how many bookings wait for an answer.
  const received = useProviderBookings();
  const waiting = received.bookings.filter((b) => b.status === "PENDING").length;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-2" role="group" aria-label={t("bookings.tabs.label")}>
        {(["made", "received"] as Tab[]).map((key) => (
          <button
            key={key}
            type="button"
            aria-pressed={tab === key}
            onClick={() => setTab(key)}
            className={clsx(
              "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
              tab === key
                ? "bg-primary text-on-primary"
                : "border border-border-light bg-surface text-foreground-secondary hover:border-primary/40",
            )}
          >
            {t(`bookings.tabs.${key}`)}
            {key === "received" && waiting > 0 ? ` (${waiting})` : ""}
          </button>
        ))}
      </div>

      {tab === "made" ? <MadeTab lang={lang} /> : <ReceivedTab lang={lang} received={received} />}
    </div>
  );
}
