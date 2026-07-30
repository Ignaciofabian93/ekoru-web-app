"use client";
import { Pagination } from "@/components/Patterns/Pagination";
import { Text } from "@/components/Primitives/Text";
import { useTranslation } from "@/i18n/context";

import { NAMESPACE } from "../i18n";
import { PAGE_SIZE_OPTIONS, type PageInfo } from "../types";
import { StoreProductGrid } from "./StoreProductGrid";
import type { StoreProduct } from "@/types/product";

interface Props {
  lang: string;
  products: StoreProduct[];
  loading: boolean;
  pageInfo?: PageInfo;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function StoreProductResults({
  lang,
  products,
  loading,
  pageInfo,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: Props) {
  const { t } = useTranslation(NAMESPACE);

  const total = pageInfo?.totalCount ?? 0;
  const countText =
    total === 1
      ? t("results.count", { count: "1" })
      : t("results.countPlural", { count: String(total) });

  const from = total === 0 ? 0 : (pageInfo!.currentPage - 1) * pageInfo!.pageSize + 1;
  const to = total === 0 ? 0 : Math.min(from + products.length - 1, total);

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Text size="sm" color="secondary">
          {pageInfo
            ? t("results.showing", {
                from: String(from),
                to: String(to),
                total: String(total),
              })
            : countText}
        </Text>
      </div>

      <StoreProductGrid products={products} lang={lang} loading={loading} />

      {pageInfo && pageInfo.totalPages > 1 && (
        <Pagination
          currentPage={pageInfo.currentPage}
          totalPages={pageInfo.totalPages}
          onPageChange={onPageChange}
          itemsPerPage={pageSize}
          onItemsPerPageChange={onPageSizeChange}
          itemsPerPageOptions={PAGE_SIZE_OPTIONS}
          rowsLabel={t("filters.perPage")}
        />
      )}
    </section>
  );
}
