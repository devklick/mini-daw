import useSequencerStore from "../../../stores/useSequencerStore";
import "./SequencerProgress.scss";

function SequencerProgress() {
  const currentStep = useSequencerStore((s) => s.currentStep);
  const stepsPerBeat = useSequencerStore((s) => s.stepsPerBeat);
  const beatsPerBar = useSequencerStore((s) => s.beatsPerBar);
  const barsPerSequence = useSequencerStore((s) => s.barsPerSequence);
  const totalSteps = stepsPerBeat * beatsPerBar * barsPerSequence;
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
