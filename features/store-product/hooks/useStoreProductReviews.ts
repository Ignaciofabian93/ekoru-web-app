"use client";
import { useMutation, useQuery } from "@apollo/client/react";
import { useState } from "react";

import {
  ADD_STORE_PRODUCT_REVIEW,
  DELETE_STORE_PRODUCT_REVIEW,
} from "@/graphql/stores/mutations";
import {
  GET_STORE_PRODUCT_BY_ID,
  GET_STORE_PRODUCT_REVIEWS,
} from "@/graphql/stores/queries";
import { useToast } from "@/hooks/useToast";
import { useTranslation } from "@/i18n/context";
import { useCurrentSellerId } from "@/store/useAuthStore";

import { NAMESPACE } from "../i18n";

export interface StoreProductReview {
  id: string;
  storeProductId: number;
  userId: string;
  rating: number;
  comment?: string | null;
  images?: string[] | null;
  isVerifiedPurchase?: boolean | null;
  createdAt: string;
}

interface ReviewsResponse {
  getStoreProductReviews: {
    nodes: StoreProductReview[];
    pageInfo: { totalCount: number };
  };
}

/**
 * Reviews for one store product, plus write access for the viewer.
 *
 * The subgraph only accepts a review from someone with a paid order for the
 * product, so the form is offered to anyone signed in and the refusal comes
 * back as a message — checking every viewer's order history just to decide
 * whether to render a textarea would cost a round trip on every page view.
 */
export function useStoreProductReviews(storeProductId: string) {
  const { t } = useTranslation(NAMESPACE);
  const toast = useToast();
  const currentSellerId = useCurrentSellerId();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const { data, loading } = useQuery<ReviewsResponse>(GET_STORE_PRODUCT_REVIEWS, {
    variables: { storeProductId },
    skip: !storeProductId,
    fetchPolicy: "cache-and-network",
  });

  // The product's stored rating moves when a review lands, so the detail query
  // is refetched alongside the list or the stars stay stale.
  const refetchQueries = [
    { query: GET_STORE_PRODUCT_REVIEWS, variables: { storeProductId } },
    { query: GET_STORE_PRODUCT_BY_ID, variables: { id: storeProductId } },
  ];

  const [addReview, { loading: submitting }] = useMutation(
    ADD_STORE_PRODUCT_REVIEW,
    { refetchQueries },
  );
  const [deleteReview, { loading: deleting }] = useMutation(
    DELETE_STORE_PRODUCT_REVIEW,
    { refetchQueries },
  );

  const reviews = data?.getStoreProductReviews.nodes ?? [];
  const myReview = currentSellerId
    ? (reviews.find((r) => r.userId === currentSellerId) ?? null)
    : null;

  const submit = async () => {
    try {
      await addReview({
        variables: {
          input: {
            storeProductId: Number(storeProductId),
            rating,
            comment: comment.trim() || undefined,
          },
        },
      });
      setComment("");
      toast.success(t("reviews.submitted"));
    } catch (err) {
      // "You can only review products you bought" arrives here already
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
    total: data?.getStoreProductReviews.pageInfo.totalCount ?? 0,
    loading: loading && !data,
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
