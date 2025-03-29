'use client'
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PropertyTypesWithImageUrls } from '@/lib/types'
import { motion } from 'framer-motion'
import React from 'react'
import PropertyCard from '../../_components/PropertyCard'
import Loading from '@/components/loading'
import { Button } from '@/components/ui/button'
interface PropertyListProps {
    properties: PropertyTypesWithImageUrls[]
    loadMore: (numItems: number) => void;
    status: "LoadingFirstPage" | "CanLoadMore" | "LoadingMore" | "Exhausted"
}
function PropertyList({
    properties,
    loadMore,
    status
}:PropertyListProps ) {
  return (
    <div className="flex flex-col md:flex-row gap-6">
    {/* Main Content */}
    <div className={``}>
      {/* Results Summary */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">
          {properties.length} {properties.length === 1 ? "Property" : "Properties"} for Sale
        </h2>
      </div>

      {/* Property Grid View */}
   
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <motion.div
              key={property._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -5 }}
              className="h-full"
            >
              <PropertyCard property={property} onClick={() => {}} />
            </motion.div>
          ))}
        </div>

         {status === "LoadingMore" ?
            <Loading/>
        : status === "CanLoadMore" && (
        <div className="mt-8 text-center">
            <Button
            onClick={() => loadMore(10)}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
            Load More Agents
            </Button>
        </div>
        )}
    </div>
  </div>
  )
}

export default PropertyList