"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ClipboardList, FileText } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();

  return (
    <nav className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <ScrollArea className="h-full py-6">
        <div className="px-3 py-2">
          <h2 className="mb-3 px-4 text-lg font-semibold tracking-tight">
            Admin Dashboard
          </h2>
          <div className="space-y-1">
            {sidebarNavItems.map((item) => (
              <Button
                key={item.href}
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  pathname === item.href && "bg-gray-100 dark:bg-gray-700"
                )}
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
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
