import { asyncHandler } from "@/lib";
import { healthCheck } from "@/controllers";

export const GET = asyncHandler(async () => {
  return healthCheck();
});
