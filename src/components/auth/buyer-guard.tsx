"use client"


import { useConvexAuth } from "convex/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useCheckRole } from "../hooks/use-check-role";

export function BuyerGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth()
    const { data: role, isLoading: isRoleLoading } = useCheckRole()
    const pathname = usePathname()

    useEffect(() => {
        if (!isAuthLoading && !isRoleLoading) {
            if (!isAuthenticated && 
                (pathname === "/properties/profile" ||
                    pathname === "/"
                )) {
                router.push("/")
                return
            }

            if (role !== "buyer") {
                // Redirect non-admin users to appropriate routes
                switch (role) {
                    case "admin":
                        router.push("/admin")
                        break
                    case "seller":
                        router.push("/seller")
                        break
                    default:
                        router.push("/auth")
                }
                return
            }
        }
    }, [isAuthenticated, isAuthLoading, isRoleLoading, role, router])

    // Show nothing while checking authentication and role
    if (isAuthLoading || isRoleLoading) {
        return null
    }

    // Only render children if authenticated and system admin
    if (isAuthenticated && role === "buyer") {
        return <>{children}</>
    }

    return null
}