"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname(); // Get current page path
  const { user, isSubscribed, loading, refreshUser } = useAuth();

  // Define the rules directly in this file
  const pageProtectionRules = {
    "/settings": {
      requiresAuth: true,
      requiresSubscription: false,
    },
    "/posts": {
      requiresAuth: true,
      requiresSubscription: true, // Requires both auth and subscription
    },
  };

  const protectionRules = pageProtectionRules[pathname]; // Get rules for current page

  useEffect(() => {
    if (!loading && protectionRules) {
      const {
        requiresAuth,
        requiresSubscription,
        blockIfSubscribed,
      } = protectionRules;

      // Check if the user is logged in
      if (requiresAuth && !user) {
        console.log("Redirecting to sign-in...");
        router.push("/sign-in");
        return;
      }

      // Check if the user needs to be subscribed
      if (requiresSubscription && !isSubscribed) {
        console.log("Redirecting to checkout...");
        router.push("/checkout");
        return;
      }

      // Block subscribed users if the page should not be accessible to them
      if (blockIfSubscribed && isSubscribed) {
        console.log("Redirecting to dashboard...");
        router.push("/dashboard");
        return;
      }

     

      console.log("Access granted to page:", pathname);
    }
  }, [user, isSubscribed, loading, router, pathname, protectionRules, refreshUser]);

  if (loading) return <div>Loading...</div>;

  return <>{children}</>;
}
