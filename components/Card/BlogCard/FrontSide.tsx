"use client";

import { resolveImageUrl } from "@/utils/resolveImage";
import { BookOpen, Clock, ImageOff, RotateCw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import type { BlogCardData, BlogCardLabels } from "./types";

interface Props {
  post: BlogCardData;
  href?: string;
  labels: Required<BlogCardLabels>;
  onFlip: () => void;
}

export default function FrontSide({ post, href, labels, onFlip }: Props) {
  const [imageError, setImageError] = useState(false);
  const cover = resolveImageUrl(post.coverImage);
  const avatar = resolveImageUrl(post.authorAvatar);

  const Container: React.ElementType = href ? Link : "div";
  const containerProps = href ? { href } : {};

  const handleFlip = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFlip();
  };

  return (
    <Container
      {...containerProps}
      className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-nature-ocean-light bg-surface text-left shadow-sm transition-all hover:border-nature-ocean-dark/40 hover:shadow-md"
    >
      <div className="relative aspect-16/9 w-full shrink-0 bg-gradient-to-br from-nature-ocean-light/70 to-nature-ocean-light/20">
        {cover && !imageError ? (
          <Image
            src={cover}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 240px"
            onError={() => setImageError(true)}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <BookOpen size={32} strokeWidth={1.5} className="text-nature-ocean-dark" />
          </div>
        )}

        {post.category && (
          <span className="absolute bottom-2 left-2 rounded-md bg-nature-ocean-dark px-2 py-0.5 text-xs font-semibold text-white shadow-sm">
            {post.category}
          </span>
        )}

        <button
          type="button"
          onClick={handleFlip}
          aria-label={labels.flipToDetails}
          className="absolute top-2 right-2 flex size-8 cursor-pointer items-center justify-center rounded-full bg-nature-ocean-dark text-white shadow-sm transition-colors hover:bg-nature-ocean-dark/85"
        >
          <RotateCw size={14} strokeWidth={2.5} />
        </button>
      </div>

      <div className="flex flex-1 flex-col justify-between gap-2 p-3">
        <div className="min-w-0">
          <p className="line-clamp-2 text-sm leading-snug font-semibold text-foreground">
            {post.title}
          </p>
          {post.excerpt && (
            <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-foreground-secondary">
              {post.excerpt}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            {avatar ? (
              <Image
                src={avatar}
                alt={post.authorName ?? ""}
                width={20}
                height={20}
                className="size-5 shrink-0 rounded-full object-cover"
              />
            ) : (
              <div className="size-5 shrink-0 rounded-full bg-nature-ocean-light" />
            )}
            <div className="min-w-0">
              {post.authorName && (
                <p className="truncate text-xs font-medium text-foreground">
                  {post.authorName}
                </p>
              )}
              {post.publishedAt && (
                <p className="truncate text-[10px] text-foreground-tertiary">
                  {post.publishedAt}
                </p>
              )}
            </div>
          </div>
          {typeof post.readingMinutes === "number" && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-nature-ocean-light/60 px-2 py-0.5 text-[10px] font-semibold text-nature-ocean-dark">
              <Clock size={10} strokeWidth={2.5} />
              {post.readingMinutes} {labels.minRead}
            </span>
          )}
        </div>
      </div>

      {!cover && (
        <span className="sr-only">
          <ImageOff aria-label={labels.noImage} />
        </span>
      )}
    </Container>
  );
}
