"use client";
import { PackageSearch, Store, Wrench } from "lucide-react";
import { EmptyState, NavCard } from "@/components/Patterns";
import { Chip } from "@/components/Primitives/Chip";
import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";
import { Grid } from "@/components/Layout";
import { useTranslation } from "@/i18n/context";
import { NAMESPACE } from "../i18n";

interface Props {
  lang: string;
  /** Terms the engine returned for this query — the only honest "try this". */
  suggestions: string[];
  onPickSuggestion: (term: string) => void;
}

/**
 * The whole-page state for a term that matched nothing anywhere. Rather than a
 * dead end it offers three ways forward: fix the term, take a related search,
 * or browse a catalog.
 */
export function SearchZeroResults({ lang, suggestions, onPickSuggestion }: Props) {
  const { t } = useTranslation(NAMESPACE);

  return (
    <div className="flex flex-col gap-8">
      <EmptyState
        frame="framed"
        icon={PackageSearch}
        title={t("zero.title")}
        description={t("zero.description")}
        tips={[t("zero.tipSpelling"), t("zero.tipFewer"), t("zero.tipCategory")]}
      >
        {suggestions.length > 0 && (
          <>
            <Text variant="span" size="sm" color="secondary">
              {t("zero.otherSearches")}
            </Text>
            {suggestions.map((term) => (
              <Chip key={term} label={term} onPress={() => onPickSuggestion(term)} />
            ))}
          </>
        )}
      </EmptyState>

      <div className="flex flex-col gap-4">
        <Title level="h2" size="h5" weight="semibold">
          {t("zero.browseTitle")}
        </Title>
        <Grid cols={1} md={3} gap={4}>
          <NavCard
            href={`/${lang}/marketplace`}
            icon={PackageSearch}
            tone="primary"
            title={t("zero.marketplace")}
            hint={t("zero.marketplaceHint")}
          />
          <NavCard
            href={`/${lang}/stores`}
            icon={Store}
            tone="secondary"
            title={t("zero.stores")}
            hint={t("zero.storesHint")}
          />
          <NavCard
            href={`/${lang}/services`}
            icon={Wrench}
            tone="accent"
            title={t("zero.services")}
            hint={t("zero.servicesHint")}
          />
        </Grid>
      </div>
    </div>
  );
}
