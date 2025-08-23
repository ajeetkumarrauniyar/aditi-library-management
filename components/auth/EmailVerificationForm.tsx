"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiPost, ApiSuccessResponse } from "@/lib";
import { toast } from "sonner";

const verificationSchema = z.object({
  email: z.string().email("Invalid email address"),
  verificationCode: z.string().length(6, "Verification code must be 6 digits"),
});

type VerificationData = z.infer<typeof verificationSchema>;

interface EmailVerificationFormProps extends React.ComponentProps<"form"> {
  email?: string;
  onSuccess?: (data: {
    userId: string;
    tenantId: string;
    tenantSlug: string;
    role: string;
  }) => void;
}

export function EmailVerificationForm({
  className,
  email,
  onSuccess,
  ...props
}: EmailVerificationFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerificationData>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      email: email || "",
    },
  });

  const onSubmit = async (data: VerificationData) => {
    setIsLoading(true);

    try {
      const result = await apiPost<
        ApiSuccessResponse<{
          userId: string;
          tenantId: string;
          tenantSlug: string;
          role: string;
        }>
      >("/verify-email", data);

      toast.success("Email verified successfully!");
      onSuccess?.(result.data);
    } catch (error) {
      // Error handling is done by axios interceptor
      // eslint-disable-next-line no-console
      console.error("Verification error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    const emailValue = email || document.querySelector<HTMLInputElement>("#email")?.value;

    if (!emailValue) {
      toast.error("Please enter your email address");
      return;
    }

    setIsResending(true);

    try {
      await apiPost<ApiSuccessResponse<unknown>>("/resend-verification", { email: emailValue });
      toast.success("Verification code sent to your email!");
    } catch (error) {
      // Error handling is done by axios interceptor
      // eslint-disable-next-line no-console
      console.error("Resend verification error:", error);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn("space-y-6", className)} {...props}>
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          {...register("email")}
          type="email"
          id="email"
          placeholder="Enter your email"
          disabled={isLoading || !!email}
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="verificationCode">Verification Code</Label>
        <Input
          {...register("verificationCode")}
          type="text"
          id="verificationCode"
          placeholder="Enter 6-digit code"
          maxLength={6}
          disabled={isLoading}
          className={errors.verificationCode ? "border-red-500" : ""}
        />
        {errors.verificationCode && (
          <p className="text-sm text-red-600">{errors.verificationCode.message}</p>
        )}
      </div>

      <div className="space-y-4">
        <Button type="submit" disabled={isLoading} className="w-full" size="lg">
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify Email"
          )}
        </Button>

        <Button
          type="button"
          variant="outline"
          disabled={isResending}
          className="w-full"
          onClick={handleResendCode}
        >
          {isResending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Resending...
            </>
          ) : (
            "Resend Code"
          )}
        </Button>
      </div>
    </form>
  );
}
