'use client'
import { PropertyCard } from '@/components/seller/property-card'
import React from 'react'
import { Doc, Id } from '../../../../../convex/_generated/dataModel'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface PropertiesProps {
  // position: { lat: number; lng: number; zoom: number };
  // setPosition: (value: { lat: number; lng: number; zoom: number }) => void;
  properties: Doc<'property'>[];
  selectedProperty: Doc<'property'> | null,
  setSelectedProperty: (value: Doc<'property'> | null) => void;
  setSelectedLocation: (value: [number, number] | null) => void;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

function SelectableProperties({
  properties,
  selectedProperty,
  setSelectedProperty,
  setSelectedLocation,
  activeTab,
  setActiveTab
}: PropertiesProps) {

  function handleSelectProperty (property: Doc<'property'>) {
    if(selectedProperty && selectedProperty?._id === property._id) {
      setSelectedProperty(null)
      
    } else {
      setSelectedProperty(property)
    
      setSelectedLocation(null)
    }
  }

  const assignedPropertiesRaw = properties.filter(prop => prop.coordinates)
  const unAssignedPropertiesRaw = properties.filter(prop => prop.coordinates === undefined)

  // Helper to move selected property to the top if present
  function prioritizeSelected(arr: Doc<'property'>[]) {
    if (!selectedProperty) return arr
    const idx = arr.findIndex(p => p._id === selectedProperty._id)
    if (idx === -1) return arr
    return [arr[idx], ...arr.slice(0, idx), ...arr.slice(idx + 1)]
  }

  const assignedProperties = prioritizeSelected(assignedPropertiesRaw)
  const unAssignedProperties = prioritizeSelected(unAssignedPropertiesRaw)

  return (
   
    <div className="bg-white rounded-lg shadow-sm border p-4 space-y-4">
      <h2 className="text-lg font-semibold ">Property Listings </h2>
      <p className="text-xs font-normal text-muted-foreground mb-4"> </p>
      <Tabs defaultValue='Unassigned' onValueChange={setActiveTab}>
        <TabsList className='bg-gray-200'>
          <TabsTrigger value='Assigned' className='relative bg-transparent'>
            Assigned
             <span className='absolute top-[-7px] right-[-2px] bg-green-500 text-white rounded-full size-4 p-1 text-xs flex items-center justify-center'>{assignedProperties.length}</span>
          </TabsTrigger>
          <TabsTrigger value='Unassigned' className='relative'>
            Unassigned
            <span className='absolute top-[-7px] right-[-5px] bg-red-500 text-white rounded-full size-4 p-1 text-xs flex items-center justify-center'>{unAssignedProperties.length}</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value='Assigned'>
          <ScrollArea className='h-[700px] p-2 '>
            <div className="space-y-4">
              {assignedProperties.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground py-8">
            No assigned properties found.
          </div>
              ) : (
          assignedProperties.map((property) => (
            <button
              type='button'
              onClick={() => handleSelectProperty(property)}
              key={property._id}
              className={cn(
                selectedProperty?._id === property._id
            ? 'border-4 shadow-lg border-orange-400 rounded-lg'
            : '',
                'block w-full transition-colors duration-300 ease-linear'
              )}
            >
              <PropertyCard property={property} onViewDetails={() => {}} />
            </button>
          ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value='Unassigned'>
          <ScrollArea className='h-[700px] p-2 '>
            <div className="space-y-4">
              {unAssignedProperties.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground py-8">
            No unassigned properties found.
          </div>
              ) : (
          unAssignedProperties.map((property) => (
            <button
              type='button'
              onClick={() => handleSelectProperty(property)}
              key={property._id}
              className={cn(
                selectedProperty?._id === property._id
            ? 'border-4 shadow-lg border-orange-400 rounded-lg'
            : '',
                'block w-full transition-colors duration-300 ease-linear'
              )}
            >
              <PropertyCard property={property} onViewDetails={() => {}} />
            </button>
          ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
     
    </div>

  )
}

export default SelectableProperties