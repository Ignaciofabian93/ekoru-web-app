"use client";
import { useMutation } from "@apollo/client/react";
import { useState } from "react";

import { PROPOSE_EXCHANGE_DEAL } from "@/graphql/deals/mutations";
import { MY_DEALS_AS_BUYER } from "@/graphql/deals/queries";
import { useToast } from "@/hooks/useToast";

export interface ProposeExchangeInput {
  /** The listing the current user wants to receive. */
  requestedProductId: string;
  /** One of the current user's own listings, offered in return. */
  offeredProductId: string;
  /** Free-text note for the owner; travels with the deal and its notification. */
  notes?: string;
}

/**
 * Creates a real EXCHANGE P2PDeal (transactions subgraph). The buyer offers one
 * of their products for the requested one; the deal carries any cash
 * compensation the price gap requires. It shows up on both sides' /deals inbox.
 */
export function useProposeExchange() {
  const toast = useToast();
  const [done, setDone] = useState(false);
  const [proposeExchange, { loading }] = useMutation(PROPOSE_EXCHANGE_DEAL, {
    refetchQueries: [{ query: MY_DEALS_AS_BUYER }],
    awaitRefetchQueries: false,
  });

  async function propose(input: ProposeExchangeInput) {
    try {
      await proposeExchange({
        variables: {
          requestedProductId: Number(input.requestedProductId),
          offeredProductId: Number(input.offeredProductId),
          message: input.notes,
        },
      });
      setDone(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo enviar la propuesta");
    }
  }

  function reset() {
    setDone(false);
  }

  return { propose, loading, done, reset };
}
