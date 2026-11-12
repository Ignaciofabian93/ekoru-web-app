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
    <Link href={`/${language}/publish`} className={clsx("btn btn-primary", className)}>
      <PackagePlus size={18} strokeWidth={2} aria-hidden className="shrink-0" />
      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
        {t("dropdown.publish")}
      </span>
    </Link>
  );
}
