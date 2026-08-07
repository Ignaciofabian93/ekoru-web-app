"use client";

import type { VisibleSocial } from "../hooks/useSellerVisibility";

/**
 * Outbound links to the seller's social profiles. The caller decides whether
 * these may be shown at all — see `useSellerVisibility`.
 *
 * `rel="noopener"` because these point at profiles the seller typed in: the
 * destination is untrusted, and without it the opened tab can reach back
 * through `window.opener`.
 */
export function SellerSocials({ socials }: { socials: VisibleSocial[] }) {
  if (socials.length === 0) return null;

  return (
    <ul className="flex flex-wrap items-center gap-2">
      {socials.map(({ key, icon: Icon, url }) => (
        <li key={key}>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            // The platform name is the accessible name — the icon alone would
            // announce as an unlabelled link.
            aria-label={key}
            className="flex size-9 items-center justify-center rounded-lg bg-primary-light/20 text-primary outline-none transition-colors hover:bg-primary hover:text-on-primary focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Icon size={16} color="currentColor" strokeWidth={2} aria-hidden />
          </a>
        </li>
      ))}
    </ul>
  );
}
