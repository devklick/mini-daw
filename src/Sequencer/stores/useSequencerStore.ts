import { useCallback, useEffect, useRef } from "react";
import { create } from "zustand";
import useSampleStore, {
  SampleInfo,
  useLoadDefaultSamples,
} from "../../Samples/stores/useSamplesStore";
import { getFirst } from "../../utils/arrayUtils";
import { useAudioContext } from "../../stores/useDawStore";

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
   * - Min: -12
   * - Max: 12
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
  selectedTrack: number | null;
  stepsPerBeat: number;
  beatsPerBar: number;
  barsPerSequence: number;
  tracks: ReadonlyArray<Readonly<SequencerTrack>>;
  currentStep: number;
  currentBeat: number;
  playing: boolean;
  addTrack(track: Readonly<SequencerTrack>): void;
  addSampleAsTrack(sample: SampleInfo): void;
  assignNewSampleToTrack(trackId: string, sample: SampleInfo): void;
  toggleTrackStep(trackNo: number, stepNo: number): void;
  setStepsPerBeat(stepsPerBeat: number): void;
  setBeatsPerBar(beatsPerBar: number): void;
  setBarsPerSequence(barsPerSequence: number): void;
  deleteTrack(trackId: string): void;
  setTrackVolume(trackId: string, volume: number): void;
  setTrackPitch(trackId: string, pitch: number): void;
  setTrackPan(trackId: string, pan: number): void;
  setCurrentStep(currentStep: number): void;
  setPlaying(playing: boolean): void;
  setSelectedTrack(trackNo: number | null): void;
  setTrackName(trackNo: number, trackName: string): void;
}

const useSequencerStore = create<SequencerStoreState>()((set, get) => ({
  tracks: [],
  stepsPerBeat: 4,
  beatsPerBar: 4,
  barsPerSequence: 1,
  currentStep: 1,
  currentBeat: 1,
  selectedTrack: 0,
  playing: false,
  addTrack(track) {
    const { beatsPerBar, stepsPerBeat, barsPerSequence } = get();
    const steps = Array.from(
      { length: beatsPerBar * stepsPerBeat * barsPerSequence },
      () => false
    );

    const updatedTrack: SequencerTrack = { ...track, steps };

    set((state) => {
      return { tracks: [...state.tracks, updatedTrack] };
    });
  },
  toggleTrackStep(trackNo, stepNo) {
    set((state) => {
      return {
        tracks: state.tracks.map((track, index) => {
          if (index !== trackNo) return track;

          const { beatsPerBar, stepsPerBeat, barsPerSequence } = state;

          const newSteps = Array.from(
            { length: beatsPerBar * stepsPerBeat * barsPerSequence },
            (_, i) => (i === stepNo ? !track.steps[i] : track.steps[i] ?? false)
          );

          return {
            ...track,
            steps: newSteps,
          };
        }),
      };
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
    set((state) => ({
      tracks: [
        ...state.tracks,
        {
          id: crypto.randomUUID(),
          name: getFirst(sample.name.split(".")),
          sample,
          steps: [],
          mute: false,
          pan: 0,
          pitch: 0,
          volume: 80,
        },
      ],
      selectedTrack: state.tracks.length,
    }));
  },
  assignNewSampleToTrack(trackId, sample) {
    set((state) => {
      const trackIndex = state.tracks.findIndex((t) => t.id === trackId);
      if (trackIndex < 0) return {};
      const track = {
        ...state.tracks[trackIndex],
        sample,
      };

      const updatedTracks = [...state.tracks];
      updatedTracks[trackIndex] = track;

      const selectedTrack = trackIndex;

      return { tracks: updatedTracks, selectedTrack };
    });
  },
  deleteTrack(trackId) {
    set((state) => {
      const updatedTracks = state.tracks.filter((t) => t.id !== trackId);
      const selectedTrack =
        updatedTracks.length && state.selectedTrack
          ? Math.min(state.selectedTrack, updatedTracks.length - 1)
          : null;
      return { tracks: updatedTracks, selectedTrack };
    });
  },
  setTrackVolume(trackId, volume) {
    set((state) => ({
      tracks: state.tracks.map((track) => {
        if (track.id !== trackId) return track;
        return { ...track, volume };
      }),
    }));
  },
  setTrackPan(trackId, pan) {
    set((state) => ({
      tracks: state.tracks.map((track) => {
        if (track.id !== trackId) return track;
        return { ...track, pan };
      }),
    }));
  },
  setTrackPitch(trackId, pitch) {
    set((state) => ({
      tracks: state.tracks.map((track) => {
        if (track.id !== trackId) return track;
        return { ...track, pitch };
      }),
    }));
  },
  setCurrentStep(currentStep) {
    const { stepsPerBeat } = get();
    const currentBeat = Math.floor(currentStep / stepsPerBeat);
    set({ currentStep, currentBeat });
  },
  setPlaying(playing) {
    set({ playing });
  },
  setSelectedTrack(trackNo) {
    set({ selectedTrack: trackNo });
  },
  setTrackName(trackNo, trackName) {
    set((state) => ({
      tracks: state.tracks.map((track, i) => {
        if (trackNo === i) {
          return { ...track, name: trackName };
        }
        return track;
      }),
    }));
  },
}));

export default useSequencerStore;

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

export function useSequencer() {
  const tracks = useSequencerStore((s) => s.tracks);
  const stepsPerBeat = useSequencerStore((s) => s.stepsPerBeat);
  const beatsPerBar = useSequencerStore((s) => s.beatsPerBar);
  const barsPerSequence = useSequencerStore((s) => s.barsPerSequence);
  const trackBuffers = useRef<Record<string, AudioBuffer>>({});
  const audioContext = useAudioContext();
  const isPlaying = useSequencerStore((s) => s.playing);
  const setIsPlaying = useSequencerStore((s) => s.setPlaying);
  const currentStep = useRef(0);
  const setCurrentStep = useSequencerStore((s) => s.setCurrentStep);

  // TODO: Configurable bpm in global state
  const bpm = 127;
  const secondsPerBeat = 60 / bpm;
  const stepInterval = secondsPerBeat / stepsPerBeat;
  const totalSteps = stepsPerBeat * beatsPerBar * barsPerSequence;

  /**
   * Fetch the audio samples and convert to audio buffers
   */
  useEffect(() => {
    const loadBuffers = async () => {
      if (!audioContext) return;
      for (const track of tracks) {
        if (trackBuffers.current[track.id]) continue;
        const response = await fetch(track.sample.url);
        const arrayBuff = await response.arrayBuffer();
        const audioBuff = await audioContext.decodeAudioData(arrayBuff);
        trackBuffers.current[track.id] = audioBuff;
      }
    };

    loadBuffers();
  }, [audioContext, tracks]);

  const playSample = useCallback(
    (track: SequencerTrack) => {
      const audioBuffer = trackBuffers.current[track.id];
      const { pan, pitch, volume } = track;
      if (!audioBuffer || !audioContext) return;

      const bufferSource = audioContext.createBufferSource();
      bufferSource.buffer = audioBuffer;

      bufferSource.detune.value = pitch * 100;

      const gainNode = audioContext.createGain();
      gainNode.gain.value = volume / 100;

      const pannerNode = audioContext.createStereoPanner();
      pannerNode.pan.value = pan / 100;

      bufferSource.connect(gainNode);
      gainNode.connect(pannerNode);
      pannerNode.connect(audioContext.destination);

      bufferSource.start();
    },
    [audioContext]
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
        for (const track of tracks) {
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

  return { play, stop };
}
