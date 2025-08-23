"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface AuthLayoutProps {
  children: ReactNode;
  title: ReactNode;
  description?: string;
  footerLinks?: {
    text: string;
    href: string;
    linkText: string;
  }[];
}

export function AuthLayout({ children, title, description, footerLinks }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600">
            <svg
              className="h-8 w-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">{title}</h1>
          {description && <p className="mt-2 text-sm text-gray-600">{description}</p>}
        </div>

        {/* Main Content */}
        <Card className="border-0 shadow-xl">
          <CardContent className="p-6">{children}</CardContent>
        </Card>

        {/* Footer Links */}
        {footerLinks && footerLinks.length > 0 && (
          <div className="space-y-2 text-center">
            {footerLinks.map((link, index) => (
              <p key={index} className="text-sm text-gray-600">
                {link.text}{" "}
                <Link
                  href={link.href}
                  className="font-medium text-blue-600 transition-colors hover:text-blue-500"
                >
                  {link.linkText}
                </Link>
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
