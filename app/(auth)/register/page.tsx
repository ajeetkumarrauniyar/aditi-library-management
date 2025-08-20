"use client";

import { useState } from "react";
import { EmailVerificationForm, TenantRegistrationForm, AuthLayout } from "@/components/index";

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

  const handleVerificationSuccess = (data: VerificationSuccessData) => {
    // Redirect to tenant subdomain dashboard
    const currentHost = window.location.host;
    const protocol = window.location.protocol;

    // Handle localhost and production domains differently
    let tenantUrl: string;

    if (currentHost.includes("localhost")) {
      // For localhost development: tenant-slug.localhost:3000
      tenantUrl = `${protocol}//${data.tenantSlug}.localhost:3000/dashboard`;
    } else {
      // For production: tenant-slug.yourdomain.com
      const baseHost = currentHost.includes(".")
        ? currentHost.replace(/^[^.]+\./, "") // Remove existing subdomain
        : currentHost; // No subdomain exists
      tenantUrl = `${protocol}//${data.tenantSlug}.${baseHost}/dashboard`;
    }

    // eslint-disable-next-line no-console
    console.log(`Redirecting to tenant dashboard: ${tenantUrl}`);

    // Use window.location for cross-subdomain navigation
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
