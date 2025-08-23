import { BookOpen } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";

const TenantNotFound = ({ subdomain }: { subdomain: string }) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-red-100">
          <BookOpen className="h-12 w-12 text-red-600" />
        </div>
        <h1 className="mb-4 text-4xl font-bold text-red-600">Library Not Found</h1>
        <p className="mb-8 text-gray-600">
          The library &quot;{subdomain}&quot; does not exist or has been moved.
        </p>
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <Link href="/">Go to Homepage</Link>
        </Button>
      </div>
    </div>
  );
};

export default TenantNotFound;
