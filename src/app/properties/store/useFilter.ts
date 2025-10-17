import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define the types for the store state and actions
export interface FilterState {
  searchTerm: string;
  transactionType: string;
  unitType: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  priceRange: number[];
  amenities: string[];
  facilities: string[];

  // Actions
  setTransactionType: (transactionType: string) => void;
  setUnitType: (unitType: string) => void;
  setLocation: (location: string) => void;
  setBedrooms: (bedrooms: number) => void;
  setBathrooms: (bathrooms: number) => void;
  setPriceRange: (priceRange: number[]) => void;
  setAmenities: (amenities: string[]) => void;
  setFacilities: (facilities: string[]) => void;
  setSearchTerm: (searchTerm: string) => void;
  resetFiltersStore: () => void;
}

// Create Zustand store
export const useFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      searchTerm: "",
      transactionType: "All Types",
      unitType: "All Units",
      location: "",
      bedrooms: 0,
      bathrooms: 0,
      priceRange: [0, 0],
      amenities: [],
      facilities: [],

      // Actions
      setTransactionType: (transactionType) => set({ transactionType }),
      setUnitType: (unitType) => set({ unitType }),
      setLocation: (location) => set({ location }),
      setBedrooms: (bedrooms) => set({ bedrooms }),
      setBathrooms: (bathrooms) => set({ bathrooms }),
      setPriceRange: (priceRange) => set({ priceRange }),
      setAmenities: (amenities) => set({ amenities }),
      setFacilities: (facilities) => set({ facilities }),
      setSearchTerm: (searchTerm) => set({ searchTerm }),

      // Reset all filters to default
      resetFiltersStore: () =>
        set({
          transactionType: "All Types",
          unitType: "All Units",
          location: "All Locations",
          bedrooms: 0,
          bathrooms: 0,
          priceRange: [0, 100000000],
          amenities: [],
          facilities: [],
        }),
    }),
    { name: "filter-storage" } // Persists state in localStorage
  )
);
