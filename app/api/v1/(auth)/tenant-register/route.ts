import { NextRequest } from "next/server";
import { asyncHandler } from "@/lib";
import { registerTenant } from "@/controllers";

export const POST = asyncHandler(async (request: NextRequest) => {
  const body = await request.json();
  return await registerTenant(body);
});
