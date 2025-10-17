/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SlidersHorizontal, Search, Info, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import type { FilterOptions } from "@/types/property";
import { formatPrice, formatPriceRange } from "@/lib/utils";
import { PropertyTypesWithImageUrls } from "@/lib/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { PropertyFilter } from "./PropertyFilter";
import PropertyCard from "./PropertyCard";
import { PropertyDetailModal } from "./PropertyDetailsModal";
import { useRouter } from "next/navigation";
import { useFilterStore } from "../store/useFilter";
import { useConvexAuth, useMutation } from "convex/react";
import MapComponent from "./map";
import PropertyListHeader from "./PropertyListHeader";
import { toast } from "sonner";
import { api } from "../../../../convex/_generated/api";

// Filter options
const locations = ["All Locations", "Makati", "Pasay", "Taguig"];
const transactionTypes = ["All Types", "Buy", "Rent", "Lease"];
const unitTypes = [
  "All Units",
  "Apartment",
  "Condominium",
  "Duplex",
  "Single Attached House",
  "Single Detached House",
  "Townhouse/detached Row House",
];
const amenities = [
  "Balcony",
  "Garden",
  "Built-in Wardrobe",
  "Built-in Kitchen",
  "Air Conditioning",
  "Security System",
  "Garage",
  "High Ceiling",
  "Smart Home System",
  "Private Pool",
  "Wine Cellar",
  "Home Theater",
];
const facilities = [
  "Swimming Pool",
  "Gym",
  "Function Room",
  "Playground",
  "Tennis Court",
  "Basketball Court",
  "Sauna",
  "Rooftop Garden",
  "Parking Space",
  "Security",
  "Elevator Access",
  "Helipad",
  "Concierge Service",
  "Spa",
];

const ITEMS_PER_PAGE = 12;

