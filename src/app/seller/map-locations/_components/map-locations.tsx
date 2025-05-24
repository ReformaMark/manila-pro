'use client'
import { useQuery } from 'convex/react'
import dynamic from 'next/dynamic'
import React, { useMemo, useState } from 'react'
import { api } from '../../../../../convex/_generated/api'
import Loading from '@/components/loading'
import SelectableProperties from './selectable-properties'
import { Doc } from '../../../../../convex/_generated/dataModel'

function MapLocations() {
  const Map = useMemo(() => dynamic(
    () => import('./map').then(mod => mod.default),
    {
        loading: () => <p>A map is loading</p>,
        ssr: false
    }
  ), [])
  const [selectedProperty, setSelectedProperty] = useState<Doc<'property'> | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<[number,number] | null>(null)
  const properties = useQuery(api.property.getPropertyBySeller)

  if (!properties) return <Loading />

  return (
    <div className="flex">
      <SelectableProperties 
        properties={properties}
        selectedProperty={selectedProperty}
        setSelectedProperty={setSelectedProperty}

      />
      <div className='h-[700px] w-full'>
        <Map 
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          selectedProperty={selectedProperty}
          setSelectedProperty={setSelectedProperty}
        />
      </div>
    </div>
  )
}

export default MapLocations