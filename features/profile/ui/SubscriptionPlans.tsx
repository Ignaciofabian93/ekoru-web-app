"use client";
import { Button } from "@/components/Primitives/Button";
import { Chip } from "@/components/Primitives/Chip";
import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";
import { useFormatPrice } from "@/hooks/useFormatPrice";
import { useTranslation } from "@/i18n/context";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useSellerType } from "@/store/useAuthStore";
import { DEFAULT_LANGUAGE, type SupportedLanguage } from "@/constants/settings";
import clsx from "clsx";
import { Check, Crown, Gem, Sparkles, type LucideIcon } from "lucide-react";
import type {
  BusinessSubscriptionPlan,
  PersonSubscriptionPlan,
  SellerType,
} from "@/types/enums";
import { NAMESPACE } from "../i18n";
import { useSubscribe, type PlanTerm } from "../hooks/useSubscribe";
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

/** How buying a card's plan relates to the term the seller holds (USR-16). */
type PlanAction = "none" | "new" | "extend" | "upgrade" | "lower";

export function SubscriptionPlans() {
  const { t } = useTranslation(NAMESPACE);
  const params = useParams<{ lang?: SupportedLanguage }>();
  const lang = params.lang ?? DEFAULT_LANGUAGE;
  const sellerType: SellerType | null = useSellerType();
  const formatPrice = useFormatPrice();

  const isBusiness = sellerType !== null && sellerType !== "PERSON";
  const plans = isBusiness ? BUSINESS_PLANS : PERSON_PLANS;
  const { subscribe, pendingKey, termsFor, current, currentLoaded } = useSubscribe();
  // The plan comes from the active subscription itself: the profile carries no
  // plan field, so reading one there always came back empty. No subscription
  // means the free tier.
  const currentPlan: PlanKey | null = current
    ? (current.plan as PlanKey)
    : currentLoaded
      ? FREE_PLAN
      : null;

  const groupKey = isBusiness ? "business" : "person";
  const currentConfig = plans.find((p) => p.key === currentPlan);
  const currentTerm =
    current && currentConfig
      ? (termsFor(currentConfig.key).find(
          (term) => term.membershipId === String(current.membershipId),
        ) ?? null)
      : null;
  // Plans are listed lowest first, so the index is the rank.
  const rank = (key: PlanKey) => plans.findIndex((p) => p.key === key);
  const paidRank =
    current && currentPlan && currentPlan !== FREE_PLAN ? rank(currentPlan) : -1;

  const monthsLabel = (months: number) =>
    months === 1
      ? t("subscription.plans.month")
      : t("subscription.plans.perMonths", { count: String(months) });

  const actionFor = (key: PlanKey): PlanAction => {
    if (key === FREE_PLAN || !currentLoaded) return "none";
    if (paidRank < 0) return "new";
    const r = rank(key);
    if (r === paidRank) return "extend";
    return r > paidRank ? "upgrade" : "lower";
  };

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
          currentTerm ? (
            <div className="hidden sm:block">
              <Text variant="span" size="sm" color="tertiary">
                {`${formatPrice(currentTerm.price, currentTerm.currency)} / ${monthsLabel(
                  currentTerm.months,
                )}`}
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
          {/* A paid term is one-off: it expires rather than renewing, so the
              honest thing to show is when it ends — prepaid extensions
              included — not a cancel button for a recurrence that does not
              exist. */}
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
        {plans.map((plan) => (
          <PlanCard
            key={plan.key}
            plan={plan}
            groupKey={groupKey}
            isActive={plan.key === currentPlan}
            action={actionFor(plan.key)}
            terms={termsFor(plan.key)}
            paidUntil={current?.endDate ? formatDate(current.endDate, lang) : ""}
            pending={pendingKey === plan.key}
            busy={pendingKey !== null}
            monthsLabel={monthsLabel}
            onSubscribe={(term) => void subscribe(plan.key, term)}
          />
        ))}
      </div>

      {/* The no-refund rule is in the terms (section 13); say it where the
          buyer decides, not only there. */}
      <Text variant="span" size="xs" color="tertiary">
        {t("subscription.plans.noRefunds")}{" "}
        <Link
          href={`/${lang}/terms-and-conditions`}
          className="font-semibold text-primary underline-offset-2 hover:underline"
        >
          {t("subscription.plans.termsLink")}
        </Link>
      </Text>
    </div>
  );
}

