import { useEffect } from "react";
import { create } from "zustand";

interface DawStoreState {
  audioContext: AudioContext;
  bpm: number;
  setBpm(bpm: number): void;
}

const useDawStore = create<DawStoreState>()((set) => ({
  audioContext: new window.AudioContext(),
  bpm: 127,
  setBpm(bpm) {
    set({ bpm });
  },
}));

export function useAudioContext() {
  const audioContext = useDawStore((s) => s.audioContext);

  // Since browsers typically prevent starting audio automatically,
  // the audioContext starts of in a suspended state, where the currentTime will
  // not progress. To work around this, we can hook up to user input events and
  // resume the audioContext as soon as one happens.
  useEffect(() => {
    function ensureResumed() {
      if (audioContext.state === "suspended") {
        audioContext.resume();
      }
    }

    document.addEventListener("click", ensureResumed, { once: true });
    document.addEventListener("keydown", ensureResumed, { once: true });
    document.addEventListener("touchstart", ensureResumed, { once: true });

    return () => {
      document.removeEventListener("click", ensureResumed);
      document.removeEventListener("keydown", ensureResumed);
      document.removeEventListener("touchstart", ensureResumed);
    };
  });
  return audioContext;
}
export function useBpm() {
  const bpm = useDawStore((s) => s.bpm);
  const setBpm = useDawStore((s) => s.setBpm);
  return [bpm, setBpm] as const;
}

export default useDawStore;
