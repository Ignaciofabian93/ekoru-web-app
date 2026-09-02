"use client";
import { Text } from "@/components/Primitives/Text";
import { useTranslation } from "@/i18n/context";
import clsx from "clsx";
import {
  Check,
  ChevronRight,
  MessageSquare,
  Repeat2,
  Truck,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DEFAULT_LANGUAGE, type SupportedLanguage } from "@/constants/settings";
import { NAMESPACE } from "../i18n";
import { SectionCard } from "@/components/Patterns/SectionCard";

// TODO(action-center): wire to real GraphQL counts (pending orders / unread
// messages / open exchange proposals) when those endpoints land.
const MOCK_COUNTS = {
  ordersToShip: 2,
  unreadMessages: 5,
  exchangeProposals: 1,
};

type ActionKey = "ordersToShip" | "unreadMessages" | "exchangeProposals";

interface ActionDef {
  key: ActionKey;
  icon: LucideIcon;
  tone: string;
  href: (lang: string) => string;
}

const ACTIONS: ActionDef[] = [
  {
    key: "ordersToShip",
    icon: Truck,
    tone: "bg-warning/10 text-warning",
    href: () => "#",
  },
  {
    key: "unreadMessages",
    icon: MessageSquare,
    tone: "bg-info/10 text-info",
    href: () => "#",
  },
  {
    key: "exchangeProposals",
    icon: Repeat2,
    tone: "bg-success/10 text-success",
    href: (lang) => `/${lang}/profile/exchanges`,
  },
];

export function ActionCenter() {
  const { t } = useTranslation(NAMESPACE);
  const params = useParams<{ lang?: SupportedLanguage }>();
  const lang = params.lang ?? DEFAULT_LANGUAGE;

  const items = ACTIONS.map((a) => ({
    ...a,
    count: MOCK_COUNTS[a.key],
  })).filter((a) => a.count > 0);

  return (
    <SectionCard
      icon={items.length > 0 ? items[0].icon : Check}
      tone={items.length > 0 ? "warning" : "success"}
      title={t("dashboard.actionCenter.title")}
      subtitle={t("dashboard.actionCenter.subtitle")}
    >
      {items.length === 0 ? (
        <div className="flex items-center gap-2 text-success">
          <Check size={16} color="currentColor" strokeWidth={2.5} />
          <Text variant="span" weight="semibold">
            {t("dashboard.actionCenter.empty")}
          </Text>
        </div>
      ) : (
        <ul className="flex flex-col">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <li
                key={item.key}
                className={clsx(
                  "flex items-center gap-3 py-3",
                  i < items.length - 1 && "border-b border-border-light",
                )}
              >
                <div
                  className={clsx(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                    item.tone,
                  )}
                >
                  <Icon size={16} color="currentColor" strokeWidth={2} />
                </div>
                <div className="flex flex-1 flex-col">
                  <Text variant="span" weight="semibold" size="base">
                    {t(`dashboard.actionCenter.${item.key}`)}
                  </Text>
                  <Text variant="span" size="sm" color="tertiary">
                    {t(`dashboard.actionCenter.${item.key}Description`)}
                  </Text>
                </div>
                <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-on-primary">
                  {item.count}
                </span>
                <Link
                  href={item.href(lang)}
                  className="ml-2 flex h-8 w-8 items-center justify-center rounded-md text-foreground-tertiary transition-colors hover:bg-background-secondary hover:text-foreground"
                  aria-label={t("dashboard.actionCenter.viewAll")}
                >
                  <ChevronRight size={16} color="currentColor" strokeWidth={2} />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </SectionCard>
  );
}
