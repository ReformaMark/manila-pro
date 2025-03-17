'use client'
import { useQuery } from 'convex/react'
import React from 'react'
import { api } from '../../../../convex/_generated/api'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import Image from 'next/image'
import { cn, formatPrice } from '@/lib/utils'

function PropertyList() {
    const properties = useQuery(api.property.getProperties, {})

  return (
    <div className='grid grid-cols-2 xl:grid-cols-4 p-2 md:p-5'>
        {properties?.map(property =>(
            <Card key={property._id} className='h h-80 flex flex-col justify-between'>
            <CardHeader className='h-1/2 w-full bg-orange-500/20 overflow-hidden relative'>
            {property.displayImage ? (
                <Image src={property.displayImage} alt="Property Image" className='size-full object-cover'/>
            ) : (
                <div className="size-full flex text-xs items-center justify-center  ">
                    <h1>No Uploaded Image</h1>
                    
                </div>
            )}
            <h4 className={cn(
                property.transactionType?.toLowerCase() === "buy" && "bg-green-500",
                property.transactionType?.toLowerCase() === "rent" && "bg-blue-500",
                property.transactionType?.toLowerCase() === "lease" && "bg-yellow-500",
                'uppercase text-xs text-white font-semibold rotate-45  text-center absolute px-10 top-5 right-[-30px]')}
            >
                For {property.transactionType}
            </h4>
        
            </CardHeader>
            <CardContent className='px-2 text-xs font-semibold space-y-2 h-2/6'>
                <div className="space-y-2">
                    <h4>Unit Type: <span className='font-normal'>{property.unitType}</span></h4>
                    <h4>Unit Type: <span className='font-normal'>{property.unitType}</span></h4>
                    <h4>Unit Type: <span className='font-normal'>{property.unitType}</span></h4>
                    <h4>Unit Type: <span className='font-normal'>{property.unitType}</span></h4>
                    
                </div>
            </CardContent>
            <CardFooter className='h-10 bg-gray-50 p-2'>
                <h4 className='font-normal text-right  w-full'>{formatPrice(property.totalSellingPrice)} {  property.transactionType?.toLowerCase() === "buy" ? "" : "/month"}</h4>
            </CardFooter>
        </Card>
        ))}
        
    </div>
  )
}

export default PropertyList