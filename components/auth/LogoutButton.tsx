"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export function LogoutButton() {
  const { logout, isLoading } = useAuth();

  return (
    <Button variant="outline" onClick={logout} disabled={isLoading}>
      Logout
    </Button>
  );
}
