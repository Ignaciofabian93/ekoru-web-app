"use client";
import { useState } from "react";

export interface ProposeExchangeInput {
  /** The listing the current user wants to receive. */
  requestedProductId: string;
  /** One of the current user's own listings, offered in return. */
  offeredProductId: string;
  notes?: string;
}

// STUB — there is no GraphQL mutation for exchange proposals yet (see the
// "exchange backend gap"): the `Exchange` type and EXCHANGE_* notifications
// exist, but no create/accept/decline operations. This simulates the request so
// the propose UI is fully wired and ready. To make it real, swap the body for a
// `useMutation(CREATE_EXCHANGE_PROPOSAL)` call — the input shape already matches
// the `Exchange` fields (offeredProductId / requestedProductId / notes).
export function useProposeExchange() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function propose(input: ProposeExchangeInput) {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    console.warn("[stub] exchange proposal — no backend yet:", input);
    setLoading(false);
    setDone(true);
  }

  function reset() {
    setDone(false);
  }

  return { propose, loading, done, reset };
}
