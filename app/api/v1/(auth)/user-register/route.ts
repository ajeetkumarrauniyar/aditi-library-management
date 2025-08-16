import { NextRequest } from "next/server";
import { asyncHandler } from "@/lib";
import { registerUser } from "@/controllers";

export const POST = asyncHandler(async (request: NextRequest) => {
  const body = await request.json();
  return await registerUser(body);
});
