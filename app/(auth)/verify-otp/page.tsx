"use client";

import { EmailVerificationForm, AuthLayout } from "@/components/index";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const handleVerificationSuccess = (data: {
    userId: string;
    tenantId: string;
    tenantSlug: string;
    role: string;
  }) => {
    if (data.tenantSlug) {
      router.push(`/${data.tenantSlug}/dashboard`);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <AuthLayout
      title="Verify your email"
      description="Enter the verification code sent to your email address"
      footerLinks={[
        {
          text: "Back to",
          href: "/login",
          linkText: "sign in",
        },
      ]}
    >
      <EmailVerificationForm email={email || undefined} onSuccess={handleVerificationSuccess} />
    </AuthLayout>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <AuthLayout title="Loading..." description="Please wait...">
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          </div>
        </AuthLayout>
      }
    >
      <VerifyOtpContent />
    </Suspense>
  );
}
