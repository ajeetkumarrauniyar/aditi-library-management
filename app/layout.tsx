import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/index";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ITMS Library - Modern Library Management System",
  description:
    "Comprehensive library management system for students and staff with premium UI/UX design.",
  keywords: ["library", "management", "students", "education", "Next.js"],
  authors: [{ name: "ITMS Library Team" }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "ITMS Library - Modern Library Management System",
    description: "Comprehensive library management system for students and staff",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="font-inter bg-gray-50 text-gray-900 antialiased" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
