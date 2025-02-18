import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { getLast } from "../../utils/arrayUtils";
import { clone } from "../../utils/mutabilityUtils";

type Instrument = "kick" | "snare" | "hat" | "unknown";
type Pattern = "oneshot" | "loop" | "unknown";
type StoreInitState = "waiting" | "loading" | "loaded";

export interface SampleInfo {
  id: string;
  name: string;
  instrument: Instrument;
  pattern: Pattern;
  length: number;
  url: string;
}

interface SamplesStoreState {
  samples: Readonly<Record<string, Readonly<SampleInfo>>>;
  initState: StoreInitState;
  setInitState(initState: StoreInitState): void;
  getSample(id: string): Readonly<SampleInfo> | undefined;
  addSample(sample: Readonly<SampleInfo>): void;
  addSamples(samples: Readonly<Array<Readonly<SampleInfo>>>): void;
  removeSample(id: string): void;
}

const useSampleStore = create<SamplesStoreState>()(
  immer((set, get) => ({
    samples: {},
    initState: "waiting",
    setInitState(initState) {
      set({ initState });
    },
    addSample(sample) {
      set((state) => {
        state.samples[sample.id] = sample;
      });
    },
    addSamples(samples) {
      set((state) => {
        samples.forEach((sample) => (state.samples[sample.id] = sample));
      });
    },
    removeSample(id) {
      set((state) => {
        if (state.samples[id]) delete state.samples[id];
      });
    },
    getSample(id) {
      return get().samples[id];
    },
  }))
);

export function useAddSamples() {
  const addSamples = useSampleStore((s) => s.addSamples);
  const setSampleLength = useSetSampleLength();

  return function (sampleFiles: FileList) {
    addSamples(
      Array.from(sampleFiles)
        .filter((file) => file.type.startsWith("audio/"))
        .map((file) => {
          const url = URL.createObjectURL(file);
          const id = getLast(url.split("/"));

          const audio = new Audio(url);

          audio.addEventListener("loadedmetadata", () =>
            setSampleLength(id, Number(audio.duration.toFixed(2)))
          );

          return {
            id,
            url,
            name: file.name,
            instrument: "unknown",
            length: 0,
            pattern: "unknown",
          };
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
    id: string,
    fields: Partial<
      Pick<SampleInfo, "name" | "pattern" | "length" | "instrument">
    >
  ) {
    const sample = getSample(id);
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
  return (id: string, name: string) => updateSample(id, { name });
}
export function useSetSampleLength() {
  const updateSample = useUpdateSample();
  return (id: string, length: number) => updateSample(id, { length });
}
export function useSetSampleInstrument() {
  const updateSample = useUpdateSample();
  return (id: string, instrument: Instrument) =>
    updateSample(id, { instrument });
}
export function useSetSamplePattern() {
  const updateSample = useUpdateSample();
  return (id: string, pattern: Pattern) => updateSample(id, { pattern });
}

/**
 * Loads the default samples
 */
export function useLoadDefaultSamples() {
  const initState = useSampleStore((s) => s.initState);
  const setInitState = useSampleStore((s) => s.setInitState);
  const addSample = useSampleStore((s) => s.addSample);
  const setSampleLength = useSetSampleLength();

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
    const url = String((samples[path] as { default: string }).default);
    const fileName = getLast(path.split("/"));
    const audio = new Audio(url);

    const id = crypto.randomUUID();
    const sample: SampleInfo = {
      id,
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
    audio.addEventListener("loadedmetadata", () => {
      setSampleLength(id, Number(audio.duration.toFixed(2)));
      loadedCount++;

      if (loadedCount === samplesCount) {
        setInitState("loaded");
        return;
      }
    });
  }
}

export default useSampleStore;
