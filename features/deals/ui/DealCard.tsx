"use client";
import { useState } from "react";
import Image from "next/image";
import { ArrowLeftRight, Clock, ImageOff, ShieldAlert } from "lucide-react";

import { useFormatPrice } from "@/hooks/useFormatPrice";
import { resolveImageUrl } from "@/utils/resolveImage";
import { useCurrentSellerId } from "@/store/useAuthStore";

import type { Deal, DealPerspective, DealProduct } from "../types";
import { useDealActions } from "../hooks/useDealActions";

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
        <Image src={cover} alt={product?.name ?? ""} fill className="object-cover" sizes="64px" />
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
  const formatPrice = useFormatPrice();
  const myId = useCurrentSellerId();
  const a = useDealActions();
  const [photo, setPhoto] = useState<File | null>(null);
  const busy = a.busyId === deal.id;

  const isExchange = deal.type === "EXCHANGE";
  const item = isExchange ? deal.requestedProduct : deal.product;
  const iConfirmed =
    perspective === "buyer" ? !!deal.buyerConfirmedAt : !!deal.sellerConfirmedAt;
  // The buyer always receives an item; the seller only in an exchange.
  const iReceiveItem = perspective === "buyer" || isExchange;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border-light bg-surface p-4">
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
              Compensación en efectivo: {formatPrice(deal.compensationAmount)}
              {deal.compensationPayerId === myId ? " (pagas tú)" : " (paga la otra parte)"}
            </p>
          )}
        </div>
        <span
          className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-medium ${STATUS_STYLE[deal.status] ?? "bg-border"}`}
        >
          {deal.status}
        </span>
      </div>

      {deal.status === "ACCEPTED" && deal.confirmationDeadline && (
        <p className="flex items-center gap-1.5 text-xs text-foreground-tertiary">
          <Clock size={13} />
          Confirmar antes de {new Date(deal.confirmationDeadline).toLocaleString()}
        </p>
      )}
      {deal.status === "DISPUTED" && deal.disputeReason && (
        <p className="flex items-center gap-1.5 text-xs text-red-600">
          <ShieldAlert size={13} /> {deal.disputeReason}
        </p>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        {perspective === "seller" && deal.status === "PROPOSED" && (
          <>
            <Btn onClick={() => a.acceptDeal(deal.id)} disabled={busy} primary>
              Aceptar
            </Btn>
            <Btn onClick={() => a.declineDeal(deal.id)} disabled={busy}>
              Rechazar
            </Btn>
          </>
        )}
        {perspective === "buyer" && deal.status === "PROPOSED" && (
          <Btn onClick={() => a.cancelDeal(deal.id)} disabled={busy}>
            Cancelar
          </Btn>
        )}
        {deal.status === "ACCEPTED" && !iConfirmed && (
          <div className="flex w-full flex-col gap-2">
            {iReceiveItem && (
              <label className="text-xs text-foreground-secondary">
                Foto del producto recibido (obligatoria)
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
                  className="mt-1 block w-full text-xs"
                />
              </label>
            )}
            <div className="flex gap-2">
              <Btn
                onClick={() => a.confirmDeal(deal.id, photo ?? undefined)}
                disabled={busy || (iReceiveItem && !photo)}
                primary
              >
                Confirmar recepción
              </Btn>
              <Btn
                onClick={() => {
                  const reason = window.prompt("Motivo de la disputa:");
                  if (reason) a.disputeDeal(deal.id, reason);
                }}
                disabled={busy}
              >
                Disputar
              </Btn>
              <Btn onClick={() => a.cancelDeal(deal.id)} disabled={busy}>
                Cancelar
              </Btn>
            </div>
          </div>
        )}
        {deal.status === "ACCEPTED" && iConfirmed && (
          <p className="text-xs text-foreground-tertiary">
            Confirmaste — esperando a la otra parte.
          </p>
        )}
      </div>
    </div>
  );
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
