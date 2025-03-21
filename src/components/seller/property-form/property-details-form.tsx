"use client"

import { UseFormReturn } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface PropertyDetailsFormProps {
    form: UseFormReturn<any>
}

export const PropertyDetailsForm = ({ form }: PropertyDetailsFormProps) => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold mb-4">Property Details</h2>
                <p className="text-muted-foreground mb-6">Provide specific details about your property.</p>
            </div>

            <FormField
                control={form.control}
                name="lotArea"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Lot Area (sqm)</FormLabel>
                        <FormControl>
                            <Input
                                type="number"
                                placeholder="e.g. 120"
                                {...field}
                                onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                                className="border-orange-200 focus-visible:ring-orange-500"
                            />
                        </FormControl>
                        <FormDescription>Enter the total lot area in square meters.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="transactionType"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Transaction Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger className="border-orange-200 focus:ring-orange-500">
                                    <SelectValue placeholder="Select transaction type" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Buy">Buy</SelectItem>
                                <SelectItem value="Rent">Rent (Month to Month)</SelectItem>
                                <SelectItem value="Lease">Lease (Long Term)</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormDescription>Select how you want to sell or rent your property.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Property Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger className="border-orange-200 focus:ring-orange-500">
                                    <SelectValue placeholder="Select property status" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="available">Available</SelectItem>
                                <SelectItem value="reserved">Reserved</SelectItem>
                                <SelectItem value="sold">Sold</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormDescription>Set the current status of your property.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            /> */}

            <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Property Description (Optional)</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder="Describe your property in detail..."
                                className="min-h-32 border-orange-200 focus-visible:ring-orange-500"
                                {...field}
                            />
                        </FormControl>
                        <FormDescription>
                            Add any additional details that might help buyers understand your property better.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    )
}

