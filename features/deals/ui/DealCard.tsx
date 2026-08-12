"use client";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import {
  ArrowLeftRight,
  BadgeCheck,
  Clock,
  Coins,
  ImageOff,
  ImagePlus,
  Leaf,
  MapPin,
  MessageSquareQuote,
  Phone,
  ShieldAlert,
  UserRound,
} from "lucide-react";

import { useFormatPrice } from "@/hooks/useFormatPrice";
import {
  useDisplayName,
  useInitials,
  useProfileImage,
  useSellerLocation,
} from "@/hooks/useSellerData";
import { resolveImageUrl } from "@/utils/resolveImage";
import { useCurrentSellerId } from "@/store/useAuthStore";
import { useTranslation } from "@/i18n/context";

import { NAMESPACE } from "../i18n";
import type { Deal, DealPerspective, DealProduct } from "../types";
import { useDealActions } from "../hooks/useDealActions";
import { useDealSettings } from "../hooks/useDealSettings";

const STATUS_STYLE: Record<string, string> = {
  PROPOSED: "bg-amber-50 text-amber-700",
  ACCEPTED: "bg-primary-light-bg text-primary",
  COMPLETED: "bg-success/15 text-success",
  DISPUTED: "bg-red-50 text-red-600",
  EXPIRED: "bg-border text-foreground-secondary",
  CANCELLED: "bg-border text-foreground-secondary",
  DECLINED: "bg-border text-foreground-secondary",
};

function Thumb({ product }: { product?: DealProduct | null }) {
  const cover = resolveImageUrl(product?.images?.[0]);
  return (
    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-background-secondary">
      {cover ? (
        <Image
          src={cover}
          alt={product?.name ?? ""}
          fill
          className="object-cover"
          sizes="64px"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <ImageOff size={20} className="text-foreground-muted" />
        </div>
      )}
    </div>
  );
}

