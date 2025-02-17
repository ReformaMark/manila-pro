import { Id } from "../../convex/_generated/dataModel";
import { create } from "zustand"

interface PropertyStore {
    selectedPropertyId: Id<"property"> | null;
    setSelectedPropertyId: (id: Id<"property"> | null) => void;
}

export const usePropertyStore = create<PropertyStore>((set) =>({
    selectedPropertyId: null,
    setSelectedPropertyId: (id) => set({ selectedPropertyId: id })
}))