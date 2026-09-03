"use client";
import { Grid, Stack } from "@/components/Layout";
import { SectionCard } from "@/components/Patterns/SectionCard";
import { LinkButton } from "@/components/Primitives/LinkButton";
import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";
import { DEFAULT_LANGUAGE } from "@/constants/settings";
import { useTranslation } from "@/i18n/context";
import { ListOrdered, Mail } from "lucide-react";
import { useParams } from "next/navigation";
import { TERMS_SECTIONS, type TermsSection } from "../constants/sections";
import { NAMESPACE } from "../i18n";

/**
 * The document, laid out as the about page is: the clauses as stacked
 * `SectionCard` panels in the wide column, and a narrower rail beside them —
 * here an index of the clauses and the way to ask about them.
 */
export function TermsContent() {
  const { t } = useTranslation(NAMESPACE);
  const params = useParams();
  const lang = typeof params?.lang === "string" ? params.lang : DEFAULT_LANGUAGE;

  const clauses = TERMS_SECTIONS.map((section) => ({
    section,
    ...splitClauseNumber(t(`${section.key}Title`)),
  }));

  return (
    <Grid cols={1} lg={5} gap={4}>
      <Stack gap={4} className="lg:col-span-3">
        {clauses.map(({ section, number, label }) => (
          // The card itself is the `<section>`; this wrapper only carries the
          // anchor the index links to, offset so the heading clears the navbar.
          <div key={section.key} id={clauseId(section.key)} className="scroll-mt-24">
            <SectionCard
              title={label}
              tone={section.kind === "prose" ? "default" : "primary"}
              chip={
                <span className="font-sans text-sm font-bold text-current">{number}</span>
              }
            >
              <Clause section={section} />
            </SectionCard>
          </div>
        ))}
      </Stack>

      <Stack
        as="aside"
        gap={4}
        className="lg:col-span-2 lg:sticky lg:top-24 lg:self-start"
      >
        <SectionCard icon={ListOrdered} tone="primary" title={t("page.toc")}>
          <Stack gap={1} as="nav">
            {clauses.map(({ section, number, label }) => (
              <a
                key={section.key}
                href={`#${clauseId(section.key)}`}
                className="flex items-baseline gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-background-secondary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              >
                <Text
                  variant="span"
                  size="xs"
                  weight="bold"
                  color="primary"
                  className="w-5 shrink-0"
                >
                  {number}
                </Text>
                <Text variant="span" size="sm" color="secondary">
                  {label}
                </Text>
              </a>
            ))}
          </Stack>
        </SectionCard>

        <SectionCard
          icon={Mail}
          tone="success"
          title={t("page.questions.title")}
          subtitle={t("page.questions.subtitle")}
        >
          <LinkButton
            href={`/${lang}/contact`}
            icon={Mail}
            label={t("page.questions.cta")}
            variant="outlined"
            size="md"
            fullWidth
          />
        </SectionCard>
      </Stack>
    </Grid>
  );
}

/** The body of one clause, by kind. */
function Clause({ section }: { section: TermsSection }) {
  const { t } = useTranslation(NAMESPACE);

  if (section.kind === "prose") return <Body text={t(`${section.key}Body`)} />;

  if (section.kind === "definitions") {
    return (
      <Stack gap={4}>
        <Body text={t(`${section.key}Intro`)} />
        <ul className="flex flex-col gap-2">
          {section.items.map((item) => (
            <li
              key={item}
              className="flex gap-2 rounded-xl border border-border-light bg-background-secondary/50 p-3"
            >
              <span aria-hidden className="mt-0.5 shrink-0 text-primary">
                •
              </span>
              <Text variant="span" size="sm" color="secondary">
                {t(item)}
              </Text>
            </li>
          ))}
        </ul>
        <Body text={t(`${section.key}Footer`)} />
      </Stack>
    );
  }

  return (
    <Stack gap={4}>
      <Body text={t(`${section.key}Intro`)} />
      {section.items.map((item) => (
        <Stack key={item} gap={2} className="border-l-2 border-primary/25 pl-4">
          <Title level="h3" size="h6" weight="semibold">
            {t(`${item}Title`)}
          </Title>
          <Body text={t(`${item}Body`)} />
        </Stack>
      ))}
    </Stack>
  );
}

/**
 * Clause bodies are stored as one string with `\n\n` between paragraphs, so the
 * legal copy stays a single translatable unit per clause instead of an array
 * the three locales could drift apart on.
 */
function Body({ text }: { text: string }) {
  return (
    <Stack gap={3}>
      {text.split("\n\n").map((paragraph, i) => (
        <Text key={i} variant="p" size="sm" color="secondary">
          {paragraph}
        </Text>
      ))}
    </Stack>
  );
}

function clauseId(key: string) {
  return `clause-${key}`;
}

/**
 * Splits "3. Platform Use" into the marker and the heading, so the number can
 * ride in the card's chip without being repeated in the title beside it.
 *
 * The number is read from the copy rather than the section list because the
 * copy is what's legally authoritative — a clause referred to as "8" in a
 * contract must show 8, whatever position it happens to sit at. All three
 * locales use the same `N.` / `N.N` prefix; a title without one keeps its text
 * and shows no marker.
 */
function splitClauseNumber(title: string): { number: string; label: string } {
  const match = /^\s*(\d+(?:\.\d+)*)\.?\s+(.*)$/.exec(title);
  if (!match) return { number: "", label: title };
  return { number: match[1], label: match[2] };
}
