"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isSubscribed, loading, refreshUser } = useAuth();

  useEffect(() => {
    console.log("🚀 ProtectedRoute state:", { user, isSubscribed, loading });

    if (!loading) {
      if (!user) {
        console.log("Redirecting to sign-up...");
        router.push("/sign-up");
      } else if (user && isSubscribed === false) {
        console.log("Redirecting to checkout...");

        //Attempt to refresh state before redirecting
        refreshUser().then(() => {
          if (!isSubscribed) router.push("/checkout");
        });
      } else if (user && isSubscribed === true) {
        console.log("Access granted to protected route.");
      }
    }
  }, [user, isSubscribed, loading, router, refreshUser]);

  //Only render children after loading is false
  if (loading) return <div>Loading...</div>;

  return <>{children}</>;
}
