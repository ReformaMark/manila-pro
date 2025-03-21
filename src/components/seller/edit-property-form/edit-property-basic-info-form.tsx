"use client"

import { UseFormReturn } from "react-hook-form"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bath, BedDoubleIcon, StarIcon, Users2 } from "lucide-react"
import { z } from "zod"
import { PropertyFormSchema } from "@/lib/validations/property"
import { Switch } from "@/components/ui/switch"

interface EditPropertyBasicInfoFormProps {
    form: UseFormReturn<z.infer<typeof PropertyFormSchema>>
}

export const EditPropertyBasicInfoForm = ({ form }: EditPropertyBasicInfoFormProps) => {
    const propertyTypes = [
        "apartment",
        "condominium",
        "duplex",
        "single-attached-house",
        "single-detached-house",
        "townhouse",
    ]

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold mb-4">Basic Property Information</h2>
                <p className="text-muted-foreground mb-6">Start by providing the basic details about your property.</p>
            </div>

            <FormField
                control={form.control}
                name="propertyName"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Property Name</FormLabel>
                        <FormControl>
                            <Input
                                placeholder="e.g. Modern Condominium in Makati City"
                                {...field}
                                className="border-orange-200 focus-visible:ring-orange-500"
                            />
                        </FormControl>
                        <FormDescription>Create a descriptive name that highlights key features of your property.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="unitType"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Property Type</FormLabel>
                        <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                        >
                            <FormControl>
                                <SelectTrigger className="border-orange-200 focus-visible:ring-orange-500">
                                    <SelectValue placeholder="Select property type" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {propertyTypes.map((type) => (
                                    <SelectItem key={type} value={type}>
                                        {type.replace(/-/g, " ")}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormDescription>Select the type of property you are listing.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                    control={form.control}
                    name="bedrooms"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-2">
                                <BedDoubleIcon className="w-4 h-4" />
                                Number of Bedrooms
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="e.g. 3"
                                    {...field}
                                    className="border-orange-200 focus-visible:ring-orange-500"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="bathrooms"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-2">
                                <Bath className="w-4 h-4" />
                                Number of Bathrooms
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="e.g. 2"
                                    {...field}
                                    className="border-orange-200 focus-visible:ring-orange-500"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="maximumOccupants"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-2">
                                <Users2 className="w-4 h-4" />
                                Number of Occupants
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    placeholder="e.g. 4-6"
                                    {...field}
                                    className="border-orange-200 focus-visible:ring-orange-500"
                                />
                            </FormControl>
                            <FormDescription>Recommended number of occupants.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <FormField
                    control={form.control}
                    name="featured"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-2">
                                <StarIcon className="w-4 h-4" />
                                Featured
                            </FormLabel>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <FormDescription>Features the property</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    )
}