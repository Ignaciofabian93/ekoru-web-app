"use client";
import { Button } from "@/components/Primitives/Button";
import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";
import { useTranslation } from "@/i18n/context";
import { useParams } from "next/navigation";
import {
  useBusinessProfile,
  usePersonProfile,
  useSellerType,
} from "@/store/useAuthStore";
import { DEFAULT_LANGUAGE, type SupportedLanguage } from "@/constants/settings";
import clsx from "clsx";
import { Check, Crown, Gem, Sparkles, type LucideIcon } from "lucide-react";
import type {
  BusinessSubscriptionPlan,
  PersonSubscriptionPlan,
  SellerType,
} from "@/types/enums";
import { NAMESPACE } from "../i18n";
import { useSubscribe } from "../hooks/useSubscribe";
import { SectionCard } from "./SectionCard";

type PersonPlanKey = PersonSubscriptionPlan;
type BusinessPlanKey = BusinessSubscriptionPlan;
type PlanKey = PersonPlanKey | BusinessPlanKey;

interface PlanConfig {
  key: PlanKey;
  price: number;
  currency: string;
  highlight?: boolean;
  icon: LucideIcon;
  features: number;
}

const PERSON_PLANS: PlanConfig[] = [
  { key: "FREEMIUM", price: 0, currency: "USD", icon: Sparkles, features: 3 },
  { key: "BASIC", price: 4.9, currency: "USD", icon: Gem, features: 3, highlight: true },
  { key: "ADVANCED", price: 12.9, currency: "USD", icon: Crown, features: 4 },
];

const BUSINESS_PLANS: PlanConfig[] = [
  { key: "FREEMIUM", price: 0, currency: "USD", icon: Sparkles, features: 3 },
  { key: "STARTUP", price: 9.9, currency: "USD", icon: Gem, features: 3 },
  { key: "BASIC", price: 24.9, currency: "USD", icon: Gem, features: 3, highlight: true },
  { key: "ADVANCED", price: 49.9, currency: "USD", icon: Crown, features: 3 },
  { key: "EXPERT", price: 99.9, currency: "USD", icon: Crown, features: 4 },
];

function formatPrice(price: number, currency: string, locale: string) {
  if (price === 0) return "$0";
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(price);
  } catch {
    return `${currency} ${price}`;
  }
}

