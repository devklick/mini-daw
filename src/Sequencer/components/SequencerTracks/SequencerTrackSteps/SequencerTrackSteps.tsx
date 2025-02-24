import useSequencerStore, {
  useSequencerSteps,
} from "../../../stores/useSequencerStore";
import SequencerStep from "./SequencerStep";
import "./SequencerTrackSteps.scss";

interface SequencerTrackStepsProps {
  trackNo: number;
}

function SequencerTrackSteps({ trackNo }: SequencerTrackStepsProps) {
  const { totalSteps } = useSequencerSteps();
  const setSelected = useSequencerStore((s) => s.setSelectedTrack);
  return (
    <div className="sequencer-track-steps" onClick={() => setSelected(trackNo)}>
      {Array.from({ length: totalSteps }, (_, i) => (
        <SequencerStep trackNo={trackNo} stepNo={i} key={i} />
      ))}
    </div>
  );
}

export default SequencerTrackSteps;
