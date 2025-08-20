import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  /**
   * Handle multi-tenant subdomain routing
   */
  const host = req.headers.get("host") || "";
  const subdomain = host.split(".")[0].toLowerCase();
  const url = req.nextUrl.clone();
  const pathname = url.pathname;
  const root = process.env.NEXT_PUBLIC_ROOT_DOMAIN?.toLowerCase();

  // Skip middleware for login page
  if (pathname.startsWith("/login")) {
    return NextResponse.next();
  }

  // Skip for apex root, www, localhost, and ngrok
  if (
    subdomain === "localhost" ||
    subdomain === "127.0.0.1" ||
    host.includes("ngrok-free.app") ||
    host.includes("ngrok.io") ||
    host.includes("ngrok.app") ||
    (root && (subdomain === root || subdomain === `www.${root}`))
  ) {
    return NextResponse.next();
  }

  let slug: string | null = null;

  // Dev: subdomain.localhost
  if (subdomain.endsWith(".localhost")) {
    slug = subdomain.split(".")[0];
  }
  // Prod: subdomain of the configured root domain
  else if (root && subdomain.endsWith(`.${root}`)) {
    slug = subdomain.split(".")[0];
  } else {
    // Custom domain mapping -> resolve to slug (implement via edge config or cached API)
    // slug = await getSlugByDomain(baseHost); // middleware must remain edge-safe/non-DB
  }

  // If we found a tenant, rewrite to /s/[slug] and pass tenant info
  if (slug) {
    url.pathname = `/s/${slug}${pathname === "/" ? "" : pathname}`;
    url.searchParams.set("tenant", slug);
    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
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
