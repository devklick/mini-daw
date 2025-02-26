import Num from "../../../components/Input/Num";
import useSequencerStore from "../../stores/useSequencerStore";
import "./SequencerHeader.scss";

function SequencerHeader() {
  const beatsPerBar = useSequencerStore((s) => s.beatsPerBar);
  const barsPerSequence = useSequencerStore((s) => s.barsPerSequence);
  const stepsBerBeat = useSequencerStore((s) => s.stepsPerBeat);
  const setStepsPerBeat = useSequencerStore((s) => s.setStepsPerBeat);
  const setBeatsPerBar = useSequencerStore((s) => s.setBeatsPerBar);
  const setBarsPerSequence = useSequencerStore((s) => s.setBarsPerSequence);
  return (
    <div className="sequencer-header">
      <div className="sequencer-header__timing">
        <Num
          label="Steps/Beat"
          min={1}
          max={16}
          value={stepsBerBeat}
          onChange={(value) => setStepsPerBeat(Number(value))}
        />

        <Num
          label="Beats/Bar"
          min={1}
          max={16}
          value={beatsPerBar}
          onChange={(value) => setBeatsPerBar(Number(value))}
        />

        <Num
          label="Bars/Seq"
          min={1}
          max={4}
          value={barsPerSequence}
          onChange={(value) => setBarsPerSequence(Number(value))}
        />
      </div>
    </div>
  );
}

export default SequencerHeader;
