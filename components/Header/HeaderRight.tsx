"use client";
import clsx from "clsx";
import { useDrawer } from "@/context/DrawerContext";
import { Menu, ShoppingCart } from "lucide-react";
import ProfileDropdown from "./ProfileDropdown";
import LanguageDropdown from "./LanguageDropdown";

interface CartButtonProps {
  itemCount?: number;
}

function CartButton({ itemCount = 0 }: CartButtonProps) {
  return (
    <button
      type="button"
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
    </button>
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
