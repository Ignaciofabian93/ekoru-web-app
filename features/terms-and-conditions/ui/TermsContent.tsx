"use client";
import { Grid, Stack } from "@/components/Layout";
import { SectionCard } from "@/components/Patterns/SectionCard";
import { LinkButton } from "@/components/Primitives/LinkButton";
import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";
import { DEFAULT_LANGUAGE } from "@/constants/settings";
import { useTranslation } from "@/i18n/context";
import { AlertCircle, ListOrdered, Mail } from "lucide-react";
import { useParams } from "next/navigation";
import type { TermsDocument } from "../api/getCurrentTerms";
import { NAMESPACE } from "../i18n";
import { groupClauses, type ClausePart } from "./groupClauses";

/**
 * The document, laid out as the about page is: the clauses as stacked
 * `SectionCard` panels in the wide column, and a narrower rail beside them —
 * here an index of the clauses and the way to ask about them.
 *
 * The text comes from the API as plain-text blocks (LEG-1), edited in the
 * panel; nothing here is rendered as HTML.
 */
export function TermsContent({ terms }: { terms: TermsDocument | null }) {
  const { t } = useTranslation(NAMESPACE);
  const params = useParams();
  const lang = typeof params?.lang === "string" ? params.lang : DEFAULT_LANGUAGE;

  const clauses = terms ? groupClauses(terms.blocks) : [];

  return (
    <Grid cols={1} lg={5} gap={4}>
      <Stack gap={4} className="lg:col-span-3">
        {!terms && (
          <SectionCard icon={AlertCircle} tone="default" title={t("page.heroTitle")}>
            <Text variant="p" size="sm" color="secondary">
              {t("page.unavailable")}
            </Text>
          </SectionCard>
        )}
        {clauses.map((clause) => (
          // The card itself is the `<section>`; this wrapper only carries the
          // anchor the index links to, offset so the heading clears the navbar.
          <div key={clause.id} id={clause.id} className="scroll-mt-24">
            <SectionCard
              title={clause.label}
              tone={clause.structured ? "primary" : "default"}
              chip={
                clause.number ? (
                  <span className="font-sans text-sm font-bold text-current">
                    {clause.number}
                  </span>
                ) : undefined
              }
            >
              <Parts parts={clause.parts} />
            </SectionCard>
          </div>
        ))}
      </Stack>

      <Stack
        as="aside"
        gap={4}
        className="lg:col-span-2 lg:sticky lg:top-24 lg:self-start"
      >
        {clauses.length > 0 && (
          <SectionCard icon={ListOrdered} tone="primary" title={t("page.toc")}>
            <Stack gap={1} as="nav">
              {clauses.map((clause) => (
                <a
                  key={clause.id}
                  href={`#${clause.id}`}
                  className="flex items-baseline gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-background-secondary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                >
                  <Text
                    variant="span"
                    size="xs"
                    weight="bold"
                    color="primary"
                    className="w-5 shrink-0"
                  >
                    {clause.number}
                  </Text>
                  <Text variant="span" size="sm" color="secondary">
                    {clause.label}
                  </Text>
                </a>
              ))}
            </Stack>
          </SectionCard>
        )}

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

/** A clause's paragraphs, lists and sub-clauses. */
function Parts({ parts }: { parts: ClausePart[] }) {
  return (
    <Stack gap={4}>
      {parts.map((part, i) => {
        if (part.kind === "paragraph") {
          return (
            <Text key={i} variant="p" size="sm" color="secondary">
              {part.text}
            </Text>
          );
        }
        if (part.kind === "list") {
          return (
            <ul key={i} className="flex flex-col gap-2">
              {part.items.map((item, j) => (
                <li
                  key={j}
                  className="flex gap-2 rounded-xl border border-border-light bg-background-secondary/50 p-3"
                >
                  <span aria-hidden className="mt-0.5 shrink-0 text-primary">
                    •
                  </span>
                  <Text variant="span" size="sm" color="secondary">
                    {item}
                  </Text>
                </li>
              ))}
            </ul>
          );
        }
        return (
          <Stack key={i} gap={2} className="border-l-2 border-primary/25 pl-4">
            <Title level="h3" size="h6" weight="semibold">
              {part.title}
            </Title>
            <Parts parts={part.parts} />
          </Stack>
        );
      })}
    </Stack>
  );
}
