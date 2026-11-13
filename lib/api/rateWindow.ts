/**
 * Counts events per key inside a fixed window, in this process's memory. One
 * container serves each site, so that is the whole count; a restart clears it.
 */
export class RateWindow {
  private readonly hits = new Map<string, { start: number; count: number }>();

  constructor(
    private readonly limit: number,
    private readonly windowMs: number,
    /** Past this many keys the map is emptied, so it can't grow without limit. */
    private readonly maxKeys = 5_000,
  ) {}

  /** Counts one event for `key`. False once the key is over its limit. */
  take(key: string, now = Date.now()): boolean {
    const entry = this.hits.get(key);
    if (!entry || now - entry.start >= this.windowMs) {
      if (this.hits.size >= this.maxKeys) this.hits.clear();
      this.hits.set(key, { start: now, count: 1 });
      return true;
    }
    entry.count += 1;
    return entry.count <= this.limit;
  }
}
