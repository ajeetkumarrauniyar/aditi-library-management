import { User } from "@/types/user";
import { getRedirectUrl, performRedirect } from "./redirect";

// Legacy wrapper for backward compatibility
export function getRoleBasedRedirectUrl(user: User, fallbackPath: string = "/dashboard"): string {
  const context = {
    host: window.location.host,
    protocol: window.location.protocol,
    port: window.location.port,
    rootDomain: process.env.NEXT_PUBLIC_ROOT_DOMAIN,
  };
  return getRedirectUrl(user, context, fallbackPath);
}

// Legacy wrapper for backward compatibility
export function performRoleBasedRedirect(user: User, fallbackPath: string = "/dashboard"): void {
  performRedirect(user, fallbackPath);
}
