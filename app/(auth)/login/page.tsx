"use client";

import { LoginForm } from "@/components/auth";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleLoginSuccess = () => {
    router.push("/dashboard");
  };

  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to your account to continue"
      footerLinks={[
        {
          text: "Don't have an account?",
          href: "/register",
          linkText: "Create one now",
        },
        {
          text: "Forgot your password?",
          href: "/forgot-password",
          linkText: "Reset it here",
        },
      ]}
    >
      <LoginForm onSuccess={handleLoginSuccess} />
    </AuthLayout>
  );
}
