"use client";

import { PageLayout, Stack } from "@/components/Layout";
import { Skeleton } from "@/components/Primitives/Skeleton";
import { useTranslation } from "@/i18n/context";

import { SkeletonGrid } from "../SkeletonGrid";

export type RouteSkeletonVariant = "catalog" | "detail" | "list" | "article";

export interface RouteSkeletonProps {
  /** The shape of the page being loaded. */
  variant: RouteSkeletonVariant;
  /** Reserve the full-bleed hero most listing and profile pages open with. */
  hero?: boolean;
}

/** A results grid: a row of filter chips over product cards. */
function CatalogBody() {
  return (
    <Stack gap={4}>
      <div className="flex flex-wrap gap-2">
        <Skeleton radius="full" className="h-9 w-28" count={4} />
      </div>
      <SkeletonGrid count={10} />
    </Stack>
  );
}

/** A product, store product or service: the shape `ProductLoading` uses. */
function DetailBody() {
  return (
    <Stack gap={8}>
      <div className="grid gap-6 md:grid-cols-2 md:gap-8">
        <Skeleton radius="2xl" className="aspect-square w-full" />
        <div className="flex flex-col gap-4">
          <Skeleton radius="sm" className="h-6 w-24" />
          <Skeleton radius="sm" className="h-8 w-3/4" />
          <Skeleton radius="sm" className="h-6 w-1/3" />
          <Skeleton radius="sm" className="h-24 w-full" />
          <Skeleton radius="sm" className="h-12 w-full" />
        </div>
      </div>
      <SkeletonGrid count={5} />
    </Stack>
  );
}

/** Profile lists and notifications: a heading over rows. */
function ListBody() {
  return (
    <Stack gap={4}>
      <Skeleton radius="sm" className="h-8 w-1/3" />
      <Skeleton radius="xl" className="h-24 w-full" count={5} />
    </Stack>
  );
}

/** A blog or community post: title, cover, paragraphs. */
function ArticleBody() {
  return (
    <Stack gap={4}>
      <Skeleton radius="sm" className="h-10 w-3/4" />
      <Skeleton radius="sm" className="h-4 w-40" />
      <Skeleton radius="2xl" className="aspect-video w-full" />
      <Skeleton radius="sm" className="h-4 w-full" count={6} />
      <Skeleton radius="sm" className="h-4 w-2/3" />
    </Stack>
  );
}

const BODY: Record<RouteSkeletonVariant, () => React.ReactElement> = {
  catalog: CatalogBody,
  detail: DetailBody,
  list: ListBody,
  article: ArticleBody,
};

/**
 * What a `loading.tsx` renders while a route's server payload is on its way
 * (WEB-18). It keeps the real navbar and footer, whose copy the locale layout
 * already provides, so only the page body changes once the route arrives; the
 * page's own client-side loading state then takes over from the same shape.
 */
export function RouteSkeleton({ variant, hero = false }: RouteSkeletonProps) {
  const { t } = useTranslation();
  const Body = BODY[variant];

  return (
    <PageLayout
      width="default"
      hero={hero ? <Skeleton radius="none" className="h-40 w-full md:h-56" /> : undefined}
    >
      <div aria-busy="true" aria-live="polite">
        <span className="sr-only">{t("common.loading")}</span>
        <Body />
      </div>
    </PageLayout>
  );
}
