import { IMAGES_PUBLIC_BASE_URL } from "@/config/endpoints";

// Turns a stored R2 key (e.g. "user_avatar/42/9f2a…webp") into a fully
// qualified URL that next/image can load. The DB always stores bare R2 keys —
// see docs/R2_IMAGES_SETUP.md. Absolute URLs are returned unchanged so the
// helper is safe to call on values that may already be resolved.
export function resolveImageUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("http")) return url;
  const normalized = url.startsWith("/") ? url.slice(1) : url;
  return `${IMAGES_PUBLIC_BASE_URL}/${normalized}`;
}
