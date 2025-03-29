"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FilterOptions } from '@/types/property'
import { Search } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

interface HeroProps {
    heroTitle: string;
    heroDesc: string;
    // filters: FilterOptions;
    // onFilterChange: (key: string, value: any) => void;
    // setIsFilterOpen: (value:boolean)=> void;
}

function Hero({heroTitle, heroDesc }: HeroProps) {
  return (
    <div className="relative rounded-xl overflow-hidden mb-8">
    <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 z-10"></div>
    <div className="relative h-64 md:h-80">
      <Image
        src="/placeholder.svg?height=800&width=1600"
        alt="Properties for Sale"
        width={100}
        height={100}
        className="w-full h-full object-cover"
      />
    </div>
    <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 md:px-12">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{heroTitle}</h1>
      <p className="text-lg text-white/90 max-w-2xl mb-6">
        {heroDesc}
      </p>

      <div className="bg-white rounded-lg p-4 max-w-3xl">
        <div className="flex flex-col md:flex-row gap-4">
          {/* <div className="flex-1 relative">
            <Input
              placeholder="Search by location, property name, or features..."
              value={filters.searchTerm}
              onChange={(e) => onFilterChange("searchTerm", e.target.value)}
              className="pl-10 bg-white border-gray-300 text-gray-900"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          </div> */}
          {/* <Button
            className="bg-brand-orange hover:bg-brand-orange/90 text-white"
            onClick={() => setIsFilterOpen(true)}
          >
            Search Properties
          </Button> */}
        </div>
      </div>
    </div>
  </div>
  )
}

export default Hero