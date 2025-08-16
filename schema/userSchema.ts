import { z } from "zod";

export const userRegistrationSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  tenantSlug: z.string().min(1, "Organization identifier is required"),
  phone: z.string().optional(),
});

export type UserRegistrationInput = typeof userRegistrationSchema._input;

