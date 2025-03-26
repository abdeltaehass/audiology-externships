// SITE HEADER COMPONENT
// This component renders the top navigation bar for the application.
// It includes the logo, primary navigation links (Home, Pricing, FAQ), a responsive mobile dropdown menu,
// and user authentication controls via the <UserNav /> component. It also includes a <SurveyDialog> for survey access.

import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";

import { UserNav } from "@/components/layout/user-nav"; // User profile dropdown or auth controls
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { SurveyDialog } from "@/components/survey-dialog"; // Opens survey dialog from navbar
import MaxWidthWrapper from "./max-width-wrapper"; // Layout wrapper for consistent max-width

export function SiteHeader() {
  return (
    // Sticky header with backdrop blur and border
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <MaxWidthWrapper className="flex h-14 items-center justify-between">
        {/* Logo and home link */}
        <Link href="/" className="font-semibold">
          <Image
            className="h-8 w-auto"
            src="/logo-dark.png"
            alt="Audiology Externships"
            width={32}
            height={32}
          />
        </Link>

        {/* Navigation section */}
        <nav className="flex items-center gap-2">
          {/* Desktop links */}
          <div className="hidden md:flex items-center">
            <Link href="/" className={buttonVariants({ variant: "ghost" })}>
              Home
            </Link>
            <Link
              href="/pricing"
              className={buttonVariants({ variant: "ghost" })}
            >
              Pricing
            </Link>
            <Link
              href="/faq"
              className={buttonVariants({ variant: "ghost" })}
            >
              FAQ
            </Link>
            {/* Inline survey trigger for desktop */}
            <SurveyDialog />
          </div>

          {/* Mobile menu button (hamburger) */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative size-10 rounded-full"
                >
                  <Menu className="size-6" />
                </Button>
              </DropdownMenuTrigger>

              {/* Dropdown content for mobile navigation */}
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem asChild>
                  <Link
                    href="/"
                    className={buttonVariants({
                      variant: "ghost",
                      className: "w-full cursor-pointer",
                    })}
                  >
                    Home
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/pricing"
                    className={buttonVariants({
                      variant: "ghost",
                      className: "w-full cursor-pointer",
                    })}
                  >
                    Pricing
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/faq"
                    className={buttonVariants({
                      variant: "ghost",
                      className: "w-full cursor-pointer",
                    })}
                  >
                    FAQ
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  {/* Survey dialog trigger in mobile menu */}
                  <SurveyDialog buttonClassName="w-full" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* User account menu / auth control */}
          <UserNav />
        </nav>
      </MaxWidthWrapper>
    </header>
  );
}
