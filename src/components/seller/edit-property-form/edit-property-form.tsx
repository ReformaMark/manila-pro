"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { PropertyFormSchema } from "@/lib/validations/property"
import { useConvexMutation } from "@convex-dev/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { api } from "../../../../convex/_generated/api"
import { Id } from "../../../../convex/_generated/dataModel"
import { useQuery } from "convex/react"
import Loading from "@/components/loading"
import { EditPropertyBasicInfoForm } from "./edit-property-basic-info-form"
import { EditPropertyLocationForm } from "./edit-property-location-form"
import { EditPropertyDetailsForm } from "./edit-property-details-form"
import { EditPropertyPricingForm } from "./edit-property-pricing-form"
import { EditPropertyImagesForm } from "./edit-property-images-form"
import { useConfirm } from "@/hooks/use-confirm"
// import { PropertyBasicInfoForm } from "./property-basic-info-form"
// import { PropertyDetailsForm } from "./property-details-form"
// import { PropertyImagesForm } from "./property-images-form"
// import { PropertyLocationForm } from "./property-location-form"
// import { PropertyPricingForm } from "./property-pricing-form"

const steps = [
    { id: "basic-info", label: "Basic Info" },
    { id: "location", label: "Location" },
    { id: "details", label: "Property Details" },
    { id: "pricing", label: "Pricing" },
    { id: "images", label: "Images" },
]

interface EditPropertyFormProps {
    params: {
        propertyId: Id<'property'>
    }
}

export const EditPropertyForm = ({ params }: EditPropertyFormProps) => {
    const [currentStep, setCurrentStep] = useState(0)
    const [displayImagePreview, setDisplayImagePreview] = useState<string | null>(null)
    const [otherImagePreviews, setOtherImagePreviews] = useState<string[]>([])
    const [ConfirmDialog, confirm] = useConfirm(
        "Edit property",
        "Please double check and review your property details to avoid errors and transaction failures"
    )

    const router = useRouter()

    const property = useQuery(api.property.getPropertyByIdSeller, {
        id: params.propertyId
    })

    const { mutate: updateProperty, isPending } = useMutation({
        mutationFn: useConvexMutation(api.property.update)
    })

    const form = useForm<z.infer<typeof PropertyFormSchema>>({
        resolver: zodResolver(PropertyFormSchema),
        defaultValues: property ? {
            ...property,
            displayImage: property.displayImage || undefined,
            otherImage: property.otherImage?.map(img => img || undefined)
        } : {}
    })

    console.log(form.watch())

    useEffect(() => {
        if (property) {
            const formattedProperty = {
                ...property,
                displayImage: property.displayImage || undefined,
                otherImage: property.otherImage?.map(img => img || undefined)
            }
            form.reset(formattedProperty)
        }
    }, [property, form])

    const getFieldsToValidate = (step: number) => {
        switch (step) {
            case 0: // Basic Info (1st Step)
                return ["propertyName", "unitType", "bedrooms", "maximumOccupants", "bathrooms", "featured"]
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
        if (currentStep !== 4) return;
        const confirmed = await confirm()

        if (confirmed) {
            try {
                await updateProperty({
                    ...data,
                    id: property?._id as Id<"property">,
                })
                // await new Promise((resolve) => setTimeout(resolve, 1500))

                router.push("/seller/properties")
                router.refresh()
            } catch (error) {
                console.error("Error submitting property:", error)
            }
        }


    }

    if (!property) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loading />
            </div>
        )
    }

    return (
        <>
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
                        <TabsList className="grid grid-cols-2">
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
                            {/* <TabsTrigger
                            value="review"
                            disabled={currentStep !== 5}
                            className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                        >
                            Review
                        </TabsTrigger> */}
                        </TabsList>
                    </Tabs>
                </div>

                <Card className="border-orange-100 shadow-md">
                    <CardContent className="pt-6">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                {currentStep === 0 && <EditPropertyBasicInfoForm form={form} />}
                                {currentStep === 1 && <EditPropertyLocationForm form={form} />}
                                {currentStep === 2 && <EditPropertyDetailsForm form={form} />}
                                {currentStep === 3 && <EditPropertyPricingForm form={form} />}
                                {currentStep === 4 && (
                                    <EditPropertyImagesForm
                                        form={form}
                                        displayImagePreview={displayImagePreview}
                                        setDisplayImagePreview={setDisplayImagePreview}
                                        otherImagePreviews={otherImagePreviews}
                                        setOtherImagePreviews={setOtherImagePreviews}
                                    />
                                )}

                                <div className="flex justify-between mt-8">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={prevStep}
                                        disabled={currentStep === 0}
                                        className="border-orange-200 text-orange-700 hover:bg-orange-50"
                                    >
                                        Back
                                    </Button>

                                    {currentStep < 4 ? (
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
                                        // disabled={isPending}
                                        >
                                            {/* {isPending ? "Submitting..." : "Submit Property"} */}
                                            Submit
                                        </Button>
                                    )}

                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>

            <ConfirmDialog />
        </>
    )
}