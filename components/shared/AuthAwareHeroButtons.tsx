"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";

interface AuthAwareHeroButtonsProps {
  subdomain?: string;
  isMainLanding?: boolean;
}

export function AuthAwareHeroButtons({
  subdomain,
  isMainLanding = false,
}: AuthAwareHeroButtonsProps) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center gap-4 sm:flex-row">
        <div className="h-12 w-40 animate-pulse rounded-full bg-gray-200"></div>
        <div className="h-12 w-40 animate-pulse rounded-full bg-gray-200"></div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    // User is logged in - show dashboard access
    return (
      <div className="flex flex-col justify-center gap-4 sm:flex-row">
        <Button
          size="lg"
          className="animate-pulse-glow rounded-full bg-blue-600 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-blue-700 hover:shadow-2xl"
          asChild
        >
          <Link href="/dashboard">
            Go to Dashboard
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="rounded-full border-2 border-slate-300 px-8 py-4 text-lg font-semibold text-slate-700 transition-all duration-300 hover:border-blue-600 hover:text-blue-600 hover:shadow-lg"
          asChild
        >
          <Link href="/demo">Schedule Demo</Link>
        </Button>
      </div>
    );
  }

  // Not authenticated - show original buttons
  if (isMainLanding) {
    return (
      <div className="flex flex-col justify-center gap-4 sm:flex-row">
        <Button
          size="lg"
          className="animate-pulse-glow rounded-full bg-blue-600 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-blue-700 hover:shadow-2xl"
          asChild
        >
          <Link href="/register">Start Free Trial</Link>
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="rounded-full border-2 border-slate-300 px-8 py-4 text-lg font-semibold text-slate-700 transition-all duration-300 hover:border-blue-600 hover:text-blue-600 hover:shadow-lg"
          asChild
        >
          <Link href="/demo">Schedule Demo</Link>
        </Button>
      </div>
    );
  }

  // Subdomain landing page buttons
  return (
    <div className="flex flex-col justify-center gap-4 sm:flex-row">
      <Button
        size="lg"
        className="animate-pulse-glow rounded-full bg-blue-600 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-blue-700 hover:shadow-2xl"
        asChild
      >
        <Link href={`/s/${subdomain}/apply`}>
          <Calendar className="mr-2 h-5 w-5" />
          Book Your Seat
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </Button>
      <Button
        size="lg"
        variant="outline"
        className="rounded-full border-2 border-slate-300 px-8 py-4 text-lg font-semibold text-slate-700 transition-all duration-300 hover:border-blue-600 hover:text-blue-600 hover:shadow-lg"
        asChild
      >
        <Link href={`/s/${subdomain}/contact`}>Contact Us</Link>
      </Button>
    </div>
  );
}
