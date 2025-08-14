import { headers } from "next/headers";

/**
 * Get tenant ID from request headers (for APIs & server actions)
 * Use in: API routes, server actions, middleware
 */
export function getTenantIdFromHeaders(requestHeaders: Headers): string {
  return requestHeaders.get("x-tenant-id") || "default";
}

/**
 * Get current tenant ID in server components/actions
 * Use in: Server components, server actions (auto-gets headers)
 */
export async function getCurrentTenantId(): Promise<string> {
  const headersList = await headers();
  return getTenantIdFromHeaders(headersList);
}

/**
 * Validate if user has access to tenant
 * Use in: API routes for security
 */
export async function validateTenantAccess(
  requestHeaders: Headers,
  requiredTenantId: string,
): Promise<boolean> {
  const currentTenantId = getTenantIdFromHeaders(requestHeaders);
  return currentTenantId === requiredTenantId;
}
