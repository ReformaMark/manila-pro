import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define the types for the store state and actions
export interface FilterState {
    transactionType: string;
    unitType: string;
    location: string;
    setTransactionType: (transactionType: string) => void;
    setUnitType: (unitType: string) => void;
    setLocation: (location: string) => void;
    resetFiltersStore: () => void;
}

// Create the Zustand store with TypeScript types
export const useFilterStore = create<FilterState>()(
    persist(
        (set) => ({
            transactionType: "All Types",
            unitType: "All Units",
            location: "",
            setTransactionType: (transactionType: string) => set({ transactionType }),
            setUnitType: (unitType: string) => set({ unitType }),
            setLocation: (location: string) => set({ location }),
            resetFiltersStore: () =>
                set({
                    transactionType: "All Types",
                    unitType: "All Units",
                    location: "",
                }),
        }),
        { name: "filter-storage" } // Persists state in localStorage
    )
);
