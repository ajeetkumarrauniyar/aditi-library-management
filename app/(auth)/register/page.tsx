"use client";

import { useState } from "react";
import { EmailVerificationForm, TenantRegistrationForm, AuthLayout } from "@/components/index";
import { getSubdomainFromHostname } from "@/lib";

interface RegistrationSuccessData {
  tenantId: string;
  userId: string;
  slug: string;
  email: string;
}

interface VerificationSuccessData {
  userId: string;
  tenantId: string;
  tenantSlug: string;
  role: string;
}

export default function Register() {
  const [step, setStep] = useState<"register" | "verify">("register");
  const [userEmail, setUserEmail] = useState<string>("");

  const handleRegistrationSuccess = (data: RegistrationSuccessData) => {
    setUserEmail(data.email || "");
    setStep("verify");
  };

  /**
   * Handle successful email verification
   *
   * After email verification, redirect the user to their tenant's dashboard.
   * This function constructs the correct tenant subdomain URL based on the
   * current environment and the user's tenant slug.
   *
   * @param data - Verification success data containing tenant information
   */
  const handleVerificationSuccess = (data: VerificationSuccessData) => {
    // Get current host and protocol for URL construction
    const currentHost = window.location.host;
    const protocol = window.location.protocol;
    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN;

    // Get current subdomain to determine base host
    const currentSubdomain = getSubdomainFromHostname(currentHost, rootDomain);
    const baseHost = currentSubdomain
      ? currentHost.replace(`${currentSubdomain}.`, "")
      : currentHost;

    const tenantUrl = `${protocol}//${data.tenantSlug}.${baseHost}/dashboard`;

    // eslint-disable-next-line no-console
    console.log(`Redirecting to tenant dashboard: ${tenantUrl}`);
    window.location.href = tenantUrl;
  };

  const getTitle = () => {
    return step === "register" ? "Create your organization" : "Verify your email";
  };

  const getDescription = () => {
    return step === "register"
      ? "Set up your organization account to get started"
      : "Enter the verification code sent to your email";
  };

  const getFooterLinks = () => {
    if (step === "register") {
      return [
        {
          text: "Already have an account?",
          href: "/login",
          linkText: "Sign in here",
        },
      ];
    }
    return [
      {
        text: "Back to",
        href: "/login",
        linkText: "sign in",
      },
    ];
  };

  return (
    <AuthLayout title={getTitle()} description={getDescription()} footerLinks={getFooterLinks()}>
      {step === "register" ? (
        <TenantRegistrationForm onSuccess={handleRegistrationSuccess} />
      ) : (
        <EmailVerificationForm email={userEmail} onSuccess={handleVerificationSuccess} />
      )}
    </AuthLayout>
  );
}
