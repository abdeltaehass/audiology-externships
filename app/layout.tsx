import type { Metadata } from "next";
import { Inter } from "next/font/google";
import React from "react";

import { cn } from "@/lib/utils";
import "./globals.css";
import Providers from "./providers";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  preload: true,
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Audiology Externship - Find & Share Experiences",
  description:
    "Discover and share audiology externship experiences with your peers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "antialiased")}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
