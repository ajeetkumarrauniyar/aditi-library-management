import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  /**
   * Handle multi-tenant subdomain routing
   */
  const host = req.headers.get("host") || "";
  const subdomain = host.split(".")[0];

  // Skip middleware for main domain, www, and localhost
  if (subdomain === "www" || host === "localhost:3000" || subdomain === host) {
    return NextResponse.next();
  }

  // For subdomain requests, rewrite to /s/[subdomain] and pass tenant info
  const url = req.nextUrl.clone();
  url.pathname = `/s/${subdomain}${url.pathname === "/" ? "" : url.pathname}`;
  url.searchParams.set("tenant", subdomain);

  return NextResponse.rewrite(url);
}

// Only run on relevant paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