export function SubscriptionPlans() {
  const { t } = useTranslation(NAMESPACE);
  const params = useParams<{ lang?: SupportedLanguage }>();
  const lang = params.lang ?? DEFAULT_LANGUAGE;
  const sellerType: SellerType | null = useSellerType();
  const personProfile = usePersonProfile();
  const businessProfile = useBusinessProfile();

  const isBusiness = sellerType !== null && sellerType !== "PERSON";
  const plans = isBusiness ? BUSINESS_PLANS : PERSON_PLANS;
  const currentPlan: PlanKey | null = isBusiness
    ? (businessProfile?.businessSubscriptionPlan ?? null)
    : (personProfile?.personSubscriptionPlan ?? null);

  const groupKey = isBusiness ? "business" : "person";
  const currentConfig = plans.find((p) => p.key === currentPlan);
  const { subscribe, pendingKey, isSubscribable } = useSubscribe();

  return (
    <div className="flex flex-col gap-5">
      {/* Current plan card */}
      <SectionCard
        icon={currentConfig?.icon ?? Sparkles}
        tone="primary"
        title={t("subscription.current.label")}
        subtitle={
          currentConfig
            ? t(`subscription.${groupKey}.${currentConfig.key}.tagline`)
            : t("subscription.current.free")
        }
        headerRight={
          currentConfig ? (
            <div className="hidden sm:block">
              <Text variant="span" size="sm" color="tertiary">
                {currentConfig.price === 0
                  ? ""
                  : `${formatPrice(currentConfig.price, currentConfig.currency, lang)} / ${t("subscription.plans.month")}`}
              </Text>
            </div>
          ) : null
        }
      >
        <div className="flex flex-col gap-3">
          <div className="flex items-baseline gap-2">
            <Title level="h2" size="h3" weight="bold">
              {currentConfig
                ? t(`subscription.${groupKey}.${currentConfig.key}.name`)
                : "—"}
            </Title>
          </div>
          {currentConfig && currentConfig.price > 0 && (
            <div className="flex flex-wrap gap-2">
              <Button
                text={t("subscription.current.manage")}
                variant="outline"
                size="sm"
              />
              <Button
                text={t("subscription.current.cancel")}
                variant="ghost"
                size="sm"
              />
            </div>
          )}
        </div>
      </SectionCard>

      {/* Available plans */}
      <div className="flex flex-col gap-1.5">
        <Title level="h2" size="h5" weight="semibold">
          {t("subscription.plans.title")}
        </Title>
        <Text variant="span" size="sm" color="tertiary">
          {t("subscription.plans.subtitle")}
        </Text>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isActive = plan.key === currentPlan;
          const isHighlight = plan.highlight && !isActive;

          return (
            <div
              key={plan.key}
              className={clsx(
                "relative flex flex-col gap-4 rounded-2xl border-2 bg-surface p-5 transition-all",
                isActive
                  ? "border-primary shadow-lg"
                  : isHighlight
                    ? "border-secondary shadow-md"
                    : "border-border-light hover:border-primary/40",
              )}
            >
              {isActive && (
                <span className="absolute -top-3 left-5 rounded-full bg-primary px-3 py-1 text-xs font-bold text-on-primary">
                  {t("subscription.plans.active")}
                </span>
              )}
              {isHighlight && (
                <span className="absolute -top-3 left-5 rounded-full bg-secondary px-3 py-1 text-xs font-bold text-on-primary">
                  {t("subscription.plans.popular")}
                </span>
              )}

              <div className="flex items-start justify-between">
                <div
                  className={clsx(
                    "flex h-12 w-12 items-center justify-center rounded-xl",
                    isActive
                      ? "bg-primary text-on-primary"
                      : isHighlight
                        ? "bg-secondary/10 text-secondary"
                        : "bg-primary-light/20 text-primary",
                  )}
                >
                  <Icon size={22} color="currentColor" strokeWidth={2} />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <Title level="h3" size="h5" weight="bold">
                  {t(`subscription.${groupKey}.${plan.key}.name`)}
                </Title>
                <Text variant="span" size="sm" color="tertiary">
                  {t(`subscription.${groupKey}.${plan.key}.tagline`)}
                </Text>
              </div>

              <div className="flex items-baseline gap-1.5">
                <Title
                  level="h2"
                  size="h3"
                  weight="bold"
                  color={isActive ? "primary" : "default"}
                >
                  {formatPrice(plan.price, plan.currency, lang)}
                </Title>
                {plan.price > 0 && (
                  <Text variant="span" size="sm" color="tertiary">
                    /{t("subscription.plans.month")}
                  </Text>
                )}
              </div>

              <ul className="flex flex-1 flex-col gap-2.5">
                {Array.from({ length: plan.features }).map((_, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                      <Check size={12} color="currentColor" strokeWidth={3} />
                    </span>
                    <Text variant="span" size="sm">
                      {t(`subscription.${groupKey}.${plan.key}.feature${i + 1}`)}
                    </Text>
                  </li>
                ))}
              </ul>

              {(() => {
                // FREEMIUM (price 0) isn't a payment; only paid plans that
                // resolved to a real membership id are subscribable.
                const isPaid = plan.price > 0;
                const canSubscribe = !isActive && isPaid && isSubscribable(plan.key);
                const isPending = pendingKey === plan.key;
                return (
                  <Button
                    text={
                      isActive
                        ? t("subscription.plans.active")
                        : t("subscription.plans.select")
                    }
                    variant={isActive ? "outline" : isHighlight ? "secondary" : "primary"}
                    size="md"
                    fullWidth
                    disabled={isActive || !canSubscribe || isPending}
                    onClick={canSubscribe ? () => void subscribe(plan.key) : undefined}
                  />
                );
              })()}
            </div>
          );
        })}
      </div>
    </div>
  );
}
