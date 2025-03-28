import { create } from "zustand";
import { Range } from "../../../utils/numberUtils";

/**
 * The `Position` indicates a specific point on the arranger. It's format is:
 * `BAR.BEAT.TICK.%`, where:
 *  - BAR = number
 *  - BEAT = 1-4
 *  - TICK = 1-4
 *  - % = 0-99
 *
 * @todo Revisit this type - the range per section may be unnecessary and cause
 * a degradation in the type checkers performance.
 */
type Position = `${number}.${Range<1, 4>}.${Range<1, 4>}.${Range<0, 99>}`;

/**
 * Not to be confused with a Pattern on the Sequencer. A Sequencer Pattern may
 * exist on the Arranger multiple times, where it would become a unique Arranger
 * Pattern every time.
 */
interface ArrangerPattern {
  /**
   * The ID of the track that the pattern is positioned on.
   */
  trackId: string;
  /**
   * The ID of the pattern on the arranger.
   *
   
   */
  arrangerPatternId: string;

  /**
   * The ID of the sequencer pattern that the sequencer pattern relates to.
   */
  sequencerPatternId: string;

  /**
   * The position of the pattern on the track.
   */
  position: Position;
}

/**
 * Information and configuration about a specific Track on the Arranger.
 */
interface Track {
  /**
   * The ID of the track on the arranger.
   */
  trackId: string;
}

interface ArrangerStoreState {
  /**
   * The IDs of the tracks on the arranger.
   *
   * Not to be confused with Sequencer Track IDs. These are separate.
   * An arranger track can consist of multiple different patterns, where each
   * pattern consists of multiple Sequencer tracks.
   */
  trackIds: Array<string>;

  /**
   * Configs scoped to a single track.
   *
   * The Record is keyed by the trackId, and the value is the track config
   * trackId > track
   */
  tracks: Record<string, Track>;

  /**
   * The IDs of all the arranger patterns on the given track. The Record is
   * keyed by the trackId and the value is a list of arranger patterns IDs.
   */
  patternIds: Record<string, Array<string>>;
  /**
   * The patterns on a specific track.
   *
   * The Record is keyed by the trackId, and the value is an Record, where the
   * key is the arranger pattern Id, and the value is the pattern
   * trackId > patternId > pattern
   */
  patterns: Record<string, Record<string, ArrangerPattern>>;

  addPatternToTrack(
    trackId: string,
    sequencerPatternId: string,
    position: Position
  ): void;

  addPatternToNewTrack(sequencerPatternId: string, position: Position): void;

  deletePatternFromTrack(trackId: string, arrangerPatternId: string): void;

  deleteTrack(trackId: string): void;
}

const useArrangerStore = create<ArrangerStoreState>()((set) => ({
  trackIds: [],
  tracks: {},
  patternIds: {},
  patterns: {},
  addPatternToTrack(trackId, sequencerPatternId, position) {
    set((state) => {
      const arrangerPatternId = crypto.randomUUID();

      const patternIds = { ...state.patternIds };
      patternIds[trackId].push(arrangerPatternId);

      const patterns = { ...state.patterns };
      patterns[trackId][arrangerPatternId] = {
        arrangerPatternId,
        position,
        sequencerPatternId,
        trackId,
      };
      return { patternIds, patterns };
    });
  },
  addPatternToNewTrack(sequencerPatternId, position) {
    set((state) => {
      const trackId = crypto.randomUUID();
      const trackIds = [...state.trackIds, trackId];
      const tracks = { ...state.tracks };
      tracks[trackId] = { trackId };

      const arrangerPatternId = crypto.randomUUID();
      const patternIds = { ...state.patternIds };
      patternIds[trackId].push(arrangerPatternId);
      const patterns = { ...state.patterns };
      patterns[trackId][arrangerPatternId] = {
        arrangerPatternId,
        position,
        sequencerPatternId,
        trackId,
      };
      return { trackIds, tracks, patternIds, patterns };
    });
  },
  deletePatternFromTrack(trackId, arrangerPatternId) {
    set((state) => {
      const patternIds = { ...state.patternIds };
      patternIds[trackId] = patternIds[trackId].filter(
        (id) => id !== arrangerPatternId
      );

      const patterns = { ...state.patterns };
      delete patterns[trackId][arrangerPatternId];

      return { patternIds, patterns };
    });
  },

  deleteTrack(trackId) {
    set((state) => {
      const trackIds = [...state.trackIds].filter((id) => id !== trackId);
      const tracks = { ...state.tracks };
      delete tracks[trackId];
      return { trackIds, tracks };
    });
  },
}));

export default useArrangerStore;
