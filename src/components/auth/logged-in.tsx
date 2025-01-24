"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useConvexAuth } from "convex/react"
import { useCheckRole } from "../hooks/use-check-role"

export function RoleCheck() {
    const router = useRouter()
    const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth()
    const { data: role, isLoading: isRoleLoading } = useCheckRole()

    useEffect(() => {
        if (!isAuthLoading && !isRoleLoading && isAuthenticated) {
            switch (role) {
                case "admin":
                    router.push("/admin")
                    break
                case "buyer":
                    router.push("/buyer") // to change dipende kay reforma
                    break
                case "seller":
                    router.push("/seller") // to change dipende kay reforma
                    break
                default:
                    router.push("/")
            }
        }
    }, [isAuthenticated, isAuthLoading, isRoleLoading, role, router])

    return null
}