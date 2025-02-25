import { create } from "zustand";

export interface LayoutStoreState {
  leftPanelWidth: number;
  leftPanelMinWidth: number;
  rightPanelWidth: number;
  rightPanelMinWidth: number;
  setLeftPanelWidth(leftPanelWidth: number): void;
  setRightPanelWidth(rightPanelWidth: number): void;
}

const useLayoutStore = create<LayoutStoreState>()((set) => ({
  leftPanelWidth: 260,
  rightPanelWidth: 260,
  leftPanelMinWidth: 130,
  rightPanelMinWidth: 130,
  setLeftPanelWidth(leftPanelWidth) {
    set({ leftPanelWidth });
  },
  setRightPanelWidth(rightPanelWidth) {
    set({ rightPanelWidth });
  },
}));

export default useLayoutStore;
