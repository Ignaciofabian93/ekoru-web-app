"use client";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";

import { Text } from "@/components/Primitives/Text";
import { useFormatPrice } from "@/hooks/useFormatPrice";
import { useTranslation } from "@/i18n/context";
import type { CartItem } from "@/store/useCartStore";
import { resolveImageUrl } from "@/utils/resolveImage";

type Props = {
  item: CartItem;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
};

export function CartItemRow({ item, onIncrease, onDecrease, onRemove }: Props) {
  const { t } = useTranslation("cart");
  const formatPrice = useFormatPrice();
  const image = resolveImageUrl(item.image);
  const lineTotal = item.unitPrice * item.quantity;
  const atMax = typeof item.maxStock === "number" && item.quantity >= item.maxStock;

  return (
    <li className="flex gap-3 rounded-xl border border-border-light bg-surface p-3">
      <div className="relative size-20 shrink-0 overflow-hidden rounded-md bg-background-secondary">
        {image ? (
          <Image src={image} alt={item.name} fill sizes="80px" className="object-cover" />
        ) : null}
      </div>

      <div className="flex flex-1 flex-col justify-between gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col">
            <Text variant="span" weight="semibold" numberOfLines={2}>
              {item.name}
            </Text>
            {item.sellerName ? (
              <Text variant="small" color="secondary">
                {t("cart.item.soldBy", { seller: item.sellerName })}
              </Text>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onRemove}
            aria-label={t("cart.item.remove")}
            className="flex size-8 cursor-pointer items-center justify-center rounded-md text-foreground-tertiary hover:bg-background-secondary hover:text-danger"
          >
            <Trash2 size={16} strokeWidth={2} />
          </button>
        </div>

        <div className="flex items-center justify-between gap-2">
          {item.source === "store" ? (
            <div className="flex items-center gap-1 rounded-md border border-border-light">
              <button
                type="button"
                onClick={onDecrease}
                aria-label={t("cart.item.decrease")}
                className="flex size-8 cursor-pointer items-center justify-center text-foreground-secondary hover:text-foreground"
              >
                <Minus size={14} strokeWidth={2.5} />
              </button>
              <span className="min-w-6 text-center font-sans text-sm font-semibold text-foreground">
                {item.quantity}
              </span>
              <button
                type="button"
                onClick={onIncrease}
                disabled={atMax}
                aria-label={t("cart.item.increase")}
                className="flex size-8 items-center justify-center text-foreground-secondary hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40 enabled:cursor-pointer"
              >
                <Plus size={14} strokeWidth={2.5} />
              </button>
            </div>
          ) : (
            // Marketplace items are unique single units — no counter, just the
            // line price. Removal happens via the trash icon above.
            <span className="rounded-md bg-background-secondary px-2 py-1 font-sans text-xs font-medium text-foreground-secondary">
              {t("cart.item.singleUnit")}
            </span>
          )}
          <Text variant="span" weight="bold">
            {formatPrice(lineTotal, item.currency)}
          </Text>
        </div>
      </div>
    </li>
  );
}
