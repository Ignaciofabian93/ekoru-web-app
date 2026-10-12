"use client";
import { useMutation, useQuery } from "@apollo/client/react";

import {
  ACCEPT_QUOTATION,
  CANCEL_SERVICE_BOOKING,
  COMPLETE_SERVICE_BOOKING,
  DECLINE_QUOTATION,
  UPDATE_QUOTATION,
  UPDATE_SERVICE_BOOKING_STATUS,
} from "@/graphql/services/mutations";
import {
  GET_MY_PROVIDER_BOOKINGS,
  GET_MY_PROVIDER_QUOTATIONS,
  GET_MY_QUOTATIONS,
  GET_MY_SERVICE_BOOKINGS,
} from "@/graphql/services/queries";
import { useToast } from "@/hooks/useToast";
import type { Seller } from "@/types/user";

export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "NO_SHOW"
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
  /** Own image, or the provider's logo — resolved by the services subgraph. */
  displayImage?: string | null;
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
  /** Always ON_SITE for the beta: paid to the provider, not through EKORU (D7). */
  paymentMode: "ON_SITE";
  serviceLocation?: Record<string, unknown> | null;
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
  /** Set once the client paid the accepted quote (WEB-4). */
  paidAt?: string | null;
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

/** A booking the signed-in seller received, with who made it. */
export interface ReceivedBooking extends ServiceBooking {
  client?: Pick<Seller, "id" | "email" | "phone" | "profile"> | null;
}

/** Moves the provider may make, by current status (services' booking-rules.ts). */
export type ProviderMove = "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "NO_SHOW";

export const PROVIDER_MOVES: Partial<Record<BookingStatus, ProviderMove[]>> = {
  PENDING: ["CONFIRMED"],
  CONFIRMED: ["IN_PROGRESS", "COMPLETED", "NO_SHOW"],
  IN_PROGRESS: ["COMPLETED", "NO_SHOW"],
};

/**
 * Bookings the signed-in seller received as a provider (WEB-5): confirm,
 * start, complete, mark a no-show, or cancel with a reason. Completing goes
 * through its own mutation, which is what awards the client's eco-points.
 */
export function useProviderBookings() {
  const toast = useToast();
  const { data, loading, error, refetch } = useQuery<{
    myProviderBookings: Connection<ReceivedBooking>;
  }>(GET_MY_PROVIDER_BOOKINGS, { fetchPolicy: "cache-and-network" });

  const refetchQueries = [{ query: GET_MY_PROVIDER_BOOKINGS }];
  const [updateStatus, { loading: moving }] = useMutation(
    UPDATE_SERVICE_BOOKING_STATUS,
    { refetchQueries },
  );
  const [completeBooking, { loading: completing }] = useMutation(
    COMPLETE_SERVICE_BOOKING,
    { refetchQueries },
  );
  const [cancelBooking, { loading: cancelling }] = useMutation(
    CANCEL_SERVICE_BOOKING,
    { refetchQueries },
  );

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
    bookings: data?.myProviderBookings.nodes ?? [],
    loading: loading && !data,
    error,
    refetch,
    move: (id: string, to: ProviderMove) =>
      run(() =>
        to === "COMPLETED"
          ? completeBooking({ variables: { id } })
          : updateStatus({ variables: { id, status: to } }),
      ),
    cancel: (id: string, reason: string) =>
      run(() => cancelBooking({ variables: { id, reason } })),
    busy: moving || completing || cancelling,
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
