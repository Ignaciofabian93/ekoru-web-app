"use client";
import { Title } from "@/components/Title/Title";
import { useTranslation } from "@/i18n/context";

export function PublishShell({
  nav,
  children,
}: {
  nav: React.ReactNode;
  children: React.ReactNode;
}) {
  const { t } = useTranslation("publish");

  return (
    <main className="flex-1">
      {nav}
      <section
        aria-label={t("a11y.section")}
        className="mx-auto w-full max-w-xl px-6 py-8 lg:py-12"
      >
        <Title level="h1" size="h3" weight="semibold" color="primary" className="mb-6">
          {t("page.title")}
        </Title>
        {children}
      </section>
    </main>
  );
}
