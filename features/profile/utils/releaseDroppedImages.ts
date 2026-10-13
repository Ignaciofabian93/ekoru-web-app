/**
 * Asks the server to delete the images an edit dropped (GW-3). Best effort:
 * the listing is already saved, and a leftover file only costs storage. The
 * gateway deletes only the caller's own keys that no listing still uses.
 */
export function releaseDroppedImages(
  before: readonly string[] | null | undefined,
  after: readonly string[],
) {
  const dropped = (before ?? []).filter((key) => !after.includes(key));
  if (!dropped.length) return;
  void fetch("/api/products/images", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ keys: dropped }),
  }).catch(() => undefined);
}
