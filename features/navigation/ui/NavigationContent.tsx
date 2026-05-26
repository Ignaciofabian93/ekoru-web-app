"use client";
import { CustomHeader } from "@/components/Header/CustomHeader";
import { type SupportedLanguage } from "@/constants/settings";
import SearchBar from "@/components/SearchBar/SearchBar";
import SubHeader, { type Item } from "@/components/SubHeader/SubHeader";
import { Newspaper, Package, ScanBarcode, Store, UsersRound } from "lucide-react";
import { useTranslation } from "@/i18n/context";
import { NAMESPACE } from "../i18n";
import type { ReactNode } from "react";

export function NavigationContent({
  logo,
}: {
  logo: ReactNode;
  lang: SupportedLanguage;
}) {
  const { t } = useTranslation(NAMESPACE);

  const SUBHEADER_LINKS = [
    {
      key: "marketplace",
      route: `/marketplace`,
      icon: Package,
      label: t("marketplace"),
    },
    { key: "stores", route: `/stores`, icon: Store, label: t("stores") },
    {
      key: "services",
      route: `/services`,
      icon: ScanBarcode,
      label: t("services"),
    },
    {
      key: "community",
      route: `/community`,
      icon: UsersRound,
      label: t("community"),
    },
    { key: "blog", route: `/blog`, icon: Newspaper, label: t("blog") },
  ] as Item[];

  return (
    <CustomHeader
      logo={logo}
      searchBar={<SearchBar placeholder={t("searchPlaceholder")} />}
      subHeader={<SubHeader subheaderLinks={SUBHEADER_LINKS} />}
    />
  );
}
