import { NextRequest } from "next/server";
import { asyncHandler, getAuthUser, successResponse, unauthorizedError } from "@/lib";
import { getTenantIdFromHeaders, getTenantBySubdomain } from "@/lib/server";

export const POST = asyncHandler(async (request: NextRequest) => {
  // Validate JWT
  const user = await getAuthUser(request);

  // Get tenant slug from header
  const tenantSlug = getTenantIdFromHeaders(request.headers);
  
  // If tenant slug is provided, validate it matches user's tenant
  if (tenantSlug && tenantSlug !== "default") {
    const tenant = await getTenantBySubdomain(tenantSlug);
    if (!tenant || tenant.id !== user.tenantId) {
      throw new unauthorizedError("Tenant mismatch");
    }
  }

  // Stateless JWT: client will remove token; optionally add audit logging here
  return successResponse({}, "Logged out successfully");
});