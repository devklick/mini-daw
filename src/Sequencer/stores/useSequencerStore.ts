import { useEffect, useRef, useState } from "react";
import { create } from "zustand";
import useSampleStore, {
  SampleInfo,
  useLoadDefaultSamples,
} from "../../Samples/stores/useSamplesStore";
import { getFirst } from "../../utils/arrayUtils";

interface SequencerTrack {
  id: string;
  name: string;
  sample: SampleInfo;
  steps: Array<boolean>;
}

interface SequencerStoreState {
  stepsPerBeat: number;
  beatsPerBar: number;
  barsPerSequence: number;
  tracks: ReadonlyArray<Readonly<SequencerTrack>>;
  addTrack(track: Readonly<SequencerTrack>): void;
  toggleTrackStep(trackNo: number, stepNo: number): void;
}

const useSequencerStore = create<SequencerStoreState>()((set) => ({
  tracks: [],
  stepsPerBeat: 4,
  beatsPerBar: 4,
  barsPerSequence: 1,
  addTrack(track) {
    set((state) => {
      return { tracks: [...state.tracks, track] };
    });
  },
  toggleTrackStep(trackNo, stepNo) {
    set((state) => {
      // TODO: Tidy this up with immer
      const tracks = Array.from(state.tracks);
      const track = tracks[trackNo];
      if (!track) return {};

      const newSteps = [...track.steps];
      newSteps[stepNo] = !newSteps[stepNo];

      const updatedTrack = {
        ...track,
        steps: newSteps,
      };

      tracks[trackNo] = updatedTrack;

      return { tracks };
    });
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
      });
    });
  }, [addTrack, loadSamplesStatus, samples]);
}

export function useSequencer() {
  const tracks = useSequencerStore((s) => s.tracks);
  const stepsPerBeat = useSequencerStore((s) => s.stepsPerBeat);
  const beatsPerBar = useSequencerStore((s) => s.beatsPerBar);
  const barsPerSequence = useSequencerStore((s) => s.barsPerSequence);
  const trackBuffers = useRef<Record<string, AudioBuffer>>({});
  const audioContext = useRef<AudioContext | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const currentStep = useRef(0);

  // TODO: Configurable bpm in global state
  const bpm = 130;
  const secondsPerBeat = 60 / bpm;
  const stepInterval = secondsPerBeat / stepsPerBeat;
  const totalSteps = stepsPerBeat * beatsPerBar * barsPerSequence;

  /**
   * Create our audio context
   */
  useEffect(() => {
    if (!audioContext.current) {
      audioContext.current = new window.AudioContext();
    }
  }, []);

  /**
   * Fetch the audio samples and convert to audio buffers
   */
  useEffect(() => {
    const loadBuffers = async () => {
      if (!audioContext.current) return;
      for (const track of tracks) {
        const response = await fetch(track.sample.url);
        const arrayBuff = await response.arrayBuffer();
        const audioBuff = await audioContext.current.decodeAudioData(arrayBuff);
        trackBuffers.current[track.id] = audioBuff;
      }
    };

    loadBuffers();
  }, [tracks]);

  useEffect(() => {
    if (!audioContext.current) return;
    let frameId: number | null = null;
    let nextStepTime = 0;
    const tick = () => {
      if (!audioContext.current) return;
      const { currentTime } = audioContext.current;
      while (nextStepTime < currentTime + 0.01) {
        for (const track of tracks) {
          if (track.steps[currentStep.current]) {
            playSample(track.id);
          }
        }
        currentStep.current = (currentStep.current + 1) % totalSteps;
        nextStepTime += stepInterval;
      }
      frameId = requestAnimationFrame(tick);
    };
    if (isPlaying) {
      nextStepTime = audioContext.current.currentTime;
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
  });

  function playSample(trackId: string) {
    const audioBuffer = trackBuffers.current[trackId];
    if (!audioBuffer || !audioContext.current) return;
    const bufferSource = audioContext.current.createBufferSource();
    bufferSource.buffer = audioBuffer;
    bufferSource.connect(audioContext.current.destination);
    bufferSource.start();
  }

  const play = () => setIsPlaying(true);
  const stop = () => setIsPlaying(false);

  return { play, stop };
}
