"use client";

import {
  Building2,
  Calendar,
  ChevronRight,
  DollarSign,
  MapPin,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import useMediaQuery from "@/hooks/use-media-query";
import { Button } from "../ui/button";
import { PostDetails } from "./post-details";
import { cn } from "@/lib/utils";

type Post = {
  id: string;
  siteName: string;
  location: string;
  duration: string;
  compensation: string;
  type: string;
  rating: number;
};

// This would come from your API
const ITEMS_PER_PAGE = 8;
const mockPosts: Post[] = [
  {
    id: "1",
    siteName: "Audiology Center of Excellence",
    location: "San Francisco, California",
    duration: "12 months",
    compensation: "$40,001 - $50,000",
    type: "Hospital",
    rating: 4.5,
  },
  {
    id: "2",
    siteName: "Hearing Health Institute",
    location: "Boston, Massachusetts",
    duration: "9 months",
    compensation: "$30,001 - $40,000",
    type: "Private Practice",
    rating: 4.8,
  },
  {
    id: "3",
    siteName: "Children's Audiology Clinic",
    location: "Seattle, Washington",
    duration: "12 months",
    compensation: "$45,001 - $55,000",
    type: "Pediatric Center",
    rating: 4.7,
  },
  {
    id: "4",
    siteName: "Hearing Aid Center",
    location: "Los Angeles, California",
    duration: "6 months",
    compensation: "$20,001 - $30,000",
    type: "Private Practice",
    rating: 4.2,
  },
  {
    id: "5",
    siteName: "Hearing Solutions",
    location: "Chicago, Illinois",
    duration: "12 months",
    compensation: "$45,001 - $55,000",
    type: "Private Practice",
    rating: 4.6,
  },
  {
    id: "6",
    siteName: "Audiology Associates",
    location: "New York, New York",
    duration: "9 months",
    compensation: "$30,001 - $40,000",
    type: "Hospital",
    rating: 4.4,
  },
  {
    id: "7",
    siteName: "Hearing Center of Excellence",
    location: "San Francisco, California",
    duration: "12 months",
    compensation: "$40,001 - $50,000",
    type: "Hospital",
    rating: 4.5,
  },
  {
    id: "8",
    siteName: "Hearing Health Institute",
    location: "Boston, Massachusetts",
    duration: "9 months",
    compensation: "$30,001 - $40,000",
    type: "Private Practice",
    rating: 4.8,
  },
  {
    id: "9",
    siteName: "Children's Audiology Clinic",
    location: "Seattle, Washington",
    duration: "12 months",
    compensation: "$45,001 - $55,000",
    type: "Pediatric Center",
    rating: 4.7,
  },
  {
    id: "10",
    siteName: "Hearing Aid Center",
    location: "Los Angeles, California",
    duration: "6 months",
    compensation: "$20,001 - $30,000",
    type: "Private Practice",
    rating: 4.2,
  },
  {
    id: "11",
    siteName: "Hearing Solutions",
    location: "Chicago, Illinois",
    duration: "12 months",
    compensation: "$45,001 - $55,000",
    type: "Private Practice",
    rating: 4.8,
  },
];

export function PostsList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [selectedPost, setSelectedPost] = useState<string | null>(
    searchParams.get("post")
  );
  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search")?.toLowerCase() || "";

  const filteredPosts = mockPosts.filter(
    (post) =>
      post.siteName.toLowerCase().includes(search) ||
      post.location.toLowerCase().includes(search) ||
      post.duration.toLowerCase().includes(search)
  );

  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  const currentPosts = filteredPosts.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handlePostSelect = (postId: string) => {
    setSelectedPost(postId);
    const params = new URLSearchParams(searchParams);
    params.set("post", postId);
    router.push(`/posts?${params.toString()}`);
  };

  if (filteredPosts.length === 0) {
    return (
      <Card className="flex min-h-[400px] flex-col items-center justify-center space-y-4 border-dashed">
        <div className="rounded-full bg-muted p-3">
          <Building2 className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="text-center">
          <p className="text-lg font-medium text-muted-foreground">
            No externships found
          </p>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search terms
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6 flex flex-col flex-1">
      <div className="grid gap-4">
        {currentPosts.map((post) => (
          <Card
            key={post.id}
            className={cn(
              "cursor-pointer transition-all hover:shadow-md",
              selectedPost === post.id && "border-primary bg-primary/5"
            )}
            onClick={() => handlePostSelect(post.id)}
          >
            <CardContent className="p-5">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold tracking-tight">
                      {post.siteName}
                    </h3>
                    <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{post.location}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-accent">
                    {post.type}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>{post.duration}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <span>{post.compensation}</span>
                  </div>
                  <div className="flex items-center gap-1.5 ml-auto">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(post.rating)
                              ? "text-yellow-400"
                              : i < post.rating
                              ? "text-yellow-200"
                              : "text-gray-200"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm font-medium">
                      {post.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(newPage) => {
          const params = new URLSearchParams(searchParams);
          params.set("page", newPage.toString());
          router.push(`/posts?${params.toString()}`);
        }}
      />

      {!isDesktop && (
        <Drawer
          open={selectedPost !== null}
          onClose={() => {
            setSelectedPost(null);
            const params = new URLSearchParams(searchParams);
            params.delete("post");
            router.push(`/posts?${params.toString()}`);
          }}
        >
          <DrawerContent>
            <PostDetails postId={selectedPost} />
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center gap-2">
      {pages.map((page) => (
        <Button
          key={page}
          size="icon"
          className="rounded-full"
          variant={currentPage === page ? "default" : "ghost"}
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}
      <Button
        variant="ghost"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
