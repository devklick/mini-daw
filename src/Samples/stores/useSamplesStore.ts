import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { getLast } from "../../utils/arrayUtils";
import { clone } from "../../utils/mutabilityUtils";
import { useEffect } from "react";
import { useAudioContext } from "../../stores/useDawStore";

type Instrument = "kick" | "snare" | "hat" | "unknown";
type Pattern = "oneshot" | "loop" | "unknown";
type StoreInitState = "waiting" | "loading" | "loaded";

export interface SampleInfo {
  name: string;
  instrument: Instrument;
  pattern: Pattern;
  length: number;
  url: string;
}

interface SamplesStoreState {
  samples: Readonly<Record<string, Readonly<SampleInfo>>>;
  sampleBuffers: Record<string, AudioBuffer>;
  selectedSampleUrl: string | null;
  initState: StoreInitState;
  searchValue: string | null;
  setInitState(initState: StoreInitState): void;
  getSample(url: string): Readonly<SampleInfo> | undefined;
  addSample(sample: Readonly<SampleInfo>): void;
  addSamples(samples: Readonly<Array<Readonly<SampleInfo>>>): void;
  removeSample(url: string): void;
  setSearchValue(value: string | null): void;
  setSelectedSample(url: string | null): void;
  addSampleBuffer(url: string, buffer: AudioBuffer): void;
}

const useSampleStore = create<SamplesStoreState>()(
  immer((set, get) => ({
    samples: {},
    sampleBuffers: {},
    selectedSampleUrl: null,
    initState: "waiting",
    searchValue: null,
    setInitState(initState) {
      set({ initState });
    },
    addSample(sample) {
      set((state) => {
        state.samples[sample.url] = sample;
      });
    },
    addSamples(samples) {
      set((state) => {
        samples.forEach((sample) => (state.samples[sample.url] = sample));
      });
    },
    removeSample(url) {
      set((state) => {
        if (state.samples[url]) delete state.samples[url];
      });
    },
    getSample(url) {
      return get().samples[url];
    },
    setSearchValue(searchValue) {
      set({ searchValue });
    },
    setSelectedSample(url) {
      set({ selectedSampleUrl: url });
    },
    addSampleBuffer(url, buffer) {
      set((state) => {
        state.sampleBuffers[url] = buffer;
      });
    },
  }))
);

export function useAddSamples() {
  const addSamples = useSampleStore((s) => s.addSamples);
  const setSampleLength = useSetSampleLength();
  const loadSampleBuffer = useLoadSampleBuffer();

  return function (sampleFiles: FileList) {
    addSamples(
      Array.from(sampleFiles)
        .filter((file) => file.type.startsWith("audio/"))
        .map((file) => {
          const url = URL.createObjectURL(file);
          loadSampleBuffer(url);
          const audio = new Audio(url);
          audio.addEventListener("loadedmetadata", () => {
            setSampleLength(url, Number(audio.duration.toFixed(2)));
          });

          return {
            url,
            name: file.name,
            instrument: "unknown",
            length: 0,
            pattern: "unknown",
          } satisfies SampleInfo;
        })
    );
  };
}

export function useUpdateSample() {
  const getSample = useSampleStore((s) => s.getSample);
  const addSample = useSampleStore((s) => s.addSample);

  const isValidUpdateKey = (key: string): key is keyof SampleInfo => {
    return ["name", "pattern", "length", "instrument"].includes(key);
  };

  return function (
    url: string,
    fields: Partial<
      Pick<SampleInfo, "name" | "pattern" | "length" | "instrument">
    >
  ) {
    const sample = getSample(url);
    if (!sample) return;
    const updatedSample: SampleInfo = clone(sample, { writable: true });
    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined && isValidUpdateKey(key)) {
        // TODO: Come back to this and fix the typing
        // @ts-ignore
        updatedSample[key] = value as SampleInfo[typeof key];
      }
    }

    addSample(updatedSample);
  };
}

export function useSetSampleName() {
  const updateSample = useUpdateSample();
  return (url: string, name: string) => updateSample(url, { name });
}
export function useSetSampleLength() {
  const updateSample = useUpdateSample();
  return (url: string, length: number) => updateSample(url, { length });
}
export function useSetSampleInstrument() {
  const updateSample = useUpdateSample();
  return (url: string, instrument: Instrument) =>
    updateSample(url, { instrument });
}
export function useSetSamplePattern() {
  const updateSample = useUpdateSample();
  return (url: string, pattern: Pattern) => updateSample(url, { pattern });
}

export function useLoadSampleBuffer() {
  const audioContext = useAudioContext();
  const addSampleBuffer = useSampleStore((s) => s.addSampleBuffer);

  return async function (url: string) {
    console.log("Staring load buffer", url);
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const decodedBuffer = await audioContext.decodeAudioData(arrayBuffer);
      console.log("Adding sample buffer");
      addSampleBuffer(url, decodedBuffer);
    } catch (e) {
      console.log(e);
      console.error(e);
    }
  };
}

/**
 * Loads the default samples
 */
export function useLoadDefaultSamples() {
  const initState = useSampleStore((s) => s.initState);
  const setInitState = useSampleStore((s) => s.setInitState);
  const addSample = useSampleStore((s) => s.addSample);
  const setSampleLength = useSetSampleLength();
  const loadSampleBuffer = useLoadSampleBuffer();

  useEffect(() => {
    const load = async () => {
      if (initState === "loading" || initState === "loaded") {
        return;
      }

      setInitState("loading");

      const samples = import.meta.glob("/src/assets/samples/*.{mp3,wav}", {
        eager: true,
      });
      const samplesCount = Object.keys(samples).length;
      let loadedCount = 0;

      for (const path in samples) {
        if (useSampleStore.getState().samples[path]) continue;
        const url = String((samples[path] as { default: string }).default);
        const fileName = getLast(path.split("/"));
        const audio = new Audio(url);

        const sample: SampleInfo = {
          instrument: fileName.includes("Kick")
            ? "kick"
            : fileName.includes("Hat")
            ? "hat"
            : fileName.includes("Snare")
            ? "snare"
            : "unknown",
          length: 0,
          pattern: "oneshot",
          name: fileName,
          url,
        };
        addSample(sample);
        loadSampleBuffer(sample.url);
        audio.addEventListener("loadedmetadata", () => {
          setSampleLength(url, Number(audio.duration.toFixed(2)));
          loadedCount++;

          if (loadedCount === samplesCount) {
            setInitState("loaded");
            return;
          }
        });
      }
    };
    load();
  }, [addSample, initState, loadSampleBuffer, setInitState, setSampleLength]);
}

export default useSampleStore;
