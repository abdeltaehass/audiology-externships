// HOMEPAGE LAYOUT
// This is the global layout for the Next.js application.
// It applies the Inter font, global styles, and wraps all pages with shared context providers.
// It also includes the toast notification system (`Toaster`) at the root level.

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import React from "react";

import { cn } from "@/lib/utils";           // Utility for merging class names
import "./globals.css";                    // Global CSS styles
import Providers from "./providers";       // Global providers (e.g., theme, auth, query client)
import { Toaster } from "@/components/ui/sonner"; // Toast notifications component

// Load Inter font with different weights
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  preload: true,
  weight: ["400", "500", "600", "700"],
});

// Metadata for SEO and browser tabs
export const metadata: Metadata = {
  title: "Audiology Externship - Find & Share Experiences",
  description: "Discover and share audiology externship experiences with your peers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode; // Nested content (pages and components)
}>) {
  return (
    <html lang="en">
      {/* Apply font and antialiasing globally via className */}
      <body className={cn(inter.className, "antialiased")}>
        <Providers>
          {/* Render the current page */}
          {children}

          {/* Toast notifications rendered globally */}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
