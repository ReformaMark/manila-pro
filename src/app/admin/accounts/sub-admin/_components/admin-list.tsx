"use client"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { useQuery } from "convex/react"
import { PlusIcon } from "lucide-react"
import { useState } from "react"
import { api } from "../../../../../../convex/_generated/api"
import { AddAdminModal } from "./add-admin-modal"
import { AdminColumns } from "./admin-columns"

export const AdminList = () => {
    const [showAddAdminModal, setShowAddAdminModal] = useState(false)
    const admins = useQuery(api.users.get, { role: "admin" })

    return (
        <>
            <div className="container mx-auto py-10 px-[50px] relative">
                <DataTable
                    data={admins ?? []}
                    columns={AdminColumns}
                    search="fname"
                    placeholder="Search an account"
                />

                <div className="flex flex-row gap-3 absolute right-[50px] top-[40px]">
                    <Button
                        variant="outline"
                        className="text-gray"
                        onClick={() => setShowAddAdminModal(true)}
                    >
                        <PlusIcon className="w-7 h-7" />
                    </Button>
                </div>
            </div>

            <AddAdminModal
                onClose={() => setShowAddAdminModal(false)}
                open={showAddAdminModal}
            />
        </>
    )
}