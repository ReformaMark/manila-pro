"use client"

import Loading from "@/components/loading";
import { PropertiesDashboard } from "@/components/seller/properties-dashboard";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

const PropertiesPage = () => {
    const properties = useQuery(api.property.getPropertyBySeller)

    if (!properties) return <Loading />

    return (
        <div className="container mx-auto py-8 px-3 md:px-6">
            <PropertiesDashboard initialProperties={properties} />
        </div>
    )
}

export default PropertiesPage;