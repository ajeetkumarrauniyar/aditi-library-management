"use client";

import { useState, useEffect } from "react";
import { apiGet, apiPost, ApiSuccessResponse } from "@/lib";
import { User, AuthState } from "@/types";

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    const token = localStorage.getItem("auth_token");

    if (token) {
      // Verify token and get user info
      fetchUserInfo(token);
    } else {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const fetchUserInfo = async (token: string) => {
    try {
      const result = await apiGet<ApiSuccessResponse<{ user: User }>>("/me");
      setAuthState({
        user: result.data?.user || null,
        token,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error fetching user info:", error);
      // Token is invalid or request failed, remove it
      localStorage.removeItem("auth_token");
      setAuthState({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  };

  //TODO: Update this function to get session of tenant and user
  const login = (userData: { user: User; token: string }) => {
    localStorage.setItem("auth_token", userData.token);
    setAuthState({
      user: userData.user,
      token: userData.token,
      isLoading: false,
      isAuthenticated: true,
    });
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (token) {
        await apiPost("/logout");
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("auth_token");
      setAuthState({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  };

  const hasPermission = (permission: string): boolean => {
    return authState.user?.permissions.includes(permission) || false;
  };

  const hasRole = (role: string): boolean => {
    return authState.user?.role === role || false;
  };

  return {
    ...authState,
    login,
    logout,
    hasPermission,
    hasRole,
    refetch: () => {
      const token = localStorage.getItem("auth_token");
      if (token) {
        fetchUserInfo(token);
      }
    },
  };
}
