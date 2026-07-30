import { Text } from "@/components/Primitives/Text";
import useCartStore, { useCartCount } from "@/store/useCartStore";
import clsx from "clsx";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

function Badge({ itemCount }: { itemCount: number }) {
  return (
    // The count is already part of the link's accessible name, so the badge is
    // decorative here — announcing it again would just repeat the number.
    <span
      aria-hidden
      className={clsx(
        "absolute -right-2 -top-1 flex h-5 min-w-5 items-center justify-center",
        "rounded-full border border-white/40 bg-secondary-dark font-bold leading-none",
        itemCount > 9 ? "px-1" : "px-0",
      )}
    >
      <Text variant="span" weight="bold" size="xs" color="white">
        {itemCount > 99 ? "99+" : itemCount}
      </Text>
    </span>
  );
}

interface ShoppingCartButtonProps {
  /** Accessible name used when the cart is empty. */
  label?: string;
  /** Accessible name used when the cart holds exactly one item. */
  labelWithOneItem?: string;
  /** Accessible name for two or more items. Interpolates `{{count}}`. */
  labelWithItems?: string;
}

export function ShoppingCartButton({
  label = "Shopping cart, empty",
  labelWithOneItem = "Shopping cart, 1 item",
  labelWithItems = "Shopping cart, {{count}} items",
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
      className={clsx(
        "relative flex w-10 h-10 shrink-0 cursor-pointer items-center justify-center",
        "rounded-full border border-white/25 bg-white/10 outline-none",
        "transition-all duration-150 hover:border-white/50 hover:bg-white/20",
        "focus-visible:border-white focus-visible:ring-2 focus-visible:ring-white/80",
      )}
    >
      <ShoppingCart size={18} color="#fff" strokeWidth={1.6} aria-hidden />
      {itemCount > 0 && <Badge itemCount={itemCount} />}
    </Link>
  );
}
