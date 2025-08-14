import { NextRequest, NextResponse } from "next/server";
import { ApiError, apiErrorResponse } from "./apiResponse";

interface PrismaError {
  code: string;
  message?: string;
  meta?: Record<string, unknown>;
}

interface ValidationError {
  name: string;
  message: string;
}

// Prisma error handling

export function handlePrismaError(error: PrismaError): ApiError {
  const errorMap: Record<string, { message: string; status: number }> = {
    P2000: { message: "Value too long for field", status: 400 },
    P2001: { message: "Record not found", status: 404 },
    P2002: { message: "Resource already exists", status: 409 },
    P2003: { message: "Foreign key constraint failed", status: 400 },
    P2004: { message: "Database constraint failed", status: 400 },
    P2006: { message: "Invalid value provided", status: 400 },
    P2011: { message: "Required field cannot be null", status: 400 },
    P2012: { message: "Missing required value", status: 400 },
    P2014: { message: "Invalid ID provided", status: 400 },
    P2015: { message: "Related record not found", status: 404 },
    P2025: { message: "Resource not found", status: 404 },
  };

  const errorInfo = errorMap[error.code];
  if (errorInfo) {
    return new ApiError(errorInfo.message, errorInfo.status);
  }

  return new ApiError("Database operation failed", 500);
}

export function errorHandler(error: unknown, request: NextRequest): NextResponse {
  // Generate unique request ID for tracking
  const requestId = crypto.randomUUID();

  console.error("Error in API route:", {
    requestId,
    url: request.url,
    method: request.method,
    userAgent: request.headers.get("user-agent"),
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    timestamp: new Date().toISOString(),
  });

  // ApiError (custom errors)
  if (error instanceof ApiError) {
    return apiErrorResponse(error);
  }

  // Prisma errors
  if (error && typeof error === "object" && "code" in error) {
    const prismaError = error as PrismaError;
    return apiErrorResponse(handlePrismaError(prismaError));
  }

  // Validation errors
  if (error && typeof error === "object" && "name" in error) {
    const validationError = error as ValidationError;

    if (validationError.name === "ValidationError") {
      return apiErrorResponse(new ApiError("Validation failed", 422));
    }

    if (validationError.name === "CastError") {
      return apiErrorResponse(new ApiError("Invalid data format", 400));
    }
  }

  // JSON parsing errors
  if (error instanceof SyntaxError && error.message.includes("JSON")) {
    return apiErrorResponse(new ApiError("Invalid JSON format", 400));
  }

  // Network/timeout errors
  if (error instanceof Error && error.message.includes("timeout")) {
    return apiErrorResponse(new ApiError("Request timeout", 408));
  }

  // Generic errors
  const message =
    process.env.NODE_ENV === "production"
      ? "Internal server error"
      : error instanceof Error
        ? error.message
        : "Unknown error";

  return apiErrorResponse(new ApiError(message, 500));
}
