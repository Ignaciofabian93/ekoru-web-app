"use client";
import { Grid, RHYTHM, Section, Stack } from "@/components/Layout";
import { SectionHeader } from "@/components/Patterns/SectionHeader";
import { LinkButton } from "@/components/Primitives/LinkButton";
import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";
import { DEFAULT_LANGUAGE } from "@/constants/settings";
import { useTranslation } from "@/i18n/context";
import { ArrowRight, Mail } from "lucide-react";
import { useParams } from "next/navigation";
import {
  ABOUT_BELIEFS,
  ABOUT_FEATURES,
  ABOUT_GOALS,
} from "../constants/sections";
import { NAMESPACE } from "../i18n";
import { AboutFeatureCard } from "./AboutFeatureCard";

export function AboutContent() {
  const { t } = useTranslation(NAMESPACE);
  const params = useParams();
  const lang = typeof params?.lang === "string" ? params.lang : DEFAULT_LANGUAGE;

  return (
    <>
      {/* What EKORU is */}
      <Section gap={RHYTHM.CONTENT}>
        <Title level="h2" size="h4" weight="semibold">
          {t("intro.title")}
        </Title>
        <Paragraphs text={t("intro.body")} />
      </Section>

      {/* What the platform does, each card linking into it */}
      <Section gap={RHYTHM.CONTENT} ariaLabel={t("features.title")}>
        <SectionHeader
          title={t("features.title")}
          subtitle={t("features.subtitle")}
          align="start"
        />
        <Grid cols={1} sm={2} lg={3} gap={4}>
          {ABOUT_FEATURES.map((feature) => (
            <AboutFeatureCard
              key={feature.key}
              href={`/${lang}${feature.route}`}
              icon={feature.icon}
              title={t(`features.${feature.key}.title`)}
              description={t(`features.${feature.key}.description`)}
            />
          ))}
        </Grid>
      </Section>

      {/* Manifesto */}
      <Section gap={RHYTHM.CONTENT} ariaLabel={t("beliefs.title")}>
        <Title level="h2" size="h4" weight="semibold">
          {t("beliefs.title")}
        </Title>
        <Stack gap={2}>
          {ABOUT_BELIEFS.map((belief) => (
            <Text key={belief} variant="p" size="lg" color="secondary">
              {t(`beliefs.${belief}`)}
            </Text>
          ))}
        </Stack>
        <div className="rounded-2xl bg-linear-to-br from-nature-teal-dark via-nature-teal-dark to-nature-teal-light px-6 py-8">
          <Text variant="p" size="lg" weight="bold" color="white" align="center">
            {t("beliefs.closing")}
          </Text>
        </div>
      </Section>

      {/* SDGs */}
      <Section gap={RHYTHM.CONTENT} ariaLabel={t("goals.title")}>
        <SectionHeader
          title={t("goals.title")}
          subtitle={t("goals.subtitle")}
          align="start"
        />
        <Grid cols={1} sm={2} gap={4}>
          {ABOUT_GOALS.map((goal) => (
            <div
              key={goal.key}
              className="flex gap-4 rounded-xl border border-border-light bg-surface p-5"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary/15">
                <span className="font-sans text-base font-bold text-secondary-dark">
                  {goal.number}
                </span>
              </div>
              <Stack gap={1}>
                <Title level="h3" size="h6" weight="semibold">
                  {t(`goals.${goal.key}.title`)}
                </Title>
                <Text variant="p" size="sm" color="secondary">
                  {t(`goals.${goal.key}.description`)}
                </Text>
              </Stack>
            </div>
          ))}
        </Grid>
      </Section>

      {/* Impact + the way back into the app */}
      <Section gap={RHYTHM.CONTENT} ariaLabel={t("impact.title")}>
        <Title level="h2" size="h4" weight="semibold">
          {t("impact.title")}
        </Title>
        <Paragraphs text={t("impact.body")} />
        <Text variant="blockquote" size="lg" color="primaryDark" weight="semibold">
          {t("impact.message")}
        </Text>
        <Stack direction="row" gap={3} wrap stackBelow="sm">
          <LinkButton
            href={`/${lang}/marketplace`}
            icon={ArrowRight}
            iconPosition="right"
            label={t("cta.explore")}
            size="lg"
          />
          <LinkButton
            href={`/${lang}/contact`}
            icon={Mail}
            label={t("cta.contact")}
            variant="outlined"
            size="lg"
          />
        </Stack>
      </Section>
    </>
  );
}

/** Body copy is one string with `\n\n` between paragraphs, as in the locales. */
function Paragraphs({ text }: { text: string }) {
  return (
    <Stack gap={3}>
      {text.split("\n\n").map((paragraph, i) => (
        <Text key={i} variant="p" size="base" color="secondary">
          {paragraph}
        </Text>
      ))}
    </Stack>
  );
}
