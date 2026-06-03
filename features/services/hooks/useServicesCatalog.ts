"use client";
import { useQuery } from "@apollo/client/react";
import { useMemo } from "react";

import { GET_SERVICES_CATALOG } from "@/graphql/services/queries";

import type { ServiceCatalogItem, Language } from "../types";

export function useServicesCatalog(language: Language) {
  const { data, loading, error } = useQuery<{
    getServiceCatalog: ServiceCatalogItem[];
  }>(GET_SERVICES_CATALOG, {
    variables: { language },
    fetchPolicy: "cache-first",
  });

  const categories = useMemo<ServiceCatalogItem[]>(
    () => data?.getServiceCatalog ?? [],
    [data],
  );

  return { categories, loading, error };
}
