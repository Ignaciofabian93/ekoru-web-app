"use client";
import { PageLayout } from "@/components/Layout";
import { Title } from "@/components/Primitives/Title";
import { useTranslation } from "@/i18n/context";

/**
 * Publish keeps a feature shell only for its page title; the surrounding
 * chrome, width and rhythm now come from the shared `PageLayout`.
 */
export function PublishShell({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation("publish");

  return (
    <PageLayout width="narrow">
      <section aria-label={t("a11y.section")} className="flex w-full flex-col gap-6">
        <Title level="h1" size="h3" weight="semibold" color="primary">
          {t("page.title")}
        </Title>
        {children}
      </section>
    </PageLayout>
  );
}
