/**
 * Unified redirect utilities for multi-tenant applications
 */

import { User } from "@/types/user";
import { getSubdomainFromHostname } from "./client";

interface RedirectContext {
  host: string;
  protocol: string;
  port?: string;
  rootDomain?: string;
}

/**
 * Core redirect logic that works for both client and server
 */
export function getRedirectUrl(
  user: User,
  context: RedirectContext,
  fallbackPath: string = "/dashboard",
): string {
  const { host, protocol, port, rootDomain } = context;
  const slug = user.tenant?.slug;
  const role = user.role;

  // Get current subdomain using unified logic
  const currentSubdomain = getSubdomainFromHostname(host, rootDomain);
  const portPart = port ? `:${port}` : "";

  if (role === "SUPER_ADMIN") {
    if (currentSubdomain && currentSubdomain !== "www") {
      const baseHost = host.split(":")[0];
      const rootHost = baseHost.replace(`${currentSubdomain}.`, "");
      return `${protocol}//${rootHost}${portPart}${fallbackPath}`;
    }
    return `${protocol}//${host}${fallbackPath}`;
  } else if (role === "TENANT_ADMIN" || role === "TENANT_STAFF" || role === "USER") {
    if (!slug) {
      throw new Error("Tenant not found for user");
    }

    if (currentSubdomain !== slug) {
      const baseHost = host.split(":")[0];
      const rootHost = currentSubdomain ? baseHost.replace(`${currentSubdomain}.`, "") : baseHost;
      return `${protocol}//${slug}.${rootHost}${portPart}${fallbackPath}`;
    }
    return `${protocol}//${host}${fallbackPath}`;
  }

  throw new Error(`Unknown user role: ${role}`);
}

/**
 * Check if user should be redirected (unified logic)
 */
export function shouldRedirect(user: User, context: RedirectContext): boolean {
  const { host, rootDomain } = context;
  const slug = user.tenant?.slug;
  const role = user.role;

  const currentSubdomain = getSubdomainFromHostname(host, rootDomain);

  if (role === "SUPER_ADMIN") {
    return currentSubdomain !== null && currentSubdomain !== "www";
  } else if (role === "TENANT_ADMIN" || role === "TENANT_STAFF" || role === "USER") {
    if (!slug) return false;
    return currentSubdomain !== slug;
  }

  return false;
}

/**
 * Client-side redirect execution
 */
export function performRedirect(user: User, fallbackPath: string = "/dashboard"): void {
  try {
    const context: RedirectContext = {
      host: window.location.host,
      protocol: window.location.protocol,
      port: window.location.port,
      rootDomain: process.env.NEXT_PUBLIC_ROOT_DOMAIN,
    };

    const redirectUrl = getRedirectUrl(user, context, fallbackPath);
    window.location.href = redirectUrl;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Redirect failed:", error);
    window.location.href = fallbackPath;
  }
}
