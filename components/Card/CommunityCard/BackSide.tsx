"use client";

import { Calendar, ChevronRight, Hash, MapPin, RotateCcw, Users } from "lucide-react";
import Link from "next/link";

import type { CommunityCardData, CommunityCardLabels } from "./types";

interface Props {
  post: CommunityCardData;
  href?: string;
  labels: Required<CommunityCardLabels>;
  onFlip: () => void;
}

export default function BackSide({ post, href, labels, onFlip }: Props) {
  const isEvent = post.kind === "event";
  const tags = post.tags?.slice(0, 4) ?? [];
  const cta = isEvent ? labels.viewEvent : labels.joinDiscussion;

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-nature-purple-light bg-surface shadow-sm">
      <div className="flex items-center justify-between gap-2 border-b border-nature-purple-light bg-nature-purple-light/60 px-3 py-2">
        <p className="truncate text-xs font-semibold text-nature-purple-dark">{post.title}</p>
        <button
          type="button"
          onClick={onFlip}
          aria-label={labels.flipToFront}
          className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full bg-nature-purple-dark text-white shadow-sm transition-colors hover:bg-nature-purple-dark/85"
        >
          <RotateCcw size={13} strokeWidth={2.5} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-3 py-3">
        <p className="line-clamp-5 text-xs leading-relaxed text-foreground-secondary">
          {post.excerpt || labels.noExcerpt}
        </p>

        {isEvent && (
          <ul className="flex flex-col gap-1.5">
            {post.date && (
              <li className="flex items-center gap-1.5 text-xs text-foreground-secondary">
                <Calendar size={12} strokeWidth={2} className="shrink-0 text-nature-purple-dark" />
                <span className="truncate">{post.date}</span>
              </li>
            )}
            {post.location && (
              <li className="flex items-start gap-1.5 text-xs text-foreground-secondary">
                <MapPin size={12} strokeWidth={2} className="mt-0.5 shrink-0 text-nature-purple-dark" />
                <span className="line-clamp-2">
                  {post.isOnline ? labels.online : post.location}
                </span>
              </li>
            )}
            {typeof post.attendees === "number" && (
              <li className="flex items-center gap-1.5 text-xs text-foreground-secondary">
                <Users size={12} strokeWidth={2} className="shrink-0 text-nature-purple-dark" />
                <span>
                  <span className="font-semibold text-foreground">
                    {post.attendees}
                    {post.capacity ? `/${post.capacity}` : ""}
                  </span>{" "}
                  {labels.attending}
                </span>
              </li>
            )}
          </ul>
        )}

        {tags.length > 0 && (
          <div>
            <p className="mb-1 text-[10px] font-semibold tracking-wide text-foreground-tertiary uppercase">
              {labels.tags}
            </p>
            <div className="flex flex-wrap gap-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-0.5 rounded-full bg-nature-purple-light/60 px-2 py-0.5 text-[10px] font-medium text-nature-purple-dark"
                >
                  <Hash size={9} strokeWidth={2.5} />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {href && (
          <Link
            href={href}
            className="mt-auto inline-flex items-center justify-center gap-1 rounded-md bg-nature-purple-dark px-2 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-nature-purple-dark/85"
          >
            {cta}
            <ChevronRight size={14} strokeWidth={2.5} />
          </Link>
        )}
      </div>
    </div>
  );
}
