"use client";

import { useMutation } from "@apollo/client/react";
import { useParams, usePathname, useRouter } from "next/navigation";

import { DEFAULT_LANGUAGE, type SupportedLanguage } from "@/constants/settings";
import { TOGGLE_PRODUCT_LIKE } from "@/graphql/marketplace/mutations";
import { TOGGLE_SERVICE_LIKE } from "@/graphql/services/mutations";
import { TOGGLE_STORE_PRODUCT_LIKE } from "@/graphql/stores/mutations";
import { useToast } from "@/hooks/useToast";
import { useTranslation } from "@/i18n/context";
import useAuthStore from "@/store/useAuthStore";

/** Which catalog a favorited item belongs to. */
export type FavoriteSource = "marketplace" | "store" | "service";

const SOURCE_CONFIG: Record<
  FavoriteSource,
  { varKey: string; typename: string; refetch: string }
> = {
  marketplace: {
    varKey: "productId",
    typename: "Product",
    refetch: "GetMyFavorites",
  },
  store: {
    varKey: "storeProductId",
    typename: "StoreProduct",
    refetch: "GetMyFavoriteStoreProducts",
  },
  service: {
    varKey: "serviceId",
    typename: "Service",
    refetch: "GetMyFavoriteServices",
  },
};

/**
 * Toggles the current seller's favorite mark on a marketplace product, store
 * product, or service.
 *
 * - Favoriting requires auth: anonymous users are sent to login (redirect back),
 *   matching the cart flow.
 * - Optimistic: the heart flips immediately; Apollo normalizes the returned
 *   `{ id, isLiked }` so every view of that item stays in sync.
 * - Refetches the matching favorites list so the favorites page reflects removals.
 */
export function useToggleFavorite() {
  const [toggleProduct] = useMutation(TOGGLE_PRODUCT_LIKE);
  const [toggleStoreProduct] = useMutation(TOGGLE_STORE_PRODUCT_LIKE);
  const [toggleService] = useMutation(TOGGLE_SERVICE_LIKE);

  const seller = useAuthStore((s) => s.seller);
  const isAuthHydrated = useAuthStore((s) => s.isHydrated);
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams<{ lang?: SupportedLanguage }>();
  const toast = useToast();
  const { t } = useTranslation("common");

  const lang = params?.lang ?? DEFAULT_LANGUAGE;

  const mutators = {
    marketplace: toggleProduct,
    store: toggleStoreProduct,
    service: toggleService,
  } as const;

  async function toggleFavorite(
    id: number,
    currentlyLiked: boolean,
    source: FavoriteSource = "marketplace",
  ): Promise<void> {
    // Auth not resolved yet — ignore the tap rather than misfire a redirect.
    if (!isAuthHydrated) return;

    if (!seller) {
      const redirectTo = encodeURIComponent(pathname || `/${lang}`);
      toast.info(t("loginRequired"));
      router.push(`/${lang}/login?redirectTo=${redirectTo}`);
      return;
    }

    const config = SOURCE_CONFIG[source];
    const mutationName = `toggle${
      source === "marketplace"
        ? "ProductLike"
        : source === "store"
          ? "StoreProductLike"
          : "ServiceLike"
    }`;

    try {
      await mutators[source]({
        variables: { [config.varKey]: String(id) },
        optimisticResponse: {
          [mutationName]: {
            __typename: config.typename,
            id,
            isLiked: !currentlyLiked,
          },
        },
        // Keep the matching favorites list accurate when un-favoriting from it.
        refetchQueries: [config.refetch],
      });
    } catch {
      toast.error(t("error"));
    }
  }

  return { toggleFavorite };
}
