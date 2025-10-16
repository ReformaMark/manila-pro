"use client";

import { Building2 } from "lucide-react";
import { Doc } from "../../../convex/_generated/dataModel";
import { PropertyCard } from "./property-card";

interface PropertyGridProps {
  properties: Doc<"property">[];
  onViewDetails: (property: Doc<"property">) => void;
  onPropertyDeleted?: () => void;
}

export const PropertyGrid = ({
  onViewDetails,
  properties,
  onPropertyDeleted,
}: PropertyGridProps) => {
  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No properties found</h3>
        <p className="text-muted-foreground mt-1">
          Try adjusting your filters or add a new property
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard
          key={property._id}
          property={property}
          onViewDetails={() => onViewDetails(property)}
          onPropertyDeleted={onPropertyDeleted}
        />
      ))}
    </div>
  );
};
