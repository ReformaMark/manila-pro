"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Car, MapPin, Plus, X } from "lucide-react"
import { Id } from "../../../../../convex/_generated/dataModel"
import { useMutation, useQuery } from "convex/react"
import { api } from "../../../../../convex/_generated/api"
import { toast } from "sonner"

// interface PlaceOfInterestFormProps {
//   onAddPlace: (place: Id<'nearby-places'>) => void
//   existingPlaces: NearbyPlaces[]
// }

export function TransportationForm({
  propertyId,
  addingNearbyPlaces,
  selectedNearbyPlace,
  setAddingNearbyPlaces,
}: {
  propertyId: Id<'property'> | undefined;
  addingNearbyPlaces: boolean;
  selectedNearbyPlace: [number, number] | null;
  setAddingNearbyPlaces: (value: boolean) => void;
}) {
  const removeNearbyPlace = useMutation(api.nearby_places.removeNearbyPlace)
  const nearbyPlaces = useQuery(api.nearby_places.nearbyPlaces, {propertyId: propertyId})
  const [formData, setFormData] = useState({
      name: "",
      category: "",
      distance: "",
      coordinates: { lat: 0, lng: 0 },
      propertyId: "",
  })

  const categories = [
      { value: "mall", label: "Shopping Mall", icon: "🏬" },
      { value: "restaurant", label: "Restaurant", icon: "🍽️" },
      { value: "school", label: "School", icon: "🏫" },
      { value: "hospital", label: "Hospital", icon: "🏥" },
      { value: "park", label: "Park", icon: "🌳" },
      { value: "bank", label: "Bank", icon: "🏦" },
      { value: "gas-station", label: "Gas Station", icon: "⛽" },
      { value: "other", label: "Other", icon: "📍" },
  ]
  const transportations = nearbyPlaces?.filter(place => place.type === 'transportation')

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
          <Car className="w-5 h-5" />
          Transportation Options
        </CardTitle>
        <p className="text-sm text-gray-600">Add nearby transportation options for easy access</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing Places */}
        {transportations && transportations.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Added Places ({transportations.length}/3)</Label>
            <div className="space-y-2">
              {transportations.map((place) => (
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
        {transportations && transportations.length >= 3 ? (
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Maximum of 3 places of interest reached</p>
          </div>
        ) : !transportations || transportations.length === 0 ? (
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">No transportation options added yet</p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
