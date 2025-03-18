"use client"
import { DataTable } from "@/components/ui/data-table"
import { useQuery } from "convex/react"
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
        </div>
    )
}