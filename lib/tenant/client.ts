import { prisma } from "@/lib";
import { Tenant } from "@prisma/client";

/**
 * Get tenant data from subdomain (for public pages)
 * Use in: Page components with [subdomain] route params
 */
export async function getTenantBySubdomain(subdomain: string): Promise<Tenant | null> {
  const tenant = await prisma.tenant.findUnique({
    where: { slug: subdomain },
  });
  return tenant;
}

/**
 * Get tenant ID from URL search params (for current middleware)
 * Use in: Components that need tenant ID from URL
 */
export function getTenantIdFromSearchParams(searchParams: URLSearchParams): string {
  return searchParams.get("tenant") || "default";
}

