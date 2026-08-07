"use client";
import { RHYTHM, Section, Stack } from "@/components/Layout";
import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";
import { useTranslation } from "@/i18n/context";
import { TERMS_SECTIONS } from "../constants/sections";
import { NAMESPACE } from "../i18n";

export function TermsContent() {
  const { t } = useTranslation(NAMESPACE);

  return (
    <Stack gap={RHYTHM.SECTION}>
      {TERMS_SECTIONS.map((section) => (
        <Section key={section.key} gap={RHYTHM.CONTENT}>
          <Title level="h2" size="h5" weight="semibold" color="primary">
            {t(`${section.key}Title`)}
          </Title>

          {section.kind === "prose" && <Body text={t(`${section.key}Body`)} />}

          {section.kind === "definitions" && (
            <>
              <Body text={t(`${section.key}Intro`)} />
              <ul className="flex flex-col gap-2 pl-1">
                {section.items.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span aria-hidden className="mt-0.5 text-primary">
                      •
                    </span>
                    <Text variant="span" size="sm" color="secondary">
                      {t(item)}
                    </Text>
                  </li>
                ))}
              </ul>
              <Body text={t(`${section.key}Footer`)} />
            </>
          )}

          {section.kind === "subsections" && (
            <>
              <Body text={t(`${section.key}Intro`)} />
              {section.items.map((item) => (
                <Stack key={item} gap={2} className="pl-4">
                  <Title level="h3" size="h6" weight="semibold">
                    {t(`${item}Title`)}
                  </Title>
                  <Body text={t(`${item}Body`)} />
                </Stack>
              ))}
            </>
          )}
        </Section>
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
