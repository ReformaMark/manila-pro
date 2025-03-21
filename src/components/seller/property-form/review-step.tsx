import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PropertyFormSchema } from "@/lib/validations/property"
import { UseFormReturn } from "react-hook-form"
import { z } from "zod"

interface ReviewStepDialogProps {
    form: UseFormReturn<z.infer<typeof PropertyFormSchema>>;
    isOpen: boolean;
    onChange: (open: boolean) => void;
}

export const ReviewStepDialog = ({ form, isOpen, onChange }: ReviewStepDialogProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onChange}>
            <DialogContent className="w-full h-[600px]">
                <DialogTitle>
                    <h2 className="text-xl font-semibold text-orange-800 mb-4">Review Your Property Listing</h2>
                    <p className="text-muted-foreground font-normal text-base mb-6">
                        Please review all the information below before submitting your property listing.
                    </p>
                </DialogTitle>
                <ScrollArea className="space-y-6">
                    <div className="mb-5">
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-medium text-orange-700 mb-2">Basic Information</h3>
                                <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <span className="text-sm text-muted-foreground">Property Name</span>
                                            <p className="font-medium">{form.getValues("propertyName")}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-muted-foreground">Property Type</span>
                                            <p className="font-medium capitalize">{form.getValues("unitType").replace(/-/g, " ")}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-muted-foreground">Bedrooms</span>
                                            <p className="font-medium">{form.getValues("bedrooms")}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-muted-foreground">Maximum Occupants</span>
                                            <p className="font-medium">{form.getValues("maximumOccupants")}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-medium text-orange-700 mb-2">Location</h3>
                                <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <span className="text-sm text-muted-foreground">Address</span>
                                            <p className="font-medium">{form.getValues("address")}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-muted-foreground">City</span>
                                            <p className="font-medium">{form.getValues("city")}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-muted-foreground">Block/Lot</span>
                                            <p className="font-medium">
                                                Block {form.getValues("block")}, Lot {form.getValues("lot")}
                                            </p>
                                        </div>
                                        {/* <div>
                                                            <span className="text-sm text-muted-foreground">Lot ID</span>
                                                            <p className="font-medium">{form.getValues("lotId")}</p>
                                                        </div> */}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-medium text-orange-700 mb-2">Property Details</h3>
                                <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <span className="text-sm text-muted-foreground">Lot Area</span>
                                            <p className="font-medium">{form.getValues("lotArea")} sqm</p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-muted-foreground">Transaction Type</span>
                                            <p className="font-medium">{form.getValues("transactionType")}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-muted-foreground">Status</span>
                                            <p className="font-medium capitalize">Available</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-medium text-orange-700 mb-2">Pricing</h3>
                                <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <span className="text-sm text-muted-foreground">Price per sqm</span>
                                            <p className="font-medium">
                                                {new Intl.NumberFormat("en-PH", {
                                                    style: "currency",
                                                    currency: "PHP",
                                                    maximumFractionDigits: 0,
                                                }).format(form.getValues("pricePerSqm"))}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-muted-foreground">Total Contract Price</span>
                                            <p className="font-medium">
                                                {new Intl.NumberFormat("en-PH", {
                                                    style: "currency",
                                                    currency: "PHP",
                                                    maximumFractionDigits: 0,
                                                }).format(form.getValues("totalContractPrice"))}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-muted-foreground">Net Contract Price</span>
                                            <p className="font-medium">
                                                {new Intl.NumberFormat("en-PH", {
                                                    style: "currency",
                                                    currency: "PHP",
                                                    maximumFractionDigits: 0,
                                                }).format(form.getValues("netContractPrice"))}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-muted-foreground">Total Selling Price</span>
                                            <p className="font-medium">
                                                {new Intl.NumberFormat("en-PH", {
                                                    style: "currency",
                                                    currency: "PHP",
                                                    maximumFractionDigits: 0,
                                                }).format(form.getValues("totalSellingPrice"))}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-muted-foreground">Suggested Monthly Amortization</span>
                                            <p className="font-medium">
                                                {new Intl.NumberFormat("en-PH", {
                                                    style: "currency",
                                                    currency: "PHP",
                                                    maximumFractionDigits: 0,
                                                }).format(form.getValues("suggestedMonthlyAmortization"))}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-muted-foreground">Term Length</span>
                                            <p className="font-medium">{form.getValues("suggestedTermInMonths")} month/s</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}