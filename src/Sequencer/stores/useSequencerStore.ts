import { useCallback, useEffect, useRef } from "react";
import { create } from "zustand";
import useSampleStore, {
  SampleInfo,
  useCreateSampleBufferSource,
  useLoadDefaultSamples,
} from "../../Samples/stores/useSamplesStore";
import { getFirst, getLast } from "../../utils/arrayUtils";
import { useAudioContext, useBpm } from "../../stores/useDawStore";

export interface SequencerTrack {
  id: string;
  name: string;
  sample: SampleInfo;
  steps: Array<boolean>;
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
  stepsPerBeat: number;
  beatsPerBar: number;
  barsPerSequence: number;
  currentStep: number;
  currentBeat: number;
  playing: boolean;
  trackIds: ReadonlyArray<string>;

  /**
   * Each track on the sequencer, keyed by the trackId.
   */
  tracks: Readonly<Record<string, SequencerTrack>>;
  addTrack(track: Readonly<SequencerTrack>): void;
  addSampleAsTrack(sample: SampleInfo): void;
  assignNewSampleToTrack(trackId: string, sample: SampleInfo): void;
  toggleTrackStep(trackId: string, stepNo: number): void;
  setStepsPerBeat(stepsPerBeat: number): void;
  setBeatsPerBar(beatsPerBar: number): void;
  setBarsPerSequence(barsPerSequence: number): void;
  deleteTrack(trackId: string): void;
  setTrackVolume(trackId: string, volume: number): void;
  setTrackPitch(trackId: string, pitch: number): void;
  setTrackPan(trackId: string, pan: number): void;
  setCurrentStep(currentStep: number): void;
  setPlaying(playing: boolean): void;
  setSelectedTrack(trackId: string | null): void;
  setTrackName(trackId: string, trackName: string): void;
  generateTrackSteps(): Array<boolean>;
}

const useSequencerStore = create<SequencerStoreState>()((set, get) => ({
  tracks: {},
  stepsPerBeat: 4,
  beatsPerBar: 4,
  barsPerSequence: 1,
  currentStep: 1,
  currentBeat: 1,
  selectedTrack: null,
  playing: false,
  patternNumber: 0,
  trackIds: [],
  generateTrackSteps() {
    const { beatsPerBar, stepsPerBeat, barsPerSequence } = get();
    return Array.from(
      { length: beatsPerBar * stepsPerBeat * barsPerSequence },
      () => false
    );
  },
  addTrack(track) {
    const steps = get().generateTrackSteps();

    const updatedTrack: SequencerTrack = { ...track, steps };

    set((state) => {
      const tracks = { ...state.tracks };
      tracks[track.id] = track;
      return {
        tracks,
        trackIds: [...state.trackIds, updatedTrack.id],
      };
    });
  },
  toggleTrackStep(trackId, stepNo) {
    set((state) => {
      const tracks = { ...state.tracks };
      const steps = get()
        .generateTrackSteps()
        .map((_, i) =>
          i === stepNo
            ? !tracks[trackId].steps[i]
            : tracks[trackId].steps[i] ?? false
        );

      tracks[trackId] = { ...tracks[trackId], steps };
      return { tracks };
    });
  },
  setBarsPerSequence(barsPerSequence) {
    set({ barsPerSequence });
  },
  setBeatsPerBar(beatsPerBar) {
    set({ beatsPerBar });
  },
  setStepsPerBeat(stepsPerBeat) {
    set({ stepsPerBeat });
  },
  addSampleAsTrack(sample) {
    set((state) => {
      const id = crypto.randomUUID();
      const tracks = { ...state.tracks };
      tracks[id] = {
        id: id,
        name: getFirst(sample.name.split(".")),
        sample,
        steps: [],
        mute: false,
        pan: 0,
        pitch: 0,
        volume: 80,
      };
      return {
        tracks,
        trackIds: [...state.trackIds, id],
        selectedTrack: id,
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

      delete tracks[trackId];

      const trackIds = state.trackIds.filter((id) => id !== trackId);

      const selectedTrack = (state.selectedTrack = trackId
        ? null
        : state.selectedTrack);

      return {
        tracks,
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
    const { stepsPerBeat } = get();
    const currentBeat = Math.floor(currentStep / stepsPerBeat);
    set({ currentStep, currentBeat });
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
}));

export default useSequencerStore;

export function useIsPlaying() {
  const isPlaying = useSequencerStore((s) => s.playing);
  const setIsPlaying = useSequencerStore((s) => s.setPlaying);

  return [isPlaying, setIsPlaying] as const;
}

export function useSequencerSteps() {
  const stepsPerBeat = useSequencerStore((s) => s.stepsPerBeat);
  const beatsPerBar = useSequencerStore((s) => s.beatsPerBar);
  const barsPerSequence = useSequencerStore((s) => s.barsPerSequence);

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
        steps: [],
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
  const { stepsPerBeat, totalSteps } = useSequencerSteps();
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
      const { tracks } = useSequencerStore.getState();
      while (nextStepTime < currentTime + 0.01) {
        setCurrentStep(currentStep.current);
        for (const track of Object.values(tracks)) {
          if (!track.mute && track.steps[currentStep.current]) {
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
