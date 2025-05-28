'use client'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus } from 'lucide-react'
import React from 'react'
import { Id } from '../../../../../convex/_generated/dataModel'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../../../../convex/_generated/api'
import { toast } from 'sonner'


interface FormaDataTypes {
    name: string;
    category: string;
    distance: string;
    travelTime: string;
    propertyId: Id<"property">;
}

type Category = {
    value: string;
    label: string;
    icon: string;
}
interface AddPlaceDialogProps {
    addingNearbyPlaces: boolean;
    setAddingNearbyPlaces: (value: boolean) => void;
    placesOfInterestDialog: boolean;
    setPlacesOfInterestDialog: (value: boolean) => void;
    formData: FormaDataTypes;
    setFormData: (value: FormaDataTypes | ((prev: FormaDataTypes) => FormaDataTypes)) => void;
    categories: Category[];
    selectedNearbyPlace: [number, number];
    setSelectedNearbyPlace: (value: [number, number] | null) => void;
}

function AddPlaceDialog({
    addingNearbyPlaces,
    setAddingNearbyPlaces,
    placesOfInterestDialog,
    setPlacesOfInterestDialog,
    formData,
    setFormData,
    categories,
    selectedNearbyPlace,
    setSelectedNearbyPlace,
}: AddPlaceDialogProps) {
    const nearbyPlaces = useQuery(api.nearby_places.nearbyPlaces,{propertyId: formData.propertyId})
    const saveNearbyPlace = useMutation(api.nearby_places.addNearbyPlace)

    const handleCancel = () =>{
        setAddingNearbyPlaces(false)
        setSelectedNearbyPlace(null)
    }
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        
        if (addingNearbyPlaces && selectedNearbyPlace && formData.name && formData.category && formData.distance) {
            // Check if we've reached the maximum number of places
            const transportationPlaces = nearbyPlaces?.filter(place => place.type === 'transportation') || []
            const otherPlaces = nearbyPlaces?.filter(place => place.type !== 'transportation') || []
            
            const isTransportation = formData.category === 'transportation'
            const currentTypeCount = isTransportation ? transportationPlaces.length : otherPlaces.length
            
            if (currentTypeCount >= 3) {
                toast.error(`Maximum number of ${isTransportation ? 'transportation' : 'other'} places reached (3)`)
                return
            }

            toast.promise(saveNearbyPlace({
                propertyId: formData.propertyId,
                name: formData.name,
                type: formData.category,
                coordinates: selectedNearbyPlace,
                distance: parseFloat(formData.distance),
                travelTime: formData.travelTime,
            }), {
                loading: 'Adding place of interest...',
                success: 'Place of interest added successfully!',
                error: 'Failed to add place of interest. Please try again.'
            })
            setAddingNearbyPlaces(false)
            setSelectedNearbyPlace(null)
            setFormData((prev) => ({ ...prev, name: '', category: '', distance: '', travelTime: '' }))
        }
    }
  return (
    <Dialog open={placesOfInterestDialog}>
        <DialogContent className="sm:max-w-[425px] z-[10000]">
            <DialogHeader>
            <DialogTitle>Add Place of Interest</DialogTitle>
            <DialogDescription>
                Add details about the nearby place of interest.
            </DialogDescription>
            </DialogHeader>
            <form className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="place-name">Place Name</Label>
                <Input
                id="place-name"
                value={formData.name}
                onChange={(e) => setFormData((prev: FormaDataTypes) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., SM Mall of Asia"
                required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="place-category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData((prev: FormaDataTypes) => ({ ...prev, category: value }))} required>
                <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className='z-[10000]'>
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

            <div className="grid grid-cols-1 gap-2">
                <div className="space-y-2">
                <Label htmlFor="distance">Distance (km)</Label>
                <Input
                    id="distance"
                    type="number"
                    step="0.1"
                    value={formData.distance}
                    onChange={(e) => setFormData((prev: FormaDataTypes) => ({ ...prev, distance: e.target.value }))}
                    placeholder="0.5"
                    required
                />
                </div>
                <div className="space-y-2">
                <Label htmlFor="travelTime">Travel Time (min)</Label>
                <Input
                    id="travelTime"
                    type="number"
                    step="0.1"
                    value={formData.travelTime}
                    onChange={(e) => setFormData((prev: FormaDataTypes) => ({ ...prev, travelTime: e.target.value }))}
                    placeholder="30"
                    required
                />
                </div>
            </div>

            <DialogFooter>
                <Button type="button" onClick={handleSubmit}>
                    <Plus className="w-4 h-4 mr-2" />
                     Add Place of Interest
                </Button>
                <Button type="button" onClick={handleCancel}>
                    <Plus className="w-4 h-4 mr-2" />
                    Cancel
                </Button>
            </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
  )
}

export default AddPlaceDialog