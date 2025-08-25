import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { toast } from "sonner";
import { getSubdomainFromHostname } from "./tenant";

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "/api/v1",
  timeout: 10000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add authentication token and tenant information
axiosInstance.interceptors.request.use(
  (config) => {
    // Add authentication token if available
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Derive tenant slug and set x-tenant-id header for multi-tenant API calls
      try {
        const host = window.location.host.toLowerCase();
        const pathname = window.location.pathname || "/";
        const rootDomain = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || "").toLowerCase();

        let tenantSlug: string | null = null;

        // Strategy 1: Prefer pathname-based tenant identification
        // This works when middleware has already processed the request
        // and rewritten the URL to /s/[slug]/...
        if (pathname.startsWith("/s/")) {
          const parts = pathname.split("/").filter(Boolean); // ["s","slug",...]
          if (parts.length >= 2) {
            tenantSlug = parts[1]; // Extract tenant slug from path
          }
        }

        // Strategy 2: Fallback to subdomain-based tenant identification
        // This works for direct subdomain access (e.g., tenant.example.com)
        if (!tenantSlug) {
          tenantSlug = getSubdomainFromHostname(host, rootDomain);
        }

        // Set tenant header for API requests if tenant identified
        if (tenantSlug) {
          (config.headers as Record<string, string>)["x-tenant-id"] = tenantSlug;
        }
      } catch {
        // Silently fail if tenant identification fails
        // This ensures API calls still work even if tenant detection fails
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Return the response data directly for successful requests
    return response;
  },
  (error: AxiosError) => {
    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - token expired or invalid
          if (typeof window !== "undefined") {
            // Show the error message from API response
            if (data && typeof data === "object" && "message" in data) {
              toast.error(data.message as string);
            } else {
              toast.error("Authentication failed");
            }

            // Only remove token and redirect if not on auth pages (token expiry case)
            if (
              !window.location.pathname.includes("/login") &&
              !window.location.pathname.includes("/register") &&
              !window.location.pathname.includes("/verify")
            ) {
              localStorage.removeItem("auth_token");
              window.location.href = "/login";
            }
          }
          break;
        case 403:
          // Forbidden - insufficient permissions
          toast.error("You do not have permission to perform this action");
          break;
        case 404:
          // Not found
          toast.error("The requested resource was not found");
          break;
        case 422:
          // Validation error
          if (data && typeof data === "object" && "message" in data) {
            toast.error(data.message as string);
          } else {
            toast.error("Validation failed");
          }
          break;
        case 429:
          // Too many requests
          toast.error("Too many requests. Please try again later");
          break;
        case 500:
          // Internal server error
          toast.error("Internal server error. Please try again later");
          break;
        default:
          // Generic error message
          if (data && typeof data === "object" && "message" in data) {
            toast.error(data.message as string);
          } else {
            toast.error("An unexpected error occurred");
          }
      }
    } else if (error.request) {
      // Network error - no response received
      toast.error("Network error. Please check your connection and try again");
    } else {
      // Something else happened
      toast.error("An unexpected error occurred");
    }

    return Promise.reject(error);
  },
);

// Helper function for GET requests
export const apiGet = async <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const response = await axiosInstance.get<T>(url, config);
  return response.data;
};

// Helper function for POST requests
export const apiPost = async <T = unknown>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> => {
  const response = await axiosInstance.post<T>(url, data, config);
  return response.data;
};

// Helper function for PUT requests
export const apiPut = async <T = unknown>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> => {
  const response = await axiosInstance.put<T>(url, data, config);
  return response.data;
};

// Helper function for PATCH requests
export const apiPatch = async <T = unknown>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> => {
  const response = await axiosInstance.patch<T>(url, data, config);
  return response.data;
};

// Helper function for DELETE requests
export const apiDelete = async <T = unknown>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> => {
  const response = await axiosInstance.delete<T>(url, config);
  return response.data;
};

// Export the instance for direct use if needed
export default axiosInstance;

// Re-export the standardized API response types from apiResponse.ts
export type {
  ApiResponse,
  ApiSuccessResponse,
  ApiErrorResponse,
  PaginatedResponse,
} from "./apiResponse";

// Custom hook for handling loading states and errors
export const useApiCall = () => {
  const handleApiCall = async <T>(
    apiCall: () => Promise<T>,
    options?: {
      onSuccess?: (data: T) => void;
      onError?: (error: AxiosError) => void;
      showSuccessToast?: boolean;
      successMessage?: string;
    },
  ): Promise<{ data: T | null; error: AxiosError | null }> => {
    try {
      const data = await apiCall();

      if (options?.showSuccessToast && options?.successMessage) {
        toast.success(options.successMessage);
      }

      options?.onSuccess?.(data);
      return { data, error: null };
    } catch (error) {
      const axiosError = error as AxiosError;
      options?.onError?.(axiosError);
      return { data: null, error: axiosError };
    }
  };

  return { handleApiCall };
};
