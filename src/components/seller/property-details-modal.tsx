import { formatCurrency, formatDate } from "@/lib/utils";
import { BathIcon, BedDouble, Calendar, Home, MapPin, Ruler, Users } from "lucide-react";
import { Doc } from "../../../convex/_generated/dataModel";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { PropertyImageGallery } from "./property-image-gallery";

interface PropertyDetailsModalProps {
    property: Doc<"property">
    isOpen: boolean
    onClose: () => void;
}

export const PropertyDetailsModal = ({
    isOpen,
    onClose,
    property,
}: PropertyDetailsModalProps) => {
    const statusColors = {
        available: "bg-green-100 text-green-800 hover:bg-green-200",
        reserved: "bg-amber-100 text-amber-800 hover:bg-amber-200",
        sold: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-xl">{property.propertyName}</DialogTitle>
                        <Badge className={`${statusColors[property.status]} capitalize`}>{property.status}</Badge>
                    </div>
                    <DialogDescription className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {property.address} {property.city}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <PropertyImageGallery
                        displayImage={property.displayImage}
                        otherImages={property.otherImage || []}
                        propertyName={property.propertyName}
                    />
                </div>

                <Tabs defaultValue="details">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="details">Property Details</TabsTrigger>
                        <TabsTrigger value="pricing">Pricing</TabsTrigger>
                        <TabsTrigger value="transaction">Transaction</TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="space-y-4 pt-4">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <div className="flex flex-col">
                                <span className="text-sm text-muted-foreground">Property Type</span>
                                <span className="font-medium flex items-center">
                                    <Home className="h-4 w-4 mr-1 text-muted-foreground" />
                                    {property.unitType}
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm text-muted-foreground">Bedroom/s</span>
                                <span className="font-medium flex items-center">
                                    <BedDouble className="h-4 w-4 mr-1 text-muted-foreground" />
                                    {property.bedrooms ?? "N/A"}
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm text-muted-foreground">Bathroom/s</span>
                                <span className="font-medium flex items-center">
                                    <BathIcon className="h-4 w-4 mr-1 text-muted-foreground" />
                                    {property.bathrooms ?? "N/A"}
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm text-muted-foreground">Lot Area</span>
                                <span className="font-medium flex items-center">
                                    <Ruler className="h-4 w-4 mr-1 text-muted-foreground" />
                                    {property.lotArea} sqm
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm text-muted-foreground">Max Occupants</span>
                                <span className="font-medium flex items-center">
                                    <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                                    {property.maximumOccupants}
                                </span>
                            </div>
                        </div>

                        <Separator />

                        <div>
                            <h3 className="font-medium mb-2">Location Details</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-sm text-muted-foreground">Block</span>
                                    <p>{property.block}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-muted-foreground">Lot</span>
                                    <p>{property.lot}</p>
                                </div>
                                {/* <div>
                                    <span className="text-sm text-muted-foreground">Lot ID</span>
                                    <p>{property.lotId}</p>
                                </div> */}
                                <div>
                                    <span className="text-sm text-muted-foreground">City</span>
                                    <p>{property.city}</p>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div>
                            <h3 className="font-medium mb-2">Listing Information</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-sm text-muted-foreground">Listed On</span>
                                    <p className="flex items-center">
                                        <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                                        {formatDate(property.createdAt)}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-sm text-muted-foreground">Last Updated</span>
                                    <p>{property.updatedAt ? formatDate(property.updatedAt) : "Not updated"}</p>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="pricing" className="space-y-4 pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-muted1 p-4 rounded-lg">
                                <h3 className="font-medium mb-2">Price Breakdown</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Price per sqm</span>
                                        <span className="font-medium">{formatCurrency(property.pricePerSqm)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Total Contract Price</span>
                                        <span className="font-medium">{formatCurrency(property.totalContractPrice)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Net Contract Price</span>
                                        <span className="font-medium">{formatCurrency(property.netContractPrice)}</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between">
                                        <span className="font-medium">Total Selling Price</span>
                                        <span className="font-bold text-lg">{formatCurrency(property.totalSellingPrice)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-muted1 p-4 rounded-lg">
                                <h3 className="font-medium mb-2">Suggested Payment Terms</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Monthly Amortization</span>
                                        <span className="font-medium">{formatCurrency(property.suggestedMonthlyAmortization)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Term Length</span>
                                        <span className="font-medium">{property.suggestedTermInMonths} months</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Total Payment</span>
                                        <span className="font-medium">
                                            {formatCurrency(property.suggestedMonthlyAmortization * property.suggestedTermInMonths)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="transaction" className="space-y-4 pt-4">
                        <div className="bg-muted1 p-4 rounded-lg">
                            <h3 className="font-medium mb-2">Transaction Details</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Transaction Type</span>
                                    <span className="font-medium">{property.transactionType}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Current Status</span>
                                    <Badge className={`${statusColors[property.status]} capitalize`}>{property.status}</Badge>
                                </div>
                            </div>
                        </div>

                        {property.status === "available" && (
                            <div className="flex justify-end gap-2">
                                <Button variant="outline">Mark as Reserved</Button>
                                <Button variant="outline">Mark as Sold</Button>
                            </div>
                        )}

                        {property.status === "reserved" && (
                            <div className="flex justify-end gap-2">
                                <Button variant="outline">Mark as Available</Button>
                                <Button variant="outline">Mark as Sold</Button>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                    <Button variant="orange">Edit Property</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}