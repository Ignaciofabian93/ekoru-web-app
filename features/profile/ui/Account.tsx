"use client";
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
  type LucideIcon,
} from "lucide-react";
import { Text } from "@/components/Text/Text";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DEFAULT_LANGUAGE, type SupportedLanguage } from "@/constants/settings";
import { SectionCard } from "./SectionCard";

interface AccountItem {
  key: string;
  route: string;
  icon: LucideIcon;
  labelKey: string;
}

const ITEMS: AccountItem[] = [
  {
    key: "editProfile",
    route: "/profile/edit-profile",
    icon: UserRoundPen,
    labelKey: "account.editProfile",
  },
  {
    key: "changePassword",
    route: "/profile/change-password",
    icon: KeyRound,
    labelKey: "account.changePassword",
  },
  {
    key: "orderHistory",
    route: "/profile/orders",
    icon: PackagePlus,
    labelKey: "account.orderHistory",
  },
  {
    key: "favorites",
    route: "/profile/favorites",
    icon: Heart,
    labelKey: "account.favorites",
  },
  {
    key: "environmentalImpact",
    route: "/profile/environmental-impact",
    icon: Leaf,
    labelKey: "account.environmentalImpact",
  },
  {
    key: "subscription",
    route: "/profile/subscription",
    icon: Gem,
    labelKey: "account.subscription",
  },
  {
    key: "settings",
    route: "/profile/settings",
    icon: Settings,
    labelKey: "account.settings",
  },
];

export function Account() {
  const { t } = useTranslation(NAMESPACE);
  const params = useParams<{ lang?: SupportedLanguage }>();
  const lang = params.lang ?? DEFAULT_LANGUAGE;

  return (
    <SectionCard title={t("account.title")} subtitle={t("account.subtitle")}>
      {/* Single column inside the desktop sidebar, two columns when the card
          spans the full width on tablets. */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.key}
              href={`/${lang}${item.route}`}
              className="flex items-center gap-3 rounded-lg p-2.5 transition-colors hover:bg-background-secondary"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-light/20 text-primary">
                <Icon size={16} color="currentColor" strokeWidth={2} />
              </div>
              <Text variant="span" weight="medium" size="base" className="flex-1">
                {t(item.labelKey)}
              </Text>
              <ChevronRight
                size={16}
                color="currentColor"
                strokeWidth={2}
                className="text-foreground-tertiary"
              />
            </Link>
          );
        })}
      </div>
    </SectionCard>
  );
}
