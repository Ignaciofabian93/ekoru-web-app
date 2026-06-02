"use client";

import { ChevronRight, Hash, RotateCcw } from "lucide-react";
import Link from "next/link";

import type { BlogCardData, BlogCardLabels } from "./types";

interface Props {
  post: BlogCardData;
  href?: string;
  labels: Required<BlogCardLabels>;
  onFlip: () => void;
}

export default function BackSide({ post, href, labels, onFlip }: Props) {
  const tags = post.tags?.slice(0, 5) ?? [];
  const fullText = post.excerpt || post.content || labels.noExcerpt;

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-nature-ocean-light bg-surface shadow-sm">
      <div className="flex items-center justify-between gap-2 border-b border-nature-ocean-light bg-nature-ocean-light/60 px-3 py-2">
        <p className="truncate text-xs font-semibold text-nature-ocean-dark">{post.title}</p>
        <button
          type="button"
          onClick={onFlip}
          aria-label={labels.flipToFront}
          className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full bg-nature-ocean-dark text-white shadow-sm transition-colors hover:bg-nature-ocean-dark/85"
        >
          <RotateCcw size={13} strokeWidth={2.5} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-3 py-3">
        {post.category && (
          <span className="self-start rounded-md bg-nature-ocean-light/70 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-nature-ocean-dark uppercase">
            {post.category}
          </span>
        )}

        <p className="line-clamp-6 text-xs leading-relaxed text-foreground-secondary">
          {fullText}
        </p>

        {tags.length > 0 && (
          <div>
            <p className="mb-1 text-[10px] font-semibold tracking-wide text-foreground-tertiary uppercase">
              {labels.tags}
            </p>
            <div className="flex flex-wrap gap-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-0.5 rounded-full bg-nature-ocean-light/60 px-2 py-0.5 text-[10px] font-medium text-nature-ocean-dark"
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
            className="mt-auto inline-flex items-center justify-center gap-1 rounded-md bg-nature-ocean-dark px-2 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-nature-ocean-dark/85"
          >
            {labels.readArticle}
            <ChevronRight size={14} strokeWidth={2.5} />
          </Link>
        )}
      </div>
    </div>
  );
}
