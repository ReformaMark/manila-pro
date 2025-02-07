"use client"

import { useQuery } from "convex/react"
import { api } from "../../../../../../convex/_generated/api"
import { DataTable } from "@/components/ui/data-table"
import { SellerColumns } from "./seller-columns"
import { Button } from "@/components/ui/button"
import { PlusIcon, Trash2Icon } from "lucide-react"
import { useState } from "react"
import { AddSellersModal } from "./add-sellers-modal"

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
                    <div className="">
                        <Button
                            variant="outline"
                            className="text-gray"
                            onClick={() => setShowAddSellerModal(true)}
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

            <AddSellersModal
                onClose={() => setShowAddSellerModal(false)}
                open={showAddSellerModal}
            />
        </>
    )
}