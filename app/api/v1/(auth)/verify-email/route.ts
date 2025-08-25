import { NextRequest } from "next/server";
import { asyncHandler } from "@/lib";
import { prisma } from "@/lib/database/prisma";
import { badRequestError, notFoundError, successResponse } from "@/lib/http/apiResponse";
import { isVerificationCodeExpired } from "@/helpers";
import { z } from "zod";

const verifyEmailSchema = z.object({
  email: z.string().email("Invalid email address"),
  verificationCode: z.string().length(6, "Verification code must be 6 digits"),
});

export const POST = asyncHandler(async (request: NextRequest) => {
  const body = await request.json();

  // Validate input
  const validation = verifyEmailSchema.safeParse(body);
  if (!validation.success) {
    throw new badRequestError(validation.error.errors[0].message);
  }

  const { email, verificationCode } = validation.data;

  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
    include: { tenant: true },
  });

  if (!user) {
    throw new notFoundError("User not found");
  }

  // Check if already verified
  if (user.isEmailVerified) {
    return successResponse({ verified: true }, "Email already verified");
  }

  // Check verification code
  if (user.verifyCode !== verificationCode) {
    throw new badRequestError("Invalid verification code");
  }

  // Check if code is expired
  if (isVerificationCodeExpired(user.verifyCodeExpiresAt)) {
    throw new badRequestError("Verification code has expired. Please request a new one.");
  }

  // Update user as verified
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      isEmailVerified: true,
      isVerified: true,
      verifyCode: null,
      verifyCodeExpiresAt: null,
    },
    include: { tenant: true },
  });

  return successResponse(
    {
      userId: updatedUser.id,
      tenantId: updatedUser.tenantId,
      tenantSlug: updatedUser.tenant?.slug,
      role: updatedUser.role,
    },
    "Email verified successfully!",
  );
});
