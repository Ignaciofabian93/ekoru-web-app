"use client";
import { CheckCircle2, ExternalLink, Info, Link2Off, Wallet } from "lucide-react";
import { useParams } from "next/navigation";

import { SectionCard } from "@/components/Patterns/SectionCard";
import { Badge } from "@/components/Primitives/Badge";
import { Button } from "@/components/Primitives/Button";
import { Skeleton } from "@/components/Primitives/Skeleton";
import { Text } from "@/components/Primitives/Text";
import { DEFAULT_LANGUAGE, type SupportedLanguage } from "@/constants/settings";
import { useTranslation } from "@/i18n/context";
import { useHasSellerType } from "@/store/useAuthStore";

import { usePayoutSetup } from "../hooks/usePayoutSetup";
import { NAMESPACE } from "../i18n";

type State = "connected" | "reconnect" | "disconnected";

const BADGE: Record<State, "secondary" | "attention" | "ghost"> = {
  connected: "secondary",
  reconnect: "attention",
  disconnected: "ghost",
};

/**
 * Profile → Cobros (WEB-2). Where a business connects the Mercado Pago
 * account its buyers pay into, for free. EKORU never holds the money: Mercado
 * Pago splits EKORU's commission off each sale at source.
 */
export function PayoutSetup() {
  const { t } = useTranslation(NAMESPACE);
  const params = useParams<{ lang?: SupportedLanguage }>();
  const lang = params.lang ?? DEFAULT_LANGUAGE;
  const isBusiness = useHasSellerType("STARTUP", "COMPANY");
  const { setup, loading, finishing, busy, connect, unlink } = usePayoutSetup({
    lang,
    enabled: isBusiness,
  });

  if (!isBusiness) {
    return (
      <SectionCard icon={Wallet} tone="primary" title={t("payouts.title")}>
        <Text variant="p" color="secondary">
          {t("payouts.businessOnly")}
        </Text>
      </SectionCard>
    );
  }

  const state: State = setup?.connected
    ? "connected"
    : setup?.needsReconnect
      ? "reconnect"
      : "disconnected";
  const percent = new Intl.NumberFormat(lang, {
    style: "percent",
    maximumFractionDigits: 2,
  }).format(setup?.commissionRate ?? 0);
  const date = (iso: string | null) =>
    iso
      ? new Intl.DateTimeFormat(lang, { dateStyle: "medium" }).format(new Date(iso))
      : "—";

  return (
    <div className="flex flex-col gap-6">
      <SectionCard
        icon={Wallet}
        tone="primary"
        title={t("payouts.title")}
        subtitle={t("payouts.subtitle")}
        headerRight={
          loading || finishing ? undefined : (
            <Badge label={t(`payouts.status.${state}`)} variant={BADGE[state]} />
          )
        }
      >
        {loading || finishing ? (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-5 w-2/5" />
            <Skeleton className="h-14 w-full" />
            {finishing && (
              <Text variant="small" color="secondary">
                {t("payouts.finishing")}
              </Text>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {setup?.accountId && (
              <Text variant="span" weight="medium">
                {t("payouts.account", { id: setup.accountId })}
              </Text>
            )}
            <Text variant="p">{t(`payouts.explain.${state}`)}</Text>

            {state === "connected" && setup && (
              <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="flex flex-col gap-0.5">
                  <Text variant="small" color="secondary">
                    {t("payouts.fields.environment")}
                  </Text>
                  <Text variant="span" weight="medium">
                    {t(`payouts.environments.${setup.environment ?? "SANDBOX"}`)}
                  </Text>
                </div>
                <div className="flex flex-col gap-0.5">
                  <Text variant="small" color="secondary">
                    {t("payouts.fields.connectedAt")}
                  </Text>
                  <Text variant="span" weight="medium">
                    {date(setup.connectedAt)}
                  </Text>
                </div>
                <div className="flex flex-col gap-0.5">
                  <Text variant="small" color="secondary">
                    {t("payouts.fields.renewsBefore")}
                  </Text>
                  <Text variant="span" weight="medium">
                    {date(setup.tokenExpiresAt)}
                  </Text>
                </div>
              </dl>
            )}

            <div className="flex flex-wrap gap-3">
              {state === "connected" ? (
                <Button
                  text={t("payouts.actions.disconnect")}
                  variant="outline"
                  leftIcon={Link2Off}
                  onPress={unlink}
                  loading={busy}
                  disabled={busy}
                />
              ) : (
                <Button
                  text={t(
                    state === "reconnect"
                      ? "payouts.actions.reconnect"
                      : "payouts.actions.connect",
                  )}
                  leftIcon={ExternalLink}
                  onPress={connect}
                  loading={busy}
                  disabled={busy}
                />
              )}
            </div>
          </div>
        )}
      </SectionCard>

      <SectionCard icon={Info} title={t("payouts.how.title")}>
        <ul className="flex flex-col gap-2">
          {(["direct", "commission", "providerFee", "refunds"] as const).map((key) => (
            <li key={key} className="flex gap-2">
              <CheckCircle2 size={16} className="mt-1 shrink-0 text-primary" />
              <Text variant="span">{t(`payouts.how.${key}`, { percent })}</Text>
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}
