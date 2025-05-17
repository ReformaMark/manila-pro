'use client'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle, ChevronDown, Clock, Eye, Heart, Share2, Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import PropertyCard from '../../_components/PropertyCard'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { PropertyTypesWithImageUrls } from '@/lib/types'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useMutation } from 'convex/react'
import { api } from '../../../../../convex/_generated/api'
import { Id } from '../../../../../convex/_generated/dataModel'
import { toast } from 'sonner'

interface SavedPropertyListProps {
    savedProperties: PropertyTypesWithImageUrls[]
  
}

const savedSearches = [
  {
    id: "1",
    name: "Luxury Condos in Makati",
    criteria: {
      location: "Makati",
      transactionType: "Buy",
      unitType: "Condominium",
      priceRange: [10000000, 30000000],
      bedrooms: 2,
      bathrooms: 2,
    },
    dateCreated: "2023-03-15",
    matchCount: 24,
  },
  {
    id: "2",
    name: "Apartments for Rent in BGC",
    criteria: {
      location: "Taguig",
      transactionType: "Rent",
      unitType: "Apartment",
      priceRange: [50000, 150000],
      bedrooms: 1,
      bathrooms: 1,
    },
    dateCreated: "2023-02-28",
    matchCount: 18,
  },
  {
    id: "3",
    name: "Family Homes in Pasay",
    criteria: {
      location: "Pasay",
      transactionType: "Buy",
      unitType: "House",
      priceRange: [20000000, 40000000],
      bedrooms: 3,
      bathrooms: 2,
    },
    dateCreated: "2023-01-10",
    matchCount: 12,
  },
]

function SavedPropertyList({
    savedProperties,

}: SavedPropertyListProps) {
    const [activeTab, setActiveTab] = useState("properties")
   
    const [searches, setSearches] = useState(savedSearches)
    const saveProperty = useMutation(api.property.saveProperty)
    const clearSavedProp = useMutation(api.property.clearSavedProperties)
    const router = useRouter()

    const removeProperty = (id: string) => {
        toast.promise(saveProperty({
          id: id as Id<'property'>
        }),
        {
          loading: "Saving Property...",
          success: (data) => (
            
          <div className="flex items-center gap-2">
           
            <CheckCircle className="h-5 w-5 text-green-600" />
            {data.process === "unsave" ? <span>Property Removed From Saved Properties</span> : <span>Property Saved</span>}
            
          </div>
          ),
          error: "Error Saving Property!"
        }
      )
      }
    
  return (
    <div className="flex flex-col  md:justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Saved Properties</h1>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
            <TabsList className="bg-gray-100 text-gray-600 w-full md:w-auto">
              <TabsTrigger
                value="properties"
                className="flex-1 md:flex-initial data-[state=active]:bg-brand-orange data-[state=active]:text-white"
              >
                <Heart className="h-4 w-4 mr-2" />
                Saved Properties
              </TabsTrigger>
         
            </TabsList>
            <TabsContent value="properties" className="mt-0">
            {savedProperties.length > 0 ? (
            <>
              <div className="mb-4 flex justify-between items-center">
                <p className="text-gray-700">
                  You have <span className="font-semibold">{savedProperties?.length}</span> saved properties
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700">
                    Sort By <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => {
                      clearSavedProp()
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedProperties.map((property) => (
                  <motion.div
                    key={property._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-full relative group"
                  >
                    <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-full bg-white/90 hover:bg-white text-gray-700"
                          onClick={(e) => {
                            e.stopPropagation()
                            removeProperty(property._id)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                       
                      </div>
                    </div>
                    <PropertyCard property={property} onClick={() => {router.push(`/properties/${property._id}`)}} />
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
              <Heart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2 text-gray-900">No saved properties</h3>
              <p className="text-gray-500 mb-4">
                You haven&apos;t saved any properties yet. Browse our listings and click the heart icon to save properties
                you&apos;re interested in.
              </p>
              <Link href="/properties">
                <Button className="bg-brand-orange hover:bg-brand-orange/90 text-white">Browse Properties</Button>
              </Link>
            </div>
          )}
        </TabsContent>

      
          </Tabs>
        </div>
  )
}

export default SavedPropertyList