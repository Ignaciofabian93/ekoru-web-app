"use client";
import { Title } from "@/components/Primitives/Title";
import { Text } from "@/components/Primitives/Text";
import { useTranslation } from "@/i18n/context";

import { NAMESPACE } from "../i18n";
import type { ServiceFaq } from "../types";

/**
 * The provider's own answers for this service. Rendered as native
 * `<details>` so it stays keyboard- and screen-reader-friendly without any
 * accordion state of its own.
 */
export function ServiceFaqs({ faqs }: { faqs?: ServiceFaq[] | null }) {
  const { t } = useTranslation(NAMESPACE);

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="flex flex-col gap-3" aria-label={t("faqs.title")}>
      <Title level="h2" size="h5" weight="semibold">
        {t("faqs.title")}
      </Title>

      <ul className="flex flex-col gap-2">
        {faqs.map((faq) => (
          <li key={faq.id}>
            <details className="group rounded-2xl border border-border-light bg-surface p-4">
              <summary className="cursor-pointer list-none text-sm font-semibold text-foreground marker:hidden">
                {faq.question}
              </summary>
              <div className="pt-2">
                <Text variant="p" size="sm" color="tertiary">
                  {faq.answer}
                </Text>
              </div>
            </details>
          </li>
        ))}
      </ul>
    </section>
  );
}
