"use client";

import { resolveImageUrl } from "@/utils/resolveImage";
import {
  Calendar,
  Heart,
  ImageOff,
  MapPin,
  MessageCircle,
  RotateCw,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import type { CommunityCardData, CommunityCardLabels } from "./types";

interface Props {
  post: CommunityCardData;
  href?: string;
  labels: Required<CommunityCardLabels>;
  onFlip: () => void;
}

export default function FrontSide({ post, href, labels, onFlip }: Props) {
  const [imageError, setImageError] = useState(false);
  const cover = resolveImageUrl(post.image);
  const avatar = resolveImageUrl(post.authorAvatar);
  const isEvent = post.kind === "event";

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
      className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-nature-purple-light bg-surface text-left shadow-sm transition-all hover:border-nature-purple-dark/40 hover:shadow-md"
    >
      <div className="relative aspect-4/3 w-full shrink-0 bg-gradient-to-br from-nature-purple-light/60 to-nature-purple-light/20">
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
            <MessageCircle size={32} strokeWidth={1.5} className="text-nature-purple-dark" />
          </div>
        )}

        {isEvent && (
          <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-md bg-nature-purple-dark px-2 py-0.5 text-xs font-semibold text-white shadow-sm">
            <Calendar size={11} strokeWidth={2.5} />
            {post.isOnline ? labels.online : post.date ?? ""}
          </span>
        )}

        <button
          type="button"
          onClick={handleFlip}
          aria-label={labels.flipToDetails}
          className="absolute top-2 right-2 flex size-8 cursor-pointer items-center justify-center rounded-full bg-nature-purple-dark text-white shadow-sm transition-colors hover:bg-nature-purple-dark/85"
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
            <p className="mt-1 line-clamp-2 text-xs text-foreground-secondary">
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
              <div className="size-5 shrink-0 rounded-full bg-nature-purple-light" />
            )}
            {post.authorName && (
              <span className="truncate text-xs text-foreground-secondary">
                {post.authorName}
              </span>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2 text-xs text-foreground-tertiary">
            {isEvent && typeof post.attendees === "number" ? (
              <span className="inline-flex items-center gap-0.5">
                <Users size={12} strokeWidth={2} />
                {post.attendees}
                {post.capacity ? `/${post.capacity}` : ""}
              </span>
            ) : (
              <>
                {typeof post.likes === "number" && (
                  <span className="inline-flex items-center gap-0.5">
                    <Heart size={12} strokeWidth={2} />
                    {post.likes}
                  </span>
                )}
                {typeof post.comments === "number" && (
                  <span className="inline-flex items-center gap-0.5">
                    <MessageCircle size={12} strokeWidth={2} />
                    {post.comments}
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        {!isEvent && post.location && (
          <p className="inline-flex items-center gap-1 truncate text-xs text-foreground-tertiary">
            <MapPin size={11} strokeWidth={2} />
            <span className="truncate">{post.location}</span>
          </p>
        )}
      </div>

      {!cover && (
        <span className="sr-only">
          <ImageOff aria-label={labels.noImage} />
        </span>
      )}
    </Container>
  );
}
