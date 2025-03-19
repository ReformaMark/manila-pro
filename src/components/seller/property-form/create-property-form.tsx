"use client"

import { PropertyFormSchema } from "@/lib/validations/property"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { PropertyBasicInfoForm } from "./property-basic-info-form"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import { PropertyLocationForm } from "./property-location-form"
import { PropertyDetailsForm } from "./property-details-form"
import { PropertyPricingForm } from "./property-pricing-form"

const steps = [
    { id: "basic-info", label: "Basic Info" },
    { id: "location", label: "Location" },
    { id: "details", label: "Property Details" },
    { id: "pricing", label: "Pricing" },
    { id: "images", label: "Images" },
    { id: "review", label: "Review" },
]

export const CreatePropertyForm = () => {
    const [currentStep, setCurrentStep] = useState(0)

    const form = useForm<z.infer<typeof PropertyFormSchema>>({
        resolver: zodResolver(PropertyFormSchema),
    })

    const getFieldsToValidate = (step: number) => {
        switch (step) {
            case 0: // Basic Info (1st Step)
                return ["propertyName", "unitType", "bedrooms", "maximumOccupants"]
            case 1: // Location (2nd Step)
                return ["address", "city", "block", "lot", "lotId"]
            case 2: // Details (3rd Step)
                return ["lotArea", "transactionType"]
            case 3: // Pricing (4th Step)
                return [
                    "pricePerSqm",
                    "totalContractPrice",
                    "netContractPrice",
                    "totalSellingPrice",
                    "suggestedMonthlyAmortization",
                    "suggestedTermInMonths",
                ]
            case 4: // Images (5th Step)
                return ["displayImage"]
            default:
                return []
        }
    }

    const nextStep = () => {
        const fieldsToValidate = getFieldsToValidate(currentStep) as (keyof z.infer<typeof PropertyFormSchema>)[]

        form.trigger(fieldsToValidate).then((isValid) => {
            if (isValid) {
                setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
            }
        })
    }

    const prevStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 0))
    }

    const onSubmit = async (data: z.infer<typeof PropertyFormSchema>) => {
        try {
            console.log("Submitting property data:", data)
        } catch (error) {
            console.error(error)
            toast.error("Error submitting property")
        }
    }

    return (
        <div className="space-y-8">
            <div className="hidden md:block">
                <div className="flex justify-between">
                    {steps.map((step, index) => (
                        <div key={step.id} className="flex flex-col items-center">
                            <div className={cn("border-2 border-zinc-400 text-zinc-400 rounded-full w-10 h-10 flex items-center justify-center",
                                index <= currentStep && "border-orange-500 text-orange-500"
                            )}>
                                {index + 1}
                            </div>

                            <span className={cn("text-zinc-400 flex items-center justify-center mt-1",
                                index <= currentStep && "border-orange-500 text-orange-500"
                            )}>
                                {step.label}
                            </span>
                            {index < steps.length - 1 && (
                                <div
                                    className={`absolute h-0.5 w-[calc(100%/6)] left-[calc(${index + 1}*100%/6-100%/12)] top-5 -z-10 ${index < currentStep ? "bg-orange-500" : "bg-gray-200"
                                        }`}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="md:hidden">
                <Tabs value={steps[currentStep].id} className="w-full">
                    <TabsList className="grid grid-cols-3 mb-4">
                        <TabsTrigger
                            value="basic-info"
                            disabled={currentStep !== 0}
                            className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                        >
                            Basic
                        </TabsTrigger>
                        <TabsTrigger
                            value="location"
                            disabled={currentStep !== 1}
                            className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                        >
                            Location
                        </TabsTrigger>
                        <TabsTrigger
                            value="details"
                            disabled={currentStep !== 2}
                            className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                        >
                            Details
                        </TabsTrigger>
                    </TabsList>
                    <TabsList className="grid grid-cols-3">
                        <TabsTrigger
                            value="pricing"
                            disabled={currentStep !== 3}
                            className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                        >
                            Pricing
                        </TabsTrigger>
                        <TabsTrigger
                            value="images"
                            disabled={currentStep !== 4}
                            className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                        >
                            Images
                        </TabsTrigger>
                        <TabsTrigger
                            value="review"
                            disabled={currentStep !== 5}
                            className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                        >
                            Review
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <Card className="border-orange-100 shadow-md">
                <CardContent className="pt-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {currentStep === 0 && <PropertyBasicInfoForm form={form} />}
                            {currentStep === 1 && <PropertyLocationForm form={form} />}
                            {currentStep === 2 && <PropertyDetailsForm form={form} />}
                            {currentStep === 3 && <PropertyPricingForm form={form} />}
                            {/* {currentStep === 4 && <PropertyImagesForm form={form} />} */}

                            {currentStep === 5 && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-xl font-semibold text-orange-800 mb-4">Review your property listings</h2>
                                        <p className="text-muted-foreground mb-6">
                                            Please review all the information below before submitting your property listing.
                                        </p>

                                        <div className="space-y-6">
                                            <div>

                                            </div>
                                        </div>

                                    </div>
                                </div>
                            )}

                            <div className="flex justify-between mt-8">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={prevStep}
                                    disabled={currentStep === 0}
                                    className="border-orange-200 text-orange-500"
                                >
                                    Back
                                </Button>

                                {currentStep < steps.length - 1 ? (
                                    <Button
                                        type="button"
                                        variant="orange"
                                        onClick={nextStep}
                                    >
                                        Next Step
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                    </Button>
                                ) : (
                                    <Button
                                        type="submit"
                                        variant="orange"
                                    // disabled={isSubmitting}
                                    >
                                        {/* {isSubmitting ? "Submitting..." : "Submit Property"} */}
                                        Submit Property
                                    </Button>
                                )}
                            </div>

                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div >
    )
}