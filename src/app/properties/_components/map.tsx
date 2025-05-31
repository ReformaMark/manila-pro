'use client'
import React, { useMemo, useState } from 'react'
import SidePanel from './side-panel'
import dynamic from 'next/dynamic'
import { PropertyTypesWithImageUrls } from '@/lib/types'

function MapComponent({
   properties,
   isAuthenticated
}:{
    properties: PropertyTypesWithImageUrls[];
    isAuthenticated: boolean;
}) {
    const Map = useMemo(() => dynamic(
        () => import('@/components/map').then(mod => mod.default),
        {
            loading: () => <p>A map is loading</p>,
            ssr: false
        }
    ), [])

    const [selectedMarker, setSelectedMarker] = useState<PropertyTypesWithImageUrls | null>(null)
    
 
  return (
    <div className="flex relative h-[700px] w-full">
        <Map isAuthenticated={isAuthenticated} properties={properties} setSelectedMarker={setSelectedMarker} selectedMarker={selectedMarker} />
       
    </div>
  )
}

export default MapComponent