"use client";
import { Text } from "@/components/Primitives/Text";
import { useTranslation } from "@/i18n/context";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import { useState, type ReactNode } from "react";

/** Collapsible wrapper that keeps rarely-used store fields (dimensions, weight,
 *  warranty, features, tags) out of the way until the seller expands it. */
export function OptionalDetailsSection({ children }: { children: ReactNode }) {
  const { t } = useTranslation("publish");
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-border-light bg-surface">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left"
      >
        <span className="flex flex-col">
          <Text variant="span" weight="medium">
            {t("form.optionalDetails")}
          </Text>
          <Text variant="small" color="tertiary">
            {t("form.optionalDetailsHint")}
          </Text>
        </span>
        <ChevronDown
          size={18}
          color="currentColor"
          strokeWidth={2}
          className={clsx(
            "shrink-0 text-foreground-tertiary transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div className="flex flex-col gap-5 border-t border-border-light p-4">
          {children}
        </div>
      )}
    </div>
  );
}
