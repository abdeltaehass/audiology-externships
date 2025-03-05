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
  const getSettingsQuery = useQuery({
    queryKey: ["settings"],
    queryFn: settingService.getSettings,
  });

  const adminUsers = useMemo(
    () => (getSettingsQuery.data ? getSettingsQuery.data.adminUsers : []),
    [getSettingsQuery.data]
  );

  useLayoutEffect(() => {
    if (getSettingsQuery.isLoading) return;
    if (!user || !adminUsers.includes(user.uid)) {
      router.replace("/");
      toast.error("Access Denied!", {
        description: "You are not authorized to view this page.",
      });
    }
  }, [adminUsers, user, router, getSettingsQuery.isLoading]);

  if (getSettingsQuery.isLoading || !user || !adminUsers.includes(user.uid))
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        Loading...
      </div>
    );

  return children;
}
