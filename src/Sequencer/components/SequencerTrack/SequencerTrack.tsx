import useSequencerStore from "../../stores/useSequencerStore";
import SequencerBeat from "../SequencerBeat";

import "./SequencerTrack.scss";
import SequencerTrackHeader from "./SequencerTrackHeader";

interface SequencerTrackProps {
  trackNo: number;
}

function SequencerTrack({ trackNo }: SequencerTrackProps) {
  const beatsPerBar = useSequencerStore((s) => s.beatsPerBar);
  const barsPerSequence = useSequencerStore((s) => s.barsPerSequence);
  const beatsInSequence = beatsPerBar * barsPerSequence;
  return (
    <div className="sequencer-track">
      <SequencerTrackHeader trackNo={trackNo} />
      <div
        className={"sequencer-track__beats"}
        style={{ gridTemplateColumns: `repeat(${beatsInSequence}, 1fr)` }}
      >
        {Array.from({ length: beatsInSequence }).map((_, i) => (
          <SequencerBeat trackNo={trackNo} beatNo={i} key={i} />
        ))}
      </div>
    </div>
  );
}
export default SequencerTrack;
