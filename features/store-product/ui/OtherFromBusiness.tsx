"use client";

// import { ImageOff } from "lucide-react";
// import Image from "next/image";
import Link from "next/link";

// import { formatPrice } from "@/data/products";
// import type { MarketplaceProduct } from "@/features/marketplace/types";
import { useTranslation } from "@/i18n/context";
// import { resolveImageUrl } from "@/utils/resolveImage";

// import { useSellerProducts } from "../hooks/useSellerProducts";
import { NAMESPACE } from "../i18n";

interface Props {
  lang: string;
  sellerId: string;
  excludeProductId: number | string;
}

// function MiniCard({
//   product,
//   lang,
// }: {
//   product: MarketplaceProduct;
//   lang: string;
// }) {
//   const cover = resolveImageUrl(product.images?.[0]);

//   return (
//     <Link
//       href={`/${lang}/product/${product.id}`}
//       className="group bg-surface flex w-44 shrink-0 flex-col overflow-hidden rounded-xl border border-border-light transition hover:shadow-md"
//     >
//       <div className="bg-background-secondary relative aspect-square">
//         {cover ? (
//           <Image
//             src={cover}
//             alt={product.name}
//             fill
//             sizes="180px"
//             className="object-cover transition-transform group-hover:scale-105"
//           />
//         ) : (
//           <div className="flex h-full items-center justify-center text-foreground-muted">
//             <ImageOff size={28} strokeWidth={1.5} />
//           </div>
//         )}
//       </div>
//       <div className="flex flex-col gap-1 p-2.5">
//         {product.brand && (
//           <span className="truncate text-[10px] tracking-wide text-foreground-tertiary uppercase">
//             {product.brand}
//           </span>
//         )}
//         <p className="line-clamp-2 text-sm leading-snug font-semibold text-foreground">
//           {product.name}
//         </p>
//         <span className="mt-0.5 text-sm font-bold text-primary">
//           {formatPrice(product.price)}
//         </span>
//       </div>
//     </Link>
//   );
// }

export function OtherFromBusiness({ lang, sellerId }: Props) {
  const { t } = useTranslation(NAMESPACE);
  // const { products, loading } = useSellerProducts({
  //   sellerId,
  //   excludeProductId,
  // });

  // if (loading) {
  //   return (
  //     <section>
  //       <h2 className="mb-3 text-lg font-semibold text-foreground">
  //         {t("otherProducts.title")}
  //       </h2>
  //       <div className="flex gap-3 overflow-x-auto pb-2">
  //         {Array.from({ length: 4 }).map((_, i) => (
  //           <div
  //             key={i}
  //             className="bg-background-secondary h-60 w-44 shrink-0 animate-pulse rounded-xl"
  //           />
  //         ))}
  //       </div>
  //     </section>
  //   );
  // }

  // if (products.length === 0) {
  //   return (
  //     <section>
  //       <h2 className="mb-3 text-lg font-semibold text-foreground">
  //         {t("otherProducts.title")}
  //       </h2>
  //       <p className="text-sm text-foreground-secondary italic">
  //         {t("otherProducts.empty")}
  //       </p>
  //     </section>
  //   );
  // }

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          {t("otherProducts.title")}
        </h2>
        <Link
          href={`/${lang}/seller/${sellerId}`}
          className="text-sm font-medium text-primary hover:underline"
        >
          {t("actions.viewAll")}
        </Link>
      </div>
      {/* <div className="flex gap-3 overflow-x-auto pb-2">
        {products.map((product) => (
          <MiniCard key={product.id} product={product} lang={lang} />
        ))}
      </div> */}
    </section>
  );
}
