interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

export class MemoryCache<T> {
  private entry: CacheEntry<T> | null = null;
  private ttlMs: number;

  constructor(ttlMs = 30_000) {
    this.ttlMs = ttlMs;
  }

  get(): T | null {
    if (!this.entry) return null;
    if (Date.now() > this.entry.expiresAt) {
      this.entry = null;
      return null;
    }
    return this.entry.data;
  }

  set(data: T): void {
    this.entry = { data, expiresAt: Date.now() + this.ttlMs };
  }

  invalidate(): void {
    this.entry = null;
  }
}
