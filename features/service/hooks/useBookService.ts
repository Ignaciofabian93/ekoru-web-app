"use client";
import { useMutation } from "@apollo/client/react";
import { useState } from "react";

import { ADD_SERVICE_BOOKING } from "@/graphql/services/mutations";
import { GET_MY_SERVICE_BOOKINGS } from "@/graphql/services/queries";
import { useToast } from "@/hooks/useToast";
import { useTranslation } from "@/i18n/context";

import { NAMESPACE } from "../i18n";
import type { ServiceDetail } from "../types";

export interface BookingDraft {
  /** `yyyy-mm-dd` from the date input. */
  date: string;
  /** Free-text slot, e.g. "10:00 - 12:00". Optional per the backend. */
  timeSlot: string;
  notes: string;
}

const emptyDraft: BookingDraft = { date: "", timeSlot: "", notes: "" };

/**
 * Books a service for the signed-in buyer.
 *
 * The price sent is the service's `basePrice`: it is what the buyer was shown,
 * and the booking records what both sides agreed to at that moment. Services
 * priced by quote have no base price and go through the quotation flow instead
 * — the dialog is not offered for them.
 */
export function useBookService(service: ServiceDetail) {
  const { t } = useTranslation(NAMESPACE);
  const toast = useToast();

  const [draft, setDraft] = useState<BookingDraft>(emptyDraft);
  const [done, setDone] = useState(false);
  const [addBooking, { loading }] = useMutation(ADD_SERVICE_BOOKING, {
    refetchQueries: [{ query: GET_MY_SERVICE_BOOKINGS }],
    awaitRefetchQueries: false,
  });

  const isValid = draft.date.length > 0;

  const update = <K extends keyof BookingDraft>(key: K, value: BookingDraft[K]) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const submit = async () => {
    if (!isValid) {
      toast.error(t("booking.errors.missingDate"));
      return;
    }
    try {
      await addBooking({
        variables: {
          input: {
            serviceId: Number(service.id),
            providerId: service.sellerId,
            // The input is a DateTime; a bare `yyyy-mm-dd` would be read as UTC
            // midnight and can land on the previous day in Chile.
            scheduledDate: new Date(`${draft.date}T12:00:00`).toISOString(),
            scheduledTimeSlot: draft.timeSlot.trim() || undefined,
            agreedPrice: service.basePrice ?? 0,
            clientNotes: draft.notes.trim() || undefined,
          },
        },
      });
      setDone(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("booking.errors.failed"));
    }
  };

  const reset = () => {
    setDraft(emptyDraft);
    setDone(false);
  };

  return { draft, update, isValid, loading, done, submit, reset };
}
