"use client";
import { Title } from "@/components/Title/Title";
import {
  UnderlineTabs,
  type UnderlineTab,
} from "@/components/UnderlineTabs/UnderlineTabs";

const ALL_KEY = "__all__";

interface Props {
  /** Section heading, e.g. "Departments", "Categories" or "Product types". */
  label: string;
  ariaLabel: string;
  tabs: UnderlineTab[];
  /** Key of the active tab. Falls back to the "All" tab when omitted. */
  activeKey?: string;
  /** Bump when a label's width changes outside `tabs` (usually the language). */
  remeasureKey?: string | number;
  loading?: boolean;
}

/**
 * A titled row of underline tabs. Generic across every marketplace screen —
 * departments, department categories and product types all render through it;
 * the caller builds the `tabs` (label + `href`) and picks the active key.
 */
export function CategoryList({
  label,
  ariaLabel,
  tabs,
  activeKey,
  remeasureKey,
  loading,
}: Props) {
  if (loading && tabs.length === 0) {
    return (
      <section className="flex flex-col gap-3 px-2">
        <Title level="h2" size="h5">
          {label}
        </Title>
        <div className="scrollbar-none flex gap-6 overflow-x-auto border-b border-border-light pb-2.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-4 w-20 shrink-0 animate-pulse rounded bg-background-secondary"
            />
          ))}
        </div>
      </section>
    );
  }

  if (tabs.length === 0) return null;

  return (
    <section className="flex flex-col gap-3 px-2">
      <Title level="h2" size="h5">
        {label}
      </Title>
      <UnderlineTabs
        tabs={tabs}
        activeKey={activeKey ?? ALL_KEY}
        ariaLabel={ariaLabel}
        remeasureKey={remeasureKey}
        scrollable
      />
    </section>
  );
}
