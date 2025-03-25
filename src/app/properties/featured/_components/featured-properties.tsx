'use client'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { usePaginatedQuery } from 'convex/react'
import React, { useEffect, useState } from 'react'
import { api } from '../../../../../convex/_generated/api'
import { PropertyTypesWithImageUrls } from '@/lib/types'
import { motion } from 'framer-motion'
import PropertyCard from '../../_components/PropertyCard'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Loading from '@/components/loading'
import { useRouter } from 'next/navigation'

function FeaturedProperties() {
    const { results, status, loadMore } = usePaginatedQuery(
        api.property.getFeaturedProperties,
        {},
        { initialNumItems: 5 },
      );
    const [filteredProperties, setFilteredProperties] = useState<PropertyTypesWithImageUrls[] | undefined>(results)
    const [activeTab, setActiveTab] = useState("all")
    const router = useRouter()

    useEffect(() => {
        if(results) {
            if ( activeTab === "all") {
                setFilteredProperties(results)
            } else if (activeTab === "buy") {
                setFilteredProperties(results.filter((p) => p.transactionType === "Buy"))
            } else if (activeTab === "rent") {
                setFilteredProperties(results.filter((p) => p.transactionType === "Rent"))
            } else if (activeTab === "lease") {
                setFilteredProperties(results.filter((p) => p.transactionType === "Lease"))
            }
        }
      }, [activeTab, results])

      if(!filteredProperties) return <div className="">Loading...</div>
  return (
    <div>
        <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Featured Properties</h2>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
            <TabsList className="bg-gray-100 text-gray-600">
            <TabsTrigger
                value="all"
                className="data-[state=active]:bg-brand-orange data-[state=active]:text-white"
            >
                All
            </TabsTrigger>
            <TabsTrigger
                value="buy"
                className="data-[state=active]:bg-brand-orange data-[state=active]:text-white"
            >
                For Sale
            </TabsTrigger>
            <TabsTrigger
                value="rent"
                className="data-[state=active]:bg-brand-orange data-[state=active]:text-white"
            >
                For Rent
            </TabsTrigger>
            <TabsTrigger
                value="lease"
                className="data-[state=active]:bg-brand-orange data-[state=active]:text-white"
            >
                For Lease
            </TabsTrigger>
            </TabsList>
        </Tabs>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
            <motion.div
            key={property._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ y: -5 }}
            className="h-full"
            >
            <PropertyCard property={property} onClick={() => {router.push(`/properties/${property._id}`)}} />
            </motion.div>
        ))}
        </div>

        {filteredProperties.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <Sparkles className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2 text-gray-900">No featured properties found</h3>
            <p className="text-gray-500 mb-4">There are currently no featured properties in this category.</p>
            <Button
            variant={'default'}
            onClick={() => setActiveTab("all")}
            className="bg-brand-orange hover:bg-brand-orange/90 text-black"
            >
            View All Featured Properties
            </Button>
        </div>
        )}
     

         {status === "LoadingMore" ?
            <Loading/>
         : status === "CanLoadMore" && (
        <div className="mt-8 text-center">
            <Button
            onClick={() => loadMore(5)}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
            Load More Properties
            </Button>
        </div>
        )}
    </div>
  )
}

export default FeaturedProperties