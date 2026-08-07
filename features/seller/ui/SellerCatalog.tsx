"use client";
import { Package } from "lucide-react";
import { type ReactNode, useMemo, useState } from "react";
import { RHYTHM, Section } from "@/components/Layout";
import { Pagination } from "@/components/Patterns/Pagination";
import { ResultsGrid } from "@/components/Patterns/ResultsGrid";
import { SectionHeader } from "@/components/Patterns/SectionHeader";

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
 *
 * The grid itself is `ResultsGrid` — the same one behind the marketplace, store
 * and search results — so a storefront's cards sit at the column count and size
 * as everywhere else instead of the wider grid this used to roll by hand.
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
    <Section gap={RHYTHM.CONTENT} ariaLabel={title}>
      <SectionHeader align="start" title={title} subtitle={subtitle} />

      <ResultsGrid
        items={pageItems}
        loading={loading}
        emptyIcon={Package}
        emptyTitle={emptyTitle}
        emptyHint={emptyHint}
        renderItem={(product) => (
          <div key={getKey(product)} className="w-full min-w-0">
            {renderProduct(product)}
          </div>
        )}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setPage}
        showItemsPerPage={false}
      />
    </Section>
  );
}
