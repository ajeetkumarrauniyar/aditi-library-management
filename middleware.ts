import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  const isDev = process.env.NODE_ENV === "development";
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN?.toLowerCase() || "localhost";

  // Skip middleware for login, API, static, and image routes (matcher already filters most)
  // if (pathname.startsWith("/login")) return NextResponse.next();

  // Identify subdomain
  let subdomain: string | null = null;

  if (isDev) {
    // Development: tenant.localhost:3000
    if (host.includes("localhost")) {
      const parts = host.split(".");
      if (parts.length > 1 && parts[0] !== "localhost" && parts[0] !== "www") {
        subdomain = parts[0];
      }
    }
  } else {
    // Production: tenant.yourdomain.com or custom domains
    const parts = host.split(".");
    const isRoot = host === rootDomain || host === `www.${rootDomain}`;
    const isNgrok =
      host.includes("ngrok-free.app") || host.includes("ngrok.io") || host.includes("ngrok.app");

    if (!isRoot && !isNgrok && parts.length > 2 && host.endsWith(rootDomain)) {
      // Don't treat 'www' as a tenant subdomain
      if (parts[0] !== "www") {
        subdomain = parts[0];
      }
    } else if (!isRoot && !isNgrok && !host.endsWith(rootDomain)) {
      // Potential custom domain: resolve to tenant slug (edge-safe call)
      // subdomain = await getSlugByDomain(host); //TODO: implement if needed
    }
  }

  // If subdomain found, rewrite to /s/[slug]
  if (subdomain && !pathname.startsWith("/s/")) {
    url.pathname = `/s/${subdomain}${pathname === "/" ? "" : pathname}`;
    url.searchParams.set("tenant", subdomain);
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)).*)",
  ],
};