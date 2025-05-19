'use client'
import { usePaginatedQuery } from 'convex/react';
import React from 'react'
import { api } from '../../../../convex/_generated/api';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Bath, Bed, MapPin, Maximize, Router } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

function FeaturedProperties() {
    const { results, status, loadMore } = usePaginatedQuery(
        api.property.getFeaturedProperties,
        {},
        { initialNumItems: 3 },
    );

    const router = useRouter()
  return (
    <main className="flex-1 py-12 ">
        <div className="container">
            <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">Featured Properties</h2>
              <Button variant="outline">View All</Button>
            </div>
      
          </section>
            <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((property) => (
            <Card key={property._id} className="overflow-hidden group">
                <div className="relative h-[220px] overflow-hidden">
                <Image
                    src={property.displayImageUrl || "/placeholder.svg"}
                    alt={property.propertyName}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                />
                {property.transactionType && <Badge className="absolute top-2 left-2 bg-primary">{property.transactionType}</Badge>}
                <Badge variant="outline" className="absolute top-2 right-2 bg-white">
                    {property.propertyType}
                </Badge>
                </div>

                <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg line-clamp-1">{property.propertyName}</h3>
                    <p className="font-bold text-primary">{property.totalSellingPrice}</p>
                </div>

                <div className="flex items-center text-muted-foreground mb-4">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span className="text-sm">{property.city}</span>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                    <div className="flex items-center">
                        <Bed className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="text-sm">{property.bedrooms}</span>
                    </div>
                    <div className="flex items-center">
                        <Bath className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="text-sm">{property.bathrooms}</span>
                    </div>
                    <div className="flex items-center">
                        <Maximize className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="text-sm">{property.lotArea} m²</span>
                    </div>
                    </div>
                </div>
                </CardContent>

                <CardFooter className="p-4 pt-0 flex justify-between">
                <Badge onClick={()=> router.push(`/properties/${property._id}`)} variant="outline" className="hover:bg-primary/5 cursor-pointer">
                    View Details
                </Badge>
                <Badge onClick={()=> router.push(`/properties/agents/${property.agent?._id}`)} variant="outline" className="hover:bg-primary/5 cursor-pointer">
                    Contact Agent
                </Badge>
                </CardFooter>
            </Card>
            ))}
            </div>
        </div>
    </main>
  )
}

export default FeaturedProperties