function PlanCard({
  plan,
  groupKey,
  isActive,
  action,
  terms,
  paidUntil,
  pending,
  busy,
  monthsLabel,
  onSubscribe,
}: {
  plan: PlanConfig;
  groupKey: "person" | "business";
  isActive: boolean;
  action: PlanAction;
  terms: PlanTerm[];
  /** When the held run of terms ends, already formatted. */
  paidUntil: string;
  pending: boolean;
  busy: boolean;
  monthsLabel: (months: number) => string;
  onSubscribe: (term: PlanTerm) => void;
}) {
  const { t } = useTranslation(NAMESPACE);
  const formatPrice = useFormatPrice();
  const [termId, setTermId] = useState<string | null>(null);

  const Icon = plan.icon;
  const isFree = plan.key === FREE_PLAN;
  const isHighlight = plan.highlight && !isActive;
  // The shortest term until the buyer picks another.
  const term = terms.find((x) => x.membershipId === termId) ?? terms[0] ?? null;
  // Savings are measured against the shortest term's monthly price.
  const base = terms[0];
  const perMonth = term ? term.price / term.months : 0;
  const saving =
    term && base && term.months > base.months
      ? Math.round((1 - perMonth / (base.price / base.months)) * 100)
      : 0;

  const canBuy = !isFree && term !== null && action !== "none" && action !== "lower";
  const buttonText = (() => {
    if (isFree)
      return t(isActive ? "subscription.plans.active" : "subscription.plans.select");
    if (action === "extend" && term)
      return t("subscription.plans.extend", { months: monthsLabel(term.months) });
    if (action === "upgrade") return t("subscription.plans.upgrade");
    return t("subscription.plans.select");
  })();
  const hint =
    isFree || !term
      ? null
      : action === "extend"
        ? t("subscription.plans.extendHint", { date: paidUntil })
        : action === "upgrade"
          ? t("subscription.plans.upgradeHint")
          : action === "lower"
            ? t("subscription.plans.lowerHint")
            : null;

  return (
    <div
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

      {/* One chip per term on sale, when there is a choice. */}
      {!isFree && terms.length > 1 && (
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label={t("subscription.plans.termLabel")}
        >
          {terms.map((x) => (
            <Chip
              key={x.membershipId}
              label={monthsLabel(x.months)}
              selected={x.membershipId === term?.membershipId}
              onPress={() => setTermId(x.membershipId)}
            />
          ))}
        </div>
      )}

      <div className="flex flex-col gap-0.5">
        <div className="flex items-baseline gap-1.5">
          {isFree ? (
            <Title
              level="h2"
              size="h3"
              weight="bold"
              color={isActive ? "primary" : "default"}
            >
              {formatPrice(0)}
            </Title>
          ) : term ? (
            <>
              <Title
                level="h2"
                size="h3"
                weight="bold"
                color={isActive ? "primary" : "default"}
              >
                {formatPrice(term.price, term.currency)}
              </Title>
              <Text variant="span" size="sm" color="tertiary">
                /{monthsLabel(term.months)}
              </Text>
            </>
          ) : (
            // No pricing row for this country: say so instead of showing a
            // number the buyer would not actually be charged.
            <Text variant="span" size="sm" color="tertiary">
              {t("subscription.plans.unavailable")}
            </Text>
          )}
        </div>
        {term && term.months > 1 && (
          <Text variant="span" size="xs" color="tertiary">
            {t("subscription.plans.perMonthEquivalent", {
              price: formatPrice(Math.round(perMonth), term.currency),
            })}
            {saving > 0 &&
              ` · ${t("subscription.plans.saving", { percent: String(saving) })}`}
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

      <div className="flex flex-col gap-1.5">
        <Button
          text={buttonText}
          variant={isActive ? "outline" : isHighlight ? "secondary" : "primary"}
          size="md"
          fullWidth
          loading={pending}
          disabled={!canBuy || busy}
          onClick={canBuy && term ? () => onSubscribe(term) : undefined}
        />
        {hint && (
          <Text variant="span" size="xs" color="tertiary" align="center">
            {hint}
          </Text>
        )}
      </div>
    </div>
  );
}
