"use client";

import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useTransition } from "react";

export function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [_isPending, startTransition] = useTransition();

  const searchValue = useMemo(() => {
    if (typeof window === "undefined") return "";
    return searchParams.get("query")?.toString() || "";
  }, [searchParams]);

  const handleSearch = (term: string) => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }

    startTransition(() => {
      router.push(`/posts?${params.toString()}`);
    });
  };

  return (
    <Input
      type="search"
      placeholder="Search by site name, location, or duration..."
      className="h-11 pl-9 text-base"
      defaultValue={searchValue}
      onChange={(e) => handleSearch(e.target.value)}
    />
  );
}
