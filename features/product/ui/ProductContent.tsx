"use client";
import type { SupportedLanguage } from "@/constants/settings";
import { useProduct } from "../hooks/useProduct";
import { OtherFromSeller } from "./OtherFromSeller";
import { ProductActions } from "./ProductActions";
import { ProductDescription } from "./ProductDescription";
import { ProductDetails } from "./ProductDetails";
import { ProductGallery } from "@/components/Patterns/ProductGallery";
import { ProductImpact } from "./ProductImpact";
import { ProductError, ProductLoading, ProductNotFound } from "./ProductStatus";
import { ProductSummary } from "./ProductSummary";
import { ProductTrust, type ProductTrustItem } from "@/components/Patterns/ProductTrust";
import { SellerCard } from "@/components/Patterns/SellerCard/SellerCard";
import { Breadcrumb, type Crumb } from "@/components/Patterns/Breadcrumb";
import { useNavigation } from "@/hooks/useNavigation";
import { Section } from "@/components/Layout";
import { useTranslation } from "@/i18n/context";
import { NAMESPACE } from "../i18n";
import { useSearchParams } from "next/navigation";
import { ExchangeProposal } from "./ExchangeProposal";
import { Handshake, MapPin, PackageSearch } from "lucide-react";

interface Props {
  id: string;
  lang: SupportedLanguage;
}

export function ProductContent({ id, lang }: Props) {
  const { product, loading, error } = useProduct(id);
  const { navigateTo } = useNavigation();
  const { t } = useTranslation(NAMESPACE);
  const searchParams = useSearchParams();

  if (loading && !product) return <ProductLoading />;
  if (error) return <ProductError lang={lang} />;
  if (!product) return <ProductNotFound lang={lang} />;

  // Entered via the card's "propose an exchange" CTA (`?mode=exchange`). Only
  // honored for products the seller actually marked exchangeable.
  const isExchangeMode =
    searchParams.get("mode") === "exchange" && product.isExchangeable;

  // Marketplace listings are settled face to face: the buyer and the seller
  // agree on a handover, cash changes hands there, and Ekoru ships nothing.
  const trustItems: ProductTrustItem[] = [
    {
      icon: Handshake,
      title: t("trust.inPersonPayment"),
      hint: t("trust.inPersonPaymentHint"),
    },
    {
      icon: MapPin,
      title: t("trust.meetup"),
      hint: t("trust.meetupHint"),
    },
    {
      icon: PackageSearch,
      title: t("trust.inspect"),
      hint: t("trust.inspectHint"),
    },
  ];

  const { productCategory } = product;

  const categoryName = productCategory?.translation?.name;
  const categoryHref = productCategory?.translation?.href;
  const depCategoryName = productCategory?.departmentCategory?.translation.name;
  const depCategoryHref = productCategory?.departmentCategory?.translation.href;
  const departmentName = productCategory?.departmentCategory?.department.translation.name;
  const departmentHref = productCategory?.departmentCategory?.department.translation.href;

  const breadCrumbs: Crumb[] = [
    { label: "Marketplace", href: `/${lang}/marketplace` },
    {
      label: departmentName,
      href: `/${lang}/marketplace/${departmentHref}`,
    },
    {
      label: depCategoryName,
      href: `/${lang}/marketplace/${departmentHref}/${depCategoryHref}`,
    },
    {
      label: categoryName,
      href: `/${lang}/marketplace/${departmentHref}/${depCategoryHref}/${categoryHref}`,
    },
    { label: product.name },
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
            images={product.images ?? []}
            labels={{
              imageAlt: (index, total) =>
                t("gallery.imageAlt", {
                  name: product.name,
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
            <ProductSummary product={product} />
            {isExchangeMode ? (
              <ExchangeProposal product={product} lang={lang} />
            ) : (
              <>
                <ProductActions lang={lang} product={product} />
                <ProductTrust items={trustItems} />
              </>
            )}
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="flex flex-col gap-8 md:col-span-2">
            <ProductDescription description={product.description} />
            <ProductDetails product={product} lang={lang} />
            <ProductImpact impact={product.environmentalImpact} />
          </div>
          <div className="flex flex-col gap-8 md:col-span-1">
            {product.seller && (
              <SellerCard
                lang={lang}
                seller={product.seller}
                title={t("seller.title")}
                verifiedLabel={t("seller.verified")}
                sellerTypeLabel={t(`seller.types.${product.seller.sellerType}`)}
                viewSellerLabel={t("actions.viewSeller")}
              />
            )}
          </div>
        </div>

        {product.sellerId && (
          <OtherFromSeller
            lang={lang}
            sellerId={product.sellerId}
            excludeProductId={product.id}
          />
        )}
      </Section>
    </div>
  );
}
