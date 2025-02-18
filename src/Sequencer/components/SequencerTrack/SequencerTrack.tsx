import useSequencerStore from "../../stores/useSequencerStore";
import SequencerStep from "../SequencerStep";

import "./SequencerTrack.scss";

interface SequencerTrackProps {
  trackNo: number;
}

function SequencerTrack({ trackNo }: SequencerTrackProps) {
  const trackName = useSequencerStore((s) => s.tracks[trackNo].name);
  const stepsPerBeat = useSequencerStore((s) => s.stepsPerBeat);
  const beatsPerBar = useSequencerStore((s) => s.beatsPerBar);
  const barsPerSequence = useSequencerStore((s) => s.barsPerSequence);
  const stepsInSequence = stepsPerBeat * beatsPerBar * barsPerSequence;

  return (
    <div className="sequencer-track">
      <div className="track-info">
        <span>{trackName}</span>
      </div>
      <div className="track-steps">
        {Array.from({ length: stepsInSequence }).map((_, i) => (
          <SequencerStep trackNo={trackNo} stepNo={i} key={`step-${i}`} />
        ))}
      </div>
    </div>
  );
}
export default SequencerTrack;
