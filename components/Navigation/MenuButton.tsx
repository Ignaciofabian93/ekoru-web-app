"use client";
import { Menu } from "lucide-react";
import clsx from "clsx";
import { useDrawer } from "@/context/DrawerContext";
import { useTranslation } from "@/i18n/context";
import { DRAWER_PANEL_ID } from "../Drawer/constants/data";
import { NAMESPACE } from "./i18n";

/**
 * Opens the app drawer — the only entry point to the full menu on small
 * screens, where the profile dropdown is hidden. The drawer itself lives in the
 * root layout, so this just flips the shared context.
 */
export default function MenuButton({ className }: { className?: string }) {
  const { isOpen, openDrawer } = useDrawer();
  const { t } = useTranslation(NAMESPACE);

  return (
    <button
      type="button"
      onClick={openDrawer}
      aria-label={t("a11y.openMenu")}
      aria-controls={DRAWER_PANEL_ID}
      aria-expanded={isOpen}
      aria-haspopup="dialog"
      className={clsx(
        "flex w-10 h-10 shrink-0 cursor-pointer items-center justify-center",
        "rounded-full border border-white/25 bg-white/10 outline-none",
        "transition-all duration-150 hover:border-white/50 hover:bg-white/20",
        "active:scale-95 active:bg-white/30",
        "focus-visible:border-white focus-visible:ring-2 focus-visible:ring-white/80",
        className,
      )}
    >
      <Menu size={18} color="#fff" strokeWidth={1.6} aria-hidden />
    </button>
  );
}
