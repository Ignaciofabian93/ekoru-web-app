"use client";
import { Pagination } from "@/components/Pagination/Pagination";
import type { LucideIcon } from "lucide-react";
import { useState, type ReactNode } from "react";
import type { ListingStatus } from "../hooks/useMyListings";
import { EmptyState } from "./EmptyState";
import { UnderlineTabs } from "@/components/UnderlineTabs/UnderlineTabs";

const STATUSES: ListingStatus[] = ["active", "drafts"];
const PAGE_SIZE = 12;

export interface EmptyCopy {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface Props<T> {
  status: ListingStatus;
  counts: Record<ListingStatus, number>;
  onStatusChange: (s: ListingStatus) => void;
  statusLabel: (s: ListingStatus) => string;
  /** Items already filtered to the active status. */
  items: T[];
  loading: boolean;
  renderItem: (item: T) => ReactNode;
  emptyActive: EmptyCopy;
  emptyDrafts: EmptyCopy;
  ariaLabel?: string;
  /** Bump so the status underline remeasures when labels change (e.g. language). */
  remeasureKey?: string | number;
}

/**
 * The status-tabbed, paginated grid shared by every listing kind (marketplace /
 * store / service). Callers own the data + card; this owns the active/drafts
 * tabs, loading skeleton, empty states, and client-side pagination.
 */
export function ListingsPanel<T>({
  status,
  counts,
  onStatusChange,
  statusLabel,
  items,
  loading,
  renderItem,
  emptyActive,
  emptyDrafts,
  ariaLabel,
  remeasureKey,
}: Props<T>) {
  const [page, setPage] = useState(1);
  // Reset to the first page whenever the status filter changes — done during
  // render (React's "adjust state on prop change" pattern) rather than an effect.
  const [prevStatus, setPrevStatus] = useState(status);
  if (status !== prevStatus) {
    setPrevStatus(status);
    setPage(1);
  }

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const clampedPage = Math.min(page, totalPages);
  const visible = items.slice((clampedPage - 1) * PAGE_SIZE, clampedPage * PAGE_SIZE);

  const tabs = STATUSES.map((s) => ({ key: s, label: statusLabel(s), count: counts[s] }));
  const empty = status === "drafts" ? emptyDrafts : emptyActive;

  return (
    <div className="flex flex-col gap-5">
      <UnderlineTabs
        tabs={tabs}
        activeKey={status}
        onSelect={(k) => onStatusChange(k as ListingStatus)}
        ariaLabel={ariaLabel}
        remeasureKey={remeasureKey}
      />

      {loading && items.length === 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="aspect-4/5 animate-pulse rounded-xl bg-background-secondary"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={empty.icon}
          title={empty.title}
          description={empty.description}
          actionLabel={empty.actionLabel}
          onAction={empty.onAction}
        />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {visible.map(renderItem)}
          </div>
          {totalPages > 1 && (
            <Pagination
              currentPage={clampedPage}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  );
}
