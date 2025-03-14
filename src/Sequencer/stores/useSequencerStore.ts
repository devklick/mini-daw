import { useCallback, useEffect, useRef } from "react";
import { create } from "zustand";
import useSampleStore, {
  SampleInfo,
  useCreateSampleBufferSource,
  useLoadDefaultSamples,
} from "../../Samples/stores/useSamplesStore";
import { getFirst, getLast } from "../../utils/arrayUtils";
import { useAudioContext, useBpm } from "../../stores/useDawStore";

interface Step {
  active: boolean;
}

interface Pattern {
  id: string;
  stepsPerBeat: number;
  beatsPerBar: number;
  barsPerSequence: number;
  /**
   * The steps on this patter per track.
   *
   * The key is the trackId.
   */
  trackSteps: Record<string, Array<Step>>;
}

export interface SequencerTrack {
  id: string;
  name: string;
  sample: SampleInfo;
  /**
   * The sequencer steps per patter.
   *
   * The key of the Record is the pattern ID.
   */
  // steps: Record<string, Array<boolean>>;
  mute: boolean;
  /**
   * - Min: 0
   * - Max: 100
   * @default 80
   */
  volume: number;

  /**
   * - Min: -12 (Down one octave)
   * - Max: 12 (Up one octave)
   * @default 0
   */
  pitch: number;
  /**
   * - Min: -100 (left only)
   * - Max: 100 (right only)
   * @default 0 (centre)
   */
  pan: number;
}

interface SequencerStoreState {
  patternNumber: number;
  selectedTrack: string | null;
  // stepsPerBeat: number;
  // beatsPerBar: number;
  // barsPerSequence: number;
  currentStep: number;
  currentBeat: number;
  playing: boolean;
  trackIds: ReadonlyArray<string>;
  patternIds: Array<string>;
  selectedPattern: string;
  patternCounter: number;
  patterns: Record<string, Pattern>;

  /**
   * Each track on the sequencer, keyed by the trackId.
   */
  tracks: Readonly<Record<string, SequencerTrack>>;

  initSteps(): Array<Step>;
  initTrackSteps(): Record<string, Step[]>;
  initPattern(): Pattern;
  initTrack(name: string, sample: SampleInfo): SequencerTrack;

  setStepsPerBeat(stepsPerBeat: number): void;
  setBeatsPerBar(beatsPerBar: number): void;
  setBarsPerSequence(barsPerSequence: number): void;
  setCurrentStep(currentStep: number): void;
  setPlaying(playing: boolean): void;
  setTrackName(trackId: string, trackName: string): void;
  setTrackVolume(trackId: string, volume: number): void;
  setTrackPitch(trackId: string, pitch: number): void;
  setTrackPan(trackId: string, pan: number): void;
  setSelectedTrack(trackId: string | null): void;
  setSelectedPattern(patternId: string): void;
  setSelectedPatternIndex(index: number): void;

  addTrack(track: Readonly<SequencerTrack>): void;
  addPattern(): void;
  addSampleAsTrack(sample: SampleInfo): void;
  assignNewSampleToTrack(trackId: string, sample: SampleInfo): void;
  toggleTrackStep(trackId: string, stepNo: number): void;
  deleteTrack(trackId: string): void;
}

const defaultPatternKey = "Pattern 1";
const defaultStepsPerBeat = 4;
const defaultBeatsPerBar = 4;
const defaultBarsPerSequence = 1;

const defaultPan = 0;
const defaultVolume = 80;
const defaultPitch = 0;

