/**
 * Client-side tenant utilities for multi-tenant applications
 *
 * This module provides utilities for extracting tenant information from URLs and hostnames
 * in client-side components. It handles both subdomain-based and path-based tenant routing.
 */

/**
 * Get tenant ID from URL search params (for current middleware)
 *
 * This function extracts the tenant identifier from URL search parameters.
 * It's primarily used when the middleware has already processed the request
 * and added the tenant information to the URL search params.
 *
 * @param searchParams - URLSearchParams object from the current URL
 * @returns The tenant ID or "default" if not found
 *
 * @example
 * // URL: /dashboard?tenant=library1
 * const tenantId = getTenantIdFromSearchParams(new URLSearchParams("?tenant=library1"));
 * // Returns: "library1"
 */
export function getTenantIdFromSearchParams(searchParams: URLSearchParams): string {
  return searchParams.get("tenant") || "default";
}

/**
 * Extract subdomain from hostname (client-side utility)
 *
 * This function parses a hostname to extract the tenant subdomain. It handles various
 * edge cases including localhost development, production domains, ngrok tunnels,
 * and www subdomains.
 *
 * Key Features:
 * - Handles localhost development (tenant.localhost:3000)
 * - Handles production domains (tenant.example.com)
 * - Excludes ngrok domains (treats as no subdomain)
 * - Excludes 'www' as a tenant subdomain
 * - Validates against root domain when provided
 * - Removes port numbers from hostname
 *
 * @param hostname - The hostname to extract subdomain from (e.g., "library1.example.com:3000")
 * @param rootDomain - Optional root domain for validation (e.g., "example.com")
 * @returns The subdomain or null if no valid subdomain found
 *
 * @example
 * // Development
 * getSubdomainFromHostname("library1.localhost:3000") // Returns: "library1"
 * getSubdomainFromHostname("localhost:3000") // Returns: null
 *
 * // Production
 * getSubdomainFromHostname("library1.example.com", "example.com") // Returns: "library1"
 * getSubdomainFromHostname("www.example.com", "example.com") // Returns: null
 * getSubdomainFromHostname("example.com", "example.com") // Returns: null
 *
 * // Ngrok (no subdomain)
 * getSubdomainFromHostname("abc123.ngrok-free.app") // Returns: null
 */
export function getSubdomainFromHostname(hostname: string, rootDomain?: string): string | null {
  // Remove port if present (e.g., "example.com:3000" -> "example.com")
  const cleanHost = hostname.split(":")[0].toLowerCase();

  // Handle ngrok domains (treat as no subdomain)
  // Ngrok domains should not be treated as tenant subdomains
  if (
    cleanHost.includes("ngrok-free.app") ||
    cleanHost.includes("ngrok.io") ||
    cleanHost.includes("ngrok.app")
  ) {
    return null;
  }

  // Split by dots to analyze domain structure
  const parts = cleanHost.split(".");

  // Handle localhost/development environment
  if (cleanHost.includes("localhost") || cleanHost.includes("127.0.0.1")) {
    // For localhost: tenant.localhost:3000
    // Need at least 2 parts and first part shouldn't be "localhost" or "www"
    if (parts.length > 1 && parts[0] !== "localhost" && parts[0] !== "www") {
      return parts[0]; // Return the tenant subdomain
    }
    return null; // No valid subdomain found
  }

  // Handle production domains
  if (rootDomain) {
    const rootDomainLower = rootDomain.toLowerCase();

    // Check if this is the root domain itself (with or without www)
    const isRoot = cleanHost === rootDomainLower || cleanHost === `www.${rootDomainLower}`;

    // If it's the root domain, no subdomain exists
    if (isRoot) {
      return null;
    }

    // Check if host ends with root domain and has a subdomain
    // Need at least 3 parts: [subdomain, domain, tld]
    if (cleanHost.endsWith(rootDomainLower) && parts.length > 2) {
      // Don't treat 'www' as a tenant subdomain
      if (parts[0] !== "www") {
        return parts[0]; // Return the tenant subdomain
      }
    }
  } else {
    // Fallback logic when root domain not provided
    // Assume any domain with more than 2 parts has a subdomain
    // This is less strict but works for basic cases
    if (parts.length > 2 && parts[0] !== "www") {
      return parts[0];
    }
  }

  return null; // No valid subdomain found
}
