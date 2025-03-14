import useSequencerStore, {
  usePatternSteps,
} from "../../../stores/useSequencerStore";
import SequencerStep from "./SequencerStep";
import "./SequencerTrackSteps.scss";

interface SequencerTrackStepsProps {
  trackId: string;
}

function SequencerTrackSteps({ trackId }: SequencerTrackStepsProps) {
  const { totalSteps } = usePatternSteps();
  const setSelected = useSequencerStore((s) => s.setSelectedTrack);
  return (
    <div className="sequencer-track-steps" onClick={() => setSelected(trackId)}>
      {Array.from({ length: totalSteps }, (_, i) => (
        <SequencerStep trackId={trackId} stepNo={i} key={i} />
      ))}
    </div>
  );
}

export default SequencerTrackSteps;
