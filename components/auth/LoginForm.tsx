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
import { useAuth } from "@/hooks/useAuth";
import { performRoleBasedRedirect } from "@/lib/tenant/roleRedirect";

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
  const { login } = useAuth();

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

      // Store token and update auth state
      if (result.data) {
        localStorage.setItem("auth_token", result.data.token);
        // Update auth state using the useAuth hook
        login(result.data);
        toast.success("Login successful! Redirecting...");

        // Success callback first (optional)
        onSuccess?.(result.data);

        // Small delay to ensure toast is visible before redirect
        setTimeout(() => {
          if (redirectUrl) {
            window.location.href = redirectUrl;
          } else {
            // Use role-based redirect utility
            try {
              performRoleBasedRedirect(result.data.user);
            } catch (error) {
              // eslint-disable-next-line no-console
              console.error("Role-based redirect failed:", error);
              toast.error("Redirect failed. Please contact support.");
            }
          }
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
