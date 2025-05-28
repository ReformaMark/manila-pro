"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Plus, Save, X } from "lucide-react"
import { Id } from "../../../../../convex/_generated/dataModel"
import { useMutation, useQuery } from "convex/react"
import { api } from "../../../../../convex/_generated/api"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import AddPlaceDialog from "./add-place-dialog"
import { toast } from "sonner"

// interface PlaceOfInterestFormProps {
//   onAddPlace: (place: Id<'nearby-places'>) => void
//   existingPlaces: NearbyPlaces[]
// }

export function PlaceOfInterestForm({
    propertyId,
    addingNearbyPlaces,
    selectedNearbyPlace,
    setAddingNearbyPlaces,
    placesOfInterestDialog,
    setPlacesOfInterestDialog,
    setSelectedNearbyPlace
}: {
    propertyId: Id<'property'>;
    addingNearbyPlaces: boolean;
    selectedNearbyPlace: [number, number] | null
    setAddingNearbyPlaces: (value: boolean) => void;
    placesOfInterestDialog:boolean;
    setPlacesOfInterestDialog: (value: boolean) => void;
    setSelectedNearbyPlace: (value: [number,number] | null) => void;
}) {
    const removeNearbyPlace = useMutation(api.nearby_places.removeNearbyPlace)
    const nearbyPlaces = useQuery(api.nearby_places.nearbyPlaces, {propertyId: propertyId})
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        distance: "",
        travelTime: "",
        propertyId: propertyId ?? "",
    })
   
    const categories = [
      { value: "mall", label: "Shopping Mall", icon: "🏬" },
      { value: "restaurant", label: "Restaurant", icon: "🍽️" },
      { value: "school", label: "School", icon: "🏫" },
      { value: "hospital", label: "Hospital", icon: "🏥" },
      { value: "park", label: "Park", icon: "🌳" },
      { value: "bank", label: "Bank", icon: "🏦" },
      { value: "gas-station", label: "Gas Station", icon: "⛽" },
      { value: "transportation", label: "Transportation", icon: "🚉" },
      { value: "other", label: "Other", icon: "📍" },
  ]
    const placesOfInterest = nearbyPlaces?.filter(place => place.type !== 'transportation')

  const getCategoryIcon = (categoryValue: string) => {
    return categories.find((cat) => cat.value === categoryValue)?.icon || "📍"
  }

  const handleRemove = (placeId: Id<'nearby_places'>) => {
    toast.promise(
      removeNearbyPlace({ id: placeId }),
      {
        loading: 'Removing place...',
        success: 'Place removed successfully',
        error: 'Failed to remove place'
      }
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Places of Interest
        </CardTitle>
        <p className="text-sm text-gray-600">Add up to 3 nearby places that make this property attractive</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing Places */}
        {placesOfInterest && placesOfInterest.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Added Places ({placesOfInterest.length}/3)</Label>
            <div className="space-y-2">
              {placesOfInterest.map((place) => (
                <div key={place._id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getCategoryIcon(place.type)}</span>
                    <div>
                      <div className="font-medium text-sm">{place.name}</div>
                      <div className="text-xs text-gray-500">{place.distance}km away</div>
                      <div className="text-xs text-gray-500">{place.travelTime}</div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleRemove(place._id)} className="h-8 w-8 p-0">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add New Place Form */}
        { addingNearbyPlaces && nearbyPlaces && nearbyPlaces.length < 6 ? 
        propertyId && selectedNearbyPlace && (
          <AddPlaceDialog
            addingNearbyPlaces={addingNearbyPlaces}
            setAddingNearbyPlaces={setAddingNearbyPlaces}
            placesOfInterestDialog={placesOfInterestDialog}
            setPlacesOfInterestDialog={setPlacesOfInterestDialog}
            formData={formData}
            setFormData={setFormData}
            categories={categories}
            selectedNearbyPlace={selectedNearbyPlace}
            setSelectedNearbyPlace={setSelectedNearbyPlace}
          />
        ): (
          <Button type="button" disabled={addingNearbyPlaces} onClick={()=> setAddingNearbyPlaces(true)} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            {addingNearbyPlaces ? "Click and select a location on the map" : "Add New Place of Interest"}
          </Button>
        )}
        {addingNearbyPlaces && (
          <p className="text-sm text-gray-600 mt-2">
            Click on the map to select the location of the place of interest
          </p>
        )}
        {placesOfInterest && placesOfInterest.length >= 3 && (
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Maximum of 3 places of interest reached</p>
          </div>
        )}
       
      </CardContent>
    </Card>
  )
}
