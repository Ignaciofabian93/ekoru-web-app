"use client";
import { Container } from "@/components/Layout";
import { CoverBanner } from "@/components/Patterns/CoverBanner";
import { Badge } from "@/components/Primitives/Badge";
import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";
import { useTranslation } from "@/i18n/context";
import { CalendarClock, Globe, Scale } from "lucide-react";
import { NAMESPACE } from "../i18n";
import { TERMS_SECTIONS } from "../constants/sections";

/**
 * The about page's header without its brand mark: the cover band pinned to the
 * content column, then the eyebrow, heading, a line of context and the badges.
 * A legal page has no owner to put a face to, so the text starts flush under
 * the band rather than clearing an avatar that overlaps it.
 */
export function TermsHero() {
  const { t } = useTranslation(NAMESPACE);

  return (
    <Container as="section" width="default" gap={0} paddingY={2}>
      <CoverBanner altText="" />

      <div className="mt-5 flex min-w-0 flex-col gap-1.5 wrap-anywhere">
        <Text variant="span" size="sm" weight="semibold" color="primary">
          {t("page.heroLabel")}
        </Text>
        <Title level="h1" size="h3" weight="bold">
          {t("page.heroTitle")}
        </Title>
        <Text variant="p" size="base" color="secondary">
          {t("page.tagline")}
        </Text>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <Badge
            variant="primary"
            size="small"
            icon={Scale}
            label={t("page.badges.clauses", { count: String(TERMS_SECTIONS.length) })}
          />
          <Badge
            variant="secondary"
            size="small"
            icon={CalendarClock}
            label={t("page.badges.updated")}
          />
          <Badge
            variant="tertiary"
            size="small"
            icon={Globe}
            label={t("page.badges.jurisdiction")}
          />
        </div>
      </div>
    </Container>
  );
}
