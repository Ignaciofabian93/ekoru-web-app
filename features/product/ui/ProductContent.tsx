"use client";

import type { SupportedLanguage } from "@/constants/settings";

import { useProduct } from "../hooks/useProduct";
import { OtherFromSeller } from "./OtherFromSeller";
import { ProductActions } from "./ProductActions";
import { ProductBreadcrumbs } from "./ProductBreadcrumbs";
import { ProductDescription } from "./ProductDescription";
import { ProductDetails } from "./ProductDetails";
import { ProductGallery } from "./ProductGallery";
import { ProductImpact } from "./ProductImpact";
import {
  ProductError,
  ProductLoading,
  ProductNotFound,
} from "./ProductStatus";
import { ProductSummary } from "./ProductSummary";
import { ProductTrust } from "./ProductTrust";
import { SellerCard } from "./SellerCard";

interface Props {
  id: string;
  lang: SupportedLanguage;
}

export function ProductContent({ id, lang }: Props) {
  const { product, loading, error } = useProduct(id);

  if (loading && !product) return <ProductLoading />;
  if (error) return <ProductError lang={lang} />;
  if (!product) return <ProductNotFound lang={lang} />;

  const categoryName = product.productCategory?.translation?.name;
  const categoryHref = product.productCategory?.translation?.href;

  return (
    <div className="flex flex-col gap-8">
      <ProductBreadcrumbs
        lang={lang}
        categoryName={categoryName}
        categoryHref={categoryHref}
        productName={product.name}
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
