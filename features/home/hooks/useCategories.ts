import type { SupportedLanguage } from "@/constants/settings";
import { GET_BLOG_CATALOG } from "@/graphql/blog/queries";
import { GET_COMMUNITY_CATALOG } from "@/graphql/community/queries";
import { GET_MARKETPLACE_CATALOG } from "@/graphql/marketplace/queries";
import { GET_SERVICE_CATALOG } from "@/graphql/services/queries";
import { GET_STORES_CATALOG } from "@/graphql/stores/queries";
import type { BlogCatalog } from "@/types/blog";
import type { CommunityCatalog } from "@/types/community";
import type { MarketplaceCatalog } from "@/types/marketplace";
import type { ServiceCatalog } from "@/types/services";
import type { StoreCatalog } from "@/types/stores";
import { useQuery } from "@apollo/client/react";

export function useCategories({ language }: { language: SupportedLanguage }) {
  // Marketplace data call
  const {
    data: marketplaceData,
    loading: marketplaceLoading,
    error: marketplaceErrorLoading,
    previousData: marketplacePreviousData,
  } = useQuery<{ getMarketplaceCatalog: MarketplaceCatalog[] }>(GET_MARKETPLACE_CATALOG, {
    variables: {
      language: language.toUpperCase(),
      enableCategories: false,
      enableSubCategories: false,
    },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });
  // Store data call
  const {
    data: storeData,
    loading: storeLoading,
    error: storeErrorLoading,
    previousData: storePreviousData,
  } = useQuery<{ getStoreCatalog: StoreCatalog[] }>(GET_STORES_CATALOG, {
    variables: { language: language.toUpperCase(), enableSubCategories: false },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });
  // Service data call
  const {
    data: serviceData,
    loading: serviceLoading,
    error: serviceErrorLoading,
    previousData: servicePreviousData,
  } = useQuery<{ getServiceCatalog: ServiceCatalog[] }>(GET_SERVICE_CATALOG, {
    variables: { language: language.toUpperCase(), enableSubCategories: false },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });
  // Community data call
  const {
    data: communityData,
    loading: communityLoading,
    error: communityErrorLoading,
    previousData: communityPreviousData,
  } = useQuery<{ getCommunityCatalog: CommunityCatalog[] }>(GET_COMMUNITY_CATALOG, {
    variables: { language: language.toUpperCase(), enableSubCategories: false },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });
  // Blog data call
  const {
    data: blogData,
    loading: blogLoading,
    error: blogErrorLoading,
    previousData: blogPreviousData,
  } = useQuery<{ getBlogCatalog: BlogCatalog[] }>(GET_BLOG_CATALOG, {
    variables: { language: language.toUpperCase() },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  return {
    marketplace:
      marketplaceData?.getMarketplaceCatalog ??
      marketplacePreviousData?.getMarketplaceCatalog,
    marketplaceLoading,
    marketplaceErrorLoading,
    stores: storeData?.getStoreCatalog ?? storePreviousData?.getStoreCatalog,
    storeLoading,
    storeErrorLoading,
    services: serviceData?.getServiceCatalog ?? servicePreviousData?.getServiceCatalog,
    serviceLoading,
    serviceErrorLoading,
    community:
      communityData?.getCommunityCatalog ?? communityPreviousData?.getCommunityCatalog,
    communityLoading,
    communityErrorLoading,
    blog: blogData?.getBlogCatalog ?? blogPreviousData?.getBlogCatalog,
    blogLoading,
    blogErrorLoading,
  };
}
