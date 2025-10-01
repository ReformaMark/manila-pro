"use client";

import { useConvexAuth } from "convex/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useCheckRole } from "../hooks/use-check-role";
import { useCurrentUser } from "@/hooks/use-current-user";

export function BuyerGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth();
  const { data: role, isLoading: isRoleLoading } = useCheckRole();
  const pathname = usePathname();
  const currentUser = useCurrentUser();

  useEffect(() => {
    if (!isAuthLoading && !isRoleLoading) {
      if (
        !isAuthenticated &&
        (pathname === "/properties/profile" || pathname === "/")
      ) {
        router.push("/");
        return;
      }

      if (role !== "buyer") {
        // Redirect non-admin users to appropriate routes
        switch (role) {
          case "admin":
            router.push("/admin");
            break;
          case "seller":
            router.push("/seller");
            break;
          default:
            router.push("/auth");
        }
        return;
      }
    }
  }, [isAuthenticated, isAuthLoading, isRoleLoading, role, router, pathname]);

  // Show nothing while checking authentication and role
  if (isAuthLoading || isRoleLoading) {
    return null;
  }

  // Only render children if authenticated and system admin
  if (isAuthenticated && role === "buyer") {
    // Check if not loading
    if (!currentUser.isLoading) {
      // If user exists but phone is not verified (undefined or false), redirect to phone verification page
      if (
        (currentUser.user && !currentUser.user?.phoneVerified) ||
        currentUser.user?.phoneVerified === false
      ) {
        router.push("/auth/phone-verification");
        return null;
      }
    }
    return <>{children}</>;
  }

  return null;
}
