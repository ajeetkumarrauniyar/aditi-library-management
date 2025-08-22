import React from "react";
import { getTenantBySubdomain } from "@/lib/server";
import { TenantNotFound } from "@/components/index";

interface OrganizationLayoutProps {
  params: Promise<{ subdomain: string }>;
  children: React.ReactNode;
}

const OrganizationLayout = async ({ params, children }: OrganizationLayoutProps) => {
  const { subdomain } = await params;
  const tenant = await getTenantBySubdomain(subdomain);

  if (!tenant) {
    return <TenantNotFound subdomain={subdomain} />;
  }

  return <>{children}</>;
};

export default OrganizationLayout;
