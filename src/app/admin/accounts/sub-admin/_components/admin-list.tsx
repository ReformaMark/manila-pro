"use client"

import { useQuery } from "convex/react"
import { api } from "../../../../../../convex/_generated/api"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { PlusIcon, Trash2Icon } from "lucide-react"
import { useState } from "react"
import { AdminColumns } from "./admin-columns"
import { AddAdminModal } from "./add-admin-modal"

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
                    <div className="">
                        <Button
                            variant="outline"
                            className="text-gray"
                            onClick={() => setShowAddAdminModal(true)}
                        >
                            <PlusIcon className="w-7 h-7" />
                        </Button>
                    </div>

                    <div className="">
                        <Button
                            variant="outline"
                            className=""
                        >
                            <Trash2Icon className="w-7 h-7" />
                        </Button>
                    </div>
                </div>
            </div>

            <AddAdminModal
                onClose={() => setShowAddAdminModal(false)}
                open={showAddAdminModal}
            />
        </>
    )
}