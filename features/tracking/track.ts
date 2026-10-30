import { getApolloClient } from "@/lib/apollo/client";
import { TRACK_ITEM_VIEW, TRACK_SEARCH_CLICK } from "@/graphql/search/mutations";

/**
 * Anonymous counts for the businesses' analytics: which items are seen, from
 * where, and which search results get clicked. Nothing identifies the visitor
 * (no user, session or cookie), so this needs no consent under Ley 21.719.
 * A failed call is ignored: tracking never gets in the way of the page.
 */

export type TrackedItemType = "PRODUCT" | "STORE_PRODUCT" | "SERVICE";

export type ViewSource =
  | "SEARCH"
  | "CATALOG"
  | "SELLER"
  | "HOME"
  | "ITEM"
  | "EXTERNAL"
  | "OTHER";

export function trackItemView(input: {
  itemType: TrackedItemType;
  itemId: number;
  source: ViewSource;
}): void {
  getApolloClient()
    .mutate({ mutation: TRACK_ITEM_VIEW, variables: { input } })
    .catch(() => undefined);
}

export function trackSearchClick(input: {
  searchId: number;
  itemType: TrackedItemType;
  itemId: number;
  position: number;
}): void {
  getApolloClient()
    .mutate({ mutation: TRACK_SEARCH_CLICK, variables: { input } })
    .catch(() => undefined);
}
