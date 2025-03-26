"use client"

import { formatCurrency, formatDate } from "@/lib/utils";
import { BedDoubleIcon, HouseIcon, MapPin } from "lucide-react";
import Image from "next/image";
import { Doc } from "../../../convex/_generated/dataModel";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { Button, buttonVariants } from "../ui/button";
import Link from "next/link";

interface PropertyCardProps {
    property: Doc<"property">
    onViewDetails: () => void;
}

export const PropertyCard = ({
    onViewDetails,
    property,
}: PropertyCardProps) => {
    const statusColors = {
        available: "bg-green-100 text-green-800 hover:bg-green-200",
        reserved: "bg-amber-100 text-amber-800 hover:bg-amber-200",
        sold: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    }

    return (
        <Card className="overflow-hidden">
            <div className="relative h-48 w-full">
                <Image
                    src={property.displayImage}
                    alt={`${property.propertyName}'s display image`}
                    fill
                    className="object-cover"
                />
                {property.featured && (
                    <div className="absolute top-2 left-2">
                        <Badge className="capitalize bg-orange-400 hover:bg-orange-500">Featured</Badge>
                    </div>
                )}
                <div className="absolute top-2 right-2">
                    <Badge className={`${statusColors[property.status]} capitalize`}>{property.status}</Badge>
                </div>
            </div>

            <CardHeader className="pb-2">
                <CardTitle className="text-md line-clamp-1">{property.propertyName}</CardTitle>
                <CardDescription className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                    {property.address}
                </CardDescription>
            </CardHeader>

            <CardContent className="pb-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <HouseIcon className="w-4 h-4" />
                        {property.unitType}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <BedDoubleIcon className="w-4 h-4" />
                        {property.bedrooms} beds
                    </div>
                </div>

                <Separator className="my-2" />

                <div className="flex justify-between items-baseline">
                    {property.transactionType === "Rent" ? (
                        <div>
                            <p className="text-sm text-muted-foreground">Selling Price</p>
                            <p className="text-lg font-bold">{formatCurrency(property.totalSellingPrice)}/Month</p>
                        </div>
                    ) : (
                        <div>
                            <p className="text-sm text-muted-foreground">Selling Price</p>
                            <p className="text-lg font-bold">{formatCurrency(property.totalSellingPrice)}</p>
                        </div>
                    )}
                    <div className="text-right">
                        <p className="text-sm text-muted-foreground">Listed on</p>
                        <p className="text-sm">{formatDate(property.createdAt)}</p>
                    </div>
                </div>
            </CardContent>

            <CardFooter>
                <div className="flex gap-2 w-full">
                    <Link
                        href={`/seller/properties/edit/${property._id}`}
                        className={buttonVariants({
                            variant: "outline",
                            className: "flex-1"
                        })}
                    >
                        Edit Property
                    </Link>

                    <Button variant="orange" className="flex-1" onClick={onViewDetails}>
                        View Details
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
}