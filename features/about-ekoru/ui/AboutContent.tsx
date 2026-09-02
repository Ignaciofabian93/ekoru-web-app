"use client";
import { Grid, Stack } from "@/components/Layout";
import { NavCard } from "@/components/Patterns/NavCard";
import { SectionCard } from "@/components/Patterns/SectionCard";
import { LinkButton } from "@/components/Primitives/LinkButton";
import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";
import { DEFAULT_LANGUAGE } from "@/constants/settings";
import { useTranslation } from "@/i18n/context";
import {
  ArrowRight,
  Compass,
  HeartHandshake,
  Mail,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { useParams } from "next/navigation";
import { ABOUT_BELIEFS, ABOUT_FEATURES, ABOUT_GOALS } from "../constants/sections";
import { NAMESPACE } from "../i18n";

/**
 * The body, laid out as the profile dashboard is: a wide column carrying what
 * the platform is and does, and a narrower rail of shorter panels beside it.
 * Every panel is the shared `SectionCard`, so the two screens share a surface.
 */
export function AboutContent() {
  const { t } = useTranslation(NAMESPACE);
  const params = useParams();
  const lang = typeof params?.lang === "string" ? params.lang : DEFAULT_LANGUAGE;

  return (
    <Grid cols={1} lg={5} gap={4}>
      <Stack gap={4} className="lg:col-span-3">
        {/* What EKORU is */}
        <SectionCard icon={Sparkles} tone="primary" title={t("intro.title")}>
          <Paragraphs text={t("intro.body")} />
        </SectionCard>

        {/* What the platform does, each card linking into it. Every card is a
            link on purpose — this page is reached from the drawer, so its job
            is to explain the platform *and* hand the reader a way into it. */}
        <SectionCard
          icon={Compass}
          tone="default"
          title={t("features.title")}
          subtitle={t("features.subtitle")}
        >
          <Grid cols={1} sm={2} gap={3}>
            {ABOUT_FEATURES.map((feature) => (
              <NavCard
                key={feature.key}
                href={`/${lang}${feature.route}`}
                icon={feature.icon}
                tone={feature.tone}
                title={t(`features.${feature.key}.title`)}
                hint={t(`features.${feature.key}.description`)}
              />
            ))}
          </Grid>
        </SectionCard>

        {/* SDGs */}
        <SectionCard
          icon={Target}
          tone="success"
          title={t("goals.title")}
          subtitle={t("goals.subtitle")}
        >
          <Grid cols={1} sm={2} gap={3}>
            {ABOUT_GOALS.map((goal) => (
              <div
                key={goal.key}
                className="flex gap-3 rounded-2xl border border-success/25 bg-linear-180 from-success/8 to-success/2 p-4"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-success/30 bg-white/70 font-sans text-sm font-bold text-success">
                  {goal.number}
                </span>
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
        </SectionCard>
      </Stack>

      <Stack as="aside" gap={4} className="lg:col-span-2">
        {/* Manifesto */}
        <SectionCard icon={HeartHandshake} tone="default" title={t("beliefs.title")}>
          <Stack gap={2}>
            {ABOUT_BELIEFS.map((belief) => (
              <Text key={belief} variant="p" size="base" color="secondary">
                {t(`beliefs.${belief}`)}
              </Text>
            ))}
          </Stack>
          <div className="mt-4 rounded-2xl bg-linear-to-br from-nature-teal-dark via-nature-teal-dark to-nature-teal-light px-5 py-6">
            <Text variant="p" size="base" weight="bold" color="white" align="center">
              {t("beliefs.closing")}
            </Text>
          </div>
        </SectionCard>

        {/* Impact */}
        <SectionCard icon={TrendingUp} tone="success" title={t("impact.title")}>
          <Stack gap={4}>
            <Paragraphs text={t("impact.body")} />
            <Text variant="blockquote" size="base" color="primaryDark" weight="semibold">
              {t("impact.message")}
            </Text>
          </Stack>
        </SectionCard>

        {/* The way back into the app */}
        <SectionCard
          icon={ArrowRight}
          tone="primary"
          title={t("cta.title")}
          subtitle={t("cta.subtitle")}
        >
          <Stack gap={3}>
            <LinkButton
              href={`/${lang}/marketplace`}
              icon={ArrowRight}
              iconPosition="right"
              label={t("cta.explore")}
              size="md"
              fullWidth
            />
            <LinkButton
              href={`/${lang}/contact`}
              icon={Mail}
              label={t("cta.contact")}
              variant="outlined"
              size="md"
              fullWidth
            />
          </Stack>
        </SectionCard>
      </Stack>
    </Grid>
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
