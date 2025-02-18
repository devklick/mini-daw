import clsx from "clsx";
import useSequencerStore from "../../stores/useSequencerStore";
import "./SequencerStep.scss";

interface SequencerStepProps {
  trackNo: number;
  stepNo: number;
}

function SequencerStep({ stepNo, trackNo }: SequencerStepProps) {
  const tracksLength = useSequencerStore((s) => s.tracks.length);
  const stepsPerBeat = useSequencerStore((s) => s.stepsPerBeat);
  const beatsPerBar = useSequencerStore((s) => s.beatsPerBar);
  const step = useSequencerStore((s) => s.tracks[trackNo].steps[stepNo]);
  const barsPerSequence = useSequencerStore((s) => s.barsPerSequence);
  const toggleTrackStep = useSequencerStore((s) => s.toggleTrackStep);

  const beatNo = Math.floor(stepNo / stepsPerBeat);
  const stepsLength = stepsPerBeat * beatsPerBar * barsPerSequence;
  const lastTrack = trackNo === tracksLength - 1;
  const lastStep = stepNo === stepsLength - 1;
  const roundSE = lastStep && lastTrack;
  const roundSW = stepNo === 0 && lastTrack;
  const roundNE = lastStep && trackNo === 0;
  const roundNW = stepNo === 0 && trackNo === 0;
  const isEven = beatNo % 2 === 0;

  return (
    <div
      className={clsx("track-step-group", {
        "track-step-group--odd": !isEven,
        "track-step-group--even": isEven,
        "track-step-group--round-nw": roundNW,
        "track-step-group--round-ne": roundNE,
        "track-step-group--round-se": roundSE,
        "track-step-group--round-sw": roundSW,
      })}
      key={beatNo}
    >
      <div className="track-step">
        <button
          onClick={() => toggleTrackStep(trackNo, stepNo)}
          className={clsx("track-step-toggle", {
            ["track-step-toggle--active"]: step,
            ["track-step-toggle--inactive"]: !step,
          })}
        />
      </div>
    </div>
  );
}

export default SequencerStep;
