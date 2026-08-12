"use client";
import clsx from "clsx";
import { BadgeCheck, Star, Trash2 } from "lucide-react";

import { Button } from "@/components/Primitives/Button";
import { Text } from "@/components/Primitives/Text";
import { TextArea } from "@/components/Primitives/TextArea";
import { Title } from "@/components/Primitives/Title";

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

function Stars({ value, size = 16 }: { value: number; size?: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-hidden="true">
      {STARS.map((star) => (
        <Star
          key={star}
          size={size}
          strokeWidth={2}
          className={clsx(
            star <= Math.round(value)
              ? "fill-warning text-warning"
              : "text-border-strong",
          )}
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
    <section className="flex flex-col gap-4" aria-label={labels.title}>
      <header className="flex flex-wrap items-baseline justify-between gap-2">
        <Title level="h2" size="h5" weight="semibold">
          {labels.title}
        </Title>
        <div className="flex items-center gap-2">
          <Stars value={averageRating ?? 0} />
          <Text variant="span" size="sm" color="tertiary">
            {labels.count}
          </Text>
        </div>
      </header>

      {canWrite && (
        <form
          className="flex flex-col gap-3 rounded-2xl border border-border-light bg-surface p-4"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <Text variant="span" size="sm" weight="semibold">
            {labels.formTitle}
          </Text>

          <div className="flex items-center gap-1">
            {STARS.map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => onRatingChange(star)}
                aria-label={labels.rateLabel(star)}
                aria-pressed={rating === star}
                className="p-0.5"
              >
                <Star
                  size={22}
                  strokeWidth={2}
                  className={clsx(
                    star <= rating
                      ? "fill-warning text-warning"
                      : "text-border-strong hover:text-warning",
                  )}
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
        <div className="h-24 animate-pulse rounded-2xl bg-background-secondary" />
      ) : reviews.length === 0 ? (
        <Text variant="p" color="tertiary">
          {labels.empty}
        </Text>
      ) : (
        <ul className="flex flex-col gap-3">
          {reviews.map((review) => (
            <li
              key={review.id}
              className="flex flex-col gap-2 rounded-2xl border border-border-light bg-surface p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Stars value={review.rating} size={14} />
                  {review.isVerifiedPurchase && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-success">
                      <BadgeCheck size={14} strokeWidth={2} />
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
                  className="flex w-fit items-center gap-1 text-xs font-semibold text-danger hover:underline disabled:opacity-50"
                >
                  <Trash2 size={14} strokeWidth={2} />
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
