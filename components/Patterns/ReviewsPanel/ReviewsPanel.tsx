"use client";
import { BadgeCheck, Star, Trash2 } from "lucide-react";

import { Button } from "@/components/Primitives/Button";
import { Text } from "@/components/Primitives/Text";
import { TextArea } from "@/components/Primitives/TextArea";
import { Title } from "@/components/Primitives/Title";
import {
  reviewsPanelDeleteClass,
  reviewsPanelFormClass,
  reviewsPanelHeaderClass,
  reviewsPanelItemClass,
  reviewsPanelItemHeaderClass,
  reviewsPanelListClass,
  reviewsPanelLoadingClass,
  reviewsPanelRatingButtonClass,
  reviewsPanelRatingRowClass,
  reviewsPanelRootClass,
  reviewsPanelStarClass,
  reviewsPanelStarSize,
  reviewsPanelStarSizeInput,
  reviewsPanelStarSizeSmall,
  reviewsPanelStarsClass,
  reviewsPanelSummaryClass,
  reviewsPanelVerifiedClass,
} from "@/design/reviews-panel";

const STARS = [1, 2, 3, 4, 5];

export interface ReviewItem {
  id: string;
  rating: number;
  comment?: string | null;
  isVerifiedPurchase?: boolean | null;
  createdAt: string;
  /** True when the signed-in viewer wrote it — only then is delete offered. */
  isMine?: boolean;
}

/** Already-translated copy: shared components take text as props. */
export interface ReviewsPanelLabels {
  title: string;
  count: string;
  verified: string;
  empty: string;
  delete: string;
  formTitle: string;
  placeholder: string;
  gate: string;
  submit: string;
  /** Accessible name for the Nth star button, e.g. "3 stars". */
  rateLabel: (stars: number) => string;
}

export interface ReviewsPanelProps {
  labels: ReviewsPanelLabels;
  locale: string;
  averageRating?: number | null;
  reviews: ReviewItem[];
  loading?: boolean;
  /** Whether to show the write form at all (signed in, hasn't reviewed yet). */
  canWrite?: boolean;
  rating: number;
  onRatingChange: (rating: number) => void;
  comment: string;
  onCommentChange: (comment: string) => void;
  submitting?: boolean;
  onSubmit: () => void;
  onDelete: (id: string) => void;
  deleting?: boolean;
}

function Stars({ value, size = reviewsPanelStarSize }: { value: number; size?: number }) {
  return (
    <span className={reviewsPanelStarsClass} aria-hidden="true">
      {STARS.map((star) => (
        <Star
          key={star}
          size={size}
          strokeWidth={2}
          className={
            star <= Math.round(value)
              ? reviewsPanelStarClass.filled
              : reviewsPanelStarClass.empty
          }
        />
      ))}
    </span>
  );
}

function formatDate(iso: string, locale: string) {
  try {
    return new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

/**
 * Rating summary, review list and write form — shared by service and store
 * product pages, which differ only in which mutations they call. Purely
 * presentational: every string arrives translated, every action is a callback.
 */
export function ReviewsPanel({
  labels,
  locale,
  averageRating,
  reviews,
  loading = false,
  canWrite = false,
  rating,
  onRatingChange,
  comment,
  onCommentChange,
  submitting = false,
  onSubmit,
  onDelete,
  deleting = false,
}: ReviewsPanelProps) {
  return (
    <section className={reviewsPanelRootClass} aria-label={labels.title}>
      <header className={reviewsPanelHeaderClass}>
        <Title level="h2" size="h5" weight="semibold">
          {labels.title}
        </Title>
        <div className={reviewsPanelSummaryClass}>
          <Stars value={averageRating ?? 0} />
          <Text variant="span" size="sm" color="tertiary">
            {labels.count}
          </Text>
        </div>
      </header>

      {canWrite && (
        <form
          className={reviewsPanelFormClass}
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <Text variant="span" size="sm" weight="semibold">
            {labels.formTitle}
          </Text>

          <div className={reviewsPanelRatingRowClass}>
            {STARS.map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => onRatingChange(star)}
                aria-label={labels.rateLabel(star)}
                aria-pressed={rating === star}
                className={reviewsPanelRatingButtonClass}
              >
                <Star
                  size={reviewsPanelStarSizeInput}
                  strokeWidth={2}
                  className={
                    star <= rating
                      ? reviewsPanelStarClass.filled
                      : reviewsPanelStarClass.emptyInteractive
                  }
                />
              </button>
            ))}
          </div>

          <TextArea
            name="comment"
            placeholder={labels.placeholder}
            value={comment}
            onChangeText={onCommentChange}
            rows={3}
            maxLength={1000}
          />

          <Text variant="small" color="tertiary">
            {labels.gate}
          </Text>

          <Button text={labels.submit} type="submit" size="sm" loading={submitting} />
        </form>
      )}

      {loading ? (
        <div className={reviewsPanelLoadingClass} />
      ) : reviews.length === 0 ? (
        <Text variant="p" color="tertiary">
          {labels.empty}
        </Text>
      ) : (
        <ul className={reviewsPanelListClass}>
          {reviews.map((review) => (
            <li key={review.id} className={reviewsPanelItemClass}>
              <div className={reviewsPanelItemHeaderClass}>
                <div className={reviewsPanelSummaryClass}>
                  <Stars value={review.rating} size={reviewsPanelStarSizeSmall} />
                  {review.isVerifiedPurchase && (
                    <span className={reviewsPanelVerifiedClass}>
                      <BadgeCheck size={reviewsPanelStarSizeSmall} strokeWidth={2} />
                      {labels.verified}
                    </span>
                  )}
                </div>
                <Text variant="span" size="xs" color="tertiary">
                  {formatDate(review.createdAt, locale)}
                </Text>
              </div>

              {review.comment && (
                <Text variant="p" size="sm">
                  {review.comment}
                </Text>
              )}

              {review.isMine && (
                <button
                  type="button"
                  onClick={() => onDelete(review.id)}
                  disabled={deleting}
                  className={reviewsPanelDeleteClass}
                >
                  <Trash2 size={reviewsPanelStarSizeSmall} strokeWidth={2} />
                  {labels.delete}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
