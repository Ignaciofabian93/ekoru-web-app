"use client";
import { useMutation, useQuery } from "@apollo/client/react";

import { SET_EVENT_ATTENDANCE } from "@/graphql/community/mutations";
import { GET_MY_EVENT_ATTENDEES } from "@/graphql/community/queries";
import { useToast } from "@/hooks/useToast";
import { useTranslation } from "@/i18n/context";

import { NAMESPACE } from "../i18n";

export interface EventAttendee {
  id: number;
  name: string;
  email: string;
  /** Registered with an Ekoru account; only they earn eco-points. */
  hasAccount: boolean;
  attendedAt?: string | null;
  createdAt: string;
}

/**
 * The organiser's attendance list for one of their events. Confirming that
 * someone came earns eco-points for them and for the organiser, once.
 */
export function useEventAttendance(eventId: string | null) {
  const { t } = useTranslation(NAMESPACE);
  const toast = useToast();

  const { data, loading } = useQuery<{ myEventAttendees: EventAttendee[] }>(
    GET_MY_EVENT_ATTENDEES,
    {
      variables: { eventId: Number(eventId) },
      skip: !eventId,
      fetchPolicy: "cache-and-network",
    },
  );

  const [setAttendanceMutation, { loading: saving }] = useMutation<{
    setEventAttendance: EventAttendee;
  }>(SET_EVENT_ATTENDANCE);

  const setAttended = async (registrationId: number, attended: boolean) => {
    try {
      await setAttendanceMutation({
        variables: { registrationId, attended },
        refetchQueries: ["MyEventAttendees"],
      });
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("errors.attendance"));
      return false;
    }
  };

  return {
    attendees: data?.myEventAttendees ?? [],
    loading,
    saving,
    setAttended,
  };
}
