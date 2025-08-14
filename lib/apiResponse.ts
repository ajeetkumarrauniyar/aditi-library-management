import { NextResponse } from "next/server";

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
  statusCode?: number;
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
export class BadRequestError extends ApiError {
  constructor(message: string = "Bad Request") {
    super(message, 400);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = "Unauthorized") {
    super(message, 401);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string = "Forbidden") {
    super(message, 403);
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = "Not Found") {
    super(message, 404);
  }
}

export class ConflictError extends ApiError {
  constructor(message: string = "Conflict") {
    super(message, 409);
  }
}

export class ValidationError extends ApiError {
  constructor(message: string = "Validation Error") {
    super(message, 422);
  }
}

export class InternalServerError extends ApiError {
  constructor(message: string = "Internal Server Error") {
    super(message, 500);
  }
}

export function successResponse<T>(
  data: T,
  message = "Success",
  statusCode = 200,
): NextResponse<ApiResponse<T>> {
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
): NextResponse<ApiResponse<T>> {
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
): NextResponse<ApiResponse> {
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

export function apiErrorResponse(error: ApiError): NextResponse<ApiResponse> {
  return errorResponse(
    error.message,
    error.statusCode,
    process.env.NODE_ENV === "development" ? error.stack : undefined,
  );
}

// Pagination Response
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
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
