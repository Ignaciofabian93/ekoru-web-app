"use client";
import { useMutation } from "@apollo/client/react";
import { useCallback } from "react";
import {
  DELETE_STORE_PRODUCT,
  TOGGLE_STORE_PRODUCT_ACTIVE,
  UPDATE_STORE_PRODUCT,
} from "@/graphql/stores/mutations";
import { GET_STORE_PRODUCTS_BY_SELLER } from "@/graphql/stores/queries";
import { useToast } from "@/hooks/useToast";
import { useTranslation } from "@/i18n/context";
import { useSeller } from "@/store/useAuthStore";
import { NAMESPACE } from "../i18n";

/**
 * The editable surface of a store listing, mirroring `UpdateStoreProductInput`.
 * Every field is sent on save, so clearing one actually clears it.
 */
export interface UpdateStoreProductPatch {
  name: string;
  brand: string;
  price: number;
  stock: number;
  description: string;
  /** Final ordered image keys — the first is the card cover. */
  images: string[];
  hasOffer: boolean;
  /** Only meaningful while `hasOffer`; ignored otherwise. */
  offerPrice: number | null;
}

/** Edit / delete / activate actions for the seller's own store products.
 *  Mirrors {@link useProductActions} but targets the stores subgraph. */
export function useStoreProductActions() {
  const { t } = useTranslation(NAMESPACE);
  const toast = useToast();
  const seller = useSeller();
  const sellerId = seller?.id;

  const refetchSeller = sellerId
    ? [{ query: GET_STORE_PRODUCTS_BY_SELLER, variables: { sellerId, page: 1, pageSize: 100 } }]
    : [];

  const [deleteMutation, { loading: deleting }] = useMutation(DELETE_STORE_PRODUCT, {
    refetchQueries: refetchSeller,
  });
  const [toggleMutation, { loading: toggling }] = useMutation(TOGGLE_STORE_PRODUCT_ACTIVE, {
    refetchQueries: refetchSeller,
  });
  const [updateMutation, { loading: updating }] = useMutation(UPDATE_STORE_PRODUCT, {
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
    async (id: string | number, patch: UpdateStoreProductPatch): Promise<boolean> => {
      try {
        await updateMutation({
          variables: {
            input: {
              // UpdateStoreProductInput.id is Int! — a stringified id fails
              // schema validation before it ever reaches the resolver.
              id: Number(id),
              name: patch.name,
              brand: patch.brand || undefined,
              price: patch.price,
              stock: patch.stock,
              description: patch.description,
              images: patch.images,
              hasOffer: patch.hasOffer,
              // Sending the price only while the offer is on: leaving a stale
              // one behind would resurface the moment the toggle flips back.
              offerPrice: patch.hasOffer ? (patch.offerPrice ?? undefined) : undefined,
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

  return { remove, toggleActive, update, deleting, toggling, updating };
}
