import { PropertyTypes } from "@/lib/types"
import { Bed, Bath, Maximize, Building } from "lucide-react"

interface PropertyDetailsProps {
  property: PropertyTypes
  compact?: boolean
}

export function PropertyDetails({ property, compact = false }: PropertyDetailsProps) {
  return (
    <div className={`flex flex-wrap ${compact ? "gap-3" : "gap-4"} text-sm`}>
      <div className="flex items-center">
        <Bed className="h-4 w-4 mr-1 text-gray-400" />
        <span>
          {isNaN(Number(property.bedrooms)) ? "-" : property.bedrooms} {Number(property.bedrooms) === 1 ? "Bed" : "Beds"}
        </span>
      </div>
      <div className="flex items-center">
        <Bath className="h-4 w-4 mr-1 text-gray-400" />
        <span>
          {isNaN(Number(property.bathrooms)) ? "-" : property.bathrooms} {Number(property.bathrooms) === 1 ? "Bath" : "Baths"}
        </span>
      </div>
      <div className="flex items-center">
        <Maximize className="h-4 w-4 mr-1 text-gray-400" />
        <span>{property.lotArea} sqm</span>
      </div>
      {!compact && (
        <div className="flex items-center">
          <Building className="h-4 w-4 mr-1 text-gray-400" />
          <span>
            {isNaN(Number(property.storeys)) ? "-" : property.storeys} {Number(property.storeys) === 1 ? "Floor" : "Floors"}
          </span>
        </div>
      )}
    </div>
  )
}

