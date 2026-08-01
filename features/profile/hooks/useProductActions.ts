"use client";
import { useMutation } from "@apollo/client/react";
import { useCallback } from "react";
import {
  DELETE_PRODUCT,
  TOGGLE_PRODUCT_ACTIVE,
  UPDATE_PRODUCT,
} from "@/graphql/marketplace/mutations";
import { GET_SELLER_STOREFRONT } from "@/graphql/marketplace/queries";
import { useToast } from "@/hooks/useToast";
import { useTranslation } from "@/i18n/context";
import { useSeller } from "@/store/useAuthStore";
import type { ProductCondition } from "@/types/enums";
import { NAMESPACE } from "../i18n";

/**
 * The full editable surface of a marketplace listing, mirroring
 * `UpdateProductInput`. Every field is sent on save, so clearing an optional
 * one actually clears it — a partial patch would leave stale values behind.
 *
 * `badges` is deliberately absent: those are awarded by the platform, not the
 * seller.
 */
export interface UpdateProductPatch {
  name: string;
  brand: string;
  price: number;
  description: string;
  color: string;
  condition: ProductCondition | "";
  conditionDescription: string;
  isExchangeable: boolean;
  interests: string[];
  productCategoryId: number | null;
  /** Final ordered image keys — the first is the card cover. */
  images: string[];
}

export function useProductActions() {
  const { t } = useTranslation(NAMESPACE);
  const toast = useToast();
  const seller = useSeller();
  const sellerId = seller?.id;

  // Both queries are normalized on Product.id so updates fan out via the cache,
  // but delete and toggle invalidate the seller's storefront list, so we
  // refetch it once per mutation to keep the dashboard in sync.
  const refetchSeller = sellerId
    ? [{ query: GET_SELLER_STOREFRONT, variables: { sellerId, page: 1, pageSize: 100 } }]
    : [];

  const [deleteMutation, { loading: deleting }] = useMutation(DELETE_PRODUCT, {
    refetchQueries: refetchSeller,
  });
  const [toggleMutation, { loading: toggling }] = useMutation(TOGGLE_PRODUCT_ACTIVE, {
    refetchQueries: refetchSeller,
  });
  const [updateMutation, { loading: updating }] = useMutation(UPDATE_PRODUCT, {
    refetchQueries: refetchSeller,
  });

  const remove = useCallback(
    async (id: string | number): Promise<boolean> => {
      try {
        await deleteMutation({ variables: { id: String(id) } });
        toast.success(t("dashboard.listings.delete.success"));
        return true;
      } catch (err) {
        toast.error(err instanceof Error ? err.message : t("dashboard.listings.delete.error"));
        return false;
      }
    },
    [deleteMutation, t, toast],
  );

  const toggleActive = useCallback(
    async (id: string | number, willBeActive: boolean): Promise<boolean> => {
      try {
        await toggleMutation({ variables: { id: String(id) } });
        toast.success(
          willBeActive
            ? t("dashboard.listings.toggle.activated")
            : t("dashboard.listings.toggle.deactivated"),
        );
        return true;
      } catch (err) {
        toast.error(err instanceof Error ? err.message : t("dashboard.listings.toggle.error"));
        return false;
      }
    },
    [toggleMutation, t, toast],
  );

  const update = useCallback(
    async (id: string | number, patch: UpdateProductPatch): Promise<boolean> => {
      try {
        await updateMutation({
          variables: {
            input: {
              // UpdateProductInput.id is Int! — a stringified id fails schema
              // validation before it ever reaches the resolver.
              id: Number(id),
              name: patch.name,
              brand: patch.brand || undefined,
              price: patch.price,
              description: patch.description,
              color: patch.color || undefined,
              condition: patch.condition || undefined,
              conditionDescription: patch.conditionDescription || undefined,
              isExchangeable: patch.isExchangeable,
              // Swap preferences only apply to an exchangeable listing; turning
              // the toggle off clears them rather than leaving them orphaned.
              interests: patch.isExchangeable ? patch.interests : [],
              ...(patch.productCategoryId !== null
                ? { productCategoryId: patch.productCategoryId }
                : {}),
              images: patch.images,
            },
          },
        });
        toast.success(t("dashboard.listings.edit.success"));
        return true;
      } catch (err) {
        toast.error(err instanceof Error ? err.message : t("dashboard.listings.edit.error"));
        return false;
      }
    },
    [updateMutation, t, toast],
  );

  return {
    remove,
    toggleActive,
    update,
    deleting,
    toggling,
    updating,
  };
}
