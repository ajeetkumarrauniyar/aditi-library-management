import { NextRequest } from "next/server";
import { asyncHandler, prisma } from "@/lib/server";
import { successResponse, notFoundError } from "@/lib/apiResponse";

export const GET = asyncHandler(
  async (_request: NextRequest, { params }: { params: Promise<Record<string, string>> }) => {
    const { subdomain } = await params;
    const tenant = await prisma.tenant.findUnique({
      where: { slug: subdomain },
      select: {
        id: true,
        name: true,
        slug: true,
        logo: true,
        tagline: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!tenant) {
      throw new notFoundError("Organization not found");
    }

    return successResponse({
      message: "Organization found",
      data: tenant,
    });
  },
);
