'use client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PropertyTypesWithImageUrls } from '@/lib/types'
import { cn, formatPrice } from '@/lib/utils'
import { useMutation, useQuery } from 'convex/react'
import { CheckCircle, Heart, MapPin, Share2 } from 'lucide-react'
import React from 'react'
import { api } from '../../../../../convex/_generated/api'
import { toast } from 'sonner'

interface PropertyHeaderProps {
  property: PropertyTypesWithImageUrls
}

function PropertyHeader({property}: PropertyHeaderProps) {
  const saveProperty = useMutation(api.property.saveProperty)
  const isSaved = useQuery(api.property.isSaved, {id: property._id})

  console.log(isSaved)
  const handleSaved = () =>{
    try {
      toast.promise(saveProperty({
        id: property._id
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
    } catch (error) {
      console.log("Something Went Wrong!",error)
    }
  }
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
    <div>
      <div className="flex items-center">
        <Badge className="bg-brand-orange text-white mr-2">{property.transactionType}</Badge>
        {property.featured && (
          <Badge variant="outline" className="border-yellow-500 text-yellow-600">
            Featured
          </Badge>
        )}
      </div>
      <h1 className="text-2xl md:text-3xl font-bold mt-2 text-gray-900">{property.propertyName}</h1>
      <div className="flex items-center text-gray-500 mt-1">
        
        <MapPin className="h-4 w-4 mr-1" />
        {property.address}
      </div>
      
    </div>
    <div className="flex flex-col md:items-end">
      <p className="text-3xl font-bold text-brand-orange">
        {formatPrice(property.totalSellingPrice, property.transactionType)}
      </p>
      <div className="flex items-center gap-2 mt-2">
        <Button
          variant="outline"
          size="sm"
          className="border-brand-orange text-brand-orange hover:bg-brand-orange/10"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
        <Button
          variant="outline"
          onClick={handleSaved}
          size="sm"
          className={cn(property.isSaved ? "bg-brand-orange text-white" : "border-brand-orange text-brand-orange hover:bg-brand-orange/10" )}
        >
          <Heart className="h-4 w-4 mr-2" />
          Save{property.isSaved ? "d" : ""}
        </Button>
      </div>
    </div>
  </div>
  )
}

export default PropertyHeader