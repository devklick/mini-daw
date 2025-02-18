import useSequencerStore from "../../stores/useSequencerStore";
import SequencerBeat from "../SequencerBeat";

import "./SequencerTrack.scss";

interface SequencerTrackProps {
  trackNo: number;
}

function SequencerTrack({ trackNo }: SequencerTrackProps) {
  const trackName = useSequencerStore((s) => s.tracks[trackNo].name);
  const beatsPerBar = useSequencerStore((s) => s.beatsPerBar);
  const barsPerSequence = useSequencerStore((s) => s.barsPerSequence);
  const beatsInSequence = beatsPerBar * barsPerSequence;
  return (
    <div className="sequencer-track">
      <div className="sequencer-track__info">
        <span>{trackName}</span>
      </div>
      <div
        className={"sequencer-track__beats"}
        style={{ gridTemplateColumns: `repeat(${beatsInSequence}, 1fr)` }}
      >
        {Array.from({ length: beatsInSequence }).map((_, i) => (
          <SequencerBeat trackNo={trackNo} beatNo={i} />
        ))}
      </div>
    </div>
  );
}
export default SequencerTrack;
