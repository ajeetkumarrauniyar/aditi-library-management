import { User } from "@/types/user";

/**
 * Generates the appropriate redirect URL based on user role
 * @param user - The authenticated user object
 * @param fallbackPath - Optional fallback path (default: "/dashboard")
 * @returns The redirect URL string
 */
export function getRoleBasedRedirectUrl(user: User, fallbackPath: string = "/dashboard"): string {
    const { protocol, host, port } = window.location;
    const isLocal = host.includes("localhost") || host.includes("127.0.0.1") || host.includes("ngrok");
    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN;
    const slug = user.tenant?.slug;
    const role = user.role;

    if (role === "SUPER_ADMIN") {
        // SUPER_ADMIN redirects to www.rootdomain.com/dashboard
        if (isLocal || !rootDomain) {
            const baseHost = host.split(":")[0];
            const portPart = port ? `:${port}` : "";
            return `${protocol}//www.${baseHost}${portPart}${fallbackPath}`;
        } else {
            return `${protocol}//www.${rootDomain}${fallbackPath}`;
        }
    } else if (role === "TENANT_ADMIN" || role === "TENANT_STAFF" || role === "USER") {
        // All tenant-based roles redirect to subdomain.rootdomain.com/dashboard
        if (!slug) {
            throw new Error("Tenant not found for user");
        }

        if (isLocal || !rootDomain) {
            const baseHost = host.split(":")[0];
            const portPart = port ? `:${port}` : "";

            // Check if already on the correct subdomain
            if (baseHost.startsWith(`${slug}.`) || baseHost === `${slug}`) {
                return `${protocol}//${host}${fallbackPath}`;
            } else {
                return `${protocol}//${slug}.${baseHost}${portPart}${fallbackPath}`;
            }
        } else {
            // Production
            if (host.startsWith(`${slug}.`)) {
                return `${protocol}//${host}${fallbackPath}`;
            } else {
                return `${protocol}//${slug}.${rootDomain}${fallbackPath}`;
            }
        }
    }

    // Fallback for unknown roles
    throw new Error(`Unknown user role: ${role}`);
}

/**
 * Performs role-based redirect
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