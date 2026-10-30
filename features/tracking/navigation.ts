import { SUPPORTED_LANGUAGES } from "@/constants/settings";
import type { ViewSource } from "./track";

/**
 * The last two paths this tab showed, kept by NavigationTracker, so an item
 * page can tell where the visitor came from. Only in memory: a reload or a
 * link from outside starts it again, which is what EXTERNAL means.
 */
const history: { current: string | null; previous: string | null } = {
  current: null,
  previous: null,
};

export function recordPath(pathname: string): void {
  if (pathname === history.current) return;
  history.previous = history.current;
  history.current = pathname;
}

/**
 * Where the visitor was before `pathname`. The tracker may not have recorded
 * `pathname` yet when the item page asks (effects of one commit run in order),
 * in which case the page before it is still `current`.
 */
export function viewSourceFor(pathname: string): ViewSource {
  const before = history.current === pathname ? history.previous : history.current;
  return sourceOf(before);
}

const LANG_PREFIX = new RegExp(`^/(${SUPPORTED_LANGUAGES.join("|")})(?=/|$)`);

export function sourceOf(path: string | null): ViewSource {
  if (path === null) return "EXTERNAL";
  const p = path.replace(LANG_PREFIX, "") || "/";
  if (p === "/") return "HOME";
  if (p.startsWith("/search")) return "SEARCH";
  if (/^\/(marketplace|stores|services)(\/|$)/.test(p)) return "CATALOG";
  if (p.startsWith("/seller/")) return "SELLER";
  if (/^\/(product|store-product|service)\//.test(p)) return "ITEM";
  return "OTHER";
}
