"use client";
import Image from "next/image";
import Link from "next/link";
import { Newspaper } from "lucide-react";
import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";
import { resolveImageUrl } from "@/utils/resolveImage";
import type { BlogPost } from "../types";

interface Props {
  lang: string;
  categorySlug: string;
  post: BlogPost;
}

export function BlogPostCard({ lang, categorySlug, post }: Props) {
  const translation = post.translation;
  if (!translation) return null;

  const cover = resolveImageUrl(post.coverImage);
  const date = post.publishedAt
    ? new Intl.DateTimeFormat(lang, {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(post.publishedAt))
    : null;

  return (
    <Link
      href={`/${lang}/blog/${categorySlug}/${translation.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border-light bg-surface shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-background-secondary">
        {cover ? (
          <Image
            src={cover}
            alt={translation.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-primary/40">
            <Newspaper size={40} strokeWidth={1.5} />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        {date && (
          <Text
            size="xs"
            color="tertiary"
            weight="medium"
            className="uppercase tracking-wide"
          >
            {date}
          </Text>
        )}
        <Title level="h3" size="h6" weight="semibold" className="line-clamp-2">
          {translation.title}
        </Title>
        {translation.excerpt && (
          <Text size="sm" color="secondary" numberOfLines={3} className="flex-1">
            {translation.excerpt}
          </Text>
        )}
      </div>
    </Link>
  );
}
