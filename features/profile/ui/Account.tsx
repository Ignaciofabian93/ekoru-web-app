"use client";
import { Title } from "@/components/Title/Title";
import { useTranslation } from "@/i18n/context";
import { NAMESPACE } from "../i18n";
import {
  ChevronRight,
  Gem,
  Heart,
  KeyRound,
  Leaf,
  PackagePlus,
  Settings,
  UserRoundPen,
} from "lucide-react";
import { Text } from "@/components/Text/Text";
import Link from "next/link";

export function Account() {
  const { t } = useTranslation(NAMESPACE);

  const ITEMS = [
    {
      key: "editProfile",
      route: `/profile/edit-profile`,
      icon: UserRoundPen,
      label: t("account.editProfile"),
    },
    {
      key: "changePassword",
      route: `/profile/change-password`,
      icon: KeyRound,
      label: t("account.changePassword"),
    },
    {
      key: "orderHistory",
      route: `/profile/orders`,
      icon: PackagePlus,
      label: t("account.orderHistory"),
    },
    {
      key: "favorites",
      route: `/profile/favorites`,
      icon: Heart,
      label: t("account.favorites"),
    },
    {
      key: "environmentalImpact",
      route: `/profile/environmental-impact`,
      icon: Leaf,
      label: t("account.environmentalImpact"),
    },
    {
      key: "subscription",
      route: `/profile/subscription`,
      icon: Gem,
      label: t("account.subscription"),
    },
    {
      key: "settings",
      route: `/profile/settings`,
      icon: Settings,
      label: t("account.settings"),
    },
  ];

  return (
    <section className="w-full max-w-3xl mx-auto my-16 px-8">
      <div className="mb-4">
        <Title level="h5" size="h5">
          {t("account.title")}
        </Title>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {ITEMS.map((item) => (
          <div key={item.key} className="flex items-center">
            <div className="bg-primary-light/20 p-3 rounded-lg text-primary">
              <item.icon size={18} />
            </div>
            <Link
              href={item.route}
              className="flex ml-4 items-center justify-between w-full"
            >
              <Text variant="span" weight="normal" size="base">
                {item.label}
              </Text>
              <ChevronRight size={14} />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
