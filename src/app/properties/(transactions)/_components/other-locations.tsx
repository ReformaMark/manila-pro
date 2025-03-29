import { Button } from '@/components/ui/button'
import { ArrowRight, MapPin } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import Pasay from '@/../public/images/pasay.jpg';
import Makati from '@/../public/images/makati.jpg';
import Taguig from '@/../public/images/taguig-BGC.png';

interface OtherLocationsProps {
    makati: number;
    pasay: number;
    taguig: number;
}

function OtherLocations({makati,pasay,taguig}: OtherLocationsProps) {

    const locations = [
        { name: 'makati', count: makati, image: Makati },
        { name: 'pasay', count: pasay, image: Pasay },
        { name: 'taguig', count: taguig, image: Taguig }
    ]
  return (
    <div className="mb-8">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold text-gray-900">Popular Locations</h2>
    
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {locations.map((location) => (
        <div
          key={location.name}
          className="relative rounded-lg overflow-hidden group cursor-pointer"
          onClick={() => {}}
        >
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors z-10"></div>
          <Image
            src={location.image || "/placeholder.svg"}
            alt={location.name}
            width={100}
            height={100}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 z-20 flex flex-col justify-end p-4">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 text-white mr-1" />
              <h3 className="text-lg font-semibold text-white capitalize">{location.name}</h3>
            </div>
            <p className="text-sm text-white/90">{location.count} Properties for Sale</p>
          </div>
        </div>
      ))}
    </div>
  </div>
  )
}

export default OtherLocations