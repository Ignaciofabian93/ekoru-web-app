"use client";

import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";
import { useBusinessProfile } from "@/hooks/useSellerData";
import { useTranslation } from "@/i18n/context";
import type { Seller } from "@/types/user";

import { NAMESPACE } from "../i18n";

function isPresent<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

function titleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

// businessHours is an untyped map from the users subgraph. Support the common
// shapes defensively: a plain string ("9-18", "Closed"), or an object carrying
// open/close (under a few possible key names) plus an optional closed flag.
function formatHours(value: unknown): { closed: boolean; text: string } {
  if (!isPresent(value)) return { closed: true, text: "" };
  if (typeof value === "string") return { closed: false, text: value };
  if (typeof value === "object") {
    const v = value as Record<string, unknown>;
    if (v.closed === true || v.isClosed === true) return { closed: true, text: "" };
    const open = v.open ?? v.from ?? v.start ?? v.opening;
    const close = v.close ?? v.to ?? v.end ?? v.closing;
    if (isPresent(open) && isPresent(close)) {
      return { closed: false, text: `${String(open)} – ${String(close)}` };
    }
  }
  return { closed: false, text: "" };
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <dt className="shrink-0 text-sm font-medium text-foreground">{label}</dt>
      <dd className="min-w-0 truncate text-right text-sm font-medium text-foreground-secondary">
        {value}
      </dd>
    </div>
  );
}

/**
 * Store-only profile sections: buying policies, service details and opening
 * hours. Renders nothing for marketplace sellers or when a business has none of
 * these fields populated.
 */
export function SellerBusinessInfo({ seller }: { seller: Seller }) {
  const { t } = useTranslation(NAMESPACE);
  const profile = useBusinessProfile(seller);

  if (!profile) return null;

  const hasPolicies = Boolean(profile.shippingPolicy || profile.returnPolicy);
  const hasService = Boolean(
    profile.serviceArea ||
    isPresent(profile.travelRadius) ||
    isPresent(profile.yearsOfExperience) ||
    (profile.certifications && profile.certifications.length > 0),
  );
  const hoursEntries =
    profile.businessHours && typeof profile.businessHours === "object"
      ? Object.entries(profile.businessHours as Record<string, unknown>)
      : [];
  const hasHours = hoursEntries.length > 0;

  if (!hasPolicies && !hasService && !hasHours) return null;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {hasPolicies && (
        <section>
          <Title level="h2" size="h6" weight="medium" className="mb-4">
            {t("businessInfo.policiesTitle")}
          </Title>
          <dl className="flex flex-col gap-3">
            {profile.shippingPolicy && (
              <div>
                <dt className="text-sm font-medium text-foreground">
                  {t("businessInfo.shipping")}
                </dt>
                <dd className="mt-0.5 text-sm text-foreground-secondary">
                  {profile.shippingPolicy}
                </dd>
              </div>
            )}
            {profile.returnPolicy && (
              <div>
                <dt className="text-sm font-medium text-foreground">
                  {t("businessInfo.returns")}
                </dt>
                <dd className="mt-0.5 text-sm text-foreground-secondary">
                  {profile.returnPolicy}
                </dd>
              </div>
            )}
          </dl>
        </section>
      )}

      {hasService && (
        <section>
          <Title level="h2" size="h6" weight="medium" className="mb-4">
            {t("businessInfo.serviceTitle")}
          </Title>
          <dl className="flex flex-col divide-y divide-border-light">
            {profile.serviceArea && (
              <Row label={t("businessInfo.serviceArea")} value={profile.serviceArea} />
            )}
            {isPresent(profile.travelRadius) && (
              <Row
                label={t("businessInfo.travelRadius")}
                value={t("businessInfo.travelRadiusValue", {
                  km: String(profile.travelRadius),
                })}
              />
            )}
            {isPresent(profile.yearsOfExperience) && (
              <Row
                label={t("businessInfo.experience")}
                value={t("businessInfo.experienceValue", {
                  years: String(profile.yearsOfExperience),
                })}
              />
            )}
          </dl>
          {profile.certifications && profile.certifications.length > 0 && (
            <div className="mt-3">
              <p className="mb-2 text-sm font-medium text-foreground">
                {t("businessInfo.certifications")}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {profile.certifications.map((c) => (
                  <span
                    key={c}
                    className="rounded-full bg-primary-light-bg px-2.5 py-0.5 text-xs font-medium text-primary"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {hasHours && (
        <section>
          <Title level="h2" size="h6" weight="medium" className="mb-4">
            {t("businessInfo.hoursTitle")}
          </Title>
          <dl className="flex flex-col divide-y divide-border-light">
            {hoursEntries.map(([day, value]) => {
              const { closed, text } = formatHours(value);
              return (
                <div key={day} className="flex items-center justify-between gap-4 py-2">
                  <dt className="text-sm text-foreground">{titleCase(day)}</dt>
                  <Text variant="span" size="sm" weight="medium">
                    {closed || !text ? t("businessInfo.closed") : text}
                  </Text>
                </div>
              );
            })}
          </dl>
        </section>
      )}
    </div>
  );
}
