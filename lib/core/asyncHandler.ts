import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "../http/apiResponse";
import { errorHandler } from "./errorHandler";

// Route handler type
type RouteHandler = (request: NextRequest) => Promise<NextResponse>;
type RouteHandlerWithParams = (
  request: NextRequest,
  context: { params: Promise<Record<string, string>> },
) => Promise<NextResponse>;

type RequestBody = Record<string, string | number | boolean | null | undefined>;

export function asyncHandler(handler: RouteHandler): RouteHandler;
export function asyncHandler(handler: RouteHandlerWithParams): RouteHandlerWithParams;
export function asyncHandler(
  handler: RouteHandler | RouteHandlerWithParams,
): RouteHandler | RouteHandlerWithParams {
  return async (
    request: NextRequest,
    context?: { params: Promise<Record<string, string>> },
  ): Promise<NextResponse> => {
    try {
      if (context) {
        return await (handler as RouteHandlerWithParams)(request, context);
      }
      return await (handler as RouteHandler)(request);
    } catch (error) {
      return errorHandler(error, request);
    }
  };
}

/**
 * Async wrapper with request validation
 */
export function asyncHandlerWithValidation(
  handler: RouteHandler,
  options: {
    requiredFields?: string[];
    allowedMethods?: string[];
    maxBodySize?: number; // in bytes
  } = {},
): RouteHandler {
  return asyncHandler(async (request: NextRequest): Promise<NextResponse> => {
    const { requiredFields, allowedMethods, maxBodySize = 1024 * 1024 } = options;

    // Method validation
    if (allowedMethods && !allowedMethods.includes(request.method)) {
      throw new ApiError(`Method ${request.method} not allowed`, 405);
    }

    // Body size validation (for methods that have bodies)
    if (["POST", "PUT", "PATCH"].includes(request.method)) {
      const contentLength = request.headers.get("content-length");
      if (contentLength && parseInt(contentLength) > maxBodySize) {
        throw new ApiError("Request body too large", 413);
      }
    }

    // Parse and validate body for methods that typically have one
    if (requiredFields && ["POST", "PUT", "PATCH"].includes(request.method)) {
      let body: RequestBody;

      try {
        body = await request.json();
      } catch {
        throw new ApiError("Invalid JSON format", 400);
      }

      validateRequiredFields(body, requiredFields);
    }

    return handler(request);
  });
}

// Validation utilities
export function validateRequiredFields(data: RequestBody, fields: string[]): void {
  const missingFields = fields.filter((field) => {
    const value = data[field];
    return value === undefined || value === null || value === "";
  });

  if (missingFields.length > 0) {
    throw new ApiError(`Missing required fields: ${missingFields.join(", ")}`, 400);
  }
}

export function validateEmail(email: string): boolean {
  if (!email || typeof email !== "string") return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim().toLowerCase());
}

export function validatePhone(phone: string): boolean {
  if (!phone || typeof phone !== "string") return false;
  // International phone number regex
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, "");
  return phoneRegex.test(cleanPhone) && cleanPhone.length >= 10;
}

export function validateUrl(url: string): boolean {
  if (!url || typeof url !== "string") return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function validatePassword(
  password: string,
  options: {
    minLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumbers?: boolean;
    requireSpecialChars?: boolean;
  } = {},
): { isValid: boolean; errors: string[] } {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecialChars = false,
  } = options;

  const errors: string[] = [];

  if (!password || typeof password !== "string") {
    return { isValid: false, errors: ["Password is required"] };
  }

  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (requireNumbers && !/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  if (requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  return { isValid: errors.length === 0, errors };
}

// Pagination utilities
export function getPaginationParams(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "10")));

  return {
    page,
    limit,
    skip: (page - 1) * limit,
    offset: (page - 1) * limit, // Alternative naming
  };
}

// Sorting utilities
export function getSortParams(
  request: NextRequest,
  allowedFields: string[] = [],
  defaultSort = "createdAt",
) {
  const searchParams = request.nextUrl.searchParams;
  let sortBy = searchParams.get("sortBy") || defaultSort;
  const sortOrder = searchParams.get("sortOrder") || "desc";

  // Validate sortBy against allowed fields to prevent SQL injection
  if (allowedFields.length > 0 && !allowedFields.includes(sortBy)) {
    sortBy = defaultSort;
  }

  return {
    sortBy,
    sortOrder: sortOrder.toLowerCase() === "asc" ? "asc" : "desc",
  };
}

// Search/Filter utilities
export function getSearchParams(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get("search")?.trim() || "";
  const filters: Record<string, string> = {};

  // Extract filter parameters (assuming they start with 'filter_')
  searchParams.forEach((value, key) => {
    if (key.startsWith("filter_") && value.trim()) {
      filters[key.replace("filter_", "")] = value.trim();
    }
  });

  return { search, filters };
}

// Rate limiting helper (basic in-memory)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 100,
  windowMs: number = 60 * 1000, // 1 minute
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();

  // Clean up old entries
  for (const [key, value] of rateLimitMap.entries()) {
    if (value.resetTime < now) {
      rateLimitMap.delete(key);
    }
  }

  const current = rateLimitMap.get(identifier);

  if (!current || current.resetTime < now) {
    // New window
    const resetTime = now + windowMs;
    rateLimitMap.set(identifier, { count: 1, resetTime });
    return { allowed: true, remaining: maxRequests - 1, resetTime };
  }

  if (current.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetTime: current.resetTime };
  }

  current.count++;
  return {
    allowed: true,
    remaining: maxRequests - current.count,
    resetTime: current.resetTime,
  };
}

// Request parsing utilities
export async function parseJsonBody<T = RequestBody>(request: NextRequest): Promise<T> {
  try {
    return await request.json();
  } catch {
    throw new ApiError("Invalid JSON format", 400);
  }
}

export async function parseFormData(request: NextRequest): Promise<FormData> {
  try {
    return await request.formData();
  } catch {
    throw new ApiError("Invalid form data", 400);
  }
}
