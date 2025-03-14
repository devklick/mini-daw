import { usePatternSteps } from "../../../stores/useSequencerStore";

import "./SequencerStepsBackground.scss";

/**
 * A background who's height spans the number of tracks in the sequencer
 * and who's width spans the number of steps in the sequencer.
 */
function SequencerStepsBackground() {
  const { beatsPerBar, barsPerSequence } = usePatternSteps();
  const beatsInSequence = beatsPerBar * barsPerSequence;

  return (
    <div className="sequencer-steps-background">
      {Array.from({ length: beatsInSequence }, (_, i) => (
        <div className="sequencer-steps-background__part" key={i} />
      ))}
    </div>
  );
}

export default SequencerStepsBackground;
