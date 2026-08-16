"use client";
import type { SupportedLanguage } from "@/constants/settings";
import { Section } from "@/components/Layout";
import { Breadcrumb, type Crumb } from "@/components/Patterns/Breadcrumb";
import { ProductGallery } from "@/components/Patterns/ProductGallery";
import { ProductTrust, type ProductTrustItem } from "@/components/Patterns/ProductTrust";
import { SellerCard } from "@/components/Patterns/SellerCard/SellerCard";
import { useNavigation } from "@/hooks/useNavigation";
import { useTranslation } from "@/i18n/context";

import { SERVICE_TRUST_ITEMS } from "../constants/trust";
import { useService } from "../hooks/useService";
import { NAMESPACE } from "../i18n";
import { OtherFromProvider } from "./OtherFromProvider";
import { ServiceActions } from "./ServiceActions";
import { ServiceDescription } from "./ServiceDescription";
import { ServiceDetails } from "./ServiceDetails";
import { ServiceFaqs } from "./ServiceFaqs";
import { ServicePackages } from "./ServicePackages";
import { ServiceReviews } from "./ServiceReviews";
import { ServiceError, ServiceLoading, ServiceNotFound } from "./ServiceStatus";
import { ServiceSummary } from "./ServiceSummary";

interface Props {
  id: string;
  lang: SupportedLanguage;
}

export function ServiceContent({ id, lang }: Props) {
  const { service, loading, error } = useService(id);
  const { t } = useTranslation(NAMESPACE);
  const { navigateTo } = useNavigation();

  if (loading && !service) return <ServiceLoading />;
  if (error) return <ServiceError lang={lang} />;
  if (!service) return <ServiceNotFound lang={lang} />;

  const trustItems: ProductTrustItem[] = SERVICE_TRUST_ITEMS.map(
    ({ icon, titleKey, hintKey }) => ({
      icon,
      title: t(titleKey),
      hint: t(hintKey),
    }),
  );

  // The subcategory fragment carries no parent slug, so the trail stops at the
  // catalog root rather than guessing a `/services/[category]/…` path.
  const subcategoryName =
    service.serviceCategory?.translation?.subCategory ??
    service.serviceCategory?.subCategory;

  const breadCrumbs: Crumb[] = [
    { label: t("breadcrumbs.services"), href: `/${lang}/services` },
    ...(subcategoryName ? [{ label: subcategoryName }] : []),
    { label: service.name },
  ];

  return (
    <div>
      <Breadcrumb
        items={breadCrumbs.map((c) => ({
          label: c.label,
          onPress: c.href ? () => navigateTo({ route: c.href as string }) : undefined,
        }))}
        crumbColor="default"
        chevronColor="default"
      />
      <Section>
        <div className="grid gap-6 md:grid-cols-2 md:gap-10">
          <ProductGallery
            images={service.images ?? []}
            labels={{
              imageAlt: (index, total) =>
                t("gallery.imageAlt", {
                  name: service.name,
                  index: String(index),
                  total: String(total),
                }),
              noImage: t("gallery.noImage"),
              previous: t("gallery.previous"),
              next: t("gallery.next"),
              thumbnailAlt: (index) =>
                t("gallery.thumbnailAlt", { index: String(index) }),
              goToImage: (index) => t("gallery.goToImage", { index: String(index) }),
            }}
          />

          <div className="flex flex-col gap-5">
            <ServiceSummary service={service} />
            <ServiceActions lang={lang} service={service} />
            <ProductTrust items={trustItems} />
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="flex flex-col gap-8 md:col-span-2">
            <ServiceDescription description={service.description} />
            <ServiceDetails service={service} lang={lang} />
            <ServicePackages packages={service.packages} />
            <ServiceFaqs faqs={service.faqs} />
            <ServiceReviews
              serviceId={service.id}
              averageRating={service.averageRating}
            />
          </div>
          <div className="flex flex-col gap-8 md:col-span-1">
            {service.seller && (
              <SellerCard
                lang={lang}
                seller={service.seller}
                title={t("provider.title")}
                verifiedLabel={t("provider.verified")}
                sellerTypeLabel={t(`provider.types.${service.seller.sellerType}`)}
                viewSellerLabel={t("actions.viewProvider")}
              />
            )}
          </div>
        </div>

        {service.sellerId && (
          <OtherFromProvider
            lang={lang}
            sellerId={service.sellerId}
            excludeServiceId={service.id}
          />
        )}
      </Section>
    </div>
  );
}
