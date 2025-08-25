import { useCallback } from "react";
import { useAuth } from "./useAuth";
import { performRoleBasedRedirect, getRoleBasedRedirectUrl } from "@/lib/roleRedirect";
import { toast } from "sonner";
import { getSubdomainFromHostname } from "@/lib";

/**
 * Hook for role-based navigation utilities
 *
 * This hook provides utilities for navigating users to the appropriate
 * domain/subdomain based on their role in the multi-tenant system.
 *
 * Role-based routing:
 * - SUPER_ADMIN: Should be on root domain (example.com or www.example.com)
 * - TENANT_ADMIN/TENANT_STAFF/USER: Should be on their tenant subdomain (tenant.example.com)
 */
export function useRoleNavigation() {
  const { user } = useAuth();

  /**
   * Navigate to the user's role-appropriate dashboard
   *
   * Automatically redirects users to the correct domain/subdomain
   * based on their role and current location.
   */
  const navigateToDashboard = useCallback(() => {
    if (!user) {
      toast.error("User not authenticated");
      return;
    }

    try {
      performRoleBasedRedirect(user, "/dashboard");
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Navigation failed:", error);
      toast.error("Navigation failed. Please try again.");
    }
  }, [user]);

  /**
   * Get the appropriate dashboard URL for the current user
   *
   * Returns the URL where the user should be redirected based on their role,
   * without actually performing the navigation.
   *
   * @returns The dashboard URL or null if user not authenticated
   */
  const getDashboardUrl = useCallback(() => {
    if (!user) return null;

    try {
      return getRoleBasedRedirectUrl(user, "/dashboard");
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to get dashboard URL:", error);
      return null;
    }
  }, [user]);

  /**
   * Navigate to a specific path with role-based domain routing
   *
   * Navigates to a specific path while ensuring the user is on the correct
   * domain/subdomain for their role.
   *
   * @param path - The path to navigate to (e.g., "/settings", "/users")
   */
  const navigateToPath = useCallback(
    (path: string) => {
      if (!user) {
        toast.error("User not authenticated");
        return;
      }

      try {
        performRoleBasedRedirect(user, path);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Navigation failed:", error);
        toast.error("Navigation failed. Please try again.");
      }
    },
    [user],
  );

  /**
   * Get URL for a specific path with role-based domain routing
   *
   * Returns the full URL for a specific path on the correct domain/subdomain
   * for the user's role, without performing navigation.
   *
   * @param path - The path to get URL for
   * @returns The full URL or null if user not authenticated
   */
  const getPathUrl = useCallback(
    (path: string) => {
      if (!user) return null;

      try {
        return getRoleBasedRedirectUrl(user, path);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to get path URL:", error);
        return null;
      }
    },
    [user],
  );

  /**
   * Check if current user should be on a different domain
   *
   * Determines if the user is currently on the wrong domain/subdomain
   * for their role and should be redirected.
   *
   * Logic:
   * - SUPER_ADMIN: Should be on root domain (no subdomain or www)
   * - TENANT_ADMIN/TENANT_STAFF/USER: Should be on their specific tenant subdomain
   *
   * @returns true if user should be redirected, false otherwise
   */
  const shouldRedirect = useCallback(() => {
    if (!user) return false;

    const currentHost = window.location.host;
    const role = user.role;
    const slug = user.tenant?.slug;
    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN;

    // Get current subdomain using our utility function
    const currentSubdomain = getSubdomainFromHostname(currentHost, rootDomain);

    if (role === "SUPER_ADMIN") {
      // SUPER_ADMIN should be on root domain (no subdomain or www)
      // If there's a subdomain that's not "www", they should be redirected
      return currentSubdomain !== null && currentSubdomain !== "www";
    } else if (role === "TENANT_ADMIN" || role === "TENANT_STAFF" || role === "USER") {
      if (!slug) return false;

      // Tenant users should be on their specific tenant subdomain
      // If they're on a different subdomain or no subdomain, redirect
      return currentSubdomain !== slug;
    }

    return false;
  }, [user]);

  return {
    navigateToDashboard,
    getDashboardUrl,
    navigateToPath,
    getPathUrl,
    shouldRedirect,
    user,
  };
}
