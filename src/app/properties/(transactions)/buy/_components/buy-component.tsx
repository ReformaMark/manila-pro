"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import UnitTypes from "../../_components/unit-types"
import OtherLocations from "../../_components/other-locations"
import { usePaginatedQuery } from "convex/react"
import { api } from "../../../../../../convex/_generated/api"
import FeaturedAgents from "@/app/properties/featured/_components/featured-agents"
import PropertyList from "../../_components/property-list"

export default function BuyProperties() {
  const {results, status, loadMore} = usePaginatedQuery(
    api.property.filteredByTransaction,
    {transaction: "Buy"},
    { initialNumItems: 20 },
  )

  const countPropertiesByType = (type: string) => {
    return results.filter((property) => property.unitType === type).length;
  };

  const countPropertiesByLocation = (location: string) => {
    return results.filter((property) => property.city?.toLowerCase() === location.toLowerCase()).length;
  };
  

  return (
  <div className={`transition-all duration-300 bg-white`}>
    <div className="container mx-auto px-4 py-6">
      <UnitTypes
         apartment={countPropertiesByType('apartment')}
         condominium={countPropertiesByType('condominium')}
         duplex={countPropertiesByType('duplex')}
         singleAttachedHouse={countPropertiesByType('single-attached-house')}
         singleDetachedHouse={countPropertiesByType('single detached house')}
         townhouse={countPropertiesByType('townhouse')}
      />

      {/* Popular Locations */}
      <OtherLocations
        makati={countPropertiesByLocation('Makati')}
        pasay={countPropertiesByLocation('Pasay')}
        taguig={countPropertiesByLocation('Taguig')}
        
      />
        <PropertyList properties={results} status={status} loadMore={loadMore}/>
      {/* Featured Agents */}
      <div className="mt-12">
        <FeaturedAgents/>
      </div>
    </div>
  </div>
  )
}

