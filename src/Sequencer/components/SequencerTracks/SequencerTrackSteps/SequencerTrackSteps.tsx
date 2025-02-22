import useSequencerStore from "../../../stores/useSequencerStore";
import SequencerStep from "./SequencerStep";
import "./SequencerTrackSteps.scss";

interface SequencerTrackStepsProps {
  trackNo: number;
}

function SequencerTrackSteps({ trackNo }: SequencerTrackStepsProps) {
  const stepsPerBeat = useSequencerStore((s) => s.stepsPerBeat);
  const beatsPerBar = useSequencerStore((s) => s.beatsPerBar);
  const barsPerSequence = useSequencerStore((s) => s.barsPerSequence);
  const stepCount = stepsPerBeat * beatsPerBar * barsPerSequence;
  const setSelected = useSequencerStore((s) => s.setSelectedTrack);
  return (
    <div className="sequencer-track-steps" onClick={() => setSelected(trackNo)}>
      {Array.from({ length: stepCount }, (_, i) => (
        <SequencerStep trackNo={trackNo} stepNo={i} key={i} />
      ))}
    </div>
  );
}

export default SequencerTrackSteps;
