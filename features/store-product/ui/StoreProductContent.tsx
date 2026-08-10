"use client";
import type { SupportedLanguage } from "@/constants/settings";
import { StoreProductDescription } from "./StoreProductDescription";
import { StoreProductDetails } from "./StoreProductDetails";
import { StoreProductImpact } from "./StoreProductImpact";
import {
  StoreProductError,
  StoreProductLoading,
  StoreProductNotFound,
} from "./StoreProductStatus";
import { StoreProductSummary } from "./StoreProductSummary";
import { useStoreProduct } from "../hooks/useStoreProduct";
import { StoreProductActions } from "./StoreProductActions";
import { OtherFromBusiness } from "./OtherFromBusiness";
import { Section } from "@/components/Layout";
import { Breadcrumb, type Crumb } from "@/components/Patterns/Breadcrumb";
import { useTranslation } from "@/i18n/context";
import { useNavigation } from "@/hooks/useNavigation";
import { NAMESPACE } from "../i18n";
import { ProductGallery } from "@/components/Patterns/ProductGallery";
import { ProductTrust, type ProductTrustItem } from "@/components/Patterns/ProductTrust";
import { SellerCard } from "@/components/Patterns/SellerCard";
import { ReceiptText, ShieldCheck, Truck } from "lucide-react";

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
            <StoreProductSummary product={product} />
            <StoreProductActions lang={lang} product={product} />
            <ProductTrust items={trustItems} />
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="flex flex-col gap-8 md:col-span-2">
            <StoreProductDescription description={product.description} />
            <StoreProductDetails product={product} lang={lang} />
            <StoreProductImpact impact={product.environmentalImpact} />
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
