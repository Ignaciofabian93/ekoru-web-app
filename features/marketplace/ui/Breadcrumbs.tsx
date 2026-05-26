"use client";
import Breadcrumb from "@/components/BreadCrumbs/Breadcrumb";
import { useTranslation } from "@/i18n/context";
import { useRouter } from "next/navigation";

import { NAMESPACE } from "../i18n";

export interface Crumb {
  label: string;
  href?: string;
}

interface Props {
  /** Path to the marketplace root, used by the leading "Marketplace" crumb. */
  rootHref: string;
  items: Crumb[];
}

export function Breadcrumbs({ rootHref, items }: Props) {
  const { t } = useTranslation(NAMESPACE);
  const router = useRouter();

  const all: Crumb[] = [
    { label: t("breadcrumbs.marketplace"), href: rootHref },
    ...items,
  ];

  return (
    <Breadcrumb
      items={all.map((c) => ({
        label: c.label,
        onPress: c.href ? () => router.push(c.href as string) : undefined,
      }))}
    />
  );
}
