"use client";

import clsx from "clsx";
import { X } from "lucide-react";
import Link from "next/link";
import {
  chipClass,
  chipCountClass,
  chipInteractiveClass,
  chipRemoveClass,
  chipRemoveIconSize,
  comingSoonChipClass,
  type ChipTone,
} from "@/design/chip";

/** Marks a destination that exists but has not shipped yet. */
export function ComingSoonChip({ label }: { label: string }) {
  return <span className={comingSoonChipClass}>{label}</span>;
}

export interface ChipProps {
  label: string;
  /** Muted number beside the label — a facet's hit count. */
  count?: number;
  selected?: boolean;
  /** Renders the chip as a link. Ignored when `onPress` is given. */
  href?: string;
  onPress?: () => void;
  /**
   * Renders a ✕ that fires this instead of the chip itself. A chip with a
   * remove button is never itself a button — nested buttons are invalid — so
   * `onRemove` and `onPress` are mutually exclusive.
   */
  onRemove?: () => void;
  /** Accessible name for the ✕, e.g. "Remove filter". */
  removeLabel?: string;
  className?: string;
}

/**
 * The small pill used for search suggestions, tag facets and active filters.
 * One shape, two tones: neutral outline when idle, lime wash when selected.
 */
export function Chip({
  label,
  count,
  selected = false,
  href,
  onPress,
  onRemove,
  removeLabel,
  className,
}: ChipProps) {
  const tone: ChipTone = selected ? "selected" : "idle";
  const interactive = Boolean(onPress || href) && !onRemove;
  const shell = clsx(chipClass[tone], interactive && chipInteractiveClass, className);

  const content = (
    <>
      <span>{label}</span>
      {typeof count === "number" && (
        <span className={chipCountClass[tone]}>{count}</span>
      )}
    </>
  );

  if (onRemove) {
    return (
      <span className={shell}>
        {content}
        <button
          type="button"
          onClick={onRemove}
          aria-label={removeLabel ?? label}
          className={chipRemoveClass}
        >
          <X size={chipRemoveIconSize} strokeWidth={2.5} aria-hidden />
        </button>
      </span>
    );
  }

  if (onPress) {
    return (
      <button type="button" onClick={onPress} aria-pressed={selected} className={shell}>
        {content}
      </button>
    );
  }

  if (href) {
    return (
      <Link href={href} className={shell}>
        {content}
      </Link>
    );
  }

  return <span className={shell}>{content}</span>;
}
