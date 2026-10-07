import clsx from "clsx";
import { ArrowRight, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { createElement } from "react";
import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";
import { topicToneAt } from "@/design/topic-tones";
import type { BlogCatalog } from "@/types/blog";

export interface BlogTopicCardProps {
  lang: string;
  topic: BlogCatalog;
  /** Lucide icon for `topic.icon`, resolved by the caller so this card stays free of feature code. */
  icon: LucideIcon;
  ctaLabel: string;
  /** Position in its list; picks the tint. */
  index: number;
}

/** A blog topic (catalog category). Fills its container's width; the parent sets the size. */
export function BlogTopicCard({
  lang,
  topic,
  icon,
  ctaLabel,
  index,
}: BlogTopicCardProps) {
  const tone = topicToneAt(index);

  return (
    <Link
      href={`/${lang}/blog/${topic.slug}`}
      className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border-light bg-surface shadow-sm outline-none transition duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-2 focus-visible:ring-primary"
    >
      <div className={clsx("relative h-28 overflow-hidden bg-linear-to-br", tone.band)}>
        {createElement(icon, {
          size: 128,
          strokeWidth: 1.25,
          "aria-hidden": true,
          className: clsx(
            "pointer-events-none absolute -right-6 -bottom-10 -rotate-12 opacity-20",
            "transition-transform duration-300 group-hover:rotate-0 group-hover:scale-110",
            tone.accent,
          ),
        })}
        <span
          className={clsx(
            "absolute top-4 left-4 flex size-11 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-black/5",
            tone.accent,
          )}
        >
          {createElement(icon, { size: 22, strokeWidth: 1.75, "aria-hidden": true })}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <Title level="h3" size="h6" weight="semibold" numberOfLines={1}>
          {topic.name}
        </Title>
        <Text size="sm" color="secondary" numberOfLines={2}>
          {topic.description}
        </Text>
        <span className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-semibold text-primary">
          {ctaLabel}
          <ArrowRight
            size={16}
            strokeWidth={2.5}
            aria-hidden
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </Link>
  );
}
