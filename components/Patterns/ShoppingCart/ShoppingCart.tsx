import clsx from "clsx";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Text } from "@/components/Primitives/Text";
import useCartStore, { useCartCount } from "@/store/useCartStore";
import {
  shoppingCartBadgeClass,
  shoppingCartBadgePadClass,
  shoppingCartButtonClass,
  shoppingCartIconSize,
  shoppingCartIconStroke,
  shoppingCartLabelClass,
} from "./styles";

function Badge({ itemCount }: { itemCount: number }) {
  return (
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

export interface ShoppingCartButtonProps {
  text?: string;
  label?: string;
  labelWithOneItem?: string;
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
      <span aria-hidden className={shoppingCartLabelClass}>
        {text}
      </span>
      {itemCount > 0 && <Badge itemCount={itemCount} />}
    </Link>
  );
}
