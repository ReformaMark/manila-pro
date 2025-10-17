"use client";
import { Button } from "@/components/ui/button";
import { usePropertyCompareStore } from "@/store/property-compare-store";
import React from "react";
interface HeaderProps {
  setShowSavedSearches: (showSavedSearches: boolean) => void;
  setShowCompare: (showCompare: boolean) => void;
}
function PropertyListHeader({
  setShowSavedSearches,
  setShowCompare,
}: HeaderProps) {
  const { selectedProperties } = usePropertyCompareStore();
  return (
    <div className="mx-auto max-w-full  py-4 ">
      <div className="flex items-center justify-between lg:gap-4">
        <h1 className="text-lg lg:text-2xl font-bold text-foreground">
          Find a Property
        </h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size={"sm"}
            onClick={() => setShowSavedSearches(true)}
            className="sm:flex"
          >
            View Saved Filters
          </Button>
          <Button
            onClick={() => setShowCompare(true)}
            size={"sm"}
            disabled={selectedProperties.length < 2}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            Compare ({selectedProperties.length})
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PropertyListHeader;
