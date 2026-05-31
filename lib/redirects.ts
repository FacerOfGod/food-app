// Only allow site-relative paths to prevent open-redirect attacks.
// Rejects protocol-relative (`//evil.com`) and absolute URLs.
export function safeRedirectPath(
  raw: string | null | undefined,
  fallback: string = "/dashboard"
): string {
  if (!raw) return fallback;
  if (typeof raw !== "string") return fallback;
  if (!raw.startsWith("/")) return fallback;
  if (raw.startsWith("//")) return fallback;
  if (raw.startsWith("/\\")) return fallback;
  return raw;
}
