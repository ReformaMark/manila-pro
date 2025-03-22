'use client'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { usePropertyCategory } from '../../_components/hooks/usePropertyCategory'

function FeaturedCategories() {
    const data = usePropertyCategory()
  return (
    <div className="mb-8">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold text-gray-900">Featured Categories</h2>
      <Button variant="link" className="text-brand-orange hover:text-brand-orange/80 p-0">
        View All Categories <ArrowRight className="h-4 w-4 ml-1" />
      </Button>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {!data.isLoading ? data.categories && data.categories.map((category) => (
        <div key={category} className="relative rounded-lg overflow-hidden group cursor-pointer">
          {/* <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors z-10"></div>
          <Image
            src={category  || "/placeholder.svg"}
            alt={category.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 z-20 flex flex-col justify-end p-4">
            <h3 className="text-lg font-semibold text-white">{category.name}</h3>
            <p className="text-sm text-white/90">{category.count} Properties</p>
          </div> */}
        </div>
      )) : (
        <div className="">Loading....</div>
      )}
    </div>
  </div>
  )
}

export default FeaturedCategories