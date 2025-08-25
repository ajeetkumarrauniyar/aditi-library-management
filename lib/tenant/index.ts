/**
 * Multi-tenant utilities
 *
 * This module contains utilities for handling multi-tenant functionality
 * including subdomain detection, tenant routing, and redirect logic.
 */

// Client-side exports
export * from "./client";
export * from "./redirect";

// Re-export types
export * from "@/types/tenant";

// Note: Server-side tenant utilities are in /lib/server/tenant.ts
