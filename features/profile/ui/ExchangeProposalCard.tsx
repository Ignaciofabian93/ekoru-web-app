"use client";
import clsx from "clsx";
import { ArrowRight, Check, X } from "lucide-react";
import Image from "next/image";

import { Text } from "@/components/Primitives/Text";
import type { SupportedLanguage } from "@/constants/settings";
import { useFormatPrice } from "@/hooks/useFormatPrice";
import { useTranslation } from "@/i18n/context";
import type { ExchangeStatus } from "@/types/enums";
import { resolveImageUrl } from "@/utils/resolveImage";

import { NAMESPACE } from "../i18n";
import type {
  ExchangeDirection,
  ExchangeProductSummary,
  ExchangeProposalView,
} from "../hooks/useExchangeProposals";

const STATUS_TONE: Record<ExchangeStatus, string> = {
  PENDING: "bg-warning/10 text-warning",
  ACCEPTED: "bg-success/10 text-success",
  DECLINED: "bg-danger/10 text-danger",
  COMPLETED: "bg-primary/10 text-primary",
  CANCELLED: "bg-foreground-muted/20 text-foreground-secondary",
};

function Item({ label, product }: { label: string; product: ExchangeProductSummary }) {
  const { t } = useTranslation(NAMESPACE);
  const formatPrice = useFormatPrice();
  const src = resolveImageUrl(product.image);
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
      <Text size="xs" weight="semibold" color="tertiary" className="uppercase">
        {t(label)}
      </Text>
      <div className="flex items-center gap-2">
        <div className="bg-background-secondary relative size-12 shrink-0 overflow-hidden rounded-lg">
          {src && (
            <Image
              src={src}
              alt={product.name}
              fill
              sizes="48px"
              className="object-cover"
            />
          )}
        </div>
        <div className="min-w-0">
          <Text size="sm" weight="semibold" numberOfLines={1}>
            {product.name}
          </Text>
          <Text size="sm" weight="bold" color="primary">
            {formatPrice(product.price)}
          </Text>
        </div>
      </div>
    </div>
  );
}

interface Props {
  proposal: ExchangeProposalView;
  direction: ExchangeDirection;
  lang: SupportedLanguage;
  busy?: boolean;
  onAccept?: (id: string) => void;
  onDecline?: (id: string) => void;
}

export function ExchangeProposalCard({
  proposal,
  direction,
  busy,
  onAccept,
  onDecline,
}: Props) {
  const { t } = useTranslation(NAMESPACE);
  const formatPrice = useFormatPrice();

  // From the current user's point of view, regardless of who proposed.
  const youGive = direction === "received" ? proposal.requested : proposal.offered;
  const youGet = direction === "received" ? proposal.offered : proposal.requested;
  const diff = youGet.price - youGive.price;

  const balance =
    diff === 0
      ? t("exchanges.even")
      : diff > 0
        ? t("exchanges.youAdd", { amount: formatPrice(Math.abs(diff)) })
        : t("exchanges.theyAdd", { amount: formatPrice(Math.abs(diff)) });

  const counterpartLine =
    direction === "received"
      ? t("exchanges.from", { name: proposal.counterpartName })
      : t("exchanges.to", { name: proposal.counterpartName });

  const canRespond = direction === "received" && proposal.status === "PENDING";

  return (
    <div className="border-border-light bg-surface flex flex-col gap-3 rounded-2xl border p-4">
      <div className="flex items-center justify-between gap-2">
        <Text size="sm" weight="semibold" color="secondary" numberOfLines={1}>
          {counterpartLine}
        </Text>
        <span
          className={clsx(
            "shrink-0 rounded-full px-2 py-0.5 text-xs font-bold",
            STATUS_TONE[proposal.status],
          )}
        >
          {t(`exchanges.status.${proposal.status}`)}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Item label="exchanges.youGive" product={youGive} />
        <ArrowRight
          size={18}
          strokeWidth={2}
          className="text-foreground-tertiary shrink-0"
        />
        <Item label="exchanges.youGet" product={youGet} />
      </div>

      <div className="bg-background-secondary rounded-lg px-3 py-1.5">
        <Text size="sm" weight="semibold" color={diff === 0 ? "success" : "default"}>
          {balance}
        </Text>
      </div>

      {proposal.notes && (
        <div className="flex flex-col gap-0.5">
          <Text size="xs" weight="semibold" color="tertiary" className="uppercase">
            {t("exchanges.notesLabel")}
          </Text>
          <Text size="sm" color="secondary">
            {proposal.notes}
          </Text>
        </div>
      )}

      {canRespond && (
        <div className="flex gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => onAccept?.(proposal.id)}
            className={clsx(
              "flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-semibold transition-colors",
              busy
                ? "bg-border-light text-foreground-tertiary cursor-not-allowed"
                : "bg-primary text-on-primary hover:bg-primary-active cursor-pointer",
            )}
          >
            <Check size={16} strokeWidth={2.5} />
            {t("exchanges.accept")}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => onDecline?.(proposal.id)}
            className={clsx(
              "border-border text-foreground-secondary hover:bg-background-secondary flex flex-1 items-center justify-center gap-1.5 rounded-xl border py-2.5 text-sm font-semibold transition-colors",
              busy && "cursor-not-allowed opacity-60",
            )}
          >
            <X size={16} strokeWidth={2.5} />
            {t("exchanges.decline")}
          </button>
        </div>
      )}
    </div>
  );
}
