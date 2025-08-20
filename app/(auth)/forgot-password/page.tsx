"use client";

import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { AuthLayout } from "@/components/auth/AuthLayout";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Reset your password"
      description="Enter your email address and we'll send you instructions to reset your password"
      footerLinks={[
        {
          text: "Remember your password?",
          href: "/login",
          linkText: "Sign in here",
        },
      ]}
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
