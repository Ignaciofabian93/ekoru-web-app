"use client";
import { Breadcrumb, type Crumb } from "@/components/Patterns/Breadcrumb";
import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";
import { Container, Section } from "@/components/Layout";
import { useNavigation } from "@/hooks/useNavigation";
import { useTranslation } from "@/i18n/context";
import { resolveImageUrl } from "@/utils/resolveImage";
import { humanizeSlug } from "@/utils/formatters";

import { useBlogPost } from "../hooks/useBlogPost";
import { NAMESPACE } from "../i18n";
import type { Language } from "../types";

interface Props {
  lang: string;
  language: Language;
  categorySlug: string;
  slug: string;
}

const WALLPAPER = "/wallpapers/wallpaper-1.jpg";

export function BlogPostContent({ lang, language, categorySlug, slug }: Props) {
  const { t } = useTranslation(NAMESPACE);
  const { navigateTo } = useNavigation();
  const { post, loading } = useBlogPost(slug, language);
  const translation = post?.translation;

  if (loading && !post) {
    return (
      <Container width="narrow">
        <Section>
          <div className="flex flex-col gap-4">
            <div className="h-8 w-3/4 animate-pulse rounded-lg bg-background-secondary" />
            <div className="aspect-video w-full animate-pulse rounded-2xl bg-background-secondary" />
            <div className="h-4 w-full animate-pulse rounded bg-background-secondary" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-background-secondary" />
            <div className="h-4 w-11/12 animate-pulse rounded bg-background-secondary" />
          </div>
        </Section>
      </Container>
    );
  }

  if (!post || !translation) {
    return (
      <Container width="narrow">
        <Section>
          <div className="flex flex-col items-center gap-1 rounded-2xl border border-dashed border-border-light bg-surface px-4 py-16 text-center">
            <Text weight="semibold">{t("detail.postNotFound")}</Text>
            <Text size="sm" color="secondary">
              {t("detail.postNotFoundHint")}
            </Text>
          </div>
        </Section>
      </Container>
    );
  }

  const heroImage = resolveImageUrl(post.coverImage) ?? WALLPAPER;
  const date = post.publishedAt
    ? new Intl.DateTimeFormat(lang, {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(post.publishedAt))
    : null;

  const breadCrumbs: Crumb[] = [
    { label: t("breadcrumbs.blog"), href: `/${lang}/blog` },
    { label: humanizeSlug(categorySlug), href: `/${lang}/blog/${categorySlug}` },
    { label: translation.title },
  ];

  return (
    <article>
      <header
        className="relative w-full min-h-72 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black/70" aria-hidden />
        <div className="relative z-10 mx-auto flex h-full min-h-72 max-w-4xl flex-col justify-between gap-6 px-4 py-6 text-white">
          <Breadcrumb
            items={breadCrumbs.map((c) => ({
              label: c.label,
              onPress: c.href ? () => navigateTo({ route: c.href as string }) : undefined,
            }))}
            crumbColor="inverted"
            chevronColor="inverted"
          />
          <div className="flex flex-col gap-2 pb-4">
            {date && (
              <Text
                size="sm"
                color="white"
                weight="medium"
                className="uppercase tracking-wide opacity-80"
              >
                {date}
              </Text>
            )}
            <Title level="h1" size="h2" color="white" weight="semibold">
              {translation.title}
            </Title>
          </div>
        </div>
      </header>

      <Container width="narrow">
        <Section className="px-2">
          {translation.excerpt && (
            <Text size="lg" color="secondary" className="leading-relaxed wrap-break-word">
              {translation.excerpt}
            </Text>
          )}
          {translation.content && (
            <div className="max-w-full min-w-0 text-base leading-relaxed whitespace-pre-wrap wrap-break-word text-foreground">
              {translation.content}
            </div>
          )}
        </Section>
      </Container>
    </article>
  );
}
