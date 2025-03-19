"use client"

import { UseFormReturn } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { formatCurrency } from "@/lib/utils"

interface PropertyPricingFormProps {
    form: UseFormReturn<any>
}

export const PropertyPricingForm = ({ form }: PropertyPricingFormProps) => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semiboldmb-4">Property Pricing</h2>
                <p className="text-muted-foreground mb-6">Set the pricing details for your property.</p>
            </div>

            <FormField
                control={form.control}
                name="pricePerSqm"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Price per Square Meter</FormLabel>
                        <FormControl>
                            <Input
                                type="number"
                                placeholder="e.g. 50000"
                                {...field}
                                onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                                className="border-orange-200 focus-visible:ring-orange-500"
                            />
                        </FormControl>
                        <FormDescription>Enter the price per square meter in PHP.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="totalContractPrice"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Total Contract Price</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="e.g. 5000000"
                                    {...field}
                                    onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                                    className="border-orange-200 focus-visible:ring-orange-500"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="netContractPrice"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Net Contract Price</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="e.g. 4800000"
                                    {...field}
                                    onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                                    className="border-orange-200 focus-visible:ring-orange-500"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <FormField
                control={form.control}
                name="totalSellingPrice"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Total Selling Price</FormLabel>
                        <FormControl>
                            <Input
                                type="number"
                                placeholder="e.g. 4500000"
                                {...field}
                                onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                                className="border-orange-200 focus-visible:ring-orange-500"
                            />
                        </FormControl>
                        <FormDescription>This is the final price you're offering to buyers.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <div className="space-y-6 bg-orange-50 p-4 rounded-lg border border-orange-100">
                <h3 className="font-medium text-orange-700">Payment Terms</h3>

                <FormField
                    control={form.control}
                    name="suggestedMonthlyAmortization"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Suggested Monthly Amortization</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="e.g. 30000"
                                    {...field}
                                    onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                                    className="border-orange-200 focus-visible:ring-orange-500 bg-white"
                                />
                            </FormControl>
                            <FormDescription>Recommended monthly payment amount.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="suggestedTermInMonths"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Term Length (Months): {field.value}</FormLabel>
                            <FormControl>
                                <Slider
                                    min={12}
                                    max={240}
                                    step={12}
                                    defaultValue={[field.value]}
                                    onValueChange={(value) => field.onChange(value[0])}
                                    className="[&>.bg-primary]:bg-orange-500"
                                />
                            </FormControl>
                            <div className="flex justify-between text-sm text-muted-foreground mt-2">
                                <span>1 year</span>
                                <span>20 years</span>
                            </div>
                            <FormDescription>Suggested length of payment term in months.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="mt-4 p-3 bg-white rounded border border-orange-200">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Total Payment Over Term</span>
                        <span className="font-bold text-orange-700">
                            {formatCurrency(form.getValues("suggestedMonthlyAmortization") * form.getValues("suggestedTermInMonths"))}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}