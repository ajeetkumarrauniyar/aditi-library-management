import { NextResponse } from "next/server";

// Base API Response interface
export interface ApiResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode?: number;
}

// Success response with required data
export interface ApiSuccessResponse<T = unknown> extends ApiResponse {
  success: true;
  data: T;
}

// Error response with optional error details
export interface ApiErrorResponse extends ApiResponse {
  success: false;
  data?: never;
  error?: string;
}

export class ApiError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Specific Error Classes
export class badRequestError extends ApiError {
  constructor(message: string = "Bad Request") {
    super(message, 400);
  }
}

export class unauthorizedError extends ApiError {
  constructor(message: string = "Unauthorized") {
    super(message, 401);
  }
}

export class forbiddenError extends ApiError {
  constructor(message: string = "Forbidden") {
    super(message, 403);
  }
}

export class notFoundError extends ApiError {
  constructor(message: string = "Not Found") {
    super(message, 404);
  }
}

export class conflictError extends ApiError {
  constructor(message: string = "Conflict") {
    super(message, 409);
  }
}

export class validationError extends ApiError {
  constructor(message: string = "Validation Error") {
    super(message, 422);
  }
}

export class internalServerError extends ApiError {
  constructor(message: string = "Internal Server Error") {
    super(message, 500);
  }
}

export function successResponse<T>(
  data: T,
  message = "Success",
  statusCode = 200,
): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
      statusCode,
    },
    { status: statusCode },
  );
}

export function createdResponse<T>(
  data: T,
  message = "Created successfully",
): NextResponse<ApiSuccessResponse<T>> {
  return successResponse(data, message, 201);
}

export function noContentResponse(): NextResponse {
  return new NextResponse(null, { status: 204 });
}

// Error Response Functions
export function errorResponse(
  message: string,
  status = 500,
  error?: string,
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      message,
      error,
      timestamp: new Date().toISOString(),
      statusCode: status,
    },
    { status },
  );
}

export function apiErrorResponse(error: ApiError): NextResponse<ApiErrorResponse> {
  return errorResponse(
    error.message,
    error.statusCode,
    process.env.NODE_ENV === "development" ? error.stack : undefined,
  );
}

// Pagination Response
export interface PaginatedResponse<T> extends ApiSuccessResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export function paginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number,
  message = "Data retrieved successfully",
): NextResponse<PaginatedResponse<T>> {
  const totalPages = Math.ceil(total / limit);

  return NextResponse.json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
    statusCode: 200,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  });
}