const useSequencerStore = create<SequencerStoreState>()((set, get) => ({
  tracks: {},
  stepsPerBeat: defaultStepsPerBeat,
  beatsPerBar: defaultBeatsPerBar,
  barsPerSequence: defaultBarsPerSequence,
  currentStep: 1,
  currentBeat: 1,
  selectedTrack: null,
  playing: false,
  patternNumber: 0,
  trackIds: [],
  patternIds: [defaultPatternKey],
  selectedPattern: defaultPatternKey,
  patternCounter: 1,
  patterns: {
    [defaultPatternKey]: {
      id: defaultPatternKey,
      barsPerSequence: defaultBarsPerSequence,
      beatsPerBar: defaultBeatsPerBar,
      stepsPerBeat: defaultStepsPerBeat,
      trackSteps: {},
    },
  },
  initSteps() {
    const { selectedPattern, patterns } = get();
    const { beatsPerBar, stepsPerBeat, barsPerSequence } =
      patterns[selectedPattern];
    return Array.from(
      { length: beatsPerBar * stepsPerBeat * barsPerSequence },
      () => ({ active: false })
    );
  },
  initTrackSteps() {
    const { initSteps, trackIds } = get();
    const steps = initSteps();
    return trackIds.reduce((acc, id) => {
      acc[id] = [...steps];
      return acc;
    }, {} as Record<string, Array<Step>>);
  },
  initPattern() {
    const patternCounter = get().patternCounter + 1;
    set({ patternCounter });

    return {
      barsPerSequence: defaultBarsPerSequence,
      beatsPerBar: defaultBeatsPerBar,
      stepsPerBeat: defaultStepsPerBeat,
      trackSteps: get().initTrackSteps(),
      id: `Pattern ${patternCounter}`,
    };
  },
  initTrack(name, sample) {
    return {
      id: crypto.randomUUID(),
      name,
      sample,
      mute: false,
      pan: defaultPan,
      pitch: defaultPitch,
      volume: defaultVolume,
    };
  },
  addTrack(track) {
    set((state) => {
      const tracks = { ...state.tracks };
      const steps = state.initSteps();

      const updatedTrack: SequencerTrack = { ...track };

      const pattern = state.patterns[state.selectedPattern];
      pattern.trackSteps[track.id] = steps;
      tracks[track.id] = track;

      return {
        tracks,
        trackIds: [...state.trackIds, updatedTrack.id],
      };
    });
  },
  toggleTrackStep(trackId, stepNo) {
    set((state) => {
      const patterns = { ...state.patterns };
      const pattern = { ...patterns[state.selectedPattern] };

      const steps = state.initSteps().map((_, i) => {
        let active = pattern.trackSteps[trackId]?.[i]?.active ?? false;
        if (i === stepNo) {
          active = !active;
        }
        return { active } satisfies Step;
      });

      pattern.trackSteps[trackId] = steps;
      return { patterns };
    });
  },
  setBarsPerSequence(barsPerSequence) {
    set((state) => {
      const patterns = { ...state.patterns };
      const selectedPattern = { ...patterns[state.selectedPattern] };
      selectedPattern.barsPerSequence = barsPerSequence;
      patterns[state.selectedPattern] = selectedPattern;
      return { patterns };
    });
  },
  setBeatsPerBar(beatsPerBar) {
    set((state) => {
      const patterns = { ...state.patterns };
      const selectedPattern = { ...patterns[state.selectedPattern] };
      selectedPattern.beatsPerBar = beatsPerBar;
      patterns[state.selectedPattern] = selectedPattern;
      return { patterns };
    });
  },
  setStepsPerBeat(stepsPerBeat) {
    set((state) => {
      const patterns = { ...state.patterns };
      const selectedPattern = { ...patterns[state.selectedPattern] };
      selectedPattern.stepsPerBeat = stepsPerBeat;
      patterns[state.selectedPattern] = selectedPattern;
      return { patterns };
    });
  },
  addSampleAsTrack(sample) {
    set((state) => {
      const newTrack = state.initTrack(
        getFirst(sample.name.split(".")),
        sample
      );

      const tracks = {
        ...state.tracks,
        [newTrack.id]: newTrack,
      };

      const trackIds = [...state.trackIds, newTrack.id];

      const patterns = {
        ...state.patterns,
        [state.selectedPattern]: state.initPattern(),
      };

      return {
        tracks,
        trackIds,
        selectedTrack: newTrack.id,
        patterns,
      };
    });
  },
  assignNewSampleToTrack(trackId, sample) {
    set((state) => {
      if (!state.tracks[trackId]) return {};
      const tracks = { ...state.tracks };
      const track = { ...tracks[trackId] };
      track.sample = sample;

      return { tracks, selectedTrack: trackId };
    });
  },
  deleteTrack(trackId) {
    set((state) => {
      if (!state.tracks[trackId]) return {};
      const tracks = { ...state.tracks };
      const patterns = { ...state.patterns };

      delete tracks[trackId];
      state.patternIds.forEach(
        (patternId) => delete patterns[patternId].trackSteps[trackId]
      );

      const trackIds = state.trackIds.filter((id) => id !== trackId);

      const selectedTrack = (state.selectedTrack = trackId
        ? null
        : state.selectedTrack);

      return {
        tracks,
        patterns,
        selectedTrack,
        trackIds,
      };
    });
  },
  setTrackVolume(trackId, volume) {
    set((state) => {
      const tracks = { ...state.tracks };
      tracks[trackId] = { ...tracks[trackId] };
      tracks[trackId].volume = volume;
      return { tracks };
    });
  },
  setTrackPan(trackId, pan) {
    set((state) => {
      const tracks = { ...state.tracks };
      tracks[trackId] = { ...tracks[trackId] };
      tracks[trackId].pan = pan;
      return { tracks };
    });
  },
  setTrackPitch(trackId, pitch) {
    set((state) => {
      const tracks = { ...state.tracks };
      tracks[trackId] = { ...tracks[trackId] };
      tracks[trackId].pitch = pitch;
      return { tracks };
    });
  },
  setCurrentStep(currentStep) {
    set((state) => ({
      currentStep,
      currentBeat: Math.floor(
        currentStep / state.patterns[state.selectedPattern].stepsPerBeat
      ),
    }));
  },
  setPlaying(playing) {
    set({ playing });
  },
  setSelectedTrack(trackId) {
    set({ selectedTrack: trackId });
  },
  setTrackName(trackId, trackName) {
    set((state) => {
      const tracks = { ...state.tracks };
      tracks[trackId] = { ...tracks[trackId] };
      tracks[trackId].name = trackName;
      return { tracks };
    });
  },
  setSelectedPattern(patternId) {
    set({ selectedPattern: patternId });
  },
  setSelectedPatternIndex(index) {
    set((state) => {
      const selectedPattern = state.patternIds[index] ?? state.selectedPattern;
      return { selectedPattern };
    });
  },

  addPattern() {
    set((state) => {
      const newPattern = state.initPattern();

      const patterns = {
        ...state.patterns,
        [newPattern.id]: newPattern,
      };

      const patternIds = [...state.patternIds, newPattern.id];
      const selectedPattern = newPattern.id;

      return { selectedPattern, patternIds, patterns };
    });
  },
}));

