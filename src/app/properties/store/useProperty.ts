import { PropertyTypesWithImageUrls } from "@/lib/types";
import { create } from "zustand";

type PropertyStore = {
  properties: PropertyTypesWithImageUrls[];
};

const usePropertyStore = create<PropertyStore>((set) => ({
  properties: [],

    // Set all properties (e.g., after fetching from an API)
    setProperties: (properties: PropertyTypesWithImageUrls[]) => set({ properties }),
}));


export default usePropertyStore;