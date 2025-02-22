import useSequencerStore from "../../../stores/useSequencerStore";

import "./SequencerStepsBackground.scss";

/**
 * A background who's height spans the number of tracks in the sequencer
 * and who's width spans the number of steps in the sequencer.
 */
function SequencerStepsBackground() {
  const beatsPerBar = useSequencerStore((s) => s.beatsPerBar);
  const barsPerSequence = useSequencerStore((s) => s.barsPerSequence);
  const beatsInSequence = beatsPerBar * barsPerSequence;

  return (
    <div className="sequencer-steps-background">
      {Array.from({ length: beatsInSequence }, () => (
        <div className="sequencer-steps-background__part" />
      ))}
    </div>
  );
}

export default SequencerStepsBackground;
