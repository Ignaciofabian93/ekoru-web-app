"use client";
import clsx from "clsx";
import { ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { DropdownPanel } from "@/components/Overlays/Dropdown";
import { Skeleton } from "@/components/Primitives/Skeleton";
import { useTranslation } from "@/i18n/context";
import { NAMESPACE } from "../i18n";
import type { CatalogNode, CatalogTree } from "../types";

/** Gap kept between the panel and the viewport's right edge. */
const VIEWPORT_MARGIN = 16;

/** Rows a column's arrow keys move between: its "See all" link and its nodes. */
const ROW_SELECTOR = "[data-row]";
/** A column's catalog entries, without the "See all" link above them. */
const NODE_SELECTOR = "[data-node]";

const rowClass = clsx(
  "flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left",
  "font-sans text-sm outline-none transition-colors",
  "focus-visible:ring-2 focus-visible:ring-primary",
);

export interface MegaMenuPanelProps {
  id: string;
  /** The section's translated name, e.g. "Marketplace". */
  label: string;
  /** Locale-prefixed landing page of the section. */
  href: string;
  /** Active locale, prefixed onto the tree's locale-less routes. */
  lang: string;
  tree: CatalogTree;
  /** Called when any link in the panel is followed, so the menu can close. */
  onNavigate: () => void;
}

interface Column {
  /** The "See all" link heading the column: the section, or the opened node. */
  seeAll: { label: string; href: string };
  nodes: CatalogNode[];
}

/**
 * The desktop dropdown of one subheader section, opened one layer at a time:
 * the section's top level first (the marketplace's departments), and each
 * entry with children opens its own column to the right (categories, then
 * subcategories). Entries without children are plain links. Every column is
 * headed by a "See all" link to whatever opened it.
 *
 * Below `md` the drawer's accordions carry the same trees, so the panel is
 * desktop only.
 */
export function MegaMenuPanel({
  id,
  label,
  href,
  lang,
  tree,
  onNavigate,
}: MegaMenuPanelProps) {
  const { t } = useTranslation(NAMESPACE);
  const localize = (route: string) => `/${lang}${route}`;

  // Index of the opened entry in each column, left to right.
  const [path, setPath] = useState<number[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);
  // Column whose first entry takes focus once it renders (ArrowRight).
  const focusColumn = useRef<number | null>(null);

  const columns: Column[] = [{ seeAll: { label, href }, nodes: tree.items }];
  for (const index of path) {
    // A refetch can leave the path pointing past the end; stop there.
    const opened = columns[columns.length - 1].nodes[index];
    if (!opened?.children?.length) break;
    columns.push({
      seeAll: { label: opened.label, href: localize(opened.route) },
      nodes: opened.children,
    });
  }

  const columnId = (depth: number) => `${id}-column-${depth}`;

  const toggle = (depth: number, index: number) =>
    setPath((prev) =>
      prev[depth] === index ? prev.slice(0, depth) : [...prev.slice(0, depth), index],
    );

  // Anchored under its pill, the panel grows rightwards as columns open, so on
  // the right-hand pills it can run past the viewport. Slide it back just
  // enough to fit, never past the left margin.
  const fitToViewport = useCallback(() => {
    const el = panelRef.current;
    if (!el) return;
    el.style.translate = "";
    const { left, right } = el.getBoundingClientRect();
    const overflow =
      right - (document.documentElement.clientWidth - VIEWPORT_MARGIN);
    if (overflow > 0) {
      el.style.translate = `${-Math.min(overflow, Math.max(0, left - VIEWPORT_MARGIN))}px`;
    }
  }, []);

  // Every render: a column opening, closing or loading changes the width.
  useLayoutEffect(() => {
    fitToViewport();
    if (focusColumn.current === null) return;
    panelRef.current
      ?.querySelector<HTMLElement>(
        `[data-column="${focusColumn.current}"] ${NODE_SELECTOR}`,
      )
      ?.focus();
    focusColumn.current = null;
  });

  useEffect(() => {
    window.addEventListener("resize", fitToViewport);
    return () => window.removeEventListener("resize", fitToViewport);
  }, [fitToViewport]);

  // Up/Down/Home/End move within a column, Right opens the focused entry and
  // steps into its column, Left steps back to the entry that opened this one.
  // Tab still walks every row in order.
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const row = e.target as HTMLElement;
    const column = row.closest<HTMLElement>("[data-column]");
    if (!column || !row.matches(ROW_SELECTOR)) return;
    const depth = Number(column.dataset.column);
    const rows = [...column.querySelectorAll<HTMLElement>(ROW_SELECTOR)];
    const at = rows.indexOf(row);

    const move: Record<string, () => void> = {
      ArrowDown: () => rows[(at + 1) % rows.length]?.focus(),
      ArrowUp: () => rows[(at - 1 + rows.length) % rows.length]?.focus(),
      Home: () => rows[0]?.focus(),
      End: () => rows[rows.length - 1]?.focus(),
      ArrowRight: () => {
        if (row.dataset.index === undefined) return;
        focusColumn.current = depth + 1;
        setPath((prev) => [...prev.slice(0, depth), Number(row.dataset.index)]);
      },
      ArrowLeft: () =>
        panelRef.current
          ?.querySelector<HTMLElement>(
            `[data-column="${depth - 1}"] [aria-expanded="true"]`,
          )
          ?.focus(),
    };
    if (!(e.key in move)) return;
    e.preventDefault();
    move[e.key]();
  };

  return (
    <DropdownPanel
      ref={panelRef}
      id={id}
      isOpen
      align="left"
      width="w-max"
      className="max-md:hidden animate-fade-up"
    >
      <div className="flex" onKeyDown={handleKeyDown}>
        {columns.map((column, depth) => {
          const openIndex = path[depth];
          const isRoot = depth === 0;
          return (
            <div
              key={depth}
              id={columnId(depth)}
              data-column={depth}
              className={clsx(
                "flex w-56 shrink-0 flex-col",
                !isRoot && "border-l border-border-light",
              )}
            >
              <div className="border-b border-border-light p-1.5">
                <SeeAllLink
                  href={column.seeAll.href}
                  label={t("megaMenu.seeAll", { section: column.seeAll.label })}
                  onNavigate={onNavigate}
                />
              </div>

              {isRoot && column.nodes.length === 0 ? (
                tree.loading ? (
                  <ColumnSkeleton label={t("megaMenu.loading")} />
                ) : (
                  <p className="px-4 py-3 font-sans text-sm text-foreground-tertiary">
                    {t("megaMenu.empty")}
                  </p>
                )
              ) : (
                <ul
                  aria-label={column.seeAll.label}
                  className="flex max-h-[min(60vh,26rem)] flex-col overflow-y-auto p-1.5"
                >
                  {column.nodes.map((node, index) => (
                    <li key={node.route}>
                      {node.children?.length ? (
                        <NodeButton
                          node={node}
                          index={index}
                          isOpen={openIndex === index}
                          controls={columnId(depth + 1)}
                          onToggle={() => toggle(depth, index)}
                        />
                      ) : (
                        <Link
                          href={localize(node.route)}
                          prefetch={false}
                          onClick={onNavigate}
                          data-row
                          data-node
                          className={clsx(
                            rowClass,
                            "text-foreground-secondary hover:bg-surface-hover hover:text-primary",
                          )}
                        >
                          {node.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </DropdownPanel>
  );
}

// ── Pieces ────────────────────────────────────────────────────────────────────

/** An entry with children: opens (or closes) the next column instead of linking. */
function NodeButton({
  node,
  index,
  isOpen,
  controls,
  onToggle,
}: {
  node: CatalogNode;
  index: number;
  isOpen: boolean;
  /** Id of the column this entry opens; only present while it's open. */
  controls: string;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      aria-expanded={isOpen}
      aria-controls={isOpen ? controls : undefined}
      onClick={onToggle}
      data-row
      data-node
      data-index={index}
      className={clsx(
        rowClass,
        isOpen
          ? "bg-primary-light-bg font-semibold text-primary-dark"
          : "text-foreground-secondary hover:bg-surface-hover",
      )}
    >
      <span className="flex-1 truncate">{node.label}</span>
      <ChevronRight
        size={14}
        aria-hidden
        className={clsx("shrink-0", isOpen ? "text-primary" : "text-foreground-tertiary")}
      />
    </button>
  );
}

function SeeAllLink({
  href,
  label,
  onNavigate,
}: {
  href: string;
  label: string;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={href}
      prefetch={false}
      onClick={onNavigate}
      data-row
      className={clsx(
        rowClass,
        "font-semibold text-primary hover:bg-primary-light-bg hover:text-primary-active",
      )}
    >
      <span className="flex-1 truncate">{label}</span>
      <ArrowRight size={14} aria-hidden className="shrink-0" />
    </Link>
  );
}

function ColumnSkeleton({ label }: { label: string }) {
  return (
    <div role="status" aria-busy="true" className="flex flex-col gap-3 px-4 py-3">
      <span className="sr-only">{label}</span>
      <Skeleton className="h-4 w-3/4" radius="sm" />
      <Skeleton className="h-4 w-1/2" radius="sm" />
      <Skeleton className="h-4 w-2/3" radius="sm" />
      <Skeleton className="h-4 w-3/5" radius="sm" />
    </div>
  );
}
