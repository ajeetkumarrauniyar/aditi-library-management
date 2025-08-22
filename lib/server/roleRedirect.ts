import { User } from "@/types/user";

/**
 * Server-side utility to generate role-based redirect URLs
 * @param user - The authenticated user object
 * @param request - The incoming request object (for host detection)
 * @param fallbackPath - Optional fallback path (default: "/dashboard")
 * @returns The redirect URL string
 */
export function getServerRoleBasedRedirectUrl(
    user: User,
    request: { headers: { get: (name: string) => string | null } },
    fallbackPath: string = "/dashboard"
): string {
    const host = request.headers.get("host") || "";
    const protocol = request.headers.get("x-forwarded-proto") || "http";
    const isLocal = host.includes("localhost") || host.includes("127.0.0.1") || host.includes("ngrok");
    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN;
    const slug = user.tenant?.slug;
    const role = user.role;

    if (role === "SUPER_ADMIN") {
        // SUPER_ADMIN redirects to www.rootdomain.com/dashboard
        if (isLocal || !rootDomain) {
            const baseHost = host.split(":")[0];
            const portPart = host.includes(":") ? `:${host.split(":")[1]}` : "";
            return `${protocol}://www.${baseHost}${portPart}${fallbackPath}`;
        } else {
            return `${protocol}://www.${rootDomain}${fallbackPath}`;
        }
    } else if (role === "TENANT_ADMIN" || role === "TENANT_STAFF" || role === "USER") {
        // All tenant-based roles redirect to subdomain.rootdomain.com/dashboard
        if (!slug) {
            throw new Error("Tenant not found for user");
        }

        if (isLocal || !rootDomain) {
            const baseHost = host.split(":")[0];
            const portPart = host.includes(":") ? `:${host.split(":")[1]}` : "";

            // Check if already on the correct subdomain
            if (baseHost.startsWith(`${slug}.`) || baseHost === `${slug}`) {
                return `${protocol}://${host}${fallbackPath}`;
            } else {
                return `${protocol}://${slug}.${baseHost}${portPart}${fallbackPath}`;
            }
        } else {
            // Production
            if (host.startsWith(`${slug}.`)) {
                return `${protocol}://${host}${fallbackPath}`;
            } else {
                return `${protocol}://${slug}.${rootDomain}${fallbackPath}`;
            }
        }
    }

    // Fallback for unknown roles
    throw new Error(`Unknown user role: ${role}`);
}

/**
 * Check if user should be redirected based on current URL and role
 * @param user - The authenticated user object
 * @param currentHost - Current host from request
 * @returns boolean indicating if redirect is needed
 */
export function shouldRedirectUser(user: User, currentHost: string): boolean {
    const isLocal = currentHost.includes("localhost") || currentHost.includes("127.0.0.1") || currentHost.includes("ngrok");
    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN;
    const slug = user.tenant?.slug;
    const role = user.role;

    if (role === "SUPER_ADMIN") {
        // SUPER_ADMIN should be on www subdomain
        if (isLocal || !rootDomain) {
            return !currentHost.startsWith("www.");
        } else {
            return !currentHost.startsWith(`www.${rootDomain}`);
        }
    } else if (role === "TENANT_ADMIN" || role === "TENANT_STAFF" || role === "USER") {
        // Tenant users should be on their tenant subdomain
        if (!slug) return false;

        if (isLocal || !rootDomain) {
            return !currentHost.startsWith(`${slug}.`);
        } else {
            return !currentHost.startsWith(`${slug}.${rootDomain}`);
        }
    }

    return false;
}