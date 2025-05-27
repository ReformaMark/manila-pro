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
import { useQuery } from "convex/react"
import { api } from "../../../../../convex/_generated/api"

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

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     if (name && category && distance && coordinates.lat && coordinates.lng) {
//       onAddPlace({
//         name,
//         category,
//         distance: Number.parseFloat(distance),
//         coordinates,
//         propertyId: "",
//       })
//       setName("")
//       setCategory("")
//       setDistance("")
//       setCoordinates({ lat: 0, lng: 0 })
//     }
//   }

//   const handleRemovePlace = (placeId: string) => {
//     // In a real app, this would call an API to remove the place
//     console.log("Remove place:", placeId)
//   }

  const getCategoryIcon = (categoryValue: string) => {
    return categories.find((cat) => cat.value === categoryValue)?.icon || "📍"
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
                  <Button variant="ghost" size="sm" onClick={() => {}} className="h-8 w-8 p-0">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add New Place Form */}
        {transportations && transportations.length < 3 && (
          <form onSubmit={()=>{}} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="place-name">Place Name</Label>
              <Input
                id="place-name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., SM Mall of Asia"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="place-category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      <div className="flex items-center gap-2">
                        <span>{cat.icon}</span>
                        <span>{cat.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-2">
                <Label htmlFor="distance">Distance (km)</Label>
                <Input
                  id="distance"
                  type="number"
                  step="0.1"
                  value={formData.distance}
                  onChange={(e) => setFormData((prev) => ({ ...prev, distance: e.target.value }))}
                  placeholder="0.5"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lat">Latitude</Label>
                <Input
                  id="lat"
                  type="number"
                  step="any"
                  value={formData.coordinates.lat || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, coordinates: { ...prev.coordinates, lat: Number.parseFloat(e.target.value) || 0 }}))}
                  placeholder="14.5547"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lng">Longitude</Label>
                <Input
                  id="lng"
                  type="number"
                  step="any"
                  value={formData.coordinates.lng || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, coordinates: { ...prev.coordinates, lng: Number.parseFloat(e.target.value) || 0 }}))}
                  placeholder="121.0244"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Place of Interest
            </Button>
          </form>
        )}

        {transportations && transportations.length >= 3 && (
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Maximum of 3 places of interest reached</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
