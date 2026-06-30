"use client";
import { useState } from "react";

import { Pagination } from "@/components/Pagination/Pagination";
import { Text } from "@/components/Text/Text";
import type { Language } from "@/graphql/enums/enums";
import { useCountry } from "@/hooks/useCountry";
import { useTranslation } from "@/i18n/context";

import { useSearch } from "../hooks/useSearch";
import { NAMESPACE } from "../i18n";
import { SEARCH_PAGE_SIZE } from "../types";
import { SearchResultsGrid } from "./SearchResultsGrid";

interface Props {
  lang: string;
  /** GraphQL Language enum (ES | EN | FR), derived from the URL locale. */
  language: Language;
  /** The active query term, read from `?q=` on the server. */
  query: string;
}

export function SearchContent({ lang, language, query }: Props) {
  const { t } = useTranslation(NAMESPACE);
  const [country] = useCountry();
  // Paging restarts on a new term because the parent remounts this component
  // with `key={query}`, so page state starts back at 1 — no reset effect needed.
  const [page, setPage] = useState(1);

  const { items, pageInfo, total, loading, error } = useSearch({
    query,
    language,
    country,
    page,
    pageSize: SEARCH_PAGE_SIZE,
  });

  if (!query.trim()) {
    return (
      <div className="text-foreground-secondary py-16 text-center">
        <p className="font-semibold">{t("emptyQuery.title")}</p>
        <p className="mt-1 text-sm">{t("emptyQuery.hint")}</p>
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold text-foreground">
          {t("heading", { query })}
        </h1>
        {!error && (
          <Text size="sm" color="secondary">
            {total === 1
              ? t("count", { count: "1" })
              : t("countPlural", { count: String(total) })}
          </Text>
        )}
      </div>

      {error ? (
        <div className="text-foreground-secondary py-16 text-center">
          <p className="font-semibold">{t("error.title")}</p>
          <p className="mt-1 text-sm">{t("error.hint")}</p>
        </div>
      ) : (
        <>
          <SearchResultsGrid items={items} lang={lang} loading={loading} />

          {pageInfo && pageInfo.totalPages > 1 && (
            <Pagination
              currentPage={pageInfo.currentPage}
              totalPages={pageInfo.totalPages}
              onPageChange={setPage}
              showItemsPerPage={false}
            />
          )}
        </>
      )}
    </section>
  );
}
