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
import { SectionCard } from "@/components/Patterns/SectionCard";

type PersonPlanKey = PersonSubscriptionPlan;
type BusinessPlanKey = BusinessSubscriptionPlan;
type PlanKey = PersonPlanKey | BusinessPlanKey;

/**
 * Presentation only — icon, emphasis and how many feature bullets to read out
 * of the dictionary. **Prices are never configured here**: they come from
 * `…MembershipPricing` for the seller's country, which is what the buyer is
 * actually charged. A hardcoded price could disagree with the charge.
 */
interface PlanConfig {
  key: PlanKey;
  highlight?: boolean;
  icon: LucideIcon;
  features: number;
}

const PERSON_PLANS: PlanConfig[] = [
  { key: "FREEMIUM", icon: Sparkles, features: 3 },
  { key: "BASIC", icon: Gem, features: 3, highlight: true },
  { key: "ADVANCED", icon: Crown, features: 4 },
];

const BUSINESS_PLANS: PlanConfig[] = [
  { key: "FREEMIUM", icon: Sparkles, features: 3 },
  { key: "STARTUP", icon: Gem, features: 3 },
  { key: "BASIC", icon: Gem, features: 3, highlight: true },
  { key: "ADVANCED", icon: Crown, features: 3 },
  { key: "EXPERT", icon: Crown, features: 4 },
];

/** The free tier is the one plan with no payment behind it. */
const FREE_PLAN: PlanKey = "FREEMIUM";

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

function formatDate(iso: string, locale: string) {
  try {
    return new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
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
  const { subscribe, pendingKey, isSubscribable, priceFor, current } = useSubscribe();
  const currentPrice = currentConfig ? priceFor(currentConfig.key) : null;

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
          currentPrice ? (
            <div className="hidden sm:block">
              <Text variant="span" size="sm" color="tertiary">
                {`${formatPrice(currentPrice.price, currentPrice.currency, lang)} / ${
                  currentPrice.months === 1
                    ? t("subscription.plans.month")
                    : t("subscription.plans.perMonths", {
                        count: String(currentPrice.months),
                      })
                }`}
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
          {/* A paid term is one-off today: it expires rather than renewing, so
              the honest thing to show is when it ends — not a cancel button
              for a recurrence that does not exist. */}
          {current?.endDate && (
            <div className="flex flex-col gap-0.5">
              <Text variant="span" size="sm" weight="semibold">
                {t("subscription.current.until", {
                  date: formatDate(current.endDate, lang),
                })}
              </Text>
              {!current.autoRenew && (
                <Text variant="span" size="xs" color="tertiary">
                  {t("subscription.current.oneOff")}
                </Text>
              )}
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
          const price = priceFor(plan.key);
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
                {plan.key === FREE_PLAN ? (
                  <Title
                    level="h2"
                    size="h3"
                    weight="bold"
                    color={isActive ? "primary" : "default"}
                  >
                    {formatPrice(0, "USD", lang)}
                  </Title>
                ) : price ? (
                  <>
                    <Title
                      level="h2"
                      size="h3"
                      weight="bold"
                      color={isActive ? "primary" : "default"}
                    >
                      {formatPrice(price.price, price.currency, lang)}
                    </Title>
                    <Text variant="span" size="sm" color="tertiary">
                      /
                      {price.months === 1
                        ? t("subscription.plans.month")
                        : t("subscription.plans.perMonths", {
                            count: String(price.months),
                          })}
                    </Text>
                  </>
                ) : (
                  // No pricing row for this country: say so instead of showing
                  // a number the buyer would not actually be charged.
                  <Text variant="span" size="sm" color="tertiary">
                    {t("subscription.plans.unavailable")}
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
                // FREEMIUM isn't a payment; a paid plan is only subscribable
                // once it resolved to a real membership id *and* a price for
                // this country.
                const isPaid = plan.key !== FREE_PLAN && price !== null;
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
