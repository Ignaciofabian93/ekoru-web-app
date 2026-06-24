"use client";
import clsx from "clsx";
import { useDrawer } from "@/context/DrawerContext";
import { Menu, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import useCartStore, { useCartCount } from "@/store/useCartStore";
import ProfileDropdown from "./ProfileDropdown";
import LanguageDropdown from "./LanguageDropdown";

function CartButton() {
  const params = useParams();
  const lang = (params?.lang as string) ?? "es";
  const count = useCartCount();
  const isHydrated = useCartStore((s) => s.isHydrated);
  // Only trust the persisted count after hydration to avoid an SSR/client mismatch.
  const itemCount = isHydrated ? count : 0;

  return (
    <Link
      href={`/${lang}/cart`}
      aria-label={`Shopping cart${itemCount > 0 ? `, ${itemCount} items` : ""}`}
      className="relative flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-white/10 outline-none transition-all duration-150 hover:border-white/50 hover:bg-white/20 active:scale-95 active:bg-white/30"
    >
      <ShoppingCart size={18} color="#fff" strokeWidth={1.6} />
      {itemCount > 0 && (
        <span
          className={clsx(
            "absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full border border-lime-800 bg-amber-500 font-bold leading-none text-gray-800",
            "text-[10px]",
            itemCount > 9 ? "px-1" : "px-0",
          )}
        >
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </Link>
  );
}

const MobileHeader = () => {
  const { openDrawer } = useDrawer();

  return (
    <div className="flex items-center gap-3 md:hidden">
      <LanguageDropdown />
      <CartButton />
      <button
        type="button"
        onClick={openDrawer}
        aria-label="Open menu"
        className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-white/10 outline-none transition-all duration-150 hover:border-white/50 hover:bg-white/20 active:scale-95"
      >
        <Menu size={18} color="white" strokeWidth={1.6} />
      </button>
    </div>
  );
};

const DesktopHeader = () => (
  <div className="hidden md:flex items-center gap-3">
    <LanguageDropdown />
    <CartButton />
    <ProfileDropdown />
  </div>
);

export default function HeaderRight() {
  return (
    <div className="flex items-center gap-4">
      <MobileHeader />
      <DesktopHeader />
    </div>
  );
}
