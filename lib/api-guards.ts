import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { apiProxyLimiter } from "@/lib/rate-limit";

const MAX_QUERY_LEN = 80;

export type GuardResult =
  | { ok: true; q: string; userId: string }
  | { ok: false; response: NextResponse };

function getClientIp(request: NextRequest): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) {
    // x-forwarded-for can be a comma-separated list; the original client is first.
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

// Common guard for the external-API proxy routes:
//   - requires an authenticated session
//   - rate-limits independently by user id AND by client IP, so an attacker
//     can't bypass the user limit by spinning up multiple accounts and
//     can't bypass the IP limit by switching accounts
//   - trims + length-caps the `q` parameter (empty `q` returns ok:true with q: "")
export async function guardProxyRequest(request: NextRequest): Promise<GuardResult> {
  const user = await getCurrentUser();
  if (!user) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const ip = getClientIp(request);
  // Check IP first so a misbehaving network gets blocked regardless of which
  // accounts it cycles through.
  if (!apiProxyLimiter.consume(`api:ip:${ip}`)) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Too many requests" }, { status: 429 }),
    };
  }
  if (!apiProxyLimiter.consume(`api:user:${user.id}`)) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Too many requests" }, { status: 429 }),
    };
  }

  const raw = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (raw.length > MAX_QUERY_LEN) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Query too long" }, { status: 400 }),
    };
  }

  return { ok: true, q: raw, userId: user.id };
}
