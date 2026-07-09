"use client";

import type { SupportedLanguage } from "@/constants/settings";

import { StoreProductDescription } from "./StoreProductDescription";
import { StoreProductDetails } from "./StoreProductDetails";
import { StoreProductGallery } from "./StoreProductGallery";
import { StoreProductImpact } from "./StoreProductImpact";
import {
  StoreProductError,
  StoreProductLoading,
  StoreProductNotFound,
} from "./StoreProductStatus";
import { StoreProductSummary } from "./StoreProductSummary";
import { StoreProductTrust } from "./StoreProductTrust";
import { useStoreProduct } from "../hooks/useStoreProduct";
import { StoreProductBreadcrumbs } from "./StoreProductBreadcrumbs";
import { StoreProductActions } from "./StoreProductActions";
import { OtherFromBusiness } from "./OtherFromBusiness";

interface Props {
  id: string;
  lang: SupportedLanguage;
}

export function StoreProductContent({ id, lang }: Props) {
  const { product, loading, error } = useStoreProduct(id);

  if (loading && !product) return <StoreProductLoading />;
  if (error) return <StoreProductError lang={lang} />;
  if (!product) return <StoreProductNotFound lang={lang} />;

  const categoryName = product.storeSubCategory?.translation.name;
  const categoryHref = product.storeSubCategory?.translation.href;

  return (
    <div className="flex flex-col gap-8">
      <StoreProductBreadcrumbs
        lang={lang}
        categoryName={categoryName}
        categoryHref={categoryHref}
        productName={product.name}
      />

      <div className="grid gap-6 md:grid-cols-2 md:gap-10">
        <StoreProductGallery name={product.name} images={product.images ?? []} />

        <div className="flex flex-col gap-5">
          <StoreProductSummary product={product} />
          <StoreProductActions lang={lang} product={product} />
          <StoreProductTrust />
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="flex flex-col gap-8 md:col-span-2">
          <StoreProductDescription description={product.description} />
          <StoreProductDetails product={product} lang={lang} />
          <StoreProductImpact impact={product.environmentalImpact} />
        </div>
        {/* <div className="flex flex-col gap-8 md:col-span-1">
          {product.seller && <SellerCard lang={lang} seller={product.seller} />}
        </div> */}
      </div>

      {product.sellerId && (
        <OtherFromBusiness
          lang={lang}
          sellerId={product.sellerId}
          excludeProductId={product.id}
        />
      )}
    </div>
  );
}