export default useSequencerStore;

export function useIsPlaying() {
  const isPlaying = useSequencerStore((s) => s.playing);
  const setIsPlaying = useSequencerStore((s) => s.setPlaying);

  return [isPlaying, setIsPlaying] as const;
}

export function usePatternSteps() {
  const patternId = useSequencerStore((s) => s.selectedPattern);
  console.log("usePatternSteps - selectedPattern", patternId);

  const stepsPerBeat = useSequencerStore(
    (s) => s.patterns[patternId].stepsPerBeat
  );
  const beatsPerBar = useSequencerStore(
    (s) => s.patterns[patternId].beatsPerBar
  );
  const barsPerSequence = useSequencerStore(
    (s) => s.patterns[patternId].barsPerSequence
  );

  console.log("usePatternSteps", {
    stepsPerBeat,
    beatsPerBar,
    barsPerSequence,
  });

  return {
    stepsPerBeat,
    beatsPerBar,
    barsPerSequence,
    totalSteps: stepsPerBeat * beatsPerBar * barsPerSequence,
  };
}

/**
 * Loads the default samples and populates the sequencer with a track per sample
 */
export function useLoadSequencer() {
  useLoadDefaultSamples();
  const loadSamplesStatus = useSampleStore((s) => s.initState);
  const samples = useSampleStore((s) => s.samples);
  const addTrack = useSequencerStore((s) => s.addTrack);

  useEffect(() => {
    if (loadSamplesStatus !== "loaded") {
      return;
    }
    Object.values(samples).map((sample) => {
      addTrack({
        name: getFirst(sample.name.split(".")),
        sample: sample,
        id: crypto.randomUUID(),
        mute: false,
        pan: 0,
        pitch: 0,
        volume: 80,
      });
    });
    // dont want this to run every time samples chang
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addTrack, loadSamplesStatus]);
}

