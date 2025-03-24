"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { PropertyFormSchema } from "@/lib/validations/property"
import { commonAmenities, commonFacilities } from "@/types/common-amenities"
import { Building2Icon, PlusIcon, SparklesIcon, Trash2Icon } from "lucide-react"
import { useState } from "react"
import { UseFormReturn } from "react-hook-form"
import { z } from "zod"

interface PropertyAmenitiesFormProps {
    form: UseFormReturn<z.infer<typeof PropertyFormSchema>>
}

export const PropertyAmenitiesForm = ({ form }: PropertyAmenitiesFormProps) => {
    const [newAmenity, setNewAmenity] = useState({ name: "", description: "" })
    const [newFacility, setNewFacility] = useState({ name: "", description: "" })

    const addAmenity = () => {
        if (!newAmenity.name.trim()) return

        const currentAmenities = form.getValues("amenities") || []
        form.setValue("amenities", [...currentAmenities, { ...newAmenity }])
        setNewAmenity({ name: "", description: "" })
    }

    const removeAmenity = (index: number) => {
        const currentAmenities = form.getValues("amenities") || []
        const updatedAmenities = [...currentAmenities]
        updatedAmenities.splice(index, 1)
        form.setValue("amenities", updatedAmenities)
    }

    const quickAddAmenity = (name: string) => {
        const currentAmenities = form.getValues("amenities") || []

        if (!currentAmenities.some((a) => a.name === name)) {
            form.setValue("amenities", [...currentAmenities, { name, description: "" }])
        }
    }

    const addFacility = () => {
        if (!newFacility.name.trim()) return

        const currentFacilities = form.getValues("facilities") || []
        form.setValue("facilities", [...currentFacilities, { ...newFacility }])
        setNewFacility({ name: "", description: "" })
    }

    const removeFacility = (index: number) => {
        const currentFacilities = form.getValues("facilities") || []
        const updatedFacilities = [...currentFacilities]
        updatedFacilities.splice(index, 1)
        form.setValue("facilities", updatedFacilities)
    }

    const quickAddFacility = (name: string) => {
        const currentFacilities = form.getValues("facilities") || []

        if (!currentFacilities.some((a) => a.name === name)) {
            form.setValue("facilities", [...currentFacilities, { name, description: "" }])
        }
    }

    return (
        <div className="space-y-6">
            <div className="text-xl font-semibold">Amenities & Facilities</div>
            <p className="text-muted-foreground text-sm">Add amenities and facilities available at your property to attract potential buyers.</p>

            <Tabs defaultValue="amenities" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="amenities">
                        <SparklesIcon className="h-4 w-4 mr-2" />
                        Amenities
                    </TabsTrigger>
                    <TabsTrigger value="facilities">
                        <Building2Icon className="h-4 w-4 mr-2" />
                        Facilities
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="amenities">
                    <div>
                        <h3 className="text-sm font-medium text-orange-700 mb-2">Quick Add Common Amenities</h3>
                        <div className="flex flex-wrap gap-2 mb-6">
                            {commonAmenities.map((amenity) => (
                                <Button
                                    key={amenity}
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => quickAddAmenity(amenity)}
                                    className="border-orange-200 text-orange-700 hover:bg-orange-50  hover:text-orange-500"
                                >
                                    <PlusIcon className="h-3 w-3 mr-1" />
                                    {amenity}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <Card className="border-orange-200 mb-6">
                        <CardHeader>
                            <CardTitle>Add New Amenity</CardTitle>
                            <CardDescription>Highlight the amenities that your property has</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4">
                                <div className="grid grid-cols-1 gap-3">
                                    <div>
                                        <label htmlFor="amenity-name" className="text-sm font-medium">
                                            Amenity Name
                                        </label>
                                        <Input
                                            id="amenity-name"
                                            value={newAmenity.name}
                                            onChange={(e) => setNewAmenity({ ...newAmenity, name: e.target.value })}
                                            placeholder="e.g. Swimming Pool"
                                            className="mt-1 border-orange-200 focus-visible:ring-orange-500"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="amenity-description" className="text-sm font-medium">
                                            Description (Optional)
                                        </label>
                                        <Textarea
                                            id="amenity-description"
                                            value={newAmenity.description}
                                            onChange={(e) => setNewAmenity({ ...newAmenity, description: e.target.value })}
                                            placeholder="Describe the amenity..."
                                            className="mt-1 min-h-20 border-orange-200 focus-visible:ring-orange-500"
                                        />
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600"
                                    onClick={addAmenity}
                                >
                                    <PlusIcon className="h-4 w-4 mr-2" /> Add Amenity
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <FormField
                        control={form.control}
                        name="amenities"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Added Amenities</FormLabel>
                                <FormControl>
                                    <div className="space-y-2">
                                        {field.value?.length > 0 ? (
                                            field.value.map((amenity: any, index: number) => (
                                                <div
                                                    key={index}
                                                    className="flex items-start justify-between p-3 bg-orange-50 rounded-md border border-orange-100"
                                                >
                                                    <div>
                                                        <p className="font-medium">{amenity.name}</p>
                                                        {amenity.description && (
                                                            <p className="text-sm text-muted-foreground mt-1">{amenity.description}</p>
                                                        )}
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeAmenity(index)}
                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        <Trash2Icon className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-sm text-muted-foreground py-2">No amenities added yet.</p>
                                        )}
                                    </div>
                                </FormControl>
                                <FormDescription>List of amenities that will be displayed to potential buyers.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </TabsContent>

                <TabsContent value="facilities">
                    <div>
                        <h3 className="text-sm font-medium text-orange-700 mb-2">Quick Add Common Facilities</h3>
                        <div className="flex flex-wrap gap-2 mb-6">
                            {commonFacilities.map((facility) => (
                                <Button
                                    key={facility}
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => quickAddFacility(facility)}
                                    className="border-orange-200 text-orange-700 hover:bg-orange-50  hover:text-orange-500"
                                >
                                    <PlusIcon className="h-3 w-3 mr-1" />
                                    {facility}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <Card className="border-orange-200 mb-6">
                        <CardHeader>
                            <CardTitle>Add New Facility</CardTitle>
                            <CardDescription>Highlight the facilities that your property has</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4">
                                <div className="grid grid-cols-1 gap-3">
                                    <div>
                                        <label htmlFor="facility-name" className="text-sm font-medium">
                                            Facility Name
                                        </label>
                                        <Input
                                            id="facility-name"
                                            value={newFacility.name}
                                            onChange={(e) => setNewFacility({ ...newFacility, name: e.target.value })}
                                            placeholder="e.g. Parking"
                                            className="mt-1 border-orange-200 focus-visible:ring-orange-500"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="facility-description" className="text-sm font-medium">
                                            Description (Optional)
                                        </label>
                                        <Textarea
                                            id="facility-description"
                                            value={newFacility.description}
                                            onChange={(e) => setNewFacility({ ...newFacility, description: e.target.value })}
                                            placeholder="Describe the facility..."
                                            className="mt-1 min-h-20 border-orange-200 focus-visible:ring-orange-500"
                                        />
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600"
                                    onClick={addFacility}
                                >
                                    <PlusIcon className="h-4 w-4 mr-2" /> Add Amenity
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <FormField
                        control={form.control}
                        name="facilities"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Added Facilities</FormLabel>
                                <FormControl>
                                    <div className="space-y-2">
                                        {field.value?.length > 0 ? (
                                            field.value.map((facility: any, index: number) => (
                                                <div
                                                    key={index}
                                                    className="flex items-start justify-between p-3 bg-orange-50 rounded-md border border-orange-100"
                                                >
                                                    <div>
                                                        <p className="font-medium">{facility.name}</p>
                                                        {facility.description && (
                                                            <p className="text-sm text-muted-foreground mt-1">{facility.description}</p>
                                                        )}
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeFacility(index)}
                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        <Trash2Icon className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-sm text-muted-foreground py-2">No amenities added yet.</p>
                                        )}
                                    </div>
                                </FormControl>
                                <FormDescription>List of amenities that will be displayed to potential buyers.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </TabsContent>
            </Tabs>
        </div>
    )
}