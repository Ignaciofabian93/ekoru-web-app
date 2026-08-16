"use client";

import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type React from "react";
import { Select } from "@/components/Primitives/Select";
import {
  paginationChevronClass,
  paginationChevronSize,
  paginationControlsClass,
  paginationEllipsisClass,
  paginationPageClass,
  paginationPagesClass,
  paginationRootClass,
  paginationRowsGroupClass,
  paginationRowsLabelClass,
  paginationSelectWrapperClass,
  paginationSpacerClass,
} from "@/design/pagination";

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
    <div ref={ref} style={style} className={clsx(paginationRootClass, className)}>
      {showItemsPerPage && onItemsPerPageChange ? (
        <div className={paginationRowsGroupClass}>
          <span className={paginationRowsLabelClass}>{rowsLabel}</span>
          <div className={paginationSelectWrapperClass}>
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
        <span aria-hidden className={paginationSpacerClass} />
      )}

      <div className={paginationControlsClass}>
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label={previousLabel}
          className={paginationChevronClass}
        >
          <ChevronLeft
            size={paginationChevronSize}
            color="currentColor"
            strokeWidth={2}
            aria-hidden
          />
        </button>

        <div className={paginationPagesClass}>
          {pages.map((page, i) =>
            page === "..." ? (
              <span key={`ellipsis-${i}`} aria-hidden className={paginationEllipsisClass}>
                …
              </span>
            ) : (
              <button
                key={String(page)}
                type="button"
                onClick={() => onPageChange(page)}
                aria-current={page === currentPage ? "page" : undefined}
                className={paginationPageClass[page === currentPage ? "current" : "idle"]}
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
          className={paginationChevronClass}
        >
          <ChevronRight
            size={paginationChevronSize}
            color="currentColor"
            strokeWidth={2}
            aria-hidden
          />
        </button>
      </div>
    </div>
  );
}
