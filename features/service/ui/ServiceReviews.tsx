"use client";
import { ReviewsPanel } from "@/components/Patterns/ReviewsPanel";
import { DEFAULT_LANGUAGE, type SupportedLanguage } from "@/constants/settings";
import { useTranslation } from "@/i18n/context";
import { useParams } from "next/navigation";

import { useServiceReviews } from "../hooks/useServiceReviews";
import { NAMESPACE } from "../i18n";

export function ServiceReviews({
  serviceId,
  averageRating,
}: {
  serviceId: string;
  averageRating?: number | null;
}) {
  const { t } = useTranslation(NAMESPACE);
  const params = useParams<{ lang?: SupportedLanguage }>();
  const lang = params.lang ?? DEFAULT_LANGUAGE;
  const {
    reviews,
    total,
    loading,
    canWrite,
    myReview,
    rating,
    setRating,
    comment,
    setComment,
    submitting,
    deleting,
    submit,
    remove,
  } = useServiceReviews(serviceId);

  return (
    <ReviewsPanel
      locale={lang}
      averageRating={averageRating}
      reviews={reviews.map((review) => ({
        ...review,
        isMine: myReview?.id === review.id,
      }))}
      loading={loading}
      canWrite={canWrite}
      rating={rating}
      onRatingChange={setRating}
      comment={comment}
      onCommentChange={setComment}
      submitting={submitting}
      deleting={deleting}
      onSubmit={() => void submit()}
      onDelete={(id) => void remove(id)}
      labels={{
        title: t("reviews.title"),
        count: t("reviews.count", { count: String(total) }),
        verified: t("reviews.verified"),
        empty: t("reviews.empty"),
        delete: t("reviews.delete"),
        formTitle: t("reviews.form.title"),
        placeholder: t("reviews.form.placeholder"),
        gate: t("reviews.form.gate"),
        submit: t("reviews.form.submit"),
        rateLabel: (stars) => t("reviews.form.rate", { count: String(stars) }),
      }}
    />
  );
}
