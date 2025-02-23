import { create } from "zustand";

interface DawStoreState {
  audioContext: AudioContext;
}

const useDawStore = create<DawStoreState>()(() => ({
  audioContext: new window.AudioContext(),
}));

export function useAudioContext() {
  return useDawStore((s) => s.audioContext);
}

export default useDawStore;
