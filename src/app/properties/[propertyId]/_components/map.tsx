'use client'
import React, { useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { PropertyTypesWithImageUrls } from '@/lib/types'

function MapComponent({
   property, 
}:{
    property: PropertyTypesWithImageUrls;
}) {
    const Map = useMemo(() => dynamic(
        () => import('@/components/map').then(mod => mod.default),
        {
            loading: () => <p>A map is loading</p>,
            ssr: false
        }
    ), [])

  return (
    <div className="flex relative h-[300px] w-full">
        <Map property={property} />
    </div>
  )
}

export default MapComponent