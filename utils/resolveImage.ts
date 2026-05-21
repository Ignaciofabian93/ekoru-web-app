import { GATEWAY_BASE_URL } from "@/config/endpoints";

// Image can load them. Already-absolute URLs are returned unchanged.
export function resolveImageUrl(url: string | null | undefined): string | undefined {
  console.log("URL:: ", url);

  if (!url) return undefined;
  return url.startsWith("http") ? url : `${GATEWAY_BASE_URL}${url}`;
}
