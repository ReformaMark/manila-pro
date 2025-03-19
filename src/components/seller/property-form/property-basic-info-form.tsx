"use client"

import { UseFormReturn } from "react-hook-form"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PropertyBasicInfoFormProps {
    form: UseFormReturn<any>
}

export const PropertyBasicInfoForm = ({ form }: PropertyBasicInfoFormProps) => {
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="bedrooms"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Number of Bedrooms</FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
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
                            <FormLabel>Maximum Occupants</FormLabel>
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
        </div>
    )
}