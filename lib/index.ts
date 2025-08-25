/**
 * Main library exports - Client-Safe Only
 *
 * This module exports only client-safe utilities that can be used
 * in browser environments. Server-only utilities must be imported directly.
 */

// Core utilities
export * from "./core";

// HTTP utilities
export * from "./http";

// Authentication (client-safe parts)
export * from "./auth/jwt";
export * from "./auth/auth";

// Tenant utilities (client-safe only)
export * from "./tenant";

// Note: Server-only utilities must be imported directly:
// - Database: import { prisma } from "@/lib/database";
// - Services: import { resend } from "@/lib/services";
// - Server: import { getTenantBySubdomain } from "@/lib/server";
