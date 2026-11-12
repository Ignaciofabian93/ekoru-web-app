"use client";
import clsx from "clsx";
import { PackagePlus } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import { useTranslation } from "@/i18n/context";
import { NAMESPACE } from "./i18n";

export function PublishButton({ className }: { className?: string }) {
  const [language] = useLanguage();
  const { t } = useTranslation(NAMESPACE);

  return (
    <Link
      href={`/${language}/publish`}
      className={clsx(
        "flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-md sm:w-auto sm:px-4",
        "bg-linear-90 from-primary-dark via-primary to-primary-light",
        "font-sans text-sm font-bold text-white shadow-sm outline-none",
        "transition-all duration-200 hover:brightness-110",
        className,
      )}
    >
      <PackagePlus size={18} strokeWidth={2} aria-hidden className="shrink-0" />
      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
        {t("dropdown.publish")}
      </span>
    </Link>
  );
}
