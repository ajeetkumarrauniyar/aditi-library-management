import { NextRequest } from "next/server";
import { asyncHandler, getTenantIdFromHeaders } from "@/lib/server";
import { getAllUsersByTenant } from "@/controllers";

export const GET = asyncHandler(async (request: NextRequest) => {
  const tenantId = getTenantIdFromHeaders(request.headers);
  return getAllUsersByTenant(tenantId);
});
