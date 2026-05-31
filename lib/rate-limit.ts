// In-process token bucket. Resets on server restart, which is fine for a
// best-effort abuse limit; persistent quotas should live in the DB.
//
// Each limiter is bounded to MAX_KEYS entries via LRU-on-access — Map
// iteration order is insertion-order, so re-setting on every consume() naturally
// brings recently-used keys to the end and lets us evict the oldest entries.
// Without this, a flood of unique keys (e.g. `send:<random>@…`) would grow
// the Map without bound.

type Bucket = { tokens: number; updatedAt: number };

interface LimiterOptions {
  capacity: number;        // max tokens
  refillPerSecond: number; // tokens added per second
  maxKeys?: number;        // max distinct keys tracked simultaneously
}

const DEFAULT_MAX_KEYS = 10_000;

export class RateLimiter {
  private buckets = new Map<string, Bucket>();
  private capacity: number;
  private refillRate: number;
  private maxKeys: number;

  constructor(opts: LimiterOptions) {
    this.capacity = opts.capacity;
    this.refillRate = opts.refillPerSecond;
    this.maxKeys = opts.maxKeys ?? DEFAULT_MAX_KEYS;
  }

  // Returns true when the request is allowed. Each call consumes one token.
  consume(key: string): boolean {
    const now = Date.now();
    const existing = this.buckets.get(key);
    const bucket = existing
      ? { ...existing }
      : { tokens: this.capacity, updatedAt: now };

    // Clamp to zero: an NTP step-back would otherwise give negative refill.
    const elapsedSec = Math.max(0, (now - bucket.updatedAt) / 1000);
    bucket.tokens = Math.min(
      this.capacity,
      bucket.tokens + elapsedSec * this.refillRate
    );
    bucket.updatedAt = now;

    const allowed = bucket.tokens >= 1;
    if (allowed) bucket.tokens -= 1;

    // Re-inserting moves the key to the end (LRU on access).
    this.buckets.delete(key);
    this.buckets.set(key, bucket);

    // Evict the oldest entries if we're over the cap. Map iteration is
    // insertion order, so the first key is the least-recently used.
    while (this.buckets.size > this.maxKeys) {
      const oldest = this.buckets.keys().next().value;
      if (oldest === undefined) break;
      this.buckets.delete(oldest);
    }

    return allowed;
  }
}

// Shared limiters
export const otpVerifyLimiter = new RateLimiter({
  capacity: 10,             // burst of 10 verify attempts
  refillPerSecond: 1 / 6,   // ~10/minute steady state
  maxKeys: 5_000,
});

export const otpSendLimiter = new RateLimiter({
  capacity: 5,
  refillPerSecond: 1 / 60,  // 1 send per minute steady state
  maxKeys: 5_000,
});

export const apiProxyLimiter = new RateLimiter({
  capacity: 30,
  refillPerSecond: 1,       // 1/sec sustained, 30 burst
  maxKeys: 10_000,
});
