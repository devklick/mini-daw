import useSequencerStore, {
  usePatternSteps,
} from "../../../stores/useSequencerStore";
import "./SequencerProgress.scss";

function SequencerProgress() {
  const currentStep = useSequencerStore((s) => s.currentStep);
  const { totalSteps } = usePatternSteps();
  const isPlaying = useSequencerStore((s) => s.playing);
  const position = (100 / totalSteps) * currentStep;
  return (
    <div className="sequencer-progress">
      {isPlaying && (
        <div
          className="sequencer-progress__indicator"
          style={{ left: `${position}%`, width: `${100 / totalSteps}%` }}
        />
      )}
    </div>
  );
}

export default SequencerProgress;
