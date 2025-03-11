import clsx from "clsx";
import "./SequencerStep.scss";
import useSequencerStore from "../../../../stores/useSequencerStore";

interface SequencerStepProps {
  trackId: string;
  stepNo: number;
}

function SequencerStep({ stepNo, trackId }: SequencerStepProps) {
  const step = useSequencerStore((s) => s.tracks[trackId]?.steps?.[stepNo]);
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
