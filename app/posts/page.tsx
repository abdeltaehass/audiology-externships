import { Suspense } from "react";
import { Search } from "lucide-react";
import { ErrorBoundary } from "react-error-boundary";

import { SiteHeader } from "@/components/layout/site-header";
import { PostsList } from "@/components/posts/posts-list";
import { PostDetails } from "@/components/posts/post-details";
import { SearchInput } from "@/components/posts/search-input";
import { PostsSkeleton } from "@/components/posts/posts-skeleton";
import { PostsError } from "@/components/posts/posts-error";
import MaxWidthWrapper from "@/components/layout/max-width-wrapper";

export default function PostsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#fafcfb]">
      <SiteHeader />
      <MaxWidthWrapper as="main" className="flex-1 py-8">
        <div className="mb-8 space-y-4">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Externship Reviews
          </h1>
          <p className="text-lg text-muted-foreground">
            Explore detailed reviews and experiences shared by audiology
            students
          </p>
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Suspense fallback={<div></div>}>
              <SearchInput />
            </Suspense>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr,500px] xl:grid-cols-[1fr,600px]">
          <div className="min-h-[700px] space-y-6">
            <ErrorBoundary fallback={<PostsError />}>
              <Suspense fallback={<PostsSkeleton />}>
                <PostsList />
              </Suspense>
            </ErrorBoundary>
          </div>
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
  );
}
