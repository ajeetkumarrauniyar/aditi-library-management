import { getTenantIdFromHeaders } from "@/lib/server";
import { getUserById } from "@/controllers";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const tenantId = getTenantIdFromHeaders(request.headers);

  const { id: userId } = await params;

  // Fetch user data by ID and tenant
  //TODO Note: This route should be enhanced with authorization middleware
  //TODO to ensure only authorized users (like admins) can access other users' data
  return getUserById(userId, tenantId);
}
