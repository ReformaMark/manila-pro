"use client"


import { useConvexAuth } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useCheckRole } from "../hooks/use-check-role";

export function SellerGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth()
    const { data: role, isLoading: isRoleLoading } = useCheckRole()

    useEffect(() => {
        if (!isAuthLoading && !isRoleLoading) {
            if (!isAuthenticated) {
                router.push("/")
                return
            }

            if (role !== "seller") {
                // Redirect non-admin users to appropriate routes
                switch (role) {
                    case "buyer":
                        router.push("/buyer")
                        break
                    case "admin":
                        router.push("/admin")
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

    // Only render children if authenticated and seller
    if (isAuthenticated && role === "seller") {
        return <>{children}</>
    }

    return null
}