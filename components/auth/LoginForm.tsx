"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button, Input, Label } from "@/components/index";
import { apiPost, ApiSuccessResponse } from "@/lib";
import { User } from "@/types/user";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess?: (data: { user: User; token: string }) => void;
  redirectUrl?: string;
}

export function LoginForm({ onSuccess, redirectUrl }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      const result = await apiPost<ApiSuccessResponse<{ user: User; token: string }>>(
        "/login",
        data,
      );

      // Store token
      if (result.data) {
        localStorage.setItem("auth_token", result.data.token);
        toast.success("Login successful! Redirecting...");

        // Build tenant-aware redirect
        const slug = result.data.user?.tenant?.slug;
        // const role = result.data?.user?.role; // use if you want different paths per role

        if (!slug) {
          toast.error("Tenant not found. Please contact support.");
          return;
        }

        const { protocol, host, port } = window.location;
        const isLocal =
          host.includes("localhost") || host.includes("127.0.0.1") || host.includes("ngrok");

        const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN; // e.g. example.com
        let dest: string;

        if (isLocal || !rootDomain) {
          // Dev/local: subdomain-based tenant routing (e.g. http://abc-pvt-ltd.localhost:3000/dashboard)
          // Remove port from host if present (e.g. "localhost:3000" -> "localhost")
          const baseHost = host.split(":")[0];
          const portPart = port ? `:${port}` : "";

          // Check if already on the correct subdomain
          // e.g. host: "abc-pvt-ltd.localhost:3000", slug: "abc-pvt-ltd"
          // If so, just redirect to /dashboard on current origin
          if (
            baseHost.startsWith(`${slug}.`) ||
            baseHost === `${slug}` // edge case: just the slug as host
          ) {
            dest = `${protocol}//${host}/dashboard`;
          } else {
            dest = `${protocol}//${slug}.${baseHost}${portPart}/dashboard`;
          }
        } else {
          // Prod: subdomain-based tenant routing
          // Check if already on the correct subdomain
          // e.g. host: "abc-pvt-ltd.example.com", slug: "abc-pvt-ltd"
          if (host.startsWith(`${slug}.`)) {
            dest = `${protocol}//${host}/dashboard`;
          } else {
            dest = `${protocol}//${slug}.${rootDomain}/dashboard`;
          }
        }

        // Success callback first (optional)
        onSuccess?.(result.data);

        // Small delay to ensure toast is visible before redirect
        setTimeout(() => {
          window.location.href = redirectUrl ?? dest;
        }, 1000);
      }
    } catch (error) {
      //eslint-disable-next-line no-console
      console.error("Login error:", error);
      // Error handling is done by axios interceptor, so we don't need additional toast here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          {...register("email")}
          type="email"
          id="email"
          placeholder="Enter your email"
          disabled={isLoading}
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="Enter your password"
            disabled={isLoading}
            className={`pr-10 ${errors.password ? "border-red-500" : ""}`}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-0 right-0 h-full px-3 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-400" />
            ) : (
              <Eye className="h-4 w-4 text-gray-400" />
            )}
          </Button>
        </div>
        {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
      </div>

      <Button type="submit" disabled={isLoading} className="w-full" size="lg">
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign In"
        )}
      </Button>
    </form>
  );
}
