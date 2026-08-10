"use client";

import { useQuery } from "@apollo/client/react";

import { GET_SERVICE_BY_ID } from "@/graphql/services/queries";

import type { ServiceDetail } from "../types";

export function useService(id: string | number | undefined) {
  const serviceId = id !== undefined ? String(id) : "";

  const { data, loading, error } = useQuery<{ getService: ServiceDetail | null }>(
    GET_SERVICE_BY_ID,
    {
      variables: { id: serviceId },
      skip: !serviceId,
      fetchPolicy: "cache-and-network",
      notifyOnNetworkStatusChange: true,
    },
  );

  return {
    service: data?.getService ?? null,
    loading,
    error,
  };
}
