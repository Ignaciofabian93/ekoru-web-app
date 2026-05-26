"use client";

import { useCallback, useState } from "react";

export function useShareSeller({
  title,
  text,
  url,
}: {
  title: string;
  text?: string;
  url?: string;
}) {
  const [copied, setCopied] = useState(false);

  const share = useCallback(async () => {
    const targetUrl =
      url ?? (typeof window !== "undefined" ? window.location.href : "");

    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ title, text, url: targetUrl });
        return;
      } catch {
        // fall through to clipboard fallback
      }
    }

    if (typeof navigator !== "undefined" && navigator.clipboard && targetUrl) {
      try {
        await navigator.clipboard.writeText(targetUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      } catch {
        // clipboard unavailable
      }
    }
  }, [title, text, url]);

  return { share, copied };
}
