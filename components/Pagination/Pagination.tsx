"use client";

import { borderRadius, colors, fontFamily, fontSize } from "@/design/tokens";
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

    const chevronBtnStyle = (disabled: boolean): React.CSSProperties => ({
      width: 36,
      height: 36,
      borderRadius: borderRadius.sm,
      backgroundColor: colors.backgroundSecondary,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: `1px solid ${colors.borderLight}`,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.35 : 1,
      flexShrink: 0,
    });

    return (
      <div
        ref={ref}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          marginBlock: 32,
          borderTop: `1px solid ${colors.borderStrong}`,
          paddingTop: 8,
          ...style,
        }}
        className={className}
      >
        {showItemsPerPage && onItemsPerPageChange && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 8,
              marginBlock: 12,
            }}
          >
            <span
              style={{
                fontSize: fontSize.sm,
                fontFamily: fontFamily.sans,
                fontWeight: 500,
                color: colors.foregroundSecondary,
                textTransform: "capitalize",
                letterSpacing: 0.6,
              }}
            >
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

        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 6, marginBlock: 12 }}>
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={chevronBtnStyle(currentPage === 1)}
          >
            <ChevronLeft size={20} color={colors.foreground} strokeWidth={2} />
          </button>

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              overflowX: "auto",
            }}
          >
            {pages.map((page, i) =>
              page === "..." ? (
                <span
                  key={`ellipsis-${i}`}
                  style={{
                    fontSize: fontSize.sm,
                    color: colors.foregroundTertiary,
                    paddingInline: 4,
                    lineHeight: "36px",
                  }}
                >
                  …
                </span>
              ) : (
                <button
                  key={String(page)}
                  type="button"
                  onClick={() => onPageChange(page)}
                  style={{
                    minWidth: 36,
                    height: 36,
                    borderRadius: borderRadius.sm,
                    paddingInline: 12,
                    backgroundColor: page === currentPage ? colors.primary : colors.surface,
                    border: `1.5px solid ${colors.primary}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontSize: fontSize.sm,
                      fontFamily: fontFamily.sans,
                      fontWeight: 600,
                      color: page === currentPage ? colors.onPrimary : colors.foreground,
                    }}
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
            style={chevronBtnStyle(currentPage === totalPages)}
          >
            <ChevronRight size={20} color={colors.foreground} strokeWidth={2} />
          </button>
        </div>
      </div>
    );
  },
);

Pagination.displayName = "Pagination";

export { Pagination };
