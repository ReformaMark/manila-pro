'use client '
import React, { useMemo } from 'react'
import SidePanel from './side-panel'
import dynamic from 'next/dynamic'

function MapComponent() {
    const Map = useMemo(() => dynamic(
        () => import('@/components/map').then(mod => mod.default),
        {
            loading: () => <p>A map is loading</p>,
            ssr: false
        }
    ), [])
  return (
    <div className="flex">
        
        <SidePanel/>
        <Map/>
    </div>
  )
}

export default MapComponent