"use client";
import { useMutation } from "@apollo/client/react";
import { useCallback } from "react";
import {
  DELETE_SERVICE,
  TOGGLE_SERVICE_ACTIVE,
  UPDATE_SERVICE,
} from "@/graphql/services/mutations";
import { GET_SERVICES_BY_SELLER } from "@/graphql/services/queries";
import { useToast } from "@/hooks/useToast";
import { useTranslation } from "@/i18n/context";
import { useSeller } from "@/store/useAuthStore";
import { NAMESPACE } from "../i18n";

export interface UpdateServicePatch {
  name: string;
  description: string;
  basePrice: number;
  duration: number;
}

/** Edit / delete / activate actions for the seller's own services.
 *  Mirrors {@link useProductActions} but targets the services subgraph. */
export function useServiceActions() {
  const { t } = useTranslation(NAMESPACE);
  const toast = useToast();
  const seller = useSeller();
  const sellerId = seller?.id;

  const refetchSeller = sellerId
    ? [{ query: GET_SERVICES_BY_SELLER, variables: { sellerId, page: 1, pageSize: 100 } }]
    : [];

  const [deleteMutation, { loading: deleting }] = useMutation(DELETE_SERVICE, {
    refetchQueries: refetchSeller,
  });
  const [toggleMutation, { loading: toggling }] = useMutation(TOGGLE_SERVICE_ACTIVE, {
    refetchQueries: refetchSeller,
  });
  const [updateMutation, { loading: updating }] = useMutation(UPDATE_SERVICE, {
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
    async (id: string | number, patch: UpdateServicePatch): Promise<boolean> => {
      try {
        await updateMutation({
          variables: {
            input: {
              id: String(id),
              name: patch.name,
              description: patch.description || undefined,
              basePrice: patch.basePrice,
              duration: patch.duration || undefined,
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
