import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";

import { UserNav } from "@/components/layout/user-nav";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { SurveyDialog } from "@/components/survey-dialog";
import MaxWidthWrapper from "./max-width-wrapper";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <MaxWidthWrapper className="flex h-14 items-center justify-between">
        <Link href="/" className="font-semibold">
          <Image
            className="h-8 w-auto"
            src="/logo-dark.png"
            alt="Audiology Externships"
            width={32}
            height={32}
          />
        </Link>
        <nav className="flex items-center gap-2">
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
            <SurveyDialog />
          </div>

          {/* Mobile menu */}
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
                  <SurveyDialog buttonClassName="w-full" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <UserNav />
        </nav>
      </MaxWidthWrapper>
    </header>
  );
}
