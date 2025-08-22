import { useCallback } from "react";
import { useAuth } from "./useAuth";
import { performRoleBasedRedirect, getRoleBasedRedirectUrl } from "@/lib/roleRedirect";
import { toast } from "sonner";

/**
 * Hook for role-based navigation utilities
 */
export function useRoleNavigation() {
  const { user } = useAuth();

  /**
   * Navigate to the user's role-appropriate dashboard
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
   */
  const shouldRedirect = useCallback(() => {
    if (!user) return false;

    const currentHost = window.location.host;
    const role = user.role;
    const slug = user.tenant?.slug;
    const isLocal =
      currentHost.includes("localhost") ||
      currentHost.includes("127.0.0.1") ||
      currentHost.includes("ngrok");
    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN;

    if (role === "SUPER_ADMIN") {
      if (isLocal || !rootDomain) {
        return !currentHost.startsWith("www.");
      } else {
        return !currentHost.startsWith(`www.${rootDomain}`);
      }
    } else if (role === "TENANT_ADMIN" || role === "TENANT_STAFF" || role === "USER") {
      if (!slug) return false;

      if (isLocal || !rootDomain) {
        return !currentHost.startsWith(`${slug}.`);
      } else {
        return !currentHost.startsWith(`${slug}.${rootDomain}`);
      }
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