export function useWireTrackBufferNodes() {
  const audioContext = useAudioContext();
  const createBufferSource = useCreateSampleBufferSource();

  return function (track: SequencerTrack) {
    const bufferSource = createBufferSource(track.sample.url);

    const { pan, pitch, volume } = track;

    bufferSource.detune.value = pitch * 100;

    const gainNode = audioContext.createGain();
    gainNode.gain.value = volume / 100;

    const pannerNode = audioContext.createStereoPanner();
    pannerNode.pan.value = pan / 100;

    bufferSource.connect(gainNode);
    gainNode.connect(pannerNode);
    pannerNode.connect(audioContext.destination);

    return [bufferSource, [gainNode, pannerNode]] as const;
  };
}

export function useSequencer() {
  const { stepsPerBeat, totalSteps } = usePatternSteps();
  const audioContext = useAudioContext();
  const currentStep = useRef(0);
  const setCurrentStep = useSequencerStore((s) => s.setCurrentStep);
  const wireTrackNodes = useWireTrackBufferNodes();
  const [isPlaying, setIsPlaying] = useIsPlaying();
  const [bpm] = useBpm();

  const secondsPerBeat = 60 / bpm;
  const stepInterval = secondsPerBeat / stepsPerBeat;

  const playSample = useCallback(
    (track: SequencerTrack) => {
      const [bufferSource, nodes] = wireTrackNodes(track);
      getLast(nodes).connect(audioContext.destination);
      bufferSource.start();
    },
    [audioContext.destination, wireTrackNodes]
  );

  useEffect(() => {
    if (!audioContext) return;
    let nextStepTime = 0;
    let frameId: number | null = null;
    const tick = () => {
      if (!audioContext) return;
      const { currentTime } = audioContext;
      const { tracks, selectedPattern, patterns } =
        useSequencerStore.getState();
      const pattern = patterns[selectedPattern];
      while (nextStepTime < currentTime + 0.01) {
        setCurrentStep(currentStep.current);
        for (const track of Object.values(tracks)) {
          if (
            !track.mute &&
            pattern.trackSteps[track.id]?.[currentStep.current]?.active
          ) {
            playSample(track);
          }
        }
        currentStep.current = (currentStep.current + 1) % totalSteps;
        nextStepTime += stepInterval;
      }
      frameId = requestAnimationFrame(tick);
    };
    if (isPlaying) {
      nextStepTime = audioContext.currentTime;
      frameId = requestAnimationFrame(tick);
    } else {
      if (frameId) cancelAnimationFrame(frameId);
      currentStep.current = 0;
    }

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [
    audioContext,
    isPlaying,
    playSample,
    setCurrentStep,
    stepInterval,
    totalSteps,
  ]);

  const play = () => setIsPlaying(true);
  const stop = () => setIsPlaying(false);
  const togglePlayStop = () => setIsPlaying(!isPlaying);

  return { play, stop, togglePlayStop, isPlaying };
}
