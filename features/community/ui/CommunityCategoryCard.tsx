"use client";
import clsx from "clsx";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";
import { topicToneAt } from "@/design/topic-tones";
import { useTranslation } from "@/i18n/context";

import { NAMESPACE } from "../i18n";
import type { CommunityCategory } from "../types";

/** Topic chips shown before the rest collapse into a "+N more" chip. */
const MAX_TOPICS = 4;

const topicChipClass = clsx(
  "block rounded-full bg-current/5 px-2.5 py-1 text-xs font-medium ring-1 ring-current/20 ring-inset",
  "transition-colors hover:bg-current/15",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current",
);

interface Props {
  lang: string;
  category: CommunityCategory;
  /** Position in the grid; picks the tint. */
  index: number;
}

/**
 * A community category, styled after the blog topic card. There is no icon on
 * purpose: the catalogue is expected to change, so the band carries only the
 * tint and a few shapes. The title link is stretched over the whole card; the
 * topic chips sit above it so each stays clickable on its own.
 */
export function CommunityCategoryCard({ lang, category, index }: Props) {
  const { t } = useTranslation(NAMESPACE);
  const tone = topicToneAt(index);
  const categoryHref = `/${lang}/community/${category.slug}`;
  const topics = category.subcategories;
  const shownTopics = topics.slice(0, MAX_TOPICS);
  const hiddenCount = topics.length - shownTopics.length;

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border-light bg-surface shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div
        aria-hidden
        className={clsx(
          "relative h-24 overflow-hidden bg-linear-to-br",
          tone.band,
          tone.accent,
        )}
      >
        <span className="absolute -top-10 -right-8 size-32 rounded-full bg-current opacity-10 transition-transform duration-500 group-hover:scale-110" />
        <span className="absolute right-20 -bottom-12 size-24 rounded-full bg-current opacity-15 transition-transform duration-500 group-hover:-translate-x-3" />
        <span className="absolute right-7 bottom-4 size-9 rounded-full border-4 border-current opacity-25 transition-transform duration-500 group-hover:-translate-y-1" />
        {topics.length > 0 && (
          <span className="absolute top-4 left-4 rounded-full bg-white px-2.5 py-1 text-xs font-semibold shadow-sm ring-1 ring-black/5">
            {topics.length === 1
              ? t("category.topicOne")
              : t("category.topicOther", { count: String(topics.length) })}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-col gap-1.5">
          <Title level="h3" size="h6" weight="semibold" numberOfLines={1}>
            <Link
              href={categoryHref}
              className="outline-none after:absolute after:inset-0 after:rounded-2xl focus-visible:after:ring-2 focus-visible:after:ring-primary"
            >
              {category.category}
            </Link>
          </Title>
          {category.description && (
            <Text size="sm" color="secondary" numberOfLines={2}>
              {category.description}
            </Text>
          )}
        </div>

        {shownTopics.length > 0 && (
          <ul className={clsx("relative z-10 flex flex-wrap gap-1.5", tone.accent)}>
            {shownTopics.map((sub) => (
              <li key={sub.id}>
                <Link
                  href={`/${lang}/community/${category.slug}/${sub.slug}`}
                  className={topicChipClass}
                >
                  {sub.subcategory}
                </Link>
              </li>
            ))}
            {hiddenCount > 0 && (
              <li>
                <Link href={categoryHref} className={topicChipClass}>
                  {t("category.moreTopics", { count: String(hiddenCount) })}
                </Link>
              </li>
            )}
          </ul>
        )}

        <span className="mt-auto inline-flex items-center gap-1 pt-1 text-sm font-semibold text-primary">
          {t("category.explore")}
          <ArrowRight
            size={16}
            strokeWidth={2.5}
            aria-hidden
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </div>
  );
}
