"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import useAuthStore from "@/store/useAuthStore";
import { viewSourceFor } from "../navigation";
import { trackItemView, type TrackedItemType } from "../track";

/** Items already counted in this tab, so going back and forth counts once. */
const counted = new Set<string>();

/**
 * Counts one view of an item page once the item has loaded. The seller's own
 * visits are left out, so a business checking its listings does not inflate
 * its figures; that waits for the session to load, to know who is looking.
 */
export function useTrackItemView({
  itemType,
  itemId,
  sellerId,
}: {
  itemType: TrackedItemType;
  itemId?: number | string | null;
  sellerId?: string | null;
}): void {
  const pathname = usePathname();
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const viewerId = useAuthStore((s) => s.seller?.id ?? null);

  useEffect(() => {
    const id = Number(itemId);
    if (!Number.isInteger(id) || id <= 0 || !isHydrated) return;
    if (sellerId && viewerId === sellerId) return;
    const key = `${itemType}:${id}`;
    if (counted.has(key)) return;
    counted.add(key);
    trackItemView({ itemType, itemId: id, source: viewSourceFor(pathname) });
  }, [itemType, itemId, sellerId, isHydrated, viewerId, pathname]);
}
