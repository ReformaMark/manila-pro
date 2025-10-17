"use client";
import { PropertyTypesWithImageUrls } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Check, Heart, PlusSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PropertyDetails } from "./PropertyDetails";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { usePropertyCompareStore } from "@/store/property-compare-store";

interface PropertyCardProps {
  property: PropertyTypesWithImageUrls;
  onClick: () => void;
  layout?: "grid" | "list";
}
export function PropertyCard({
  property,
  onClick,
  layout = "grid",
}: PropertyCardProps) {
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const { selectedProperties, addProperty, removeProperty } =
    usePropertyCompareStore();

  const onSelect = () => {
    const isAlreadyAdded = alreadyAdded();
    if (isAlreadyAdded) {
      removeProperty(property._id);
      setIsSelected(false);
    }

    if (!isAlreadyAdded) {
      addProperty(property);
      setIsSelected(true);
    }
  };

  const alreadyAdded = useCallback(() => {
    return selectedProperties.some((prop) => prop._id === property._id);
  }, [property._id, selectedProperties]);

  useEffect(() => {
    const isAlreadyAdded = alreadyAdded();
    if (isAlreadyAdded) {
      setIsSelected(true);
    }
  }, [alreadyAdded]);

  if (layout === "list") {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer  text-brand-black">
        <div className="flex flex-col md:flex-row">
          <div className="relative md:w-1/3">
            <Image
              src={property.displayImageUrl || "/placeholder.svg"}
              alt={property.propertyName}
              width={400}
              height={250}
              className="w-full h-48 md:h-full object-cover"
              priority
              onClick={onClick}
            />
            <div className="absolute top-2 right-2 space-x-3">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full bg-white hover:bg-white/70 hover:text-brand-orange"
              >
                <Heart className="h-4 w-4 " />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onSelect()}
                className={`rounded-full h-8 w-8 text-white ${
                  isSelected
                    ? "bg-orange-500 hover:bg-orange-600 text-white"
                    : " bg-white hover:bg-white/70 text-white"
                }`}
              >
                {isSelected ? (
                  <Check className="h-4 w-4 text-black" />
                ) : (
                  <PlusSquare className="h-4 w-4 text-black" />
                )}
              </Button>
            </div>
            {property.featured && (
              <Badge className="absolute top-2 left-2 bg-brand-orange text-white">
                Featured
              </Badge>
            )}
            <Badge className="absolute bottom-2 left-2 bg-black/70 text-white">
              {property.transactionType}
            </Badge>
          </div>
          <div className="md:w-2/3 p-4">
            <div className="flex justify-between items-start">
              <div onClick={onClick}>
                <h3 className="text-lg font-semibold text-black">
                  {property.propertyName}
                </h3>
                <div className="flex items-center text-sm text-gray-400 mb-2">
                  {property.city}
                  <Link
                    href={`/property/${property._id}`}
                    className="text-black"
                  >
                    <Button variant={"link"}>More details</Button>
                  </Link>
                </div>
              </div>
              <p className="text-xl font-bold text-brand-orange">
                {formatPrice(
                  property.totalSellingPrice,
                  property.transactionType ?? ""
                )}
              </p>
            </div>
            <p className="text-sm text-gray-400 mb-4 line-clamp-2">
              {property.description}
            </p>
            <PropertyDetails property={property} compact />
          </div>
        </div>
      </Card>
    );
  }
  return (
    <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer text-brand-black ">
      <div className="relative">
        <Image
          src={property.displayImageUrl || "/placeholder.svg"}
          alt={property.propertyName}
          width={400}
          height={250}
          priority
          className="w-full h-48 object-cover"
          onClick={onClick}
        />
        <div className="absolute top-2 right-2 space-x-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-white hover:bg-white/70 hover:text-brand-orange"
          >
            <Heart className="h-4 w-4 " />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onSelect()}
            className={`rounded-full h-8 w-8 text-white ${
              isSelected
                ? "bg-orange-500 hover:bg-orange-600 text-white"
                : " bg-white hover:bg-white/70 text-white"
            }`}
          >
            {isSelected ? (
              <Check className="h-4 w-4 text-black" />
            ) : (
              <PlusSquare className="h-4 w-4 text-black" />
            )}
          </Button>
        </div>

        {property.featured && (
          <Badge className="absolute top-2 left-2 bg-brand-orange text-white">
            Featured
          </Badge>
        )}
        <Badge className="absolute bottom-2 left-2 bg-black/70 text-white">
          {property.transactionType}
        </Badge>
        <Badge className="absolute bottom-2 right-2 bg-black/70 text-white">
          {property.propertyType}
        </Badge>
      </div>
      <CardHeader onClick={onClick} className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold line-clamp-1 ">
            {property.propertyName}
          </CardTitle>
        </div>
        <div className="flex items-center text-sm text-gray-700">
          {property.city}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xl font-bold text-brand-orange">
            {formatPrice(
              property.totalSellingPrice,
              property.transactionType ?? ""
            )}
          </p>
        </div>
        <PropertyDetails property={property} />
      </CardContent>
    </Card>
  );
}

export default PropertyCard;
