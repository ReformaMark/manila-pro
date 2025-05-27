'use client'
import { useQuery } from 'convex/react'
import dynamic from 'next/dynamic'
import React, { useMemo, useState } from 'react'
import { api } from '../../../../../convex/_generated/api'
import Loading from '@/components/loading'
import SelectableProperties from './selectable-properties'
import { Doc } from '../../../../../convex/_generated/dataModel'
import { PlaceOfInterestForm } from './place-of-interest-form'
import { TransportationForm } from './transportation-form'
import { Button } from '@/components/ui/button'
import { Expand } from 'lucide-react'
import { cn } from '@/lib/utils'
import { BiCollapse } from 'react-icons/bi'

function MapLocations() {
  const Map = useMemo(() => dynamic(
    () => import('./map').then(mod => mod.default),
    {
        loading: () => <p>A map is loading</p>,
        ssr: false
    }
  ), [])
  const [expand, setExpand] = useState<boolean>(false)
  const [addingNearbyPlaces, setAddingNearbyPlaces] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<string>("Unassigned")
  const [selectedProperty, setSelectedProperty] = useState<Doc<'property'> | null>(null)
  const [selectedNearbyPlace, setSelectedNearbyPlace] = useState<[number,number] | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<[number,number] | null>(null)
  const properties = useQuery(api.property.getPropertyBySeller)

  function handleExpand() {
    setExpand(!expand)
  }

  if (!properties) return <Loading />
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 h-fit ">
      <div className="col-span-1 ">
        <SelectableProperties 
          // position={position}
          // setPosition={setPosition}
          activeTab={activeTab}
          properties={properties}
          selectedProperty={selectedProperty}
          setSelectedLocation={setSelectedLocation}
          setSelectedProperty={setSelectedProperty}
        />
      </div>
      <div className="col-span-2 flex flex-col gap-5 flex-1 overflow-auto">
        <div className={cn(expand ? "h-full" : "h-1/2" ," bg-white rounded-lg shadow-sm border overflow-hidden")}>
          <div className="flex flex-col p-4 border-b w-full h-full ">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Property Location</h2>
              <Button variant={'ghost'} size={'icon'} onClick={handleExpand}>
                {expand ? <BiCollapse /> : <Expand />}
                
              </Button>

            </div>
            <p className="text-sm text-gray-600">
              {selectedProperty
                ? "Click on the map to pin the exact location"
                : "Select a property to view its location"}
            </p>
            <div className="flex-1 mt-4">

              <Map 
                // position={position}
                // setPosition={setPosition}
                properties={properties}
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
                selectedProperty={selectedProperty}
                setSelectedProperty={setSelectedProperty}
                selectedNearbyPlace={selectedNearbyPlace}
                setSelectedNearbyPlace={setSelectedNearbyPlace}
                addingNearbyPlaces={addingNearbyPlaces}
                setActiveTab={setActiveTab}
              />
            </div>
          </div>
      
        </div>
        {selectedProperty && (
          <div className={cn(expand ? "h-0" : "h-1/2" ," grid grid-cols-1 md:grid-cols-2 gap-6")}>
            <PlaceOfInterestForm 
              propertyId={selectedProperty._id} 
              addingNearbyPlaces={addingNearbyPlaces}
              selectedNearbyPlace={selectedNearbyPlace}
              setAddingNearbyPlaces={setAddingNearbyPlaces}
            />
            <TransportationForm 
              propertyId={selectedProperty._id} 
              addingNearbyPlaces={addingNearbyPlaces}
              selectedNearbyPlace={selectedNearbyPlace}
              setAddingNearbyPlaces={setAddingNearbyPlaces}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default MapLocations