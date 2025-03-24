// AUTH GUARD
// This component protects admin-only routes by checking if the current user is authorized.
// It fetches a list of admin users from settings, verifies the current user’s UID, and redirects
// unauthorized users to the homepage with an error toast.

"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { PropsWithChildren, useLayoutEffect, useMemo } from "react";
import { toast } from "sonner";

import { settingService } from "@/service";
import { useAuthStore } from "@/store/auth-store";

export default function AuthGuard({ children }: PropsWithChildren) {
  const router = useRouter();
  const { user } = useAuthStore();

  // Query to fetch global app settings (e.g., list of admin UIDs)
  const getSettingsQuery = useQuery({
    queryKey: ["settings"],
    queryFn: settingService.getSettings,
  });

  // Memoized list of admin UIDs to avoid recalculating unnecessarily
  const adminUsers = useMemo(
    () => (getSettingsQuery.data ? getSettingsQuery.data.adminUsers : []),
    [getSettingsQuery.data]
  );

  // Redirect and notify if the user is not an admin
  useLayoutEffect(() => {
    if (getSettingsQuery.isLoading) return;

    const isUnauthorized = !user || !adminUsers.includes(user.uid);

    if (isUnauthorized) {
      router.replace("/"); // Redirect to home page
      toast.error("Access Denied!", {
        description: "You are not authorized to view this page.",
      });
    }
  }, [adminUsers, user, router, getSettingsQuery.isLoading]);

  // Show loading fallback while fetching settings or verifying user
  if (getSettingsQuery.isLoading || !user || !adminUsers.includes(user.uid)) {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        Loading...
      </div>
    );
  }

  // Render children if user is authorized
  return children;
}
