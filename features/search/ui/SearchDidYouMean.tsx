"use client";
import clsx from "clsx";
import { Replace } from "lucide-react";
import { Text } from "@/components/Primitives/Text";
import { useTranslation } from "@/i18n/context";
import { NAMESPACE } from "../i18n";

interface Props {
  /** The spelling the engine is confident the user meant. */
  correction: string;
  onPick: (term: string) => void;
}

/** "Did you mean …?" — the engine's spelling fix, one click from re-running. */
export function SearchDidYouMean({ correction, onPick }: Props) {
  const { t } = useTranslation(NAMESPACE);

  return (
    <div
      className={clsx(
        "flex flex-row flex-wrap items-center gap-2 rounded-2xl px-4 py-3.5",
        "border border-navbar bg-primary-light-bg",
      )}
    >
      <Replace
        size={20}
        strokeWidth={2}
        aria-hidden
        className="shrink-0 text-primary-active"
      />
      <Text variant="span" color="primaryDark">
        {t("corrected.prefix")}
      </Text>
      <button
        type="button"
        onClick={() => onPick(correction)}
        className={clsx(
          "cursor-pointer text-lg font-bold text-primary-active underline",
          "decoration-navbar-hover underline-offset-3 hover:decoration-primary",
          "outline-none focus-visible:ring-2 focus-visible:ring-border-focus rounded-sm",
        )}
      >
        {correction}
      </button>
      <Text variant="span" color="primaryDark">
        {t("corrected.suffix")}
      </Text>
    </div>
  );
}
