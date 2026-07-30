"use client";
import clsx from "clsx";
import { Info, Inbox, Send } from "lucide-react";
import { useState } from "react";

import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";
import { DEFAULT_LANGUAGE, type SupportedLanguage } from "@/constants/settings";
import { useTranslation } from "@/i18n/context";
import { useParams } from "next/navigation";

import {
  useExchangeProposals,
  type ExchangeDirection,
} from "../hooks/useExchangeProposals";
import { NAMESPACE } from "../i18n";
import { ExchangeProposalCard } from "./ExchangeProposalCard";

const TABS: { key: ExchangeDirection; icon: typeof Inbox }[] = [
  { key: "received", icon: Inbox },
  { key: "sent", icon: Send },
];

export function ExchangeInbox() {
  const { t } = useTranslation(NAMESPACE);
  const params = useParams<{ lang?: SupportedLanguage }>();
  const lang = params.lang ?? DEFAULT_LANGUAGE;

  const { received, sent, accept, decline, pendingId } = useExchangeProposals();
  const [tab, setTab] = useState<ExchangeDirection>("received");

  const items = tab === "received" ? received : sent;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <Title level="h1" size="h3" weight="semibold">
          {t("exchanges.title")}
        </Title>
        <Text size="sm" color="secondary">
          {t("exchanges.subtitle")}
        </Text>
      </div>

      {/* Preview-only banner — this is sample data until the backend lands. */}
      <div className="bg-primary/5 flex items-start gap-2 rounded-xl p-3">
        <Info size={14} strokeWidth={2} className="text-primary mt-0.5 shrink-0" />
        <Text size="xs" color="secondary">
          {t("exchanges.stubNotice")}
        </Text>
      </div>

      <div className="flex gap-2">
        {TABS.map(({ key, icon: Icon }) => {
          const active = tab === key;
          const count = (key === "received" ? received : sent).length;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              aria-pressed={active}
              className={clsx(
                "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-on-primary"
                  : "border-border-light bg-surface text-foreground-secondary hover:border-primary/40 border",
              )}
            >
              <Icon size={16} strokeWidth={2} />
              {t(`exchanges.tabs.${key}`)}
              <span
                className={clsx(
                  "rounded-full px-1.5 text-xs font-bold",
                  active ? "bg-on-primary/20" : "bg-background-secondary",
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {items.length === 0 ? (
        <div className="border-border-light bg-surface rounded-2xl border border-dashed px-4 py-16 text-center">
          <Text weight="semibold" color="secondary">
            {t(`exchanges.empty.${tab}`)}
          </Text>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map((proposal) => (
            <ExchangeProposalCard
              key={proposal.id}
              proposal={proposal}
              direction={tab}
              lang={lang}
              busy={pendingId === proposal.id}
              onAccept={accept}
              onDecline={decline}
            />
          ))}
        </div>
      )}
    </div>
  );
}
