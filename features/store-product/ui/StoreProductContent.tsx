"use client";
import clsx from "clsx";
import type { SupportedLanguage } from "@/constants/settings";
import { StoreProductDescription } from "./StoreProductDescription";
import { StoreProductDetails } from "./StoreProductDetails";
import { StoreProductImpact } from "./StoreProductImpact";
import { StoreProductReviews } from "./StoreProductReviews";
import {
  StoreProductError,
  StoreProductLoading,
  StoreProductNotFound,
} from "./StoreProductStatus";
import { StoreProductSummary } from "./StoreProductSummary";
import { useStoreProduct } from "../hooks/useStoreProduct";
import { StoreProductPurchasePanel } from "./StoreProductPurchasePanel";
import { OtherFromBusiness } from "./OtherFromBusiness";
import { Section } from "@/components/Layout";
import { Breadcrumb, type Crumb } from "@/components/Patterns/Breadcrumb";
import { useTranslation } from "@/i18n/context";
import { useNavigation } from "@/hooks/useNavigation";
import { NAMESPACE } from "../i18n";
import { ProductGallery } from "@/components/Patterns/ProductGallery";
import { ProductTrust, type ProductTrustItem } from "@/components/Patterns/ProductTrust";
import { SellerCard } from "@/components/Patterns/SellerCard/SellerCard";
import { ReceiptText, ShieldCheck, Truck } from "lucide-react";
import { RAIL_MAIN, RAIL_SIDE, RAILS } from "@/design/detail-rails";

interface Props {
  id: string;
  lang: SupportedLanguage;
}

export function StoreProductContent({ id, lang }: Props) {
  const { product, loading, error } = useStoreProduct(id);
  const { t } = useTranslation(NAMESPACE);
  const { navigateTo } = useNavigation();

  if (loading && !product) return <StoreProductLoading />;
  if (error) return <StoreProductError lang={lang} />;
  if (!product) return <StoreProductNotFound lang={lang} />;

  // Store orders are paid online through checkout. Delivery is still open — no
  // provider picked, and it is undecided whether the store ships itself — so the
  // row stays as a "coming soon" placeholder instead of promising a service.
  const trustItems: ProductTrustItem[] = [
    {
      icon: ShieldCheck,
      title: t("trust.onlinePayment"),
      hint: t("trust.onlinePaymentHint"),
    },
    {
      icon: Truck,
      title: t("trust.delivery"),
      hint: t("trust.deliveryHint"),
    },
    {
      icon: ReceiptText,
      title: t("trust.storeBacked"),
      hint: t("trust.storeBackedHint"),
    },
  ];

  const subcategoryName = product.storeSubCategory?.translation.name;
  const subcategoryHref = product.storeSubCategory?.translation.href;
  const categoryName = product.storeSubCategory?.storeCategory?.translation.name;
  const categoryHref = product.storeSubCategory?.storeCategory?.translation.href;

  const breadCrumbs: Crumb[] = [
    { label: t("breadcrumbs.stores"), href: `/${lang}/stores` },
    {
      label: categoryName,
      href: `/${lang}/stores/${categoryHref}`,
    },
    {
      label: subcategoryName,
      href: `/${lang}/stores/${categoryHref}/${subcategoryHref}`,
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

          <div className={clsx(RAIL_SIDE, "flex flex-col gap-5")}>
            <StoreProductSummary product={product} />

            <StoreProductPurchasePanel product={product} lang={lang} />

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
            <StoreProductDescription description={product.description} />
          </div>
          <div className={RAIL_SIDE}>
            <StoreProductDetails product={product} lang={lang} />
          </div>
        </div>

        <StoreProductImpact impact={product.environmentalImpact} />

        <StoreProductReviews
          storeProductId={String(product.id)}
          averageRating={product.averageRating}
        />

        {product.sellerId && (
          <OtherFromBusiness
            lang={lang}
            sellerId={product.sellerId}
            excludeProductId={product.id}
          />
        )}
      </Section>
    </div>
  );
}
