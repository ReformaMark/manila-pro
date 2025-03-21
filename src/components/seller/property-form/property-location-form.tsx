"use client"

import { UseFormReturn } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PropertyLocationFormProps {
    form: UseFormReturn<any>
}

export const PropertyLocationForm = ({ form }: PropertyLocationFormProps) => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold mb-4">Property Location</h2>
                <p className="text-muted-foreground mb-6">Provide the location details of your property.</p>
            </div>

            <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Complete Address</FormLabel>
                        <FormControl>
                            <Input
                                placeholder="e.g. 123 Main Street, Barangay San Lorenzo"
                                {...field}
                                className="border-orange-200 focus-visible:ring-orange-500"
                            />
                        </FormControl>
                        <FormDescription>Enter the complete street address of the property.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>City</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger className="border-orange-200 focus:ring-orange-500">
                                    <SelectValue placeholder="Select city" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Makati">Makati</SelectItem>
                                <SelectItem value="Pasay">Pasay</SelectItem>
                                <SelectItem value="Taguig">Taguig</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                    control={form.control}
                    name="block"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Block</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. 12" {...field} className="border-orange-200 focus-visible:ring-orange-500" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="lot"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Lot</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. 5" {...field} className="border-orange-200 focus-visible:ring-orange-500" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* <FormField
                    control={form.control}
                    name="lotId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Lot ID</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="e.g. L-123"
                                    {...field}
                                    className="border-orange-200 focus-visible:ring-orange-500"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                /> */}
            </div>
        </div>
    )
}
