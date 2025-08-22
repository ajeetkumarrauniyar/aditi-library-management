"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { LogOut, User } from "lucide-react";

interface SubdomainNavigationProps {
  subdomain: string;
}

export function SubdomainNavigation({ subdomain }: SubdomainNavigationProps) {
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  const handleLogout = async () => {
    await logout();
    // Redirect to subdomain home page after logout
    window.location.href = `/s/${subdomain}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center space-x-4">
        <div className="h-8 w-20 animate-pulse rounded bg-gray-200"></div>
        <div className="h-8 w-16 animate-pulse rounded bg-gray-200"></div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center space-x-4">
        <Link href="/dashboard" className="flex items-center space-x-2 px-4 py-2">
          <User className="h-4 w-4" />
          <span className="text-sm text-gray-600">Welcome, {user.firstName || user.name}!</span>
        </Link>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="flex items-center space-x-2"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </div>
    );
  }

  // Not authenticated - show login/register buttons
  return (
    <div className="flex items-center space-x-4">
      <Button
        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        asChild
      >
        <Link href={`/s/${subdomain}/apply`}>Register</Link>
      </Button>
      <Button
        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        asChild
      >
        <Link href={`/s/${subdomain}/login`}>Login</Link>
      </Button>
    </div>
  );
}
