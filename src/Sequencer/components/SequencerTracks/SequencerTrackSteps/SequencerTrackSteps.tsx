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
  return (
    <div className="sequencer-track-steps">
      {Array.from({ length: stepCount }, (_, i) => (
        <SequencerStep trackNo={trackNo} stepNo={i} />
      ))}
    </div>
  );
}

export default SequencerTrackSteps;
