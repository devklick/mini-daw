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
        <div className="sequencer-header__field">
          <label>{`Steps/Beat`}</label>
          <input
            type="number"
            value={stepsBerBeat}
            onChange={(e) => setStepsPerBeat(Number(e.currentTarget.value))}
          ></input>
        </div>

        <div className="sequencer-header__field">
          <label>{`Beats/Bar`}</label>
          <input
            type="number"
            value={beatsPerBar}
            onChange={(e) => setBeatsPerBar(Number(e.currentTarget.value))}
          ></input>
        </div>

        <div className="sequencer-header__field">
          <label>{`Bars/Seq`}</label>
          <input
            type="number"
            value={barsPerSequence}
            onChange={(e) => setBarsPerSequence(Number(e.currentTarget.value))}
          ></input>
        </div>
      </div>
    </div>
  );
}

export default SequencerHeader;
