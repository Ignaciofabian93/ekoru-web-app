"use client";
import clsx from "clsx";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { createElement } from "react";
import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";
import { resolveCategoryIcon } from "@/features/blog/constants/icons";
import { useTranslation } from "@/i18n/context";
import type { BlogCatalog } from "@/types/blog";
import { NAMESPACE } from "../i18n";

/**
 * Soft eco tints cycled along the rail so neighbouring topics never share a
 * colour. Topics carry no imagery, so the tinted band and the oversized icon
 * are what give each card its own face.
 */
const TONES = [
  { band: "from-lime-100 via-emerald-50 to-white", accent: "text-emerald-700" },
  { band: "from-cyan-100 via-sky-50 to-white", accent: "text-sky-700" },
  { band: "from-amber-100 via-orange-50 to-white", accent: "text-amber-700" },
  { band: "from-violet-100 via-fuchsia-50 to-white", accent: "text-violet-700" },
  { band: "from-teal-100 via-emerald-50 to-white", accent: "text-teal-700" },
  { band: "from-rose-100 via-orange-50 to-white", accent: "text-rose-700" },
] as const;

interface Props {
  lang: string;
  topic: BlogCatalog;
  /** Position in the rail; picks the tint. */
  index: number;
}

export function BlogTopicCard({ lang, topic, index }: Props) {
  const { t } = useTranslation(NAMESPACE);
  const tone = TONES[index % TONES.length];
  const icon = resolveCategoryIcon(topic.icon);

  return (
    <Link
      href={`/${lang}/blog/${topic.slug}`}
      className="group flex h-full w-64 flex-col overflow-hidden rounded-2xl border border-border-light bg-surface shadow-sm outline-none transition duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-2 focus-visible:ring-primary sm:w-72"
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
          {t("blog.explore")}
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
