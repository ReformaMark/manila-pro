"use client"

import { DataTable } from "@/components/ui/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { PropertyCard } from "./_components/property-card";
import { PropertyColumns } from "./_components/property-columns";


const PropertiesPage = () => {
    const properties = useQuery(api.property.get)

    const availableProperties = properties?.filter(property => property.status === "available");
    const reservedProperties = properties?.filter(property => property.status === "reserved");
    const soldProperties = properties?.filter(property => property.status === "sold");

    return (
        <section
            className="flex flex-col justify-start items-center pt-8 min-h-screen h-full"
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 w-full px-[50px]">
                <PropertyCard
                    count={properties?.length ?? 0}
                    title="Total Properties"
                // difference={stats?.total.difference ?? 0}
                />
                <PropertyCard
                    count={availableProperties?.length ?? 0}
                    title="Available Properties"
                // difference={stats?.available.difference ?? 0}
                />

                <PropertyCard
                    count={reservedProperties?.length ?? 0}
                    title="Reserved Properties"
                // difference={stats?.reserved.difference ?? 0}
                />

                <PropertyCard
                    count={soldProperties?.length ?? 0}
                    title="Sold Properties"
                // difference={stats?.sold.difference ?? 0}
                />
            </div>

            <div className="container mx-auto py-10 px-[50px] relative">
                <Tabs defaultValue="all" className="w-full">
                    <TabsList className="bg-gray-200 text-gray absolute top-[15px] xl:top-[64px]">
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="available">Available</TabsTrigger>
                        <TabsTrigger value="reserved">Reserved</TabsTrigger>
                        <TabsTrigger value="sold">Sold</TabsTrigger>
                    </TabsList>
                    <TabsContent value="all" className="space-y-4">
                        <DataTable
                            columns={PropertyColumns}
                            data={properties ?? []}
                            isInventory
                            placeholder="Search a property"
                            search="lot"
                        />
                    </TabsContent>

                    <TabsContent value="available" className="space-y-4">
                        <DataTable
                            columns={PropertyColumns}
                            data={availableProperties ?? []}
                            isInventory
                            placeholder="Search a property"
                            search="lot"
                        />
                    </TabsContent>

                    <TabsContent value="reserved" className="space-y-4">
                        <DataTable
                            columns={PropertyColumns}
                            data={reservedProperties ?? []}
                            isInventory
                            placeholder="Search a property"
                            search="lot"
                        />
                    </TabsContent>

                    <TabsContent value="sold" className="space-y-4">
                        <DataTable
                            columns={PropertyColumns}
                            data={soldProperties ?? []}
                            isInventory
                            placeholder="Search a property"
                            search="lot"
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </section>
    )
}

export default PropertiesPage;