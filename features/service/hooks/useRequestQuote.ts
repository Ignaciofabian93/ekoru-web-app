"use client";
import { useMutation } from "@apollo/client/react";
import { useState } from "react";

import { ADD_QUOTATION } from "@/graphql/services/mutations";
import { GET_MY_QUOTATIONS } from "@/graphql/services/queries";
import { useToast } from "@/hooks/useToast";
import { useTranslation } from "@/i18n/context";

import { NAMESPACE } from "../i18n";
import type { ServiceDetail } from "../types";

export interface QuoteDraft {
  title: string;
  description: string;
  notes: string;
}

const emptyDraft: QuoteDraft = { title: "", description: "", notes: "" };

/**
 * Opens a quotation request against a service.
 *
 * The buyer describes the job; the provider replies with a price from their
 * quotation desk. No price is sent from here — proposing one would misrepresent
 * a request as an offer.
 */
export function useRequestQuote(service: ServiceDetail) {
  const { t } = useTranslation(NAMESPACE);
  const toast = useToast();

  const [draft, setDraft] = useState<QuoteDraft>(emptyDraft);
  const [done, setDone] = useState(false);
  const [addQuotation, { loading }] = useMutation(ADD_QUOTATION, {
    refetchQueries: [{ query: GET_MY_QUOTATIONS }],
    awaitRefetchQueries: false,
  });

  const isValid = draft.title.trim().length > 2 && draft.description.trim().length > 9;

  const update = <K extends keyof QuoteDraft>(key: K, value: QuoteDraft[K]) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const submit = async () => {
    if (!isValid) {
      toast.error(t("quote.errors.incomplete"));
      return;
    }
    try {
      await addQuotation({
        variables: {
          input: {
            serviceId: Number(service.id),
            providerId: service.sellerId,
            title: draft.title.trim(),
            description: draft.description.trim(),
            clientNotes: draft.notes.trim() || undefined,
          },
        },
      });
      setDone(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("quote.errors.failed"));
    }
  };

  const reset = () => {
    setDraft(emptyDraft);
    setDone(false);
  };

  return { draft, update, isValid, loading, done, submit, reset };
}
