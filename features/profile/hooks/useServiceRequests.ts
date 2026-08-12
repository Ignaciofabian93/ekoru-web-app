"use client";
import { useMutation, useQuery } from "@apollo/client/react";

import {
  ACCEPT_QUOTATION,
  CANCEL_SERVICE_BOOKING,
  DECLINE_QUOTATION,
  UPDATE_QUOTATION,
} from "@/graphql/services/mutations";
import {
  GET_MY_PROVIDER_QUOTATIONS,
  GET_MY_QUOTATIONS,
  GET_MY_SERVICE_BOOKINGS,
} from "@/graphql/services/queries";
import { useToast } from "@/hooks/useToast";

export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export type QuotationStatus =
  | "PENDING"
  | "ACCEPTED"
  | "DECLINED"
  | "COMPLETED"
  | "CANCELLED"
  | "EXPIRED";

interface ServiceRef {
  id: string;
  name: string;
  images?: string[] | null;
  sellerId: string;
}

export interface ServiceBooking {
  id: string;
  serviceId: number;
  clientId: string;
  providerId: string;
  scheduledDate: string;
  scheduledTimeSlot?: string | null;
  agreedPrice: number;
  status: BookingStatus;
  paymentStatus: string;
  clientNotes?: string | null;
  providerNotes?: string | null;
  cancellationReason?: string | null;
  completedAt?: string | null;
  createdAt: string;
  service?: ServiceRef | null;
}

export interface Quotation {
  id: string;
  serviceId: number;
  clientId: string;
  providerId: string;
  title: string;
  description: string;
  estimatedPrice?: number | null;
  finalPrice?: number | null;
  estimatedDuration?: number | null;
  status: QuotationStatus;
  clientNotes?: string | null;
  providerNotes?: string | null;
  expiresAt?: string | null;
  acceptedAt?: string | null;
  declineReason?: string | null;
  createdAt: string;
  service?: ServiceRef | null;
}

interface Connection<T> {
  nodes: T[];
  pageInfo: { totalCount: number };
}

/** Bookings the signed-in user made as a client, with the cancel action. */
export function useMyBookings() {
  const toast = useToast();
  const { data, loading, error, refetch } = useQuery<{
    myServiceBookings: Connection<ServiceBooking>;
  }>(GET_MY_SERVICE_BOOKINGS, { fetchPolicy: "cache-and-network" });

  const [cancelBooking, { loading: cancelling }] = useMutation(
    CANCEL_SERVICE_BOOKING,
    { refetchQueries: [{ query: GET_MY_SERVICE_BOOKINGS }] },
  );

  const cancel = async (id: string, reason: string) => {
    try {
      await cancelBooking({ variables: { id, reason } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error");
    }
  };

  return {
    bookings: data?.myServiceBookings.nodes ?? [],
    loading: loading && !data,
    error,
    refetch,
    cancel,
    cancelling,
  };
}

/**
 * Both sides of the quotation flow.
 *
 * A seller is a client on some quotes and the provider on others, so the inbox
 * loads both lists and the UI splits them into tabs rather than guessing which
 * role the viewer is in.
 */
export function useMyQuotations() {
  const toast = useToast();

  const asClient = useQuery<{ myQuotations: Connection<Quotation> }>(
    GET_MY_QUOTATIONS,
    { fetchPolicy: "cache-and-network" },
  );
  const asProvider = useQuery<{ myProviderQuotations: Connection<Quotation> }>(
    GET_MY_PROVIDER_QUOTATIONS,
    { fetchPolicy: "cache-and-network" },
  );

  const refetchBoth = [
    { query: GET_MY_QUOTATIONS },
    { query: GET_MY_PROVIDER_QUOTATIONS },
  ];

  const [acceptQuotation, { loading: accepting }] = useMutation(ACCEPT_QUOTATION, {
    refetchQueries: refetchBoth,
  });
  const [declineQuotation, { loading: declining }] = useMutation(DECLINE_QUOTATION, {
    refetchQueries: refetchBoth,
  });
  const [updateQuotation, { loading: responding }] = useMutation(UPDATE_QUOTATION, {
    refetchQueries: refetchBoth,
  });

  const run = async (fn: () => Promise<unknown>) => {
    try {
      await fn();
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error");
      return false;
    }
  };

  return {
    received: asProvider.data?.myProviderQuotations.nodes ?? [],
    sent: asClient.data?.myQuotations.nodes ?? [],
    loading:
      (asClient.loading && !asClient.data) || (asProvider.loading && !asProvider.data),
    error: asClient.error ?? asProvider.error,
    accept: (id: string) => run(() => acceptQuotation({ variables: { id } })),
    decline: (id: string, reason?: string) =>
      run(() => declineQuotation({ variables: { id, reason } })),
    /** Provider's reply: the price and terms the client then accepts or declines. */
    respond: (input: {
      id: string;
      estimatedPrice?: number;
      estimatedDuration?: number;
      providerNotes?: string;
    }) => run(() => updateQuotation({ variables: { input } })),
    accepting,
    declining,
    responding,
  };
}
