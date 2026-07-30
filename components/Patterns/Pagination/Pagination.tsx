"use client";

import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type React from "react";
import { Select } from "@/components/Primitives/Select";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
  onItemsPerPageChange?: (pageSize: number) => void;
  showItemsPerPage?: boolean;
  itemsPerPageOptions?: number[];
  rowsLabel?: string;
  maxPageButtons?: number;
  /** Accessible names for the chevrons — pass translated strings. */
  previousLabel?: string;
  nextLabel?: string;
  style?: React.CSSProperties;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
}

function getPageNumbers(current: number, total: number, max: number): (number | "...")[] {
  if (total <= max) return Array.from({ length: total }, (_, i) => i + 1);

  const half = Math.floor(max / 2);
  let start = Math.max(2, current - half);
  const end = Math.min(total - 1, start + max - 3);

  if (end - start < max - 3) start = Math.max(2, end - (max - 3));

  const pages: (number | "...")[] = [1];
  if (start > 2) pages.push("...");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push("...");
  pages.push(total);

  return pages;
}

const CHEVRON_BTN =
  "flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md border border-border bg-surface text-foreground-secondary transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:text-foreground-secondary";

const PAGE_BTN =
  "flex h-9 min-w-9 shrink-0 cursor-pointer items-center justify-center rounded-md px-3 font-sans text-sm font-semibold transition-colors";

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage = 10,
  onItemsPerPageChange,
  showItemsPerPage = true,
  itemsPerPageOptions = [10, 20, 30, 40, 50],
  rowsLabel = "Items per page",
  maxPageButtons = 5,
  previousLabel = "Previous page",
  nextLabel = "Next page",
  style,
  className,
  ref,
}: PaginationProps) {
  const pages = getPageNumbers(currentPage, totalPages, maxPageButtons);

  return (
    <div
      ref={ref}
      style={style}
      className={clsx(
        "mt-6 flex flex-col-reverse items-center gap-4 border-t border-border-light pt-4 sm:flex-row sm:justify-between",
        className,
      )}
    >
      {showItemsPerPage && onItemsPerPageChange ? (
        <div className="flex items-center gap-2">
          <span className="whitespace-nowrap font-sans text-sm font-medium text-foreground-secondary">
            {rowsLabel}
          </span>
          <div className="w-30">
            <Select
              size="sm"
              width="full"
              value={itemsPerPage}
              ariaLabel={rowsLabel}
              searchEnabled={false}
              dropdownDirection="up"
              options={itemsPerPageOptions.map((op) => ({
                label: op.toString(),
                value: op,
              }))}
              onChange={(v) => onItemsPerPageChange(Number(v))}
            />
          </div>
        </div>
      ) : (
        <span aria-hidden className="hidden sm:block" />
      )}

      <div className="flex flex-row items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label={previousLabel}
          className={CHEVRON_BTN}
        >
          <ChevronLeft size={18} color="currentColor" strokeWidth={2} aria-hidden />
        </button>

        <div className="scrollbar-none flex flex-row items-center gap-1 overflow-x-auto">
          {pages.map((page, i) =>
            page === "..." ? (
              <span
                key={`ellipsis-${i}`}
                aria-hidden
                className="flex h-9 min-w-9 items-center justify-center text-sm text-foreground-tertiary"
              >
                …
              </span>
            ) : (
              <button
                key={String(page)}
                type="button"
                onClick={() => onPageChange(page)}
                aria-current={page === currentPage ? "page" : undefined}
                className={clsx(
                  PAGE_BTN,
                  page === currentPage
                    ? "bg-primary text-on-primary shadow-sm"
                    : "text-foreground-secondary hover:bg-background-secondary hover:text-foreground",
                )}
              >
                {page}
              </button>
            ),
          )}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label={nextLabel}
          className={CHEVRON_BTN}
        >
          <ChevronRight size={18} color="currentColor" strokeWidth={2} aria-hidden />
        </button>
      </div>
    </div>
  );
}
