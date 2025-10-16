"use client";

import { PropertiesDashboard } from "@/components/seller/properties-dashboard";
import { usePaginatedQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

const PropertiesPage = () => {
  const {
    results: properties,
    status,
    loadMore,
    isLoading,
  } = usePaginatedQuery(
    api.property.getPropertiesBySeller,
    {},
    { initialNumItems: 15 } // Start with 15 items
  );

  if (status === "LoadingFirstPage") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <PropertiesDashboard
        initialProperties={properties ?? []}
        loadMore={loadMore}
        isLoading={isLoading}
        hasMore={status === "CanLoadMore"}
      />
    </div>
  );
};

export default PropertiesPage;
