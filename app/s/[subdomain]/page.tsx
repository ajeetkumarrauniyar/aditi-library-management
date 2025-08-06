import prisma from "@/lib/prisma";
import React from "react";

const OrganizationLandingPage = async ({ params }: { params: { subdomain: string } }) => {
  const tenantSlug = params.subdomain;

  const tenant = await prisma.tenant.findUnique({
    where: { slug: tenantSlug },
  });

  if (!tenant) {
    return (
      <main className="flex h-screen flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-red-600">Tenant Not Found</h1>
        <p className="mt-4 text-gray-600">
          The organization &quot;{tenantSlug}&quot; does not exist.
        </p>
      </main>
      
    );
  }

  return (
    <main className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">Welcome to {tenant.name}</h1>
      <p className="mt-4 text-gray-600">Organization Landing Page</p>
      <div className="mt-8 text-sm text-gray-500">Subdomain: {tenantSlug}</div>
    </main>
  );
};

export default OrganizationLandingPage;
