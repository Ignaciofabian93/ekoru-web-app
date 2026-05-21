"use client";
import Link from "next/link";
import { type SupportedLanguage } from "@/constants/settings";
import { useTranslation } from "@/i18n/context";
import type { AuthKey } from "../i18n";
import { Text } from "@/components/Text/Text";
import { Title } from "@/components/Title/Title";

type FooterLink = {
  textKey: AuthKey;
  linkKey: AuthKey;
  href: string;
};

export function AuthShell({
  lang,
  logo,
  subtitleKey,
  footer,
  children,
}: {
  lang: SupportedLanguage;
  logo: React.ReactNode;
  subtitleKey: AuthKey;
  footer: FooterLink;
  children: React.ReactNode;
}) {
  const { t } = useTranslation("auth");

  return (
    <main className="min-h-screen lg:h-screen flex flex-col justify-center lg:flex-row lg:items-center lg:overflow-hidden bg-background max-w-4xl mx-auto w-full">
      <section
        aria-label={t("a11y.brandingSection")}
        className="w-full lg:flex-1 flex flex-col items-center justify-center gap-3 px-6 pt-10 pb-4 lg:gap-4 lg:px-8 lg:py-8"
      >
        {logo}
        <div className="flex flex-col mt-4 text-center gap-2">
          <Title level="h1" size="h4" weight="semibold" color="primary" align="center">
            {t("page.headline")}
          </Title>
          <Text variant="span" weight="bold" align="center">
            {t(subtitleKey)}
          </Text>
        </div>
      </section>

      <section
        aria-label={t("a11y.authSection")}
        className="w-full lg:flex-1 flex flex-col items-center justify-center px-6 pb-10 pt-2 lg:px-8 lg:py-8 lg:max-h-screen lg:overflow-y-auto"
      >
        <div className="w-full max-w-md">
          {children}

          <div role="separator" className="flex items-center gap-3 my-2">
            <hr
              aria-hidden="true"
              className="flex-1 m-0 border-0 border-t border-border-light"
            />
            <Text variant="span" weight="semibold" size="sm" color="tertiary">
              {t("actions.or")}
            </Text>
            <hr
              aria-hidden="true"
              className="flex-1 m-0 border-0 border-t border-border-light"
            />
          </div>

          <Text variant="p" align="center">
            {t(footer.textKey)}{" "}
            <Link href={footer.href} className="font-bold text-primary hover:underline">
              {t(footer.linkKey)}
            </Link>
          </Text>
        </div>

        <nav aria-label={t("a11y.pageNav")} className="text-center mt-1">
          <Link href={`/${lang}`}>
            <Text variant="small">{t("actions.goBackHome")}</Text>
          </Link>
        </nav>
      </section>
    </main>
  );
}
