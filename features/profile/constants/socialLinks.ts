import { Facebook, Instagram, Linkedin, type LucideIcon } from "lucide-react";
import { FaTiktok } from "react-icons/fa6";

/**
 * lucide-react carries Facebook, Instagram and LinkedIn but not TikTok, so the
 * brand mark comes from react-icons (already used by the footer). It takes the
 * same `size` / `color` props `Input` passes its `leftIcon`, so the cast is
 * about the nominal type only, not the call signature.
 */
const TiktokIcon = FaTiktok as unknown as LucideIcon;

/**
 * The seller's social profiles, stored in the `socialMediaLinks` JSON column on
 * Seller. Config-driven like the settings screen: one entry here plus its label
 * in the three locales is all a new platform needs.
 *
 * Keys are the lowercase platform name — this is the map's schema, so changing
 * one orphans whatever is already stored under the old key.
 */
export type SocialPlatform = "facebook" | "instagram" | "tiktok" | "linkedin";

export type SocialLinkField = {
  key: SocialPlatform;
  icon: LucideIcon;
};

export const SOCIAL_LINKS: readonly SocialLinkField[] = [
  { key: "facebook", icon: Facebook },
  { key: "instagram", icon: Instagram },
  { key: "tiktok", icon: TiktokIcon },
  { key: "linkedin", icon: Linkedin },
] as const;

export const SOCIAL_PLATFORMS = SOCIAL_LINKS.map((s) => s.key);

/** Where a bare handle hangs off, per platform. */
const PROFILE_BASE: Record<SocialPlatform, string> = {
  facebook: "https://facebook.com/",
  instagram: "https://instagram.com/",
  tiktok: "https://tiktok.com/@",
  linkedin: "https://linkedin.com/in/",
};

/** LinkedIn splits people (`/in/`) from organisations (`/company/`). */
const LINKEDIN_COMPANY_BASE = "https://linkedin.com/company/";

/**
 * Accepts whatever the seller types — a full URL, a bare domain, or just a
 * handle — and returns a value that works directly as an `href`, so the profile
 * never has to guess how to link it later.
 */
export function normalizeSocialUrl(
  platform: SocialPlatform,
  value: string,
  isBusiness = false,
): string {
  const trimmed = value.trim();
  if (!trimmed) return "";

  // Already a URL: keep it exactly as typed.
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  // A URL missing its scheme (`instagram.com/ekoru`) — a dotted host + a path.
  if (/^[\w-]+(\.[\w-]+)+\//.test(trimmed)) return `https://${trimmed}`;

  const handle = trimmed.replace(/^@+/, "");
  const base =
    platform === "linkedin" && isBusiness
      ? LINKEDIN_COMPANY_BASE
      : PROFILE_BASE[platform];
  return `${base}${handle}`;
}

/** Reads the stored JSON map into the form's fixed shape. */
export const socialsFromLinks = (
  links: Record<string, string> | undefined | null,
): Record<SocialPlatform, string> =>
  Object.fromEntries(
    SOCIAL_PLATFORMS.map((key) => [key, links?.[key] ?? ""]),
  ) as Record<SocialPlatform, string>;

/**
 * Builds the map to persist. `updateSeller` writes the JSON column wholesale,
 * so this has to send everything that should survive the save: keys the form
 * doesn't manage are carried over untouched, and cleared fields are dropped
 * rather than stored as empty strings.
 */
export function socialsToLinks(
  socials: Record<SocialPlatform, string>,
  existing: Record<string, string> | undefined | null,
  isBusiness = false,
): Record<string, string> {
  const next: Record<string, string> = { ...(existing ?? {}) };
  for (const platform of SOCIAL_PLATFORMS) {
    const url = normalizeSocialUrl(platform, socials[platform], isBusiness);
    if (url) next[platform] = url;
    else delete next[platform];
  }
  return next;
}
