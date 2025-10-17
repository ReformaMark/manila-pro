import { PropertyTypesWithImageUrls } from "@/lib/types";
import { Id } from "../../convex/_generated/dataModel";
import { create } from "zustand";

interface PropertyCompareStore {
  selectedProperties: PropertyTypesWithImageUrls[]; // store full property data
  addProperty: (property: PropertyTypesWithImageUrls) => void;
  removeProperty: (id: Id<"property">) => void;
  clearProperties: () => void;
  setProperties: (properties: PropertyTypesWithImageUrls[]) => void;
}

export const usePropertyCompareStore = create<PropertyCompareStore>((set) => ({
  selectedProperties: [],

  addProperty: (property) =>
    set((state) => {
      const alreadyExists = state.selectedProperties.some(
        (p) => p._id === property._id
      );
      return {
        selectedProperties: alreadyExists
          ? state.selectedProperties
          : [...state.selectedProperties, property],
      };
    }),

  removeProperty: (id) =>
    set((state) => ({
      selectedProperties: state.selectedProperties.filter((p) => p._id !== id),
    })),

  clearProperties: () => set({ selectedProperties: [] }),

  setProperties: (properties) => set({ selectedProperties: properties }),
}));
