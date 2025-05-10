import { create } from "zustand";

type DndItemType = "sample";
export interface DndItem {
  id: string;
  type: DndItemType;
}
interface DndStoreState {
  item?: DndItem;
  setDragging(id: string, type: DndItemType): void;
  clearDragging(): void;
}

const useDndStore = create<DndStoreState>()((set) => ({
  item: undefined,
  setDragging(id, type) {
    set({ item: { id, type } });
  },
  clearDragging() {
    set({ item: undefined });
  },
}));

export default useDndStore;
