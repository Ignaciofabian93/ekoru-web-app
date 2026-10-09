"use client";
import { useMutation, useQuery } from "@apollo/client/react";
import { useState } from "react";

import {
  CANCEL_MY_COMMUNITY_EVENT,
  CANCEL_MY_EVENT_REGISTRATION,
  CREATE_MY_COMMUNITY_EVENT,
  REGISTER_FOR_COMMUNITY_EVENT,
  REPORT_COMMUNITY_EVENT,
} from "@/graphql/community/mutations";
import {
  GET_COMMUNITY_EVENTS,
  GET_MY_EVENT_REGISTRATIONS,
} from "@/graphql/community/queries";
import { useToast } from "@/hooks/useToast";
import { useTranslation } from "@/i18n/context";
import { useSeller, useSellerType } from "@/store/useAuthStore";

import { NAMESPACE } from "../i18n";

export interface CommunityEvent {
  id: string;
  title: string;
  content: string;
  coverImage?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  capacity?: number | null;
  registrationCount: number;
  remainingCapacity?: number | null;
  /** Seller id of the organising business; null for events EKORU runs. */
  organizerId?: string | null;
  communitySubCategoryId?: number | null;
  communityCategoryId?: number | null;
  locationType: EventLocationType;
  address?: string | null;
  countyName?: string | null;
  cityName?: string | null;
  regionName?: string | null;
  onlineUrl?: string | null;
}

export type EventLocationType = "IN_PERSON" | "ONLINE" | "HYBRID";

export const REPORT_REASONS = ["SPAM", "SCAM", "INAPPROPRIATE", "MISLEADING", "OTHER"] as const;
export type ReportReason = (typeof REPORT_REASONS)[number];

/** Narrows the list to one community category or subcategory page. */
export type EventScope = {
  communityCategoryId?: number;
  communitySubCategoryId?: number;
};

export interface EventRegistration {
  id: number;
  communityPostId: number;
  name: string;
  email: string;
  createdAt: string;
}

export interface EventDraft {
  title: string;
  content: string;
  coverImage: string;
  startDate: string;
  endDate: string;
  capacity: string;
  communityCategoryId?: number;
  communitySubCategoryId?: number;
  locationType: EventLocationType;
  countryId?: number;
  regionId?: number;
  cityId?: number;
  countyId?: number;
  address: string;
  onlineUrl: string;
}

const emptyDraft: EventDraft = {
  title: "",
  content: "",
  coverImage: "",
  startDate: "",
  endDate: "",
  capacity: "",
  locationType: "IN_PERSON",
  address: "",
  onlineUrl: "",
};

const isHttpUrl = (value: string) => /^https?:\/\/\S+\.\S+/.test(value.trim());

/** Mirrors the subgraph rule: in person needs address + comuna, online a link. */
const isLocationComplete = (draft: EventDraft) =>
  (draft.locationType === "ONLINE" ||
    (draft.address.trim().length > 3 && draft.countyId !== undefined)) &&
  (draft.locationType === "IN_PERSON" || isHttpUrl(draft.onlineUrl));

/**
 * Community events for the web app.
 *
 * Two roles, matching the backend: **business accounts organise** (the create
 * form is theirs alone — the subgraph refuses a person account, and hiding the
 * button keeps the UI honest about it) and **everyone attends**.
 */
