"use client";
import { ArrowUpRight, SearchX } from "lucide-react";
import { ServiceCard, ProductScroller } from "@/components/ProductCards";
import { EmptyState } from "@/components/Feedback/EmptyState";
import { Section } from "@/components/Layout";
import { SectionHeader } from "@/components/Patterns/SectionHeader";
import { LinkButton } from "@/components/Primitives";
import { useTranslation } from "@/i18n/context";
import { useSellerServices } from "../hooks/useSellerServices";
import { NAMESPACE } from "../i18n";
import { toServiceCardService } from "../serviceCard";

interface Props {
  lang: string;
  sellerId: string;
  excludeServiceId: string | number;
}

/** More from the same provider, laid out like the product page's seller rail. */
export function OtherFromProvider({ lang, sellerId, excludeServiceId }: Props) {
  const { t } = useTranslation(NAMESPACE);
  const { services, loading } = useSellerServices({ sellerId, excludeServiceId });
  const isEmpty = !loading && services.length === 0;

  return (
    <Section ariaLabel={t("otherServices.title")}>
      <SectionHeader
        align="start"
        title={t("otherServices.title")}
        action={
          isEmpty ? undefined : (
            <LinkButton
              href={`/${lang}/seller/${sellerId}`}
              label={t("actions.viewAll")}
              icon={ArrowUpRight}
              iconPosition="right"
              variant="ghost"
            />
          )
        }
      />

      <ProductScroller
        items={services}
        loading={loading}
        empty={
          <EmptyState variant="compact" icon={SearchX} title={t("otherServices.empty")} />
        }
        renderItem={(service) => (
          <ServiceCard service={toServiceCardService(service)} lang={lang} />
        )}
      />
    </Section>
  );
}
