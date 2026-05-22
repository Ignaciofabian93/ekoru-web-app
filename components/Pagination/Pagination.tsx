"use client";

import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
import Select from "../Select/Select";

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
  style?: React.CSSProperties;
  className?: string;
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
  "flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-sm border border-border-light bg-background-secondary text-foreground disabled:cursor-not-allowed disabled:opacity-35";

const Pagination = React.forwardRef<HTMLDivElement, PaginationProps>(
  (
    {
      currentPage,
      totalPages,
      onPageChange,
      itemsPerPage = 10,
      onItemsPerPageChange,
      showItemsPerPage = true,
      itemsPerPageOptions = [10, 25, 50, 100],
      rowsLabel = "Items per page",
      maxPageButtons = 5,
      style,
      className,
    },
    ref,
  ) => {
    const pages = getPageNumbers(currentPage, totalPages, maxPageButtons);

    return (
      <div
        ref={ref}
        style={style}
        className={clsx(
          "my-8 flex flex-col gap-3 border-t border-border-strong pt-2",
          className,
        )}
      >
        {showItemsPerPage && onItemsPerPageChange && (
          <div className="my-3 flex flex-col items-end gap-2">
            <span className="font-sans text-sm font-medium capitalize tracking-[0.6px] text-foreground-secondary">
              {rowsLabel}
            </span>
            <Select
              size="sm"
              width="sm"
              value={itemsPerPage}
              searchEnabled={false}
              dropdownDirection="up"
              options={itemsPerPageOptions.map((op) => ({ label: op.toString(), value: op }))}
              onChange={(v) => onItemsPerPageChange(Number(v))}
            />
          </div>
        )}

        <div className="my-3 flex flex-row items-center gap-1.5">
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={CHEVRON_BTN}
          >
            <ChevronLeft size={20} color="currentColor" strokeWidth={2} />
          </button>

          <div className="flex flex-1 flex-row items-center justify-center gap-1 overflow-x-auto">
            {pages.map((page, i) =>
              page === "..." ? (
                <span
                  key={`ellipsis-${i}`}
                  className="px-1 text-sm leading-9 text-foreground-tertiary"
                >
                  …
                </span>
              ) : (
                <button
                  key={String(page)}
                  type="button"
                  onClick={() => onPageChange(page)}
                  className={clsx(
                    "flex h-9 min-w-9 shrink-0 cursor-pointer items-center justify-center rounded-sm border-[1.5px] border-primary px-3",
                    page === currentPage ? "bg-primary" : "bg-surface",
                  )}
                >
                  <span
                    className={clsx(
                      "font-sans text-sm font-semibold",
                      page === currentPage ? "text-on-primary" : "text-foreground",
                    )}
                  >
                    {page}
                  </span>
                </button>
              ),
            )}
          </div>

          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={CHEVRON_BTN}
          >
            <ChevronRight size={20} color="currentColor" strokeWidth={2} />
          </button>
        </div>
      </div>
    );
  },
);

Pagination.displayName = "Pagination";

export { Pagination };
