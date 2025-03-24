"use client"
import {
    Card,
    CardContent
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/utils";
import { Filter, Plus, Search, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Doc } from "../../../convex/_generated/dataModel";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Slider } from "../ui/slider";
import { PropertyDetailsModal } from "./property-details-modal";
import { PropertyGrid } from "./property-grid";


interface PropertiesDashboardProps {
    initialProperties: Doc<"property">[]
}

export function PropertiesDashboard({
    initialProperties
}: PropertiesDashboardProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [sortBy, setSortBy] = useState("newest")
    const [selectedCity, setSelectedCity] = useState("all")
    const [priceRange, setPriceRange] = useState([0, 100000000])
    const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([])
    const [selectedProperty, setSelectedProperty] = useState<Doc<"property"> | null>(null)
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
    const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false)

    const allPrices = initialProperties.map((p) => p.totalSellingPrice)
    const minPrice = Math.min(...allPrices)
    const maxPrice = Math.max(...allPrices)

    const propertyTypes = useMemo(() => {
        const types = new Set(initialProperties.map((p) => p.unitType))
        return Array.from(types)
    }, [initialProperties])

    const cities = useMemo(() => {
        const city = new Set(initialProperties.map((p) => p.city))
        return Array.from(city)
    }, [])

    const togglePropertyType = (type: string) => {
        setSelectedPropertyTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
    }

    const resetFilters = () => {
        setPriceRange([minPrice, maxPrice])
        setSelectedPropertyTypes([])
        setSelectedCity("all")
        setSearchQuery("")
        setSortBy("newest")
    }

    const activeFilterCount = [
        priceRange[0] > minPrice || priceRange[1] < maxPrice,
        selectedPropertyTypes.length > 0,
        selectedCity !== "all",
        searchQuery.length > 0,
    ].filter(Boolean).length

    const filteredProperties = initialProperties.filter((property) => {
        if (statusFilter !== "all" && property.status !== statusFilter) return false

        if (property.totalSellingPrice < priceRange[0] || property.totalSellingPrice > priceRange[1]) return false

        if (selectedPropertyTypes.length > 0 && !selectedPropertyTypes.includes(property.unitType)) return false

        if (selectedCity !== "all" && property.city !== selectedCity) return false

        if (
            searchQuery &&
            !property.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !property.address.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
            return false
        }

        return true
    })

    const sortedProperties = [...filteredProperties].sort((a, b) => {
        if (sortBy === "newest") return b.createdAt - a.createdAt
        if (sortBy === "oldest") return a.createdAt - b.createdAt
        if (sortBy === "price-high") return b.totalSellingPrice - a.totalSellingPrice
        if (sortBy === "price-low") return a.totalSellingPrice - b.totalSellingPrice
        return 0
    })

    const allCount = initialProperties.length
    const availableCount = initialProperties.filter((p) => p.status === "available").length
    const reservedCount = initialProperties.filter((p) => p.status === "reserved").length
    const soldCount = initialProperties.filter((p) => p.status === "sold").length

    const handleViewDetails = (property: Doc<"property">) => {
        setSelectedProperty(property)
        setIsDetailsModalOpen(true)
    }

    return (
        <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">My Properties</h1>
                    <p className="text-muted-foreground">Manage and track your real estate listings</p>
                </div>

                <Button asChild variant="orange">
                    <Link href="/seller/properties/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Property
                    </Link>
                </Button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 mb-6">
                <div className="flex flex-col">
                    <Card className="w-full lg:w-64 hidden lg:block">
                        <CardContent className="p-6">
                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-medium mb-3">Price Range</h3>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm text-muted-foreground">{formatCurrency(priceRange[0])}</span>
                                        <span className="text-sm text-muted-foreground">{formatCurrency(priceRange[1])}</span>
                                    </div>
                                    <Slider
                                        defaultValue={[minPrice, maxPrice]}
                                        min={minPrice}
                                        max={maxPrice}
                                        step={100000}
                                        value={priceRange}
                                        onValueChange={(value) => setPriceRange(value)}
                                        minStepsBetweenThumbs={1}
                                    />
                                </div>

                                <Separator className="w-full" />

                                <div>
                                    <h3 className="font-medium mb-3">Property Type</h3>
                                    <div className="space-y-2">
                                        {propertyTypes.map((type) => (
                                            <div key={type} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`mobile-type-${type}`}
                                                    checked={selectedPropertyTypes.includes(type)}
                                                    onCheckedChange={() => togglePropertyType(type)}
                                                    className="data-[state=checked]:bg-orange-500"
                                                />
                                                <Label htmlFor={`mobile-type-${type}`} className="capitalize">
                                                    {type.replace(/-/g, " ")}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <Separator className="w-full" />

                                <div>

                                </div>
                            </div>


                            <div>
                                <h3 className="font-medium mb-3">City</h3>
                                <Select value={selectedCity} onValueChange={setSelectedCity}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select city" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Cities</SelectItem>
                                        {cities.map((city) => (
                                            <SelectItem key={city} value={city}>
                                                {city}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button variant="outline" className="mt-4 w-full" onClick={resetFilters}>
                                Reset Filters
                            </Button>
                        </CardContent>
                    </Card>

                </div>

                <div className="flex-1">
                    <Tabs defaultValue="all" className="w-full" onValueChange={setStatusFilter}>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                            <TabsList className="mb-4 sm:mb-0">
                                <TabsTrigger value="all">
                                    All
                                    <Badge className="ml-2" variant="secondary">{allCount}</Badge>
                                </TabsTrigger>
                                <TabsTrigger value="available">
                                    Available
                                    <Badge className="ml-2" variant="secondary">
                                        {availableCount}
                                    </Badge>
                                </TabsTrigger>
                                <TabsTrigger value="reserved">
                                    Reserved
                                    <Badge className="ml-2" variant="secondary">
                                        {reservedCount}
                                    </Badge>
                                </TabsTrigger>
                                <TabsTrigger value="sold">
                                    Sold
                                    <Badge className="ml-2" variant="secondary">
                                        {soldCount}
                                    </Badge>
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 mb-6">
                            <div className="relative flex-1">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search properties..."
                                    className="pl-8"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="newest">Newest First</SelectItem>
                                    <SelectItem value="oldest">Oldest First</SelectItem>
                                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                                </SelectContent>
                            </Select>

                            <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="outline" className="lg:hidden relative">
                                        <Filter className="h-4 w-4 mr-2" />
                                        Filters
                                        {activeFilterCount > 0 && (
                                            <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center bg-orange-500">{activeFilterCount}</Badge>
                                        )}
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                                    <SheetHeader>
                                        <SheetTitle>Filters</SheetTitle>
                                    </SheetHeader>
                                    <div className="py-4 space-y-6">
                                        <div>
                                            <h3 className="font-medium mb-3">Price Range</h3>
                                            <div className="flex justify-between mb-2">
                                                <span className="text-sm text-muted-foreground">{formatCurrency(priceRange[0])}</span>
                                                <span className="text-sm text-muted-foreground">{formatCurrency(priceRange[1])}</span>
                                            </div>
                                            <Slider
                                                defaultValue={[minPrice, maxPrice]}
                                                min={minPrice}
                                                max={maxPrice}
                                                step={100000}
                                                value={priceRange}
                                                onValueChange={setPriceRange}
                                            />
                                        </div>

                                        <Separator />

                                        <div>
                                            <h3 className="font-medium mb-3">Property Type</h3>
                                            <div className="space-y-2">
                                                {propertyTypes.map((type) => (
                                                    <div key={type} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={`mobile-type-${type}`}
                                                            checked={selectedPropertyTypes.includes(type)}
                                                            onCheckedChange={() => togglePropertyType(type)}
                                                            className="data-[state=checked]:bg-orange-500"
                                                        />
                                                        <Label htmlFor={`mobile-type-${type}`} className="capitalize">
                                                            {type.replace(/-/g, " ")}
                                                        </Label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <Separator />

                                        <div>
                                            <h3 className="font-medium mb-3">City</h3>
                                            <Select value={selectedCity} onValueChange={setSelectedCity}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select city" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All Cities</SelectItem>
                                                    {cities.map((city) => (
                                                        <SelectItem key={city} value={city}>
                                                            {city}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="flex gap-2 pt-4">
                                            <Button variant="outline" className="flex-1" onClick={resetFilters}>
                                                Reset
                                            </Button>
                                            <Button variant="orange" className="flex-1" onClick={() => setIsFilterSheetOpen(false)}>
                                                Apply Filters
                                            </Button>
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>

                        {activeFilterCount > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {priceRange[0] > minPrice || priceRange[1] < maxPrice ? (
                                    <Badge variant="outline" className="rounded-full py-2">
                                        Price: {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
                                        <Button variant="ghost" className="h-4 w-4 p-0 ml-1" size="icon" onClick={() => setPriceRange([minPrice, maxPrice])}>
                                            <X className="h-3 w-3" />
                                            <span className="sr-only">Remove price filter</span>
                                        </Button>
                                    </Badge>
                                ) : null}

                                {selectedPropertyTypes.map((type) => (
                                    <Badge variant="outline" key={type} className="rounded-full py-2">
                                        {type}
                                        <Button variant="ghost" className="h-4 w-4 p-0 ml-1" size="icon" onClick={() => togglePropertyType(type)}>
                                            <X className="h-3 w-3" />
                                            <span className="sr-only">Remove {type} filter</span>
                                        </Button>
                                    </Badge>
                                ))}

                                {selectedCity !== "all" && (
                                    <Badge variant="outline" className="flex items-center gap-1">
                                        {selectedCity}
                                        <Button variant="ghost" size="icon" className="h-4 w-4 p-0 ml-1" onClick={() => setSelectedCity("all")}>
                                            <X className="h-3 w-3" />
                                            <span className="sr-only">Remove city filter</span>
                                        </Button>
                                    </Badge>
                                )}

                                {searchQuery && (
                                    <Badge variant="outline" className="flex items-center gap-1">
                                        Search: {searchQuery}
                                        <Button variant="ghost" size="icon" className="h-4 w-4 p-0 ml-1" onClick={() => setSearchQuery("")}>
                                            <X className="h-3 w-3" />
                                            <span className="sr-only">Clear search</span>
                                        </Button>
                                    </Badge>
                                )}

                                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={resetFilters}>
                                    Clear All
                                </Button>
                            </div>
                        )}


                        <TabsContent value="all" className="mt-0">
                            <PropertyGrid properties={sortedProperties} onViewDetails={handleViewDetails} />
                        </TabsContent>
                        <TabsContent value="available" className="mt-0">
                            <PropertyGrid properties={sortedProperties} onViewDetails={handleViewDetails} />
                        </TabsContent>
                        <TabsContent value="reserved" className="mt-0">
                            <PropertyGrid properties={sortedProperties} onViewDetails={handleViewDetails} />
                        </TabsContent>
                        <TabsContent value="sold" className="mt-0">
                            <PropertyGrid properties={sortedProperties} onViewDetails={handleViewDetails} />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            {selectedProperty && (
                <PropertyDetailsModal
                    property={selectedProperty}
                    isOpen={isDetailsModalOpen}
                    onClose={() => setIsDetailsModalOpen(false)}
                />
            )}
        </>
    )
}