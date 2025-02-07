"use client"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { useQuery } from "convex/react"
import { Trash2Icon } from "lucide-react"
import { api } from "../../../../../../convex/_generated/api"
import { BuyerColumns } from "./buyer-columns"

export const BuyerList = () => {
    const buyer = useQuery(api.users.get, { role: "buyer" })

    return (
        <div className="container mx-auto py-10 px-[50px] relative">
            <DataTable
                data={buyer ?? []}
                columns={BuyerColumns}
                search="fname"
                placeholder="Search an account"
            />

            <div className="absolute top-[43px] right-[50px]">
                <Button
                    variant="outline"
                    className="text-gray"
                >
                    <Trash2Icon className="w-7 h-7" />
                </Button>
            </div>
        </div>
    )
}