"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Whether the element has come within `rootMargin` of the viewport; once true
 * it stays true. Lets a section below the fold hold off fetching and rendering
 * its content until the visitor scrolls toward it. The default starts one
 * screen ahead, so a normal scroll rarely catches the placeholder.
 */
export function useNearViewport<T extends Element>(rootMargin = "100% 0px") {
  const ref = useRef<T>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (near || !element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [near, rootMargin]);

  return [ref, near] as const;
}
