"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, ChevronLeft, ChevronRight, Share2, Heart } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"
import { formatPrice } from "@/lib/utils"
import { PropertyTypesWithImageUrls } from "@/lib/types"

interface PropertyDetailModalProps {
  property: PropertyTypesWithImageUrls
  onClose: () => void
}
  
export function PropertyDetailModal({ property, onClose }: PropertyDetailModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === (property.otherImage?.length ?? 0) - 1 ? 0 : prevIndex + 1))
  }

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? (property.otherImage?.length ?? 0) - 1 : prevIndex - 1))
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white text-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-800"
      >
        <div className="relative">
          <div className="relative h-64 md:h-96">
            <Image
              priority
              src={(property.imageUrls?.[currentImageIndex] ?? "/placeholder.svg")}
              alt={property.propertyName}
              fill
              className="object-cover"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute z-40
               top-2 right-2 h-8 w-8 rounded-full bg-black/70 hover:bg-black/90 text-white"
              onClick={(e) => {
                e.stopPropagation()
                onClose()
              }}
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="absolute inset-0 flex items-center justify-between px-4">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full bg-black/70 hover:bg-black/90 text-white"
                onClick={(e) => {
                  e.stopPropagation()
                  prevImage()
                }}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full bg-black/70 hover:bg-black/90 text-white"
                onClick={(e) => {
                  e.stopPropagation()
                  nextImage()
                }}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              {property.otherImage?.map((_, index) => (
                <button
                  key={index}
                  className={`h-2 w-2 rounded-full ${index === currentImageIndex ? "bg-brand-orange" : "bg-white/50"}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    setCurrentImageIndex(index)
                  }}
                />
              ))}
            </div>
          </div>

          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-brand-black">{property.propertyName}</h2>
                <div className="flex items-center text-gray-400">{property.city}</div>
              </div>
              <p className="text-2xl font-bold text-brand-orange">
                {formatPrice(property.totalSellingPrice, property.transactionType ?? "")}   
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-3 rounded-lg">
                <div className="flex items-center text-sm font-medium text-brand-black">Bedrooms</div>
                <p className="text-lg font-semibold text-brand-black">{property.bedrooms ?? "-"}</p>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <div className="flex items-center text-sm font-medium text-brand-black">Bathrooms</div>
                <p className="text-lg font-semibold text-brand-black">{property.bathrooms  ?? "-"}</p>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <div className="flex items-center text-sm font-medium text-brand-black">Lot Area</div>
                <p className="text-lg font-semibold text-brand-black">{property.lotArea  ?? "-"} sqm</p>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <div className="flex items-center text-sm font-medium text-brand-black">Storey</div>
                <p className="text-lg font-semibold text-brand-black">{property.storeys  ?? "-"}</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2 text-brand-black">Description</h3>
              <p className="text-gray-800">{property.description ?? "No description provided"}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-brand-black">Amenities</h3>
                <ul className="grid grid-cols-2 gap-2">
                  {property.amenities ? property.amenities.map((amenity) => (
                    <li key={amenity.name} className="flex items-center text-sm text-gray-800">
                      <div className="h-2 w-2 rounded-full bg-brand-orange mr-2" />
                      {amenity.name}
                    </li>
                  )) :(
                    <li className="flex items-center text-sm text-gray-800">
                      <div className="h-2 w-2 rounded-full bg-brand-orange mr-2" />
                      No amenities
                    </li>
                  )}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-brand-black">Facilities</h3>
                <ul className="grid grid-cols-2 gap-2">
                  {property.facilities ? property.facilities.map((facility) => (
                    <li key={facility.name} className="flex items-center text-sm text-gray-800">
                      <div className="h-2 w-2 rounded-full bg-brand-orange mr-2" />
                      {facility.name}
                    </li>
                  )): (
                    <li className="flex items-center text-sm text-gray-800">
                      <div className="h-2 w-2 rounded-full bg-brand-orange mr-2" />
                      No facilities
                    </li>
                  )}
                </ul>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="flex-1 bg-brand-orange hover:bg-brand-orange/90 text-white">Contact Agent</Button>
              <Button
                variant="outline"
                className="flex-1 border-brand-orange bg-white hover:text-black text-brand-orange hover:bg-brand-orange/10"
              >
                Schedule Viewing
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-800  hover:bg-gray-800 hover:text-gray-300">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-800 hover:bg-gray-800 hover:text-gray-300">
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

