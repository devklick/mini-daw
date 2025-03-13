import clsx from "clsx";
import "./SequencerStep.scss";
import useSequencerStore from "../../../../stores/useSequencerStore";

interface SequencerStepProps {
  trackId: string;
  stepNo: number;
}

function SequencerStep({ stepNo, trackId }: SequencerStepProps) {
  const selectedPattern = useSequencerStore((s) => s.selectedPattern);
  const step = useSequencerStore(
    (s) => s.patterns[selectedPattern]?.trackSteps[trackId]?.[stepNo]?.active
  );
  const toggleTrackStep = useSequencerStore((s) => s.toggleTrackStep);

  return (
    <div className={"track-step"}>
      <button
        onClick={() => toggleTrackStep(trackId, stepNo)}
        className={clsx("track-step-toggle", {
          ["track-step-toggle--active"]: step,
          ["track-step-toggle--inactive"]: !step,
        })}
      />
    </div>
  );
}

export default SequencerStep;
