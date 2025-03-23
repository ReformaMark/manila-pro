'use client'
import { useQuery } from 'convex/react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React, { useState } from 'react'
import { api } from '../../../../../convex/_generated/api'
import { Id } from '../../../../../convex/_generated/dataModel'
import PropertyHeader from './property-header'
import { PropertyTypesWithImageUrls } from '@/lib/types'
import ImageCarousel from './ImageCarousel'
import { Card, CardContent } from '@/components/ui/card'
import BackBtn from '@/components/back-button'
import PropertyContent from './property-content'
import { CarouselApi } from '@/components/ui/carousel'



function PropertyComponent() {
  const { propertyId } = useParams()
  const [carouselApi, setCarouselApi] = useState<CarouselApi>() 
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const property = useQuery(api.property.getProperty, { id: propertyId as Id<'property'> })
  
  if(!property) return <div className="">Loading...</div>
  return (

    <Card className="pt-5">
      <CardContent>
        
          {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <BackBtn/>
            <Link href="/properties" className="hover:text-brand-orange transition-colors ml-2">
            Properties
            </Link>
            <span className="mx-2">/</span>
            <Link
            href={`/properties?location=${property.city}`}
            className="hover:text-brand-orange transition-colors"
            >
            {property.city}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{property.propertyName}</span>
        </div>
        <PropertyHeader property={property as PropertyTypesWithImageUrls} />
        <ImageCarousel 
          images={property.imageUrls} 
          setCurrentImageIndex={setCurrentImageIndex} 
          currentImageIndex={currentImageIndex}
          setApi={setCarouselApi}
          api={carouselApi}
        />
        <PropertyContent 
          property={property} 
          setCurrentImageIndex={setCurrentImageIndex} 
          currentImageIndex={currentImageIndex}
          setApi={setCarouselApi}
          api={carouselApi}
        />
      </CardContent>
    </Card>
  
  )
}

export default PropertyComponent