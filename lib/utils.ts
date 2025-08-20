import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Checks if OTP should be logged to console instead of sending emails
 * @returns boolean indicating if OTP should be logged to console
 */
export function shouldLogOTPToConsole(): boolean {
  return process.env.DEV_LOG_OTP === "true"
}
