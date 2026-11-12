"use client";
import { Menu } from "lucide-react";
import clsx from "clsx";
import { useDrawer } from "@/context/DrawerContext";
import { useTranslation } from "@/i18n/context";
import { DRAWER_PANEL_ID } from "../Drawer/constants/data";
import { NAMESPACE } from "./i18n";

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
      className={clsx("btn btn-secondary p-2 font-bold", className)}
    >
      <Menu size={18} className="text-secondary-dark" strokeWidth={2.4} aria-hidden />
    </button>
  );
}