export function DealCard({
  deal,
  perspective,
}: {
  deal: Deal;
  perspective: DealPerspective;
}) {
  const { t } = useTranslation(NAMESPACE);
  const formatPrice = useFormatPrice();
  const myId = useCurrentSellerId();
  const a = useDealActions();
  const settings = useDealSettings();
  const [photo, setPhoto] = useState<File | null>(null);
  const [cashReceived, setCashReceived] = useState(false);
  const busy = a.busyId === deal.id;

  const isExchange = deal.type === "EXCHANGE";
  const item = isExchange ? deal.requestedProduct : deal.product;
  const iConfirmed =
    perspective === "buyer" ? !!deal.buyerConfirmedAt : !!deal.sellerConfirmedAt;
  // The buyer always receives an item; the seller only in an exchange.
  const iReceiveItem = perspective === "buyer" || isExchange;

  // Cash gap: only the side owed the money can attest it changed hands, and the
  // server refuses their confirmation until they do.
  const hasCashGap = deal.compensationAmount > 0 && !!deal.compensationPayerId;
  const iPayCash = hasCashGap && deal.compensationPayerId === myId;
  const iAmOwedCash = hasCashGap && !iPayCash;
  const cashSettled = !!deal.compensationSettledAt;
  const mustTickCash = iAmOwedCash && !cashSettled;

  // Countdown to the 72h confirmation deadline (turns urgent under 12h).
  // `now` is null until the client mounts — reading the clock during render is
  // impure and would also mismatch the server-rendered markup.
  const now = useNow();
  const msLeft =
    deal.confirmationDeadline && now !== null
      ? new Date(deal.confirmationDeadline).getTime() - now
      : null;
  const urgent = msLeft !== null && msLeft < 12 * 3600_000;

  // Local preview of the not-yet-uploaded evidence photo.
  const previewUrl = useMemo(() => (photo ? URL.createObjectURL(photo) : null), [photo]);
  useEffect(
    () => () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    },
    [previewUrl],
  );

  // The other party: on my seller tab it's the buyer; on my buyer tab, the seller.
  const counterparty = perspective === "seller" ? deal.buyer : deal.seller;
  const partyName = useDisplayName(counterparty);
  const partyImage = useProfileImage(counterparty);
  const partyInitials = useInitials(counterparty);
  const partyLocation = useSellerLocation(counterparty);

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border-light bg-surface p-4">
      {/* Who's on the other side + where they're from */}
      <div className="flex items-center gap-2.5 border-b border-border-light pb-2.5">
        <div className="relative size-9 shrink-0 overflow-hidden rounded-full bg-primary-light-bg">
          {partyImage ? (
            <Image src={partyImage} alt="" fill className="object-cover" sizes="36px" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs font-bold text-primary">
              {partyInitials || <UserRound size={16} />}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1 truncate text-sm font-semibold text-foreground">
            {partyName || t("party.unknown")}
            {counterparty?.isVerified && (
              <BadgeCheck size={14} className="shrink-0 text-primary" />
            )}
          </p>
          {partyLocation && (
            <p className="flex items-center gap-1 truncate text-xs text-foreground-tertiary">
              <MapPin size={11} className="shrink-0" />
              {partyLocation}
            </p>
          )}
        </div>
        <span className="shrink-0 rounded-md bg-background-secondary px-2 py-0.5 text-[10px] font-medium tracking-wide text-foreground-secondary uppercase">
          {perspective === "seller" ? t("party.buyer") : t("party.seller")}
        </span>
      </div>

      <div className="flex items-start gap-3">
        <Thumb product={item} />
        {isExchange && <Thumb product={deal.offeredProduct} />}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {isExchange && <ArrowLeftRight size={14} className="text-primary" />}
            <p className="truncate text-sm font-semibold text-foreground">
              {item?.name ?? `#${deal.id}`}
            </p>
          </div>
          {typeof item?.price === "number" && (
            <p className="text-sm text-foreground-secondary">{formatPrice(item.price)}</p>
          )}
          {isExchange && deal.compensationAmount > 0 && (
            <p className="mt-0.5 text-xs text-foreground-tertiary">
              {t("compensation", { amount: formatPrice(deal.compensationAmount) })}{" "}
              {deal.compensationPayerId === myId ? t("youPay") : t("theyPay")}
            </p>
          )}
        </div>
        <span
          className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-medium ${STATUS_STYLE[deal.status] ?? "bg-border"}`}
        >
          {t(`status.${deal.status}`)}
        </span>
      </div>

      {/* What the proposer wrote when they opened the deal. */}
      {deal.message && (
        <div className="flex items-start gap-1.5 rounded-lg bg-background-secondary p-2.5">
          <MessageSquareQuote
            size={14}
            className="mt-0.5 shrink-0 text-foreground-tertiary"
          />
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-foreground-tertiary">
              {perspective === "seller" ? t("message.from") : t("message.yours")}
            </p>
            <p className="text-xs whitespace-pre-line text-foreground-secondary">
              {deal.message}
            </p>
          </div>
        </div>
      )}

      {deal.status === "ACCEPTED" && (
        <div className="flex flex-col gap-1.5 rounded-lg bg-primary/5 p-2.5">
          <p className="text-xs font-semibold text-primary">{t("acceptedBanner")}</p>
          <p className="text-xs text-foreground-secondary">{t("acceptedHint")}</p>
          {counterparty?.phone && (
            <a
              href={`tel:${counterparty.phone}`}
              className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
            >
              <Phone size={13} /> {t("contact", { phone: counterparty.phone })}
            </a>
          )}
          {hasCashGap && (
            <p className="flex items-center gap-1.5 text-xs font-medium text-foreground-secondary">
              <Coins size={13} className="shrink-0" />
              {iPayCash
                ? t("cash.youBring", {
                    amount: formatPrice(deal.compensationAmount),
                  })
                : t("cash.theyBring", {
                    amount: formatPrice(deal.compensationAmount),
                  })}
            </p>
          )}
          {msLeft !== null && (
            <p
              className={`flex items-center gap-1.5 text-xs font-medium ${
                urgent ? "text-red-600" : "text-foreground-tertiary"
              }`}
            >
              <Clock size={13} />
              {msLeft > 0
                ? t("timeLeft", { time: formatRemaining(msLeft) })
                : t("overdue")}
            </p>
          )}
        </div>
      )}
      {deal.status === "COMPLETED" && (
        <p className="flex items-center gap-1.5 text-xs font-medium text-success">
          <Leaf size={13} className="shrink-0" />
          {t("pointsEarned", { points: String(settings.completionPoints) })}
        </p>
      )}
      {deal.status === "DISPUTED" && deal.disputeReason && (
        <p className="flex items-center gap-1.5 text-xs text-red-600">
          <ShieldAlert size={13} /> {deal.disputeReason}
        </p>
      )}
      {deal.status === "CANCELLED" && deal.cancelReason && (
        <p className="flex items-center gap-1.5 text-xs text-foreground-tertiary">
          <ShieldAlert size={13} /> {deal.cancelReason}
        </p>
      )}

      {cashSettled && (
        <p className="flex items-center gap-1.5 text-xs text-success">
          <Coins size={13} className="shrink-0" /> {t("cash.settled")}
        </p>
      )}

      {/* Uploaded evidence photos, viewable by both parties. */}
      {(deal.buyerEvidenceUrl || deal.sellerEvidenceUrl) && (
        <div className="flex flex-wrap gap-3">
          {deal.buyerEvidenceUrl && (
            <Evidence url={deal.buyerEvidenceUrl} label={t("evidence.buyer")} />
          )}
          {deal.sellerEvidenceUrl && (
            <Evidence url={deal.sellerEvidenceUrl} label={t("evidence.seller")} />
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        {perspective === "seller" && deal.status === "PROPOSED" && (
          <>
            <Btn onClick={() => a.acceptDeal(deal.id)} disabled={busy} primary>
              {t("actions.accept")}
            </Btn>
            <Btn onClick={() => a.declineDeal(deal.id)} disabled={busy}>
              {t("actions.decline")}
            </Btn>
          </>
        )}
        {perspective === "buyer" && deal.status === "PROPOSED" && (
          <Btn onClick={() => a.cancelDeal(deal.id)} disabled={busy}>
            {t("actions.cancel")}
          </Btn>
        )}
        {deal.status === "ACCEPTED" && !iConfirmed && (
          <div className="flex w-full flex-col gap-2">
            {iReceiveItem && (
              <div className="flex flex-col gap-1.5">
                <p className="text-xs font-medium text-foreground-secondary">
                  {t("photoLabel")}
                </p>
                {previewUrl ? (
                  <div className="flex items-center gap-3">
                    <div className="size-16 shrink-0 overflow-hidden rounded-lg border border-border-light">
                      {/* Local object URL — a plain img; next/image can't optimize blob URLs. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={previewUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <label className="cursor-pointer text-xs font-medium text-primary hover:underline">
                      {t("changePhoto")}
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="sr-only"
                        onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
                      />
                    </label>
                  </div>
                ) : (
                  <label className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-border py-4 text-sm font-medium text-foreground-secondary transition-colors hover:border-primary/50 hover:text-primary">
                    <ImagePlus size={20} strokeWidth={2} />
                    {t("uploadPhoto")}
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="sr-only"
                      onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
                    />
                  </label>
                )}
              </div>
            )}
            {/* The side owed the top-up has to say the cash arrived before
                their confirmation counts. */}
            {mustTickCash && (
              <label className="flex cursor-pointer items-start gap-2 rounded-lg border border-border-light p-2.5 text-xs text-foreground-secondary">
                <input
                  type="checkbox"
                  checked={cashReceived}
                  onChange={(e) => setCashReceived(e.target.checked)}
                  className="mt-0.5 size-3.5 shrink-0 accent-primary"
                />
                <span>
                  {t("cash.confirmReceived", {
                    amount: formatPrice(deal.compensationAmount),
                  })}
                </span>
              </label>
            )}
            {iPayCash && !cashSettled && (
              <p className="flex items-center gap-1.5 text-xs text-foreground-tertiary">
                <Coins size={13} className="shrink-0" />
                {t("cash.payerHint", {
                  amount: formatPrice(deal.compensationAmount),
                })}
              </p>
            )}
            <div className="flex gap-2">
              <Btn
                onClick={() =>
                  a.confirmDeal(
                    deal.id,
                    photo ?? undefined,
                    mustTickCash ? cashReceived : undefined,
                  )
                }
                disabled={
                  busy || (iReceiveItem && !photo) || (mustTickCash && !cashReceived)
                }
                primary
              >
                {iReceiveItem
                  ? t("actions.confirmReceipt")
                  : t("actions.confirmHandover")}
              </Btn>
              {/* The receiver can decline at delivery with a reason (item not as
                  described); the seller of a sale just calls it off. */}
              {iReceiveItem ? (
                <Btn
                  onClick={() => {
                    const reason = window.prompt(t("rejectPrompt"));
                    if (reason) a.cancelDeal(deal.id, reason);
                  }}
                  disabled={busy}
                >
                  {t("actions.reject")}
                </Btn>
              ) : (
                <Btn onClick={() => a.cancelDeal(deal.id)} disabled={busy}>
                  {t("actions.cancel")}
                </Btn>
              )}
            </div>
          </div>
        )}
        {deal.status === "ACCEPTED" && iConfirmed && (
          <p className="text-xs text-foreground-tertiary">{t("awaitingOther")}</p>
        )}
      </div>
    </div>
  );
}

/**
 * One shared clock for every deal card on the page, exposed as an external
 * store. Reading `Date.now()` during render is impure and would also mismatch
 * the server-rendered markup, so the countdown subscribes to this instead. The
 * snapshot is 0 until the first subscriber starts the interval.
 */
const clock = {
  now: 0,
  listeners: new Set<() => void>(),
  timer: null as ReturnType<typeof setInterval> | null,
  tick() {
    clock.now = Date.now();
    for (const listener of clock.listeners) listener();
  },
  subscribe(listener: () => void) {
    clock.listeners.add(listener);
    if (!clock.timer) {
      clock.tick();
      clock.timer = setInterval(clock.tick, 60_000);
    }
    return () => {
      clock.listeners.delete(listener);
      if (clock.listeners.size === 0 && clock.timer) {
        clearInterval(clock.timer);
        clock.timer = null;
      }
    };
  },
  snapshot: () => clock.now,
  serverSnapshot: () => 0,
};

/** The current time, or null before the client clock has started. */
function useNow(): number | null {
  return (
    useSyncExternalStore(clock.subscribe, clock.snapshot, clock.serverSnapshot) ||
    null
  );
}

/** A stored evidence photo — thumbnail that opens the full image in a new tab. */
function Evidence({ url, label }: { url: string; label: string }) {
  const src = resolveImageUrl(url);
  if (!src) return null;
  return (
    <a
      href={src}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center gap-1"
    >
      <div className="relative size-16 overflow-hidden rounded-lg border border-border-light">
        <Image src={src} alt={label} fill className="object-cover" sizes="64px" />
      </div>
      <span className="text-[10px] text-foreground-tertiary">{label}</span>
    </a>
  );
}

/** Compact "2d 5h" / "5h" / "45m" remaining, from milliseconds. */
function formatRemaining(ms: number): string {
  const totalMin = Math.floor(ms / 60000);
  const days = Math.floor(totalMin / 1440);
  const hours = Math.floor((totalMin % 1440) / 60);
  const mins = totalMin % 60;
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h`;
  return `${mins}m`;
}

function Btn({
  children,
  onClick,
  disabled,
  primary,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  primary?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-50 ${
        primary
          ? "bg-primary text-white hover:opacity-90"
          : "border border-border text-foreground hover:bg-background-secondary"
      }`}
    >
      {children}
    </button>
  );
}
