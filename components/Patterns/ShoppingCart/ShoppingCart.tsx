import clsx from "clsx";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Text } from "@/components/Primitives/Text";
import {
  shoppingCartBadgeClass,
  shoppingCartBadgePadClass,
  shoppingCartButtonClass,
  shoppingCartIconSize,
  shoppingCartIconStroke,
} from "@/design/shopping-cart";
import useCartStore, { useCartCount } from "@/store/useCartStore";

function Badge({ itemCount }: { itemCount: number }) {
  return (
    // The count is already part of the link's accessible name, so the badge is
    // decorative here — announcing it again would just repeat the number.
    <span
      aria-hidden
      className={clsx(
        shoppingCartBadgeClass,
        itemCount > 9 ? shoppingCartBadgePadClass.wide : shoppingCartBadgePadClass.narrow,
      )}
    >
      <Text variant="span" weight="bold" size="xs" color="white">
        {itemCount > 99 ? "99+" : itemCount}
      </Text>
    </span>
  );
}

interface ShoppingCartButtonProps {
  /**
   * Visible label, e.g. "Mi carro". Shown from `sm` up; below that the button
   * is icon-only, like "Publicar". The accessible names below should start
   * with it, so speech users can say what they see.
   */
  text?: string;
  /** Accessible name used when the cart is empty. */
  label?: string;
  /** Accessible name used when the cart holds exactly one item. */
  labelWithOneItem?: string;
  /** Accessible name for two or more items. Interpolates `{{count}}`. */
  labelWithItems?: string;
}

export function ShoppingCartButton({
  text = "My cart",
  label = "My cart, empty",
  labelWithOneItem = "My cart, 1 item",
  labelWithItems = "My cart, {{count}} items",
}: ShoppingCartButtonProps = {}) {
  const params = useParams();
  const lang = (params?.lang as string) ?? "es";
  const count = useCartCount();
  const isHydrated = useCartStore((s) => s.isHydrated);
  // Only trust the persisted count after hydration to avoid an SSR/client mismatch.
  const itemCount = isHydrated ? count : 0;

  const accessibleName =
    itemCount === 0
      ? label
      : itemCount === 1
        ? labelWithOneItem
        : labelWithItems.replace("{{count}}", String(itemCount));

  return (
    <Link
      href={`/${lang}/cart`}
      aria-label={accessibleName}
      className={shoppingCartButtonClass}
    >
      <ShoppingCart
        size={shoppingCartIconSize}
        strokeWidth={shoppingCartIconStroke}
        aria-hidden
        className="shrink-0"
      />
      {/* Visual only: the link's aria-label already names it, count included. */}
      <span aria-hidden className="hidden whitespace-nowrap sm:inline">
        {text}
      </span>
      {itemCount > 0 && <Badge itemCount={itemCount} />}
    </Link>
  );
}
