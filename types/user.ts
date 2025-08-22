export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  role: string;
  permissions: string[];
  isEmailVerified: boolean;
  isTenantAdmin: boolean;
  tenant: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export type UserRole = "USER" | "TENANT_STAFF" | "TENANT_ADMIN" | "SUPER_ADMIN";