export function useCommunityEvents(scope: EventScope = {}) {
  const { t } = useTranslation(NAMESPACE);
  const toast = useToast();
  const seller = useSeller();
  const sellerType = useSellerType();
  const isBusiness = sellerType !== null && sellerType !== "PERSON";

  // On a subcategory page the composer starts in that subcategory.
  const initialDraft: EventDraft = {
    ...emptyDraft,
    communityCategoryId: scope.communityCategoryId,
    communitySubCategoryId: scope.communitySubCategoryId,
  };
  const [draft, setDraft] = useState<EventDraft>(initialDraft);

  const { data, loading, error } = useQuery<{
    communityEvents: { nodes: CommunityEvent[]; pageInfo: { totalCount: number } };
  }>(GET_COMMUNITY_EVENTS, {
    variables: scope,
    fetchPolicy: "cache-and-network",
  });

  const { data: mine } = useQuery<{
    myCommunityEventRegistrations: { nodes: EventRegistration[] };
  }>(GET_MY_EVENT_REGISTRATIONS, { skip: !seller, fetchPolicy: "cache-and-network" });

  // By operation name, so every event list on screen (home, category,
  // subcategory) refreshes whatever its variables.
  const refetchQueries = [
    "CommunityEvents",
    ...(seller ? ["MyCommunityEventRegistrations"] : []),
  ];

  const [registerMutation, { loading: registering }] = useMutation(
    REGISTER_FOR_COMMUNITY_EVENT,
    { refetchQueries },
  );
  const [cancelMutation, { loading: cancelling }] = useMutation(
    CANCEL_MY_EVENT_REGISTRATION,
    { refetchQueries },
  );
  const [cancelEventMutation, { loading: cancellingEvent }] = useMutation(
    CANCEL_MY_COMMUNITY_EVENT,
    { refetchQueries },
  );
  const [reportMutation, { loading: reporting }] = useMutation(REPORT_COMMUNITY_EVENT);
  const [createMutation, { loading: creating }] = useMutation(
    CREATE_MY_COMMUNITY_EVENT,
    { refetchQueries },
  );

  const myRegistrations = mine?.myCommunityEventRegistrations.nodes ?? [];

  /** The reservation this viewer already holds for an event, if any. */
  const registrationFor = (eventId: string) =>
    myRegistrations.find((r) => String(r.communityPostId) === String(eventId)) ?? null;

  const register = async (eventId: string, name: string, email: string) => {
    try {
      await registerMutation({
        variables: { input: { eventId: Number(eventId), name, email } },
      });
      toast.success(t("events.registered"));
      return true;
    } catch (err) {
      // "Full" and "already finished" come back translated from the subgraph.
      toast.error(err instanceof Error ? err.message : t("events.errors.register"));
      return false;
    }
  };

  const cancel = async (registrationId: number) => {
    try {
      await cancelMutation({ variables: { id: registrationId } });
      toast.success(t("events.cancelled"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("events.errors.cancel"));
    }
  };

  /** Organiser only: cancels the event and tells everyone registered. */
  const cancelEvent = async (eventId: string, reason: string) => {
    try {
      await cancelEventMutation({
        variables: { id: Number(eventId), reason: reason.trim() || null },
      });
      toast.success(t("events.organizer.cancelled"));
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("events.errors.cancelEvent"));
      return false;
    }
  };

  /** Signed-in visitors flag an event for moderators. */
  const reportEvent = async (eventId: string, reason: ReportReason, details: string) => {
    try {
      await reportMutation({
        variables: {
          input: { eventId: Number(eventId), reason, details: details.trim() || null },
        },
      });
      toast.success(t("events.report.sent"));
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("events.errors.report"));
      return false;
    }
  };

  const updateDraft = <K extends keyof EventDraft>(key: K, value: EventDraft[K]) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const isDraftValid =
    draft.title.trim().length > 2 &&
    draft.content.trim().length > 9 &&
    draft.communitySubCategoryId !== undefined &&
    isLocationComplete(draft);

  const createEvent = async () => {
    if (!isDraftValid) {
      toast.error(t("events.errors.incomplete"));
      return false;
    }
    try {
      await createMutation({
        variables: {
          input: {
            title: draft.title.trim(),
            content: draft.content.trim(),
            coverImage: draft.coverImage.trim() || undefined,
            // Bare dates are read as UTC midnight, which can land on the
            // previous day in Chile — pin them to midday.
            startDate: draft.startDate
              ? new Date(`${draft.startDate}T12:00:00`).toISOString()
              : undefined,
            endDate: draft.endDate
              ? new Date(`${draft.endDate}T12:00:00`).toISOString()
              : undefined,
            capacity: draft.capacity ? Number(draft.capacity) : undefined,
            communitySubCategoryId: draft.communitySubCategoryId,
            locationType: draft.locationType,
            ...(draft.locationType !== "ONLINE" && {
              address: draft.address.trim(),
              countyId: draft.countyId,
            }),
            ...(draft.locationType !== "IN_PERSON" && {
              onlineUrl: draft.onlineUrl.trim(),
            }),
          },
        },
      });
      setDraft(initialDraft);
      toast.success(t("events.created"));
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("events.errors.create"));
      return false;
    }
  };

  return {
    events: data?.communityEvents.nodes ?? [],
    loading: loading && !data,
    error,
    isBusiness,
    isSignedIn: Boolean(seller),
    seller,
    registrationFor,
    register,
    registering,
    cancel,
    cancelling,
    cancelEvent,
    cancellingEvent,
    reportEvent,
    reporting,
    draft,
    updateDraft,
    isDraftValid,
    createEvent,
    creating,
  };
}
