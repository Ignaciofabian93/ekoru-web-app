"use client";
import { useMutation } from "@apollo/client/react";
import { useState } from "react";

import {
  ACCEPT_DEAL,
  CANCEL_DEAL,
  CONFIRM_DEAL,
  DECLINE_DEAL,
  DISPUTE_DEAL,
  PROPOSE_EXCHANGE_DEAL,
  PROPOSE_SALE_DEAL,
} from "@/graphql/deals/mutations";
import {
  MY_DEALS_AS_BUYER,
  MY_DEALS_AS_SELLER,
} from "@/graphql/deals/queries";
import { uploadProductImage } from "@/lib/api/products";
import { useCurrentSellerId } from "@/store/useAuthStore";
import { useToast } from "@/hooks/useToast";
import type { Deal } from "../types";

const REFETCH = [
  { query: MY_DEALS_AS_BUYER },
  { query: MY_DEALS_AS_SELLER },
];

/**
 * All the deal state transitions, plus the evidence-photo upload (reusing the
 * product image pipeline). Each returns the updated deal (or null on error);
 * lists are refetched so the UI reflects the new status.
 */
export function useDealActions() {
  const toast = useToast();
  const sellerId = useCurrentSellerId();
  const [busyId, setBusyId] = useState<number | null>(null);

  const opts = { refetchQueries: REFETCH, awaitRefetchQueries: false };
  const [proposeSale] = useMutation<
    { proposeSaleDeal: Deal },
    { productId: number }
  >(PROPOSE_SALE_DEAL, opts);
  const [proposeExchange] = useMutation<
    { proposeExchangeDeal: Deal },
    { requestedProductId: number; offeredProductId: number }
  >(PROPOSE_EXCHANGE_DEAL, opts);
  const [accept] = useMutation(ACCEPT_DEAL, opts);
  const [decline] = useMutation(DECLINE_DEAL, opts);
  const [confirm] = useMutation(CONFIRM_DEAL, opts);
  const [dispute] = useMutation(DISPUTE_DEAL, opts);
  const [cancel] = useMutation(CANCEL_DEAL, opts);

  async function run<T>(id: number | null, fn: () => Promise<T>): Promise<T | null> {
    setBusyId(id);
    try {
      return await fn();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Algo salió mal");
      return null;
    } finally {
      setBusyId(null);
    }
  }

  return {
    busyId,

    proposeSaleDeal: (productId: number) =>
      run(productId, async () => {
        const res = await proposeSale({ variables: { productId } });
        toast.success("Solicitud enviada al vendedor");
        return res.data?.proposeSaleDeal as Deal | undefined;
      }),

    proposeExchangeDeal: (requestedProductId: number, offeredProductId: number) =>
      run(requestedProductId, async () => {
        const res = await proposeExchange({
          variables: { requestedProductId, offeredProductId },
        });
        toast.success("Propuesta de intercambio enviada");
        return res.data?.proposeExchangeDeal as Deal | undefined;
      }),

    acceptDeal: (id: number) =>
      run(id, () => accept({ variables: { id } })),
    declineDeal: (id: number, reason?: string) =>
      run(id, () => decline({ variables: { id, reason } })),
    disputeDeal: (id: number, reason: string) =>
      run(id, () => dispute({ variables: { id, reason } })),
    cancelDeal: (id: number) =>
      run(id, () => cancel({ variables: { id } })),

    /** Uploads the evidence photo (if any) then confirms the deal. */
    confirmDeal: (id: number, photo?: File) =>
      run(id, async () => {
        let evidenceUrl: string | undefined;
        if (photo) {
          const { imageUrl } = await uploadProductImage(photo, sellerId ?? "deal");
          evidenceUrl = imageUrl;
        }
        await confirm({ variables: { id, evidenceUrl } });
      }),
  };
}
