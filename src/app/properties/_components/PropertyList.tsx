"use client";
import { useQuery } from "convex/react";
import React, { useState } from "react";
import { api } from "../../../../convex/_generated/api";

import PropertyShowcase from "./PropertyShowCase";
import { PropertyTypesWithImageUrls } from "@/lib/types";
import PropertiesLoading from "./PropertiesLoading";
import CompareModal from "./compare-modal";
import SavedSearchesModal from "./saved-searched-modal";

function PropertyList() {
  const [showSavedSearches, setShowSavedSearches] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const properties = useQuery(api.property.getProperties, {});

  if (!properties) return <PropertiesLoading />;

  return (
    <div className="pb-20 text-muted-foreground">
      <PropertyShowcase
        properties={properties as PropertyTypesWithImageUrls[]}
        setShowSavedSearches={setShowSavedSearches}
        setShowCompare={setShowCompare}
      />
      <SavedSearchesModal
        isOpen={showSavedSearches}
        onClose={setShowSavedSearches}
      />
      <CompareModal isOpen={showCompare} onClose={setShowCompare} />
    </div>
  );
}

export default PropertyList;
