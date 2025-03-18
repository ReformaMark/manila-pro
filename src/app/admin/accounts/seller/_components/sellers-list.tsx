"use client"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { useQuery } from "convex/react"
import { PlusIcon } from "lucide-react"
import { useState } from "react"
import { api } from "../../../../../../convex/_generated/api"
import { AddSellersModal } from "./add-sellers-modal"
import { SellerColumns } from "./seller-columns"

export const SellersList = () => {
    const [showAddSellerModal, setShowAddSellerModal] = useState(false)
    const sellers = useQuery(api.users.get, { role: "seller" })

    return (
        <>
            <div className="container mx-auto py-10 px-[50px] relative">
                <DataTable
                    data={sellers ?? []}
                    columns={SellerColumns}
                    search="fname"
                    placeholder="Search an account"
                />

                <div className="flex flex-row gap-3 absolute right-[50px] top-[40px]">
                    <Button
                        variant="outline"
                        className="text-gray"
                        onClick={() => setShowAddSellerModal(true)}
                    >
                        <PlusIcon className="w-7 h-7" />
                    </Button>
                </div>
            </div>

            <AddSellersModal
                onClose={() => setShowAddSellerModal(false)}
                open={showAddSellerModal}
            />
        </>
    )
}