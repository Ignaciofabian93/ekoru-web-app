"use client";

import { Package } from "lucide-react";
import { type ReactNode, useMemo, useState } from "react";

import { Pagination } from "@/components/Pagination/Pagination";

const PAGE_SIZE = 12;

interface Props<T> {
  title: string;
  subtitle: string;
  emptyTitle: string;
  emptyHint: string;
  products: T[];
  loading?: boolean;
  getKey: (product: T) => string | number;
  renderProduct: (product: T) => ReactNode;
}

/**
 * Seller storefront catalog: a single paginated product grid. Generic over the
 * product type so it serves both the marketplace and store catalogs.
 */
export function SellerCatalog<T>({
  title,
  subtitle,
  emptyTitle,
  emptyHint,
  products,
  loading,
  getKey,
  renderProduct,
}: Props<T>) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = useMemo(
    () => products.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [products, currentPage],
  );

  return (
    <section className="flex min-w-0 flex-col gap-5">
      <div className="min-w-0">
        <h2 className="text-foreground text-lg font-semibold sm:text-xl">{title}</h2>
        <p className="text-foreground-secondary text-sm">{subtitle}</p>
      </div>

      {loading && products.length === 0 ? (
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-background-secondary aspect-3/4 animate-pulse rounded-xl"
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-foreground-secondary flex flex-col items-center gap-2 py-16 text-center">
          <Package size={44} className="opacity-30" strokeWidth={1.4} />
          <p className="font-semibold">{emptyTitle}</p>
          <p className="text-sm">{emptyHint}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4 xl:grid-cols-5">
            {pageItems.map((product) => (
              <div key={getKey(product)} className="min-w-0">
                {renderProduct(product)}
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
              showItemsPerPage={false}
            />
          )}
        </>
      )}
    </section>
  );
}
