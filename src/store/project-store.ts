import { Id } from "../../convex/_generated/dataModel";
import { create } from "zustand"

interface ProjectStore {
    selectedProjectId: Id<"project"> | null;
    setSelectedProjectId: (id: Id<"project"> | null) => void;
}

export const useProjectStore = create<ProjectStore>((set) => ({
    selectedProjectId: null,
    setSelectedProjectId: (id) => set({ selectedProjectId: id })
}))