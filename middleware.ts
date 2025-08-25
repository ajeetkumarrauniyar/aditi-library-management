import { NextRequest, NextResponse } from "next/server";
import { getSubdomainFromHostname } from "./lib";

/**
 * Next.js middleware for multi-tenant subdomain routing
 *
 * This middleware intercepts incoming requests and handles subdomain-based
 * tenant routing. It rewrites requests from tenant subdomains to the
 * appropriate path-based routes.
 *
 * Flow:
 * 1. Extract hostname from request
 * 2. Identify if there's a tenant subdomain
 * 3. Rewrite URL to /s/[subdomain]/path
 * 4. Add tenant parameter to search params
 *
 * Examples:
 * - library1.example.com/dashboard -> /s/library1/dashboard?tenant=library1
 * - library1.localhost:3000/dashboard -> /s/library1/dashboard?tenant=library1
 * - example.com/dashboard -> /dashboard (no rewrite)
 */
export async function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  const isDev = process.env.NODE_ENV === "development";
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN?.toLowerCase() || "localhost";

  // Skip middleware for login, API, static, and image routes (matcher already filters most)
  // if (pathname.startsWith("/login")) return NextResponse.next();

  // Identify subdomain using our utility function
  let subdomain: string | null = null;

  if (isDev) {
    // Development environment: handle localhost subdomains
    // e.g., library1.localhost:3000 -> library1
    subdomain = getSubdomainFromHostname(host);
  } else {
    // Production environment: handle domain subdomains
    // Check if this is the root domain (no subdomain)
    const isRoot = host === rootDomain || host === `www.${rootDomain}`;

    // Check if this is an ngrok tunnel (should not be treated as subdomain)
    const isNgrok =
      host.includes("ngrok-free.app") || host.includes("ngrok.io") || host.includes("ngrok.app");

    // Only process subdomain if it's not root domain and not ngrok
    if (!isRoot && !isNgrok) {
      subdomain = getSubdomainFromHostname(host, rootDomain);
    }
  }

  // If subdomain found, rewrite to /s/[slug] path structure
  // This allows the app to use path-based routing while supporting subdomain access
  if (subdomain && !pathname.startsWith("/s/")) {
    url.pathname = `/s/${subdomain}${pathname === "/" ? "" : pathname}`;
    url.searchParams.set("tenant", subdomain);
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)).*)"],
};
