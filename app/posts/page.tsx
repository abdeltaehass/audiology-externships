// POST PAGE (Externship Reviews):
// This page displays a searchable list of externship reviews submitted by audiology students.
// It includes a search input, a list of posts, and a detail view for selected posts.
// The page uses Suspense for async components and ErrorBoundary for graceful error handling.

import { Suspense } from "react";
import { Search } from "lucide-react";
import { ErrorBoundary } from "react-error-boundary";

import { SiteHeader } from "@/components/layout/site-header";          // Site navigation header
import { PostsList } from "@/components/posts/posts-list";             // List of externship posts
import { PostDetails } from "@/components/posts/post-details";         // Details of selected post
import { SearchInput } from "@/components/posts/search-input";         // Search bar input
import { PostsSkeleton } from "@/components/posts/posts-skeleton";     // Loading fallback
import { PostsError } from "@/components/posts/posts-error";           // Error fallback
import MaxWidthWrapper from "@/components/layout/max-width-wrapper";   // Responsive layout wrapper
import ProtectedRoute from "@/components/protectedRoute";

export default function PostsPage() {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col bg-[#fafcfb]">
        {/* Header at the top of the page */}
        <SiteHeader />

        {/* Main content area wrapped with layout constraints */}
        <MaxWidthWrapper as="main" className="flex-1 py-8">
          {/* Page heading, subheading, and search input */}
          <div className="mb-8 space-y-4">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Externship Reviews
            </h1>
            <p className="text-lg text-muted-foreground">
              Explore detailed reviews and experiences shared by audiology students
            </p>

            {/* Search input with icon */}
            <div className="relative max-w-2xl">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Suspense fallback={<div></div>}>
                <SearchInput />
              </Suspense>
            </div>
          </div>

          {/* Main layout: list on the left, details on the right */}
          <div className="grid gap-8 lg:grid-cols-[1fr,500px] xl:grid-cols-[1fr,600px]">
            {/* Post list section with loading and error boundaries */}
            <div className="min-h-[700px] space-y-6">
              <ErrorBoundary fallback={<PostsError />}>
                <Suspense fallback={<PostsSkeleton />}>
                  <PostsList />
                </Suspense>
              </ErrorBoundary>
            </div>

            {/* Sidebar for post details, sticky on larger screens */}
            <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-6rem)]">
              <div className="max-lg:hidden h-full rounded-xl border bg-card text-card-foreground shadow-sm">
                <ErrorBoundary fallback={<PostsError />}>
                  <Suspense fallback={<PostsSkeleton />}>
                    <PostDetails />
                  </Suspense>
                </ErrorBoundary>
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </div>
    </ProtectedRoute>
  );
}
