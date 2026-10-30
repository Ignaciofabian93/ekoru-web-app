"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { recordPath } from "../navigation";

/** Remembers the previous page, for the source of an item view. Renders nothing. */
export function NavigationTracker() {
  const pathname = usePathname();
  useEffect(() => {
    recordPath(pathname);
  }, [pathname]);
  return null;
}
