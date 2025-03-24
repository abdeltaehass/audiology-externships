// SIDEBAR COMPONENT
// This component renders the vertical navigation sidebar for the admin dashboard.
// It highlights the active route based on the current pathname and provides
// quick access to admin sections such as "Externship Reviews" and "Survey Management".

"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ClipboardList, FileText } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Define the sidebar menu items
const sidebarNavItems = [
  {
    title: "Externship Reviews",
    href: "/admin",
    icon: FileText,
  },
  {
    title: "Survey Management",
    href: "/admin/survey",
    icon: ClipboardList,
  },
];

export function Sidebar() {
  const pathname = usePathname(); // Get current route path

  return (
    // Sidebar container with fixed width and border
    <nav className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      {/* Scrollable content inside sidebar */}
      <ScrollArea className="h-full py-6">
        <div className="px-3 py-2">
          {/* Sidebar header */}
          <h2 className="mb-3 px-4 text-lg font-semibold tracking-tight">
            Admin Dashboard
          </h2>

          {/* Navigation buttons list */}
          <div className="space-y-1">
            {sidebarNavItems.map((item) => (
              <Button
                key={item.href}
                variant={pathname === item.href ? "secondary" : "ghost"} // Style active item
                className={cn(
                  "w-full justify-start", // Full width and left-aligned
                  pathname === item.href && "bg-gray-100 dark:bg-gray-700" // Highlight active background
                )}
                asChild
              >
                {/* Link that wraps button */}
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4" /> {/* Icon on the left */}
                  {item.title}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </ScrollArea>
    </nav>
  );
}
