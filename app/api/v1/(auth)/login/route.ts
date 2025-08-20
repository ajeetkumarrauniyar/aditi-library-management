import { NextRequest } from "next/server";
import { asyncHandler } from "@/lib";
import { loginTenantAndUser } from "@/controllers/authController";

export const POST = asyncHandler(async (request: NextRequest) => {
  const body = await request.json();
  return await loginTenantAndUser(body);
});
