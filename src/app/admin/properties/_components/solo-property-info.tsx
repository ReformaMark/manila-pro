"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { Loader2, MapIcon, PinIcon } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import { BadgeStatus } from "@/components/badge-status";
import { formatDate, formatPrice } from "@/lib/utils";
import { PropertyColumns } from "./property-columns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SoloPropertyInfoProps {
  propertyId: Id<"property">;
}

export const SoloPropertyInfo = ({ propertyId }: SoloPropertyInfoProps) => {
  const property = useQuery(api.property.getPropertyByIdWithDeals, {
    id: propertyId,
  });

  if (property === undefined || !property)
    return <Loader2 className="w-6 h-6 animate-spin" />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{property.propertyName}</CardTitle>
          <CardDescription className="flex flex-row items-center gap-1">
            <MapIcon className="w-4 h-4" />
            {property.address}, Blk {property.block}, Lot {property.lot}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-start">
            <div className="w-full">
              <AspectRatio ratio={16 / 9}>
                <Image
                  src={property.displayImageUrl || "/next.svg"}
                  alt={property.propertyName}
                  className="rounded-md object-cover"
                  fill
                />
              </AspectRatio>
            </div>
          </div>

          <div className="grid grid-cols-2 mt-6 pl-1">
            <div className="space-y-5">
              <div>
                <h1 className="text-sm text-muted-foreground">Status</h1>
                <BadgeStatus status={property.status} />
              </div>

              <div>
                <h1 className="text-sm text-muted-foreground">Listed on</h1>
                <p>{formatDate(property.createdAt)}</p>
              </div>
            </div>
            <div className="space-y-5">
              <div>
                <h1 className="text-sm text-muted-foreground">City</h1>
                <p>{property.city}</p>
              </div>

              <div>
                <h1 className="text-sm text-muted-foreground">Last updated</h1>
                <p>{formatDate(property.updatedAt)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Property Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-7 space-y-7 h-fit">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h1 className="text-sm text-zinc-600">Price</h1>
              <p>{formatPrice(property.totalSellingPrice)}</p>
            </div>

            <div>
              <h1 className="text-sm text-zinc-600">Price per sqm</h1>
              <p>{formatPrice(property.pricePerSqm)}</p>
            </div>

            <div>
              <h1 className="text-sm text-zinc-600">Property Type</h1>
              <p>{property.unitType}</p>
            </div>

            <div>
              <h1 className="text-sm text-zinc-600">Lot Area</h1>
              <p>{property.lotArea} sqm</p>
            </div>

            <div>
              <h1 className="text-sm text-zinc-600">Bedrooms</h1>
              <p>{property.bedrooms}</p>
            </div>

            <div>
              <h1 className="text-sm text-zinc-600">Bathrooms</h1>
              <p>{property.bathrooms}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-sm text-zinc-600">Description</h1>
            <p>{property.description}</p>
          </div>

          <div>
            <p className="text-zinc-600 text-sm">Listed By</p>
            {property.seller ? (
              <div className="flex flex-row gap-3">
                <Avatar>
                  <AvatarFallback className="bg-zinc-300/70">
                    {property.seller.fname.charAt(0)}
                  </AvatarFallback>
                  <AvatarImage src={property.seller.image} />
                </Avatar>
                <div className="text-sm">
                  <h1>
                    {property.seller.fname} {property.seller.lname}
                  </h1>
                  {property.seller.agentInfo ? (
                    <p className="text-zinc-500">
                      {property.seller.agentInfo.title}
                    </p>
                  ) : (
                    <p className="text-zinc-500">No title found</p>
                  )}
                </div>
              </div>
            ) : (
              <h1>No Seller Found</h1>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
