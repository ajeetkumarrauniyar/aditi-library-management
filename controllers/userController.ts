import { prisma, successResponse, errorResponse, TenantValidationResult } from "@/lib";

/**
 * Get all users for a specific tenant
 */
export async function getAllUsersByTenant(tenantId: string) {
  try {
    const users = await prisma.user.findMany({
      where: {
        tenantId: tenantId,
        isDeleted: false, // exclude deleted users
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return successResponse(users, `Found ${users.length} users`);
  } catch (error) {
    return errorResponse(
      "Failed to fetch users",
      500,
      error instanceof Error ? error.message : "Unknown error",
    );
  }
}

/**
 * Get user by ID (tenant-aware)
 */
export async function getUserById(userId: string, tenantId: string) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        tenantId: tenantId, // Ensure user belongs to this tenant
        isDeleted: false,
      },
      include: {
        tenant: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!user) {
      return errorResponse("User not found", 404);
    }

    return successResponse(user, "User found");
  } catch (error) {
    return errorResponse(
      "Failed to fetch user",
      500,
      error instanceof Error ? error.message : "Unknown error",
    );
  }
}

/**
 * Validate tenant access for user operations
 */
export function validateTenantAccess(
  requestedTenantId: string,
  userTenantId: string,
): TenantValidationResult {
  if (!requestedTenantId) {
    return {
      isValid: false,
      tenantId: null,
      error: "Tenant ID is required",
    };
  }

  if (requestedTenantId !== userTenantId) {
    return {
      isValid: false,
      tenantId: null,
      error: "Access denied to this tenant",
    };
  }

  return {
    isValid: true,
    tenantId: requestedTenantId,
  };
}

