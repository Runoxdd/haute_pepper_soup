import { NextRequest, NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// Mock mode detection — skip ALL middleware when no external services
// ---------------------------------------------------------------------------

const isMockMode = !process.env.MONGODB_URI;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1"
  );
}

function getAllowedOrigins(): Set<string> {
  const origins = new Set<string>();

  const allowed = process.env.ALLOWED_ORIGINS;
  if (allowed) {
    for (const origin of allowed.split(",")) {
      const trimmed = origin.trim();
      if (trimmed) origins.add(trimmed);
    }
  }

  const authUrl = process.env.AUTH_URL;
  if (authUrl) {
    try {
      origins.add(new URL(authUrl).origin);
    } catch {
      // Invalid AUTH_URL — skip
    }
  }

  return origins;
}

function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return adminEmails.includes(email.trim().toLowerCase());
}

// ---------------------------------------------------------------------------
// Rate limiter (lazy, only when Upstash env vars present)
// ---------------------------------------------------------------------------

let _limitersLoaded = false;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _limiters: Record<string, any> | null = null;

async function getLimiters() {
  if (_limitersLoaded) return _limiters;
  _limitersLoaded = true;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  try {
    const { Redis } = await import("@upstash/redis");
    const { Ratelimit } = await import("@upstash/ratelimit");
    const redis = new Redis({ url, token });

    _limiters = {
      orders: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, "1 h"), prefix: "rl:orders" }),
      auth: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, "1 m"), prefix: "rl:auth" }),
      upload: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(20, "1 h"), prefix: "rl:upload" }),
      orderLookup: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(30, "1 m"), prefix: "rl:order-lookup" }),
    };
  } catch {
    _limiters = null;
  }

  return _limiters;
}

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

export async function middleware(req: NextRequest) {
  // In mock mode, skip everything — let the app render with mock data
  if (isMockMode) {
    return NextResponse.next();
  }

  const { pathname } = req.nextUrl;
  const method = req.method;

  // --------------------------------------------------
  // 1. Rate limiting
  // --------------------------------------------------
  try {
    const limiters = await getLimiters();
    if (limiters) {
      const ip = getClientIp(req);
      let result: { success: boolean; reset: number } | null = null;

      if (pathname.startsWith("/api/auth")) {
        result = await limiters.auth.limit(ip);
      } else if (pathname === "/api/orders" && method === "POST") {
        result = await limiters.orders.limit(ip);
      } else if (pathname === "/api/upload") {
        result = await limiters.upload.limit(ip);
      } else if (pathname.startsWith("/order/") && method === "GET") {
        result = await limiters.orderLookup.limit(ip);
      }

      if (result && !result.success) {
        const retryAfter = Math.max(Math.ceil((result.reset - Date.now()) / 1000), 1);
        return NextResponse.json(
          { error: "Too many requests. Please try again later." },
          { status: 429, headers: { "Retry-After": String(retryAfter) } },
        );
      }
    }
  } catch {
    // Redis unavailable — fail open
  }

  // --------------------------------------------------
  // 2. CSRF protection (skip /api/auth/*)
  // --------------------------------------------------
  const isMutating = ["POST", "PATCH", "DELETE", "PUT"].includes(method);
  const isAuthRoute = pathname.startsWith("/api/auth");

  if (isMutating && !isAuthRoute) {
    const origin = req.headers.get("origin");
    if (origin) {
      const allowed = getAllowedOrigins();
      if (allowed.size > 0 && !allowed.has(origin)) {
        return NextResponse.json({ error: "Forbidden — origin not allowed." }, { status: 403 });
      }
    }
  }

  // --------------------------------------------------
  // 3. Admin route protection
  // --------------------------------------------------
  const isAdminRoute = pathname.startsWith("/admin") || pathname.startsWith("/api/admin");

  if (isAdminRoute) {
    try {
      // Dynamic import to avoid Edge Runtime incompatibility at module level
      const { auth } = await import("@/lib/auth");
      const session = await auth();

      if (!session?.user?.email) {
        if (pathname.startsWith("/api/")) {
          return NextResponse.json({ error: "Authentication required." }, { status: 401 });
        }
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
      }

      if (!isAdminEmail(session.user.email)) {
        if (pathname.startsWith("/api/")) {
          return NextResponse.json({ error: "Forbidden — admin access required." }, { status: 403 });
        }
        return NextResponse.redirect(new URL("/", req.url));
      }
    } catch {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Internal server error during auth check." }, { status: 500 });
      }
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

// ---------------------------------------------------------------------------
// Matcher
// ---------------------------------------------------------------------------

export const config = {
  matcher: ["/api/:path*", "/admin/:path*", "/order/:path*"],
};
