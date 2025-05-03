import { create } from "zustand"

interface ViewModalState {
    isOpen: boolean;
}

interface ViewModalActions {
    toggleModal: () => void;
}

interface ViewModalStore extends ViewModalState, ViewModalActions { }

const useViewModal = create<ViewModalStore>((set) => ({
    isOpen: false,
    toggleModal: () => set((state: ViewModalState) => ({ isOpen: !state.isOpen })),
}));

export default useViewModal