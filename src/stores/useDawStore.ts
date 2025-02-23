import { create } from "zustand";

interface DawStoreState {
  audioContext: AudioContext;
  bpm: number;
  setBpm(bpm: number): void;
}

const useDawStore = create<DawStoreState>()((set) => ({
  audioContext: new window.AudioContext(),
  bpm: 130,
  setBpm(bpm) {
    set({ bpm });
  },
}));

export function useAudioContext() {
  return useDawStore((s) => s.audioContext);
}
export function useBpm() {
  const bpm = useDawStore((s) => s.bpm);
  const setBpm = useDawStore((s) => s.setBpm);
  return [bpm, setBpm] as const;
}

export default useDawStore;
