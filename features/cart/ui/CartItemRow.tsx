"use client";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { QuantityStepper } from "@/components/Patterns/QuantityStepper";
import { Badge } from "@/components/Primitives/Badge";
import { IconButton } from "@/components/Primitives/IconButton";
import { Text } from "@/components/Primitives/Text";
import { useFormatPrice } from "@/hooks/useFormatPrice";
import { useTranslation } from "@/i18n/context";
import type { CartItem } from "@/store/useCartStore";
import { resolveImageUrl } from "@/utils/resolveImage";

type Props = {
  item: CartItem;
  /** The product's own page. */
  href: string;
  onQuantityChange: (next: number) => void;
  onRemove: () => void;
};

/**
 * One cart line. On a phone it is two rows — photo, name and remove on top,
 * quantity and line total underneath across the full width, where the stepper
 * has room. From `sm` the wrapper of that second row drops out (`contents`) and
 * everything lines up in one row, with remove moved to the far end.
 */
export function CartItemRow({ item, href, onQuantityChange, onRemove }: Props) {
  const { t } = useTranslation("cart");
  const formatPrice = useFormatPrice();
  const image = resolveImageUrl(item.image);
  const lineTotal = item.unitPrice * item.quantity;
  const maxStock = typeof item.maxStock === "number" ? item.maxStock : Infinity;
  const atMax = item.source === "store" && item.quantity >= maxStock;

  return (
    <li className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-x-3 gap-y-3 py-4 first:pt-0 last:pb-0 sm:grid-cols-[auto_minmax(0,1fr)_auto_auto_auto] sm:items-center sm:gap-x-5">
      {/* The name below is the same link; this copy is for the pointer only. */}
      <Link
        href={href}
        tabIndex={-1}
        aria-hidden
        className="relative size-20 shrink-0 overflow-hidden rounded-xl border border-border-light bg-background-secondary sm:size-24"
      >
        {image ? (
          <Image src={image} alt="" fill sizes="96px" className="object-cover" />
        ) : null}
      </Link>

      <div className="flex min-w-0 flex-col gap-1 self-center">
        <Link
          href={href}
          className="rounded-sm outline-none hover:underline focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Text variant="span" weight="semibold" numberOfLines={2}>
            {item.name}
          </Text>
        </Link>
        {item.quantity > 1 ? (
          <Text variant="small" color="secondary" className="tabular-nums">
            {t("cart.item.each", { price: formatPrice(item.unitPrice, item.currency) })}
          </Text>
        ) : null}
        {atMax ? (
          <Text variant="small" color="tertiary">
            {t("cart.item.maxStock")}
          </Text>
        ) : null}
      </div>

      <IconButton
        icon={Trash2}
        ariaLabel={t("cart.item.remove")}
        variant="ghost"
        size="sm"
        onClick={onRemove}
        className="hover:text-danger sm:order-last"
      />

      <div className="col-span-3 flex items-center justify-between gap-3 sm:col-span-1 sm:contents">
        {item.source === "store" ? (
          // The stepper centers itself (`mx-auto`, from the button frame); a
          // wrapper exactly its width leaves that margin nothing to take, so it
          // stays at the start of the row instead of floating to the middle.
          <div>
            <QuantityStepper
              value={item.quantity}
              min={1}
              max={maxStock}
              onChange={onQuantityChange}
              size="sm"
              label={t("cart.item.quantity")}
              decreaseLabel={t("cart.item.decrease")}
              increaseLabel={t("cart.item.increase")}
            />
          </div>
        ) : (
          // Marketplace items are unique single units — no counter, just the
          // line price. Removal happens through the trash button.
          <Badge variant="ghost" size="medium" label={t("cart.item.singleUnit")} />
        )}
        <Text
          variant="span"
          weight="bold"
          size="lg"
          className="tabular-nums sm:min-w-28 sm:text-right"
        >
          {formatPrice(lineTotal, item.currency)}
        </Text>
      </div>
    </li>
  );
}
