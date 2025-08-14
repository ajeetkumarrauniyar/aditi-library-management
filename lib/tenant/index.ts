// Re-export everything
export * from "./client";
export * from "./server";
export * from "@/types/tenant";

// Main exports for easy importing
export {
  // Frontend (Public Pages)
  getTenantBySubdomain,
  getTenantIdFromSearchParams,
} from "./client";

export {
  // Backend (APIs & Server)
  getTenantIdFromHeaders,
  getCurrentTenantId,
  validateTenantAccess,
} from "./server";
