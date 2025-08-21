import { NextRequest } from "next/server";
import { asyncHandler, getAuthUser, successResponse } from "@/lib";
import { getUserById } from "@/controllers/userController";

export const GET = asyncHandler(async (request: NextRequest) => {
  const authUser = await getAuthUser(request);

  const userResponse = await getUserById(authUser.userId, authUser.tenantId);

  const userData = await userResponse.json();

  if (!userData.success) {
    throw new Error(userData.message || "Failed to fetch user data");
  }

  return successResponse(
    {
      user: userData.data,
    },
    "User information fetched successfully",
  );
});
