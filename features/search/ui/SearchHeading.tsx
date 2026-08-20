"use client";
import { Chip } from "@/components/Primitives/Chip";
import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";
import { useTranslation } from "@/i18n/context";
import { NAMESPACE } from "../i18n";

interface Props {
  query: string;
  total: number;
  /** How long the engine took, when it reported it. */
  processingTimeMs?: number;
  /** Related terms the engine returned; each one re-runs the search. */
  suggestions: string[];
  onPickSuggestion: (term: string) => void;
  /** Hidden while the request is in flight — the count is stale until it lands. */
  showCount: boolean;
}

/**
 * What was searched, how much came back, and where else to go — the block the
 * results body opens with.
 */
export function SearchHeading({
  query,
  total,
  processingTimeMs,
  suggestions,
  onPickSuggestion,
  showCount,
}: Props) {
  const { t } = useTranslation(NAMESPACE);

  return (
    <div className="flex flex-col gap-2">
      <Title level="h1" size="h4" weight="bold">
        {t("heading", { query })}
      </Title>

      {showCount && (
        <div className="flex flex-row flex-wrap items-center gap-2">
          <Text variant="span" size="sm" color="secondary">
            {total === 1
              ? t("count", { count: "1" })
              : t("countPlural", { count: String(total) })}
          </Text>
          {processingTimeMs !== undefined && (
            <>
              <Text variant="span" size="sm" color="muted" aria-hidden>
                ·
              </Text>
              <Text variant="span" size="sm" color="tertiary">
                {t("timing", { ms: String(Math.round(processingTimeMs)) })}
              </Text>
            </>
          )}
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="mt-1 flex flex-row flex-wrap items-center gap-2">
          <Text variant="span" size="sm" color="secondary">
            {t("suggestions.label")}
          </Text>
          {suggestions.map((term) => (
            <Chip key={term} label={term} onPress={() => onPickSuggestion(term)} />
          ))}
        </div>
      )}
    </div>
  );
}
