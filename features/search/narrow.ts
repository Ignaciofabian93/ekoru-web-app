import type { ProductCondition } from "@/types/enums";
import type {
  SearchFilters,
  SearchResultItem,
  SearchSource,
} from "./types";

/** Every condition a marketplace listing can carry, in descending order. */
export const PRODUCT_CONDITIONS: ProductCondition[] = [
  "NEW",
  "LIKE_NEW",
  "OPEN_BOX",
  "REFURBISHED",
  "GOOD",
  "FAIR",
  "POOR",
  "FOR_PARTS",
];

export const SEARCH_SOURCES: SearchSource[] = ["MARKETPLACE", "STORE"];

/** Which catalog a hit belongs to; services belong to neither. */
function sourceOf(item: SearchResultItem): SearchSource | null {
  if (item.type === "PRODUCT") return "MARKETPLACE";
  if (item.type === "STORE_PRODUCT") return "STORE";
  return null;
}

/**
 * The condition the marketplace subgraph resolved for this hit. It rides on
 * the federated entity rather than the index, which is exactly why condition
 * cannot be filtered engine-side.
 */
function conditionOf(item: SearchResultItem): ProductCondition | null {
  return item.type === "PRODUCT" ? (item.product?.condition ?? null) : null;
}

/**
 * Applies the two filters the search engine has no field for — catalog source
 * and marketplace condition — to the page of hits already on screen.
 *
 * This is a narrowing of one page, not of the result set: the engine still
 * counts and paginates everything that matched, so a page can come back with
 * fewer cards than `pageSize` once these are on. Both become engine-side
 * filters the moment the index carries `condition` and the input splits
 * `PRODUCT` from `STORE_PRODUCT`.
 */
export function narrowItems(
  items: SearchResultItem[],
  filters: SearchFilters,
): SearchResultItem[] {
  const { sources, conditions } = filters;
  if (sources.length === 0 && conditions.length === 0) return items;

  return items.filter((item) => {
    if (sources.length > 0) {
      const source = sourceOf(item);
      if (source === null || !sources.includes(source)) return false;
    }

    if (conditions.length > 0) {
      const condition = conditionOf(item);
      if (condition === null || !conditions.includes(condition)) return false;
    }

    return true;
  });
}

/**
 * How many hits on this page carry each condition. Counted before the
 * condition filter is applied — otherwise picking one would zero every other
 * option — but after the source filter, so the numbers describe what is
 * actually in scope.
 */
export function countConditions(
  items: SearchResultItem[],
  sources: SearchSource[],
): Record<ProductCondition, number> {
  const counts = Object.fromEntries(
    PRODUCT_CONDITIONS.map((condition) => [condition, 0]),
  ) as Record<ProductCondition, number>;

  items.forEach((item) => {
    const source = sourceOf(item);
    if (sources.length > 0 && (source === null || !sources.includes(source))) return;
    const condition = conditionOf(item);
    if (condition && condition in counts) counts[condition] += 1;
  });

  return counts;
}

/** How many hits on this page come from each catalog. */
export function countSources(
  items: SearchResultItem[],
): Record<SearchSource, number> {
  const counts: Record<SearchSource, number> = { MARKETPLACE: 0, STORE: 0 };
  items.forEach((item) => {
    const source = sourceOf(item);
    if (source) counts[source] += 1;
  });
  return counts;
}
