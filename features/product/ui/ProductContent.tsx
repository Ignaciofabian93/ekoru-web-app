"use client";
import clsx from "clsx";
import { useState } from "react";
import type { SupportedLanguage } from "@/constants/settings";
import { useProduct } from "../hooks/useProduct";
import { OtherFromSeller } from "./OtherFromSeller";
import { ProductDescription } from "./ProductDescription";
import { ProductDetails } from "./ProductDetails";
import { ProductGallery } from "@/components/Patterns/ProductGallery";
import { ProductImpact } from "./ProductImpact";
import { ProductPurchasePanel } from "./ProductPurchasePanel";
import { ProductError, ProductLoading, ProductNotFound } from "./ProductStatus";
import { ProductSummary } from "./ProductSummary";
import { ProductTrust, type ProductTrustItem } from "@/components/Patterns/ProductTrust";
import { SellerCard } from "@/components/Patterns/SellerCard/SellerCard";
import { Breadcrumb, type Crumb } from "@/components/Patterns/Breadcrumb";
import { useNavigation } from "@/hooks/useNavigation";
import { Section } from "@/components/Layout";
import { useTranslation } from "@/i18n/context";
import { NAMESPACE } from "../i18n";
import { ExchangeProposal } from "./ExchangeProposal";
import { Handshake, MapPin, PackageSearch } from "lucide-react";

/**
 * The page's two rails. Declared once and reused by every row, which is what
 * keeps the columns lined up from the gallery down to the spec table. Stacked
 * below `md` — at phone width the rails would be too narrow to read.
 */
const RAILS = "grid grid-cols-1 gap-6 md:grid-cols-12 md:items-start md:gap-10";
const RAIL_MAIN = "md:col-span-7";
const RAIL_SIDE = "md:col-span-5";

interface Props {
  id: string;
  lang: SupportedLanguage;
}

export function ProductContent({ id, lang }: Props) {
  const { product, loading, error } = useProduct(id);
  const { navigateTo } = useNavigation();
  const { t } = useTranslation(NAMESPACE);
  // Opt-in, from the panel's exchange CTA — an exchangeable listing still
  // opens on the buy panel rather than on the proposal form.
  const [proposingExchange, setProposingExchange] = useState(false);

  if (loading && !product) return <ProductLoading />;
  if (error) return <ProductError lang={lang} />;
  if (!product) return <ProductNotFound lang={lang} />;

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

  const { productCategory, isExchangeable } = product;

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
        {/* Two rails, 7 and 5, held all the way down: the description and the
            spec table stay aligned with the gallery and the buy panel above
            them. The page used to change grid halfway (two columns, then
            three), which left the seller card starting on its own. */}
        <div className={RAILS}>
          <div className={RAIL_MAIN}>
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
          </div>

          {/* What it is, what it costs and how to act, then who is selling and
              how the handover works — the order the decision is made in. The
              seller moved up here from the bottom column: trust matters at the
              moment of deciding, not after the spec table. */}
          <div className={clsx(RAIL_SIDE, "flex flex-col gap-5")}>
            <ProductSummary product={product} lang={lang} />

            <ProductPurchasePanel
              product={product}
              lang={lang}
              onProposeExchange={() => setProposingExchange(true)}
            />

            {/* Opens over the listing rather than replacing the panel, so the
                price stays put and Cancel comes straight back to it. Mounted
                only while open: the viewer's listings are not fetched until
                asked for, and nothing stale is left behind on close. */}
            {isExchangeable && proposingExchange && (
              <ExchangeProposal
                product={product}
                lang={lang}
                onClose={() => setProposingExchange(false)}
              />
            )}

            {product.seller && (
              <SellerCard
                lang={lang}
                seller={product.seller}
                verifiedLabel={t("seller.verified")}
                sellerTypeLabel={t(`seller.types.${product.seller.sellerType}`)}
                viewSellerLabel={t("actions.viewSeller")}
              />
            )}

            <ProductTrust items={trustItems} />
          </div>
        </div>

        <div className={RAILS}>
          <div className={RAIL_MAIN}>
            <ProductDescription description={product.description} />
          </div>
          <div className={RAIL_SIDE}>
            <ProductDetails product={product} lang={lang} />
          </div>
        </div>

        {/* Full width, below both rails — see `ProductImpact`. */}
        <ProductImpact impact={product.environmentalImpact} />

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