export default function PropertyShowcase({
  properties,
  setShowSavedSearches,
  setShowCompare,
}: {
  properties: PropertyTypesWithImageUrls[];
  setShowSavedSearches: (showSearches: boolean) => void;
  setShowCompare: (showCompare: boolean) => void;
}) {
  const [displayedCount, setDisplayedCount] = useState(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [activeView, setActiveView] = useState<"grid" | "list" | "map">("grid");
  const {
    unitType,
    transactionType,
    location,
    searchTerm,
    priceRange,
    bedrooms,
    bathrooms,
    amenities: amen,
    facilities: facil,
    setSearchTerm,
    setLocation,
    resetFiltersStore,
  } = useFilterStore();

  const [filters, setFilters] = useState<FilterOptions>({
    location: location ?? "All Locations",
    transactionType: transactionType ?? "All Types",
    unitType: unitType,
    priceRange: formatPriceRange(priceRange),
    bedrooms: bedrooms,
    bathrooms: bathrooms,
    lotAreaRange: [0, 500],
    storeyRange: [0, 50],
    selectedAmenities: amen as string[],
    selectedFacilities: facil as string[],
    maxOccupants: 0,
    searchTerm: searchTerm,
    sort: "newest",
  });
  const [filteredProperties, setFilteredProperties] =
    useState<PropertyTypesWithImageUrls[]>(properties);
  const [selectedProperty, setSelectedProperty] =
    useState<PropertyTypesWithImageUrls | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(true);

  const { isAuthenticated } = useConvexAuth();
  const router = useRouter();
  const isMobile = useIsMobile();

  const saveSearchFilter = useMutation(api.saved_searches.addSavedSearch);

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const toggleAmenity = (amenity: string) => {
    setFilters((prev) => {
      const selectedAmenities = [...prev.selectedAmenities];
      const index = selectedAmenities.indexOf(amenity);

      if (index === -1) {
        selectedAmenities.push(amenity);
      } else {
        selectedAmenities.splice(index, 1);
      }

      return {
        ...prev,
        selectedAmenities,
      };
    });
  };

  const toggleFacility = (facility: string) => {
    setFilters((prev) => {
      const selectedFacilities = [...prev.selectedFacilities];
      const index = selectedFacilities.indexOf(facility);

      if (index === -1) {
        selectedFacilities.push(facility);
      } else {
        selectedFacilities.splice(index, 1);
      }

      return {
        ...prev,
        selectedFacilities,
      };
    });
  };

  const resetFilters = () => {
    resetFiltersStore();
    setFilters({
      location: "All Locations",
      transactionType: "All Types",
      unitType: "All Units",
      priceRange: [0, 100000000],
      bedrooms: 0,
      bathrooms: 0,
      lotAreaRange: [0, 500],
      storeyRange: [0, 50],
      selectedAmenities: [],
      selectedFacilities: [],
      maxOccupants: 0,
      searchTerm: "",
      sort: "newest",
    });
  };

  const onSaveSearchFilter = () => {
    toast.promise(
      saveSearchFilter({
        query: searchTerm,
        name: new Date().toLocaleDateString("en-US"),
        transactionType: filters.transactionType,
        unitType: filters.unitType,
        location: filters.location,
        bedrooms: filters.bedrooms,
        bathrooms: filters.bathrooms,
        priceRange: filters.priceRange,
        amenities: filters.selectedAmenities,
        facilities: filters.selectedFacilities,
      }),
      {
        loading: "Saving search filters...",
        success: "Saved search filters,",
        error: "Maximum of 10 saved search filters allowed.",
      }
    );
  };

  const displayedProperties = filteredProperties.slice(0, displayedCount);

  const loadMore = useCallback(() => {
    if (isLoading || displayedCount >= filteredProperties.length) return;

    setIsLoading(true);
    // Simulate network delay
    setTimeout(() => {
      setDisplayedCount((prev) =>
        Math.min(prev + ITEMS_PER_PAGE, filteredProperties.length)
      );
      setIsLoading(false);
    }, 500);
  }, [displayedCount, filteredProperties.length, isLoading]);
  // Apply filters
  useEffect(() => {
    let result = properties;

    // Search term
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(
        (property) =>
          property.propertyName.toLowerCase().includes(term) ||
          (property.description &&
            property.description.toLowerCase().includes(term)) ||
          property.city.toLowerCase().includes(term)
      );
    }

    // Location
    if (filters.location !== "All Locations") {
      result = result.filter((property) => property.city === filters.location);
    }

    // Transaction Type
    if (filters.transactionType !== "All Types") {
      result = result.filter(
        (property) => property.transactionType === filters.transactionType
      );
    }

    // Unit Type
    if (filters.unitType !== "All Units") {
      result = result.filter(
        (property) =>
          property.unitType.toLowerCase() === filters.unitType.toLowerCase()
      );
    }

    // Price Range
    result = result.filter(
      (property) =>
        property.totalSellingPrice >= filters.priceRange[0] &&
        property.totalSellingPrice <= filters.priceRange[1]
    );

    // Bedrooms
    if (filters.bedrooms > 0) {
      result = result.filter((property) => {
        const bedrooms = Number(property.bedrooms);
        return !isNaN(bedrooms) && bedrooms >= filters.bedrooms;
      });
    }

    // Bathrooms
    if (filters.bathrooms > 0) {
      result = result.filter((property) => {
        const bathrooms = Number(property.bathrooms);
        return !isNaN(bathrooms) && bathrooms >= filters.bathrooms;
      });
    }

    // Lot Area Range
    result = result.filter(
      (property) =>
        property.lotArea >= filters.lotAreaRange[0] &&
        property.lotArea <= filters.lotAreaRange[1]
    );

    // // Storey Range
    // result = result.filter(
    //   (property) => {
    //     const storeys = Number(property.storeys);
    //     return !isNaN(storeys) && storeys >= filters.storeyRange[0] && storeys <= filters.storeyRange[1];
    //   },
    // )

    // Amenities
    if (filters.selectedAmenities.length > 0) {
      result = result.filter((property) =>
        filters.selectedAmenities.every(
          (amenity) =>
            property.amenities &&
            property.amenities.map((a) => a.name).includes(amenity)
        )
      );
    }

    // Facilities
    if (filters.selectedFacilities.length > 0) {
      result = result.filter((property) =>
        filters.selectedFacilities.every(
          (facility) =>
            property.facilities &&
            property.facilities
              .map((f) => f.name.toLowerCase())
              .includes(facility.toLowerCase())
        )
      );
    }

    // Max Occupants
    if (filters.maxOccupants > 0) {
      result = result.filter((property) => {
        const maxOccupants = Number(property.maximumOccupants);
        return !isNaN(maxOccupants) && maxOccupants >= filters.maxOccupants;
      });
    }
    if (filters.sort === "newest") {
      result = result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (filters.sort === "price-low") {
      result = result.sort((a, b) => a.totalSellingPrice - b.totalSellingPrice);
    } else if (filters.sort === "price-high") {
      result = result.sort((a, b) => b.totalSellingPrice - a.totalSellingPrice);
    } else if (filters.sort === "featured") {
      result = result.filter((property) => property.featured);
    }

    setFilteredProperties(result);
  }, [filters, location, transactionType, unitType, properties]);

  useEffect(() => {
    const ref = sentinelRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !isLoading &&
          displayedCount < filteredProperties.length
        ) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => {
      if (ref) {
        observer.unobserve(ref);
      }
    };
  }, [loadMore, isLoading, displayedCount, filteredProperties.length]);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      unitType,
      transactionType,
      location,
      searchTerm,
      priceRange: formatPriceRange(priceRange),
      bedrooms,
      bathrooms,
    }));
  }, [
    unitType,
    transactionType,
    location,
    searchTerm,
    priceRange,
    bedrooms,
    bathrooms,
  ]);
  useEffect(() => {
    setDisplayedCount(ITEMS_PER_PAGE);
  }, [searchTerm, filters]);
  return (
    <div className="min-h-screen  text-brand-black">
      {/* Main Content */}
      <div className={`transition-all duration-300 `}>
        <div className="px-2 md:px-10 ">
          <PropertyListHeader
            setShowSavedSearches={setShowSavedSearches}
            setShowCompare={setShowCompare}
          />
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search properties by name, location, or description..."
                  value={filters.searchTerm}
                  onChange={(e) => {
                    handleFilterChange("searchTerm", e.target.value);
                    setLocation(e.target.value);
                    setSearchTerm(e.target.value);
                  }}
                  className="pl-10 pr-4 py-2 w-full bg-white text-brand-black placeholder:text-gray-500 focus-visible:ring-brand-orange focus-visible:border-brand-orange"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isMobile ? (
                <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 border-brand-orange text-brand-orange hover:bg-brand-orange/10"
                    >
                      <SlidersHorizontal className="h-4 w-4" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="right"
                    className="w-full sm:max-w-md overflow-y-auto bg-white text-brand-black"
                  >
                    <SheetHeader className="mb-4">
                      <SheetTitle className="text-brand-black">
                        Property Filters
                      </SheetTitle>
                      <SheetDescription className="text-gray-400">
                        Customize your property search
                      </SheetDescription>
                    </SheetHeader>
                    <PropertyFilter
                      filters={filters}
                      onFilterChange={handleFilterChange}
                      onToggleAmenity={toggleAmenity}
                      onToggleFacility={toggleFacility}
                      onReset={resetFilters}
                      locations={locations}
                      transactionTypes={transactionTypes}
                      unitTypes={unitTypes}
                      amenities={amenities}
                      facilities={facilities}
                      formatPrice={formatPrice}
                      onSaveSearchFilter={onSaveSearchFilter}
                    />
                  </SheetContent>
                </Sheet>
              ) : (
                <></>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Filters Panel (Desktop) */}
            {!isMobile && isFilterOpen && (
              <div className="md:w-1/4 lg:w-1/5">
                <PropertyFilter
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onToggleAmenity={toggleAmenity}
                  onToggleFacility={toggleFacility}
                  onReset={resetFilters}
                  locations={locations}
                  transactionTypes={transactionTypes}
                  unitTypes={unitTypes}
                  amenities={amenities}
                  facilities={facilities}
                  formatPrice={formatPrice}
                  onSaveSearchFilter={onSaveSearchFilter}
                />
              </div>
            )}

            {/* Main Content */}
            <div
              className={`${!isMobile && isFilterOpen ? "md:w-3/4 lg:w-4/5" : "w-full"}`}
            >
              {/* Results Summary */}
              <div className="mb-6 mt-[-3.4rem] lg:mt-0 flex justify-between items-end lg:items-center">
                <h2 className="text-sm lg:text-xl font-semibold text-brand-black">
                  {displayedCount} of{" "}
                  {activeView === "map"
                    ? filteredProperties.filter(
                        (property) => property.coordinates
                      ).length
                    : filteredProperties.length}{" "}
                  {filteredProperties.length === 1 ? "Property" : "Properties"}
                </h2>
                <div className="flex flex-col-reverse lg:flex-row items-end lg:items-center gap-2">
                  {activeView !== "map" && (
                    <Select
                      defaultValue="newest"
                      onValueChange={(value: any) => {
                        handleFilterChange("sort", value);
                      }}
                    >
                      <SelectTrigger className="w-[180px] bg-white  text-brand-black">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent className="bg-white text-brand-black">
                        <SelectItem
                          value="newest"
                          className="focus:bg-gray-800 focus:text-white"
                        >
                          Newest
                        </SelectItem>
                        <SelectItem
                          value="featured"
                          className="focus:bg-gray-800 focus:text-white"
                        >
                          Featured
                        </SelectItem>
                        <SelectItem
                          value="price-low"
                          className="focus:bg-gray-800 focus:text-white"
                        >
                          Price: Low to High
                        </SelectItem>
                        <SelectItem
                          value="price-high"
                          className="focus:bg-gray-800 focus:text-white"
                        >
                          Price: High to Low
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                  <div className=" rounded-md flex border border-white divide-x divide-white bg-white">
                    <Button
                      variant={activeView === "grid" ? "default" : "ghost"}
                      size="sm"
                      className={`rounded-none ${activeView === "grid" ? "bg-brand-orange hover:bg-brand-orange/90" : "text-black hover:text-white"}`}
                      onClick={() => setActiveView("grid")}
                    >
                      Grid
                    </Button>
                    <Button
                      variant={activeView === "list" ? "default" : "ghost"}
                      size="sm"
                      className={`rounded-none ${activeView === "list" ? "bg-brand-orange hover:bg-brand-orange/90" : "text-black hover:text-white"}`}
                      onClick={() => setActiveView("list")}
                    >
                      List
                    </Button>
                    <Button
                      variant={activeView === "map" ? "default" : "ghost"}
                      size="sm"
                      className={`rounded-none ${activeView === "map" ? "bg-brand-orange hover:bg-brand-orange/90" : "text-black hover:text-white"}`}
                      onClick={() => setActiveView("map")}
                    >
                      Map
                    </Button>
                  </div>
                </div>
              </div>

              {/* Property Grid View */}
              {activeView === "grid" && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayedProperties.map((property) => (
                      <motion.div
                        key={property._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{ y: -5 }}
                        className="h-full"
                      >
                        <PropertyCard
                          property={property}
                          onClick={() =>
                            isAuthenticated
                              ? router.push(`/properties/${property._id}`)
                              : router.push(`/auth`)
                          }
                        />
                      </motion.div>
                    ))}
                  </div>

                  <div ref={sentinelRef} className="mt-8 flex justify-center">
                    {isLoading && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin text-brand-orange" />
                        <span>Loading more properties...</span>
                      </div>
                    )}
                    {!isLoading &&
                      displayedCount < filteredProperties.length && (
                        <p className="text-sm text-muted-foreground">
                          Scroll to load more properties
                        </p>
                      )}
                    {displayedCount >= filteredProperties.length &&
                      filteredProperties.length > 0 && (
                        <p className="text-sm text-muted-foreground">
                          No more properties to load
                        </p>
                      )}
                  </div>
                </>
              )}

              {/* Property List View */}
              {activeView === "list" && (
                <>
                  <div className="space-y-6">
                    {filteredProperties.map((property) => (
                      <motion.div
                        key={property._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{ y: -2 }}
                      >
                        <PropertyCard
                          property={property}
                          onClick={() =>
                            isAuthenticated
                              ? router.push(`/properties/${property._id}`)
                              : router.push(`/auth`)
                          }
                          layout="list"
                        />
                      </motion.div>
                    ))}
                  </div>
                  <div ref={sentinelRef} className="mt-8 flex justify-center">
                    {isLoading && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Loading more properties...</span>
                      </div>
                    )}
                    {!isLoading &&
                      displayedCount < filteredProperties.length && (
                        <p className="text-sm text-muted-foreground">
                          Scroll to load more properties
                        </p>
                      )}
                    {displayedCount >= filteredProperties.length &&
                      filteredProperties.length > 0 && (
                        <p className="text-sm text-muted-foreground">
                          No more properties to load
                        </p>
                      )}
                  </div>
                </>
              )}

              {/* Map View */}
              {activeView === "map" && (
                <div className="bg-white  ">
                  <div className="text-center">
                    <MapComponent
                      isAuthenticated={isAuthenticated}
                      properties={filteredProperties}
                    />
                  </div>
                </div>
              )}

              {/* No Results */}
              {filteredProperties.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg">
                  <Info className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                  <h3 className="text-lg font-medium mb-2 text-brand-black">
                    No properties found
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Try adjusting your filters to see more results
                  </p>
                  <Button
                    onClick={resetFilters}
                    className="bg-brand-orange hover:bg-brand-orange/90 text-brand-black"
                  >
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Property Detail Modal */}
      {selectedProperty && (
        <PropertyDetailModal
          property={selectedProperty as PropertyTypesWithImageUrls}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </div>
  );
}
