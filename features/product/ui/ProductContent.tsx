"use client";
import type { SupportedLanguage } from "@/constants/settings";
import { useProduct } from "../hooks/useProduct";
import { OtherFromSeller } from "./OtherFromSeller";
import { ProductActions } from "./ProductActions";
import { ProductDescription } from "./ProductDescription";
import { ProductDetails } from "./ProductDetails";
import { ProductGallery } from "./ProductGallery";
import { ProductImpact } from "./ProductImpact";
import { ProductError, ProductLoading, ProductNotFound } from "./ProductStatus";
import { ProductSummary } from "./ProductSummary";
import { ProductTrust } from "./ProductTrust";
import { SellerCard } from "./SellerCard";
import Breadcrumb, { type Crumb } from "@/components/BreadCrumbs/Breadcrumb";
import { useNavigation } from "@/hooks/useNavigation";

interface Props {
  id: string;
  lang: SupportedLanguage;
}

export function ProductContent({ id, lang }: Props) {
  const { product, loading, error } = useProduct(id);
  const { navigateTo } = useNavigation();

  if (loading && !product) return <ProductLoading />;
  if (error) return <ProductError lang={lang} />;
  if (!product) return <ProductNotFound lang={lang} />;

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
    <div className="px-2 py-2">
      <Breadcrumb
        items={breadCrumbs.map((c) => ({
          label: c.label,
          onPress: c.href ? () => navigateTo({ route: c.href as string }) : undefined,
        }))}
        crumbColor="default"
        chevronColor="default"
      />

      <div className="grid gap-6 md:grid-cols-2 md:gap-10">
        <ProductGallery name={product.name} images={product.images ?? []} />

        <div className="flex flex-col gap-5">
          <ProductSummary product={product} />
          <ProductActions lang={lang} product={product} />
          <ProductTrust />
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="flex flex-col gap-8 md:col-span-2">
          <ProductDescription description={product.description} />
          <ProductDetails product={product} lang={lang} />
          <ProductImpact impact={product.environmentalImpact} />
        </div>
        <div className="flex flex-col gap-8 md:col-span-1">
          {product.seller && <SellerCard lang={lang} seller={product.seller} />}
        </div>
      </div>

      {product.sellerId && (
        <OtherFromSeller
          lang={lang}
          sellerId={product.sellerId}
          excludeProductId={product.id}
        />
      )}
    </div>
  );
}
