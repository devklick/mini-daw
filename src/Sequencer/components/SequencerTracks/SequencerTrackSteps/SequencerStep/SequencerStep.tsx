import clsx from "clsx";
import "./SequencerStep.scss";
import useSequencerStore from "../../../../stores/useSequencerStore";

interface SequencerStepProps {
  trackNo: number;
  stepNo: number;
}

function SequencerStep({ stepNo, trackNo }: SequencerStepProps) {
  const step = useSequencerStore((s) => s.tracks[trackNo].steps[stepNo]);
  const toggleTrackStep = useSequencerStore((s) => s.toggleTrackStep);

  return (
    <div className={"track-step"}>
      <button
        onClick={() => toggleTrackStep(trackNo, stepNo)}
        className={clsx("track-step-toggle", {
          ["track-step-toggle--active"]: step,
          ["track-step-toggle--inactive"]: !step,
        })}
      />
    </div>
  );
}

export default SequencerStep;
