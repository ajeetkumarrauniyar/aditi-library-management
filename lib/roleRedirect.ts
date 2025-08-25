import { User } from "@/types/user";
import { getSubdomainFromHostname } from "./tenant/client";

/**
 * Generates the appropriate redirect URL based on user role
 *
 * This function determines where a user should be redirected based on their role
 * in the multi-tenant system. It handles both development and production environments.
 *
 * Role-based routing:
 * - SUPER_ADMIN: Redirects to root domain (example.com or www.example.com)
 * - TENANT_ADMIN/TENANT_STAFF/USER: Redirects to tenant subdomain (tenant.example.com)
 *
 * @param user - The authenticated user object
 * @param fallbackPath - Optional fallback path (default: "/dashboard")
 * @returns The redirect URL string
 *
 * @example
 * // SUPER_ADMIN on tenant subdomain
 * getRoleBasedRedirectUrl(superAdminUser)
 * // Returns: "https://www.example.com/dashboard"
 *
 * // TENANT_ADMIN on wrong subdomain
 * getRoleBasedRedirectUrl(tenantAdminUser)
 * // Returns: "https://library1.example.com/dashboard"
 */
export function getRoleBasedRedirectUrl(user: User, fallbackPath: string = "/dashboard"): string {
  const { protocol, host, port } = window.location;
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN;
  const slug = user.tenant?.slug;
  const role = user.role;

  // Get current subdomain using our utility function
  const currentSubdomain = getSubdomainFromHostname(host, rootDomain);

  if (role === "SUPER_ADMIN") {
    // SUPER_ADMIN redirects to root domain (with or without www based on original)
    const baseHost = host.split(":")[0];
    const portPart = port ? `:${port}` : "";

    if (currentSubdomain && currentSubdomain !== "www") {
      // User is on a tenant subdomain, redirect to root domain
      // Remove the subdomain to get the root host
      const rootHost = baseHost.replace(`${currentSubdomain}.`, "");
      return `${protocol}//${rootHost}${portPart}${fallbackPath}`;
    }

    // User is already on root domain, no redirect needed
    return `${protocol}//${host}${fallbackPath}`;
  } else if (role === "TENANT_ADMIN" || role === "TENANT_STAFF" || role === "USER") {
    // All tenant-based roles redirect to subdomain.rootdomain.com/dashboard
    if (!slug) {
      throw new Error("Tenant not found for user");
    }

    if (currentSubdomain !== slug) {
      // User is on wrong subdomain or no subdomain, redirect to correct tenant subdomain
      const baseHost = host.split(":")[0];
      const portPart = port ? `:${port}` : "";

      // Get root host by removing current subdomain (if any)
      const rootHost = currentSubdomain ? baseHost.replace(`${currentSubdomain}.`, "") : baseHost;
      return `${protocol}//${slug}.${rootHost}${portPart}${fallbackPath}`;
    }

    // User is already on correct tenant subdomain
    return `${protocol}//${host}${fallbackPath}`;
  }

  // Fallback for unknown roles
  throw new Error(`Unknown user role: ${role}`);
}

/**
 * Performs role-based redirect
 *
 * Executes the role-based redirect by calling getRoleBasedRedirectUrl
 * and then navigating to the resulting URL.
 *
 * @param user - The authenticated user object
 * @param fallbackPath - Optional fallback path (default: "/dashboard")
 */
export function performRoleBasedRedirect(user: User, fallbackPath: string = "/dashboard"): void {
  try {
    const redirectUrl = getRoleBasedRedirectUrl(user, fallbackPath);
    window.location.href = redirectUrl;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Role-based redirect failed:", error);
    // Fallback to current domain dashboard
    window.location.href = fallbackPath;
  }
}
