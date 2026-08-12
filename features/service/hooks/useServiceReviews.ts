"use client";
import { useMutation, useQuery } from "@apollo/client/react";
import { useState } from "react";

import {
  ADD_SERVICE_REVIEW,
  DELETE_SERVICE_REVIEW,
} from "@/graphql/services/mutations";
import { GET_SERVICE_BY_ID, GET_SERVICE_REVIEWS } from "@/graphql/services/queries";
import { useToast } from "@/hooks/useToast";
import { useTranslation } from "@/i18n/context";
import { useCurrentSellerId } from "@/store/useAuthStore";

import { NAMESPACE } from "../i18n";

export interface ServiceReview {
  id: string;
  serviceId: number;
  reviewerId: string;
  rating: number;
  comment?: string | null;
  isVerifiedPurchase?: boolean | null;
  createdAt: string;
}

interface ReviewsResponse {
  getServiceReviews: {
    nodes: ServiceReview[];
    pageInfo: { totalCount: number; hasNextPage: boolean };
  };
}

/**
 * Reviews for one service, plus write access for the viewer.
 *
 * The backend only accepts a review from someone with a completed booking, so
 * the form is offered to everyone signed in and the refusal comes back as a
 * message — the alternative would be querying every viewer's booking history
 * just to decide whether to render a textarea.
 */
export function useServiceReviews(serviceId: string) {
  const { t } = useTranslation(NAMESPACE);
  const toast = useToast();
  const currentSellerId = useCurrentSellerId();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const { data, loading, error } = useQuery<ReviewsResponse>(GET_SERVICE_REVIEWS, {
    variables: { serviceId },
    skip: !serviceId,
    fetchPolicy: "cache-and-network",
  });

  // The service's stored average moves when a review lands, so the detail
  // query has to be refetched alongside the list or the stars stay stale.
  const refetchQueries = [
    { query: GET_SERVICE_REVIEWS, variables: { serviceId } },
    { query: GET_SERVICE_BY_ID, variables: { id: serviceId } },
  ];

  const [addReview, { loading: submitting }] = useMutation(ADD_SERVICE_REVIEW, {
    refetchQueries,
  });
  const [deleteReview, { loading: deleting }] = useMutation(DELETE_SERVICE_REVIEW, {
    refetchQueries,
  });

  const reviews = data?.getServiceReviews.nodes ?? [];
  const myReview = currentSellerId
    ? (reviews.find((r) => r.reviewerId === currentSellerId) ?? null)
    : null;

  const submit = async () => {
    try {
      await addReview({
        variables: {
          input: {
            serviceId: Number(serviceId),
            rating,
            comment: comment.trim() || undefined,
          },
        },
      });
      setComment("");
      toast.success(t("reviews.submitted"));
    } catch (err) {
      // "You have to have completed a booking" arrives here, already
      // translated by the subgraph — show it rather than a generic failure.
      toast.error(err instanceof Error ? err.message : t("reviews.errors.failed"));
    }
  };

  const remove = async (id: string) => {
    try {
      await deleteReview({ variables: { id } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("reviews.errors.failed"));
    }
  };

  return {
    reviews,
    total: data?.getServiceReviews.pageInfo.totalCount ?? 0,
    loading: loading && !data,
    error,
    canWrite: Boolean(currentSellerId) && myReview === null,
    myReview,
    rating,
    setRating,
    comment,
    setComment,
    submitting,
    deleting,
    submit,
    remove,
  };
}
