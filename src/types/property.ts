export interface FilterOptions {
    location: string
    transactionType: string
    unitType: string
    priceRange: [number, number]
    bedrooms: number
    bathrooms: number
    lotAreaRange: [number, number]
    storeyRange: [number, number]
    selectedAmenities: string[]
    selectedFacilities: string[]
    maxOccupants: number
    searchTerm: string
    sort: string
  }