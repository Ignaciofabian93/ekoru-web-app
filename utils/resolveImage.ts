import { GATEWAY_BASE_URL, IMAGES_PUBLIC_BASE_URL } from "@/config/endpoints";

// Turns a stored image reference into a fully qualified URL that next/image
// can load. Three input shapes coexist while we migrate off the gateway disk
// volume:
//   - already-absolute http(s)             → returned unchanged
//   - legacy gateway path "/images/foo.jpg" → prefixed with the gateway host
//   - new R2 key "user_avatar/123/x.webp"  → prefixed with the CDN host
export function resolveImageUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("http")) return url;
  if (url.startsWith("/images/")) return `${GATEWAY_BASE_URL}${url}`;
  const normalized = url.startsWith("/") ? url.slice(1) : url;
  return `${IMAGES_PUBLIC_BASE_URL}/${normalized}`;
}
