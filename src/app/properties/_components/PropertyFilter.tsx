"use client"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { FilterOptions } from "@/types/property"

interface PropertyFilterProps {
  filters: FilterOptions
  onFilterChange: (key: string, value: any) => void
  onToggleAmenity: (amenity: string) => void
  onToggleFacility: (facility: string) => void
  onReset: () => void
  locations: string[]
  transactionTypes: string[]
  unitTypes: string[]
  amenities: string[]
  facilities: string[]
  formatPrice: (price: number, type: string) => string
}

export function PropertyFilter({
  filters,
  onFilterChange,
  onToggleAmenity,
  onToggleFacility,
  onReset,
  locations,
  transactionTypes,
  unitTypes,
  amenities,
  facilities,
  formatPrice,
}: PropertyFilterProps) {
  return (
    <div className=" rounded-lg  p-4 space-y-6 text-black bg-white shadow-md ">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="text-black hover:text-white hover:bg-gray-800"
        >
          Reset All
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-black">Location</label>
          <Select value={filters.location} onValueChange={(value) => onFilterChange("location", value)}>
            <SelectTrigger className=" text-black">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent className=" text-black">
              {locations.map((location) => (
                <SelectItem key={location} value={location} className="focus:bg-gray-800 focus:text-white">
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-black">Transaction Type</label>
          <Select value={filters.transactionType} onValueChange={(value) => onFilterChange("transactionType", value)}>
            <SelectTrigger className=" text-black">
              <SelectValue placeholder="Select transaction type" />
            </SelectTrigger>
            <SelectContent className=" text-black">
              {transactionTypes.map((type) => (
                <SelectItem key={type} value={type} className="focus:bg-gray-800 focus:text-white">
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-black">Unit Type</label>
          <Select value={filters.unitType} onValueChange={(value) => onFilterChange("unitType", value)}>
            <SelectTrigger className=" text-black">
              <SelectValue placeholder="Select unit type" />
            </SelectTrigger>
            <SelectContent className=" text-black">
              {unitTypes.map((type) => (
                <SelectItem key={type} value={type} className="focus:bg-gray-800 focus:text-white">
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-black">Price Range (PHP)</label>
          <div className="pt-6 pb-2">
            <Slider
              defaultValue={filters.priceRange}
              max={100000000}
              step={100000}
              value={filters.priceRange}
              onValueChange={(value) => onFilterChange("priceRange", value)}
              className="cursor-pointer "
            />
          </div>
          <div className="flex justify-between text-xs text-black">
            <span>{formatPrice(filters.priceRange[0], "Buy").replace("₱", "₱ ")}</span>
            <span>{formatPrice(filters.priceRange[1], "Buy").replace("₱", "₱ ")}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-black">Bedrooms</label>
            <Select
              value={filters.bedrooms.toString()}
              onValueChange={(value) => onFilterChange("bedrooms", Number.parseInt(value))}
            >
              <SelectTrigger className="text-black">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent className="text-black">
                <SelectItem value="0" className="focus:bg-gray-800 focus:text-white">
                  Any
                </SelectItem>
                <SelectItem value="1" className="focus:bg-gray-800 focus:text-white">
                  1+
                </SelectItem>
                <SelectItem value="2" className="focus:bg-gray-800 focus:text-white">
                  2+
                </SelectItem>
                <SelectItem value="3" className="focus:bg-gray-800 focus:text-white">
                  3+
                </SelectItem>
                <SelectItem value="4" className="focus:bg-gray-800 focus:text-white">
                  4+
                </SelectItem>
                <SelectItem value="5" className="focus:bg-gray-800 focus:text-white">
                  5+
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-black">Bathrooms</label>
            <Select
              value={filters.bathrooms.toString()}
              onValueChange={(value) => onFilterChange("bathrooms", Number.parseInt(value))}
            >
              <SelectTrigger className="text-black">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent className="text-black">
                <SelectItem value="0" className="focus:bg-gray-800 focus:text-white">
                  Any
                </SelectItem>
                <SelectItem value="1" className="focus:bg-gray-800 focus:text-white">
                  1+
                </SelectItem>
                <SelectItem value="2" className="focus:bg-gray-800 focus:text-white">
                  2+
                </SelectItem>
                <SelectItem value="3" className="focus:bg-gray-800 focus:text-white">
                  3+
                </SelectItem>
                <SelectItem value="4" className="focus:bg-gray-800 focus:text-white">
                  4+
                </SelectItem>
                <SelectItem value="5" className="focus:bg-gray-800 focus:text-white">
                  5+
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-black">Amenities</label>
          <ScrollArea className="h-40 rounded border border-gray-800 p-2 mt-2">
            <div className="space-y-2">
              {amenities.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox
                    id={`amenity-${amenity}`}
                    checked={filters.selectedAmenities.includes(amenity)}
                    onCheckedChange={() => onToggleAmenity(amenity)}
                    className="border-gray-600 data-[state=checked]:bg-brand-orange data-[state=checked]:border-brand-orange"
                  />
                  <label htmlFor={`amenity-${amenity}`} className="text-sm text-black">
                    {amenity}
                  </label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div>
          <label className="text-sm font-medium text-black">Facilities</label>
          <ScrollArea className="h-40 rounded border border-gray-800 p-2 mt-2 ">
            <div className="space-y-2">
              {facilities.map((facility) => (
                <div key={facility} className="flex items-center space-x-2">
                  <Checkbox
                    id={`facility-${facility}`}
                    checked={filters.selectedFacilities.includes(facility)}
                    onCheckedChange={() => onToggleFacility(facility)}
                    className="border-gray-600 data-[state=checked]:bg-brand-orange data-[state=checked]:border-brand-orange"
                  />
                  <label htmlFor={`facility-${facility}`} className="text-sm text-black">
                    {facility}
                  </label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}

