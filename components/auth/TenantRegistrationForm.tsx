"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/core/utils";
import { Button, Input, Label } from "@/components/index";
import { apiPost, ApiSuccessResponse } from "@/lib";
import { AxiosError } from "axios";
import { toast } from "sonner";

const tenantRegistrationSchema = z.object({
  name: z.string().min(2, "Organization name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
});

type TenantRegistrationData = z.infer<typeof tenantRegistrationSchema>;

interface TenantRegistrationFormProps extends React.ComponentProps<"form"> {
  onSuccess?: (data: { tenantId: string; userId: string; slug: string; email: string }) => void;
}

export function TenantRegistrationForm({
  className,
  onSuccess,
  ...props
}: TenantRegistrationFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [apiErrors, setApiErrors] = useState<Record<string, string>>({});

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<TenantRegistrationData>({
    resolver: zodResolver(tenantRegistrationSchema),
  });

  const onSubmit = async (data: TenantRegistrationData) => {
    setIsLoading(true);
    setApiErrors({});
    clearErrors();

    try {
      const result = await apiPost<
        ApiSuccessResponse<{ tenantId: string; userId: string; slug: string }>
      >("/tenant-register", data);

      toast.success(
        "Organization registered successfully! Please check your email for verification code.",
      );
      if (result.data) {
        onSuccess?.({
          tenantId: result.data.tenantId,
          userId: result.data.userId,
          slug: result.data.slug,
          email: data.email,
        });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Registration error:", error);

      const axiosError = error as AxiosError;
      if (axiosError.response) {
        const { status, data: responseData } = axiosError.response;
        const result = responseData as { message?: string; errors?: Record<string, string> };

        // Handle specific API errors
        if (status === 409) {
          if (result.message?.includes("email")) {
            // Email already exists
            setError("email", {
              type: "manual",
              message:
                "An account with this email already exists. Please use a different email or try signing in.",
            });
            setApiErrors({ email: result.message });
          } else if (result.message?.includes("Organization with this name")) {
            // Organization name already exists
            setError("name", {
              type: "manual",
              message:
                "An organization with this name already exists. Please choose a different name.",
            });
            setApiErrors({ name: result.message });
          }
        } else if (status === 400) {
          // Handle validation errors from server
          if (result.errors) {
            Object.keys(result.errors).forEach((field) => {
              const errorMessage = result.errors?.[field];
              if (errorMessage) {
                setError(field as keyof TenantRegistrationData, {
                  type: "manual",
                  message: errorMessage,
                });
              }
            });
          }
        }
      }
      // General error toast is handled by axios interceptor
    } finally {
      setIsLoading(false);
    }
  };

  const getFieldError = (fieldName: keyof TenantRegistrationData) => {
    return errors[fieldName]?.message || apiErrors[fieldName];
  };

  const hasFieldError = (fieldName: keyof TenantRegistrationData) => {
    return !!errors[fieldName] || !!apiErrors[fieldName];
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn("space-y-6", className)} {...props}>
      <div className="space-y-2">
        <Label htmlFor="name">Organization Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="Aditi Library"
          {...register("name")}
          disabled={isLoading}
          className={
            hasFieldError("name") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
          }
        />
        {hasFieldError("name") && (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{getFieldError("name")}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            type="text"
            placeholder="John"
            {...register("firstName")}
            disabled={isLoading}
            className={
              hasFieldError("firstName")
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : ""
            }
          />
          {hasFieldError("firstName") && (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{getFieldError("firstName")}</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            type="text"
            placeholder="Doe"
            {...register("lastName")}
            disabled={isLoading}
            className={
              hasFieldError("lastName")
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : ""
            }
          />
          {hasFieldError("lastName") && (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{getFieldError("lastName")}</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="john@example.com"
          {...register("email")}
          disabled={isLoading}
          className={
            hasFieldError("email") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
          }
        />
        {hasFieldError("email") && (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{getFieldError("email")}</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Create a strong password"
          {...register("password")}
          disabled={isLoading}
          className={
            hasFieldError("password")
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : ""
          }
        />
        {hasFieldError("password") && (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{getFieldError("password")}</span>
          </div>
        )}
      </div>

      <Button type="submit" disabled={isLoading} className="w-full" size="lg">
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Creating organization...
          </>
        ) : (
          "Create Organization"
        )}
      </Button>
    </form>
  );
}
