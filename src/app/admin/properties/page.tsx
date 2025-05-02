"use client";

import { DataTable } from "@/components/ui/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { PropertyCard } from "./_components/property-card";
import { PropertyColumns } from "./_components/property-columns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const PropertiesPage = () => {
  const properties = useQuery(api.property.getProperties);

  const availableProperties = properties?.filter(
    (property) => property.status === "available"
  );
  const reservedProperties = properties?.filter(
    (property) => property.status === "reserved"
  );
  const soldProperties = properties?.filter(
    (property) => property.status === "sold"
  );

  if (properties === undefined)
    return <Loader2 className="w-6 h-6 animate-spin" />;

  return (
    <section className="flex min-h-screen flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
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

        <Card>
          <CardHeader>
            <CardTitle>Properties</CardTitle>
            <CardDescription>
              View and monitor real estate property listings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={PropertyColumns}
              data={properties}
              search="propertyName"
            />
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default PropertiesPage;
