/**
 * Server-side tenant utilities
 *
 * Server-only tenant utilities for API routes and server components.
 */

import { headers } from "next/headers";

/**
 * Get tenant ID from request headers (for APIs & server actions)
 */
export function getTenantIdFromHeaders(requestHeaders: Headers): string {
  return requestHeaders.get("x-tenant-id") || "default";
}

/**
 * Get current tenant ID in server components/actions
 */
export async function getCurrentTenantId(): Promise<string> {
  const headersList = await headers();
  return getTenantIdFromHeaders(headersList);
}

/**
 * Validate if user has access to tenant
 */
export async function validateTenantAccess(
  requestHeaders: Headers,
  requiredTenantId: string,
): Promise<boolean> {
  const currentTenantId = getTenantIdFromHeaders(requestHeaders);
  return currentTenantId === requiredTenantId;
}

/**
 * Get tenant data from subdomain
 */
export async function getTenantBySubdomain(subdomain: string) {
  const { default: prisma } = await import("../database/prisma");
  const tenant = await prisma.tenant.findUnique({
    where: { slug: subdomain },
  });
  return tenant;
}
