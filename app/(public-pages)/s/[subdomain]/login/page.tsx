"use client";

import { AuthLayout, LoginForm } from "@/components/index";
import { useParams, useRouter } from "next/navigation";

export default function SubdomainLoginPage() {
  const router = useRouter();
  const params = useParams();
  const subdomain = params?.subdomain as string;

  const handleLoginSuccess = () => {
    router.push("/dashboard");
  };

  return (
    <AuthLayout
      title={
        <>
          Welcome back{" "}
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {subdomain.charAt(0).toUpperCase() + subdomain.slice(1)}
          </span>
          !!
        </>
      }
      description="Sign in to your account to continue"
      footerLinks={[
        {
          text: "Don't have an account???",
          href: "/apply",
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
