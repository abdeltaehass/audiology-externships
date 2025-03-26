// ADMIN PAGE LAYOUT
// This component provides a protected layout for admin pages.
// It ensures that only authenticated users can access the content using <AuthGuard>.
// The layout includes a sidebar navigation and a scrollable main content area.

import AuthGuard from "@/components/layout/admin/auth-guard"; // Auth protection for admin routes
import { Sidebar } from "@/components/layout/admin/sidebar"; // Sidebar navigation

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode; // Content passed into the layout (admin pages)
}) {
  return (
    // Wrap entire layout in AuthGuard to restrict access to authenticated admins only
    <AuthGuard>
      {/* Main layout container with background color */}
      <div className="flex min-h-screen flex-col bg-gray-100 dark:bg-gray-900">
        <div className="flex-1 flex">
          {/* Sidebar takes fixed space on the left */}
          <Sidebar />

          {/* Main content area on the right */}
          <main className="flex-1 p-8 overflow-auto">
            {/* Max width constraint for readability */}
            <div className="max-w-6xl mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
