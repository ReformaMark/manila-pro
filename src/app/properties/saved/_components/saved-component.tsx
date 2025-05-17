"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Trash2, Share2, Eye, Clock, ChevronDown, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { PropertyTypesWithImageUrls } from "@/lib/types"
import PropertyCard from "../../_components/PropertyCard"
import { useQuery } from "convex/react"
import { api } from "../../../../../convex/_generated/api"
import SavedPropertyList from "./saved-property-list"

// Mock saved properties
// const savedProperties: Property[] = [
//   {
//     id: "1",
//     title: "Modern Condominium in Makati CBD",
//     location: "Makati",
//     price: 15000000,
//     transactionType: "Buy",
//     unitType: "Condominium",
//     bedrooms: 2,
//     bathrooms: 2,
//     lotArea: 80,
//     storey: 15,
//     amenities: ["Balcony", "Built-in Wardrobe", "Air Conditioning"],
//     facilities: ["Swimming Pool", "Gym", "Function Room", "Playground"],
//     maxOccupants: 4,
//     images: ["/placeholder.svg?height=600&width=800"],
//     featured: true,
//     description: "Luxurious 2-bedroom condominium unit in the heart of Makati CBD.",
//   },
//   {
//     id: "3",
//     title: "Luxury Apartment with Bay View",
//     location: "Pasay",
//     price: 120000,
//     transactionType: "Rent",
//     unitType: "Apartment",
//     bedrooms: 3,
//     bathrooms: 2,
//     lotArea: 120,
//     storey: 8,
//     amenities: ["Balcony", "Built-in Kitchen", "Air Conditioning", "Cable TV"],
//     facilities: ["Swimming Pool", "Gym", "Sauna", "Rooftop Garden"],
//     maxOccupants: 5,
//     images: ["/placeholder.svg?height=600&width=800"],
//     featured: true,
//     description: "Stunning 3-bedroom apartment with panoramic Manila Bay views.",
//   },
//   {
//     id: "6",
//     title: "Penthouse with Skyline View",
//     location: "Makati",
//     price: 50000000,
//     transactionType: "Buy",
//     unitType: "Penthouse",
//     bedrooms: 5,
//     bathrooms: 5,
//     lotArea: 350,
//     storey: 45,
//     amenities: ["Private Pool", "Smart Home System", "Wine Cellar", "Home Theater"],
//     facilities: ["Helipad", "Private Elevator", "Concierge Service", "Spa"],
//     maxOccupants: 10,
//     images: ["/placeholder.svg?height=600&width=800"],
//     featured: true,
//     description: "Exclusive penthouse with breathtaking 360° views of the Metro Manila skyline.",
//   },
// ]

// Mock saved searches


export default function SavedProperties() {
  const savedProperties = useQuery(api.property.getSavedProperties)

  if(!savedProperties) return <div className="">Loading...</div>

  return (
    <div className={`transition-all duration-300 bg-white`}>
      <div className="container mx-auto px-4 py-6">
        
        <SavedPropertyList savedProperties={savedProperties as PropertyTypesWithImageUrls[]}/>

        {/* Recently Viewed */}
        {/* <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recently Viewed</h2>
            <Button variant="link" className="text-brand-orange hover:text-brand-orange/80 p-0">
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((id) => (
              <Card key={id} className="border border-gray-200 shadow-sm overflow-hidden">
                <div className="relative h-40">
                  <img
                    src="/placeholder.svg?height=300&width=400"
                    alt="Property"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-white/80 hover:bg-white text-gray-700"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-3">
                  <h3 className="font-medium text-gray-900 line-clamp-1">Property Title</h3>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="text-brand-orange font-semibold mt-1">₱15,000,000</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div> */}
        {/* Email Alerts */}
        {/* <div className="mt-12">
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Property Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="md:w-2/3">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Get notified about new properties</h3>
                  <p className="text-gray-600">
                    Set up email alerts for your saved searches and be the first to know when new properties matching
                    your criteria become available.
                  </p>
                </div>
                <div className="md:w-1/3 flex justify-center md:justify-end">
                  <Button className="bg-brand-orange hover:bg-brand-orange/90 text-white">Manage Alerts</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div> */}
      </div>
    </div>
  )
}

