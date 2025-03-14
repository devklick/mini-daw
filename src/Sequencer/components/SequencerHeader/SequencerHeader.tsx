import Num from "../../../components/Input/Num";
import useSequencerStore, {
  usePatternSteps,
} from "../../stores/useSequencerStore";
import PatternSelector from "./PatternSelector";
import "./SequencerHeader.scss";

function SequencerHeader() {
  const { beatsPerBar, barsPerSequence, stepsPerBeat } = usePatternSteps();
  const setStepsPerBeat = useSequencerStore((s) => s.setStepsPerBeat);
  const setBeatsPerBar = useSequencerStore((s) => s.setBeatsPerBar);
  const setBarsPerSequence = useSequencerStore((s) => s.setBarsPerSequence);
  return (
    <div className="sequencer-header">
      <PatternSelector />
      <div className="sequencer-header__timing">
        <Num
          label="Steps/Beat"
          min={1}
          max={16}
          value={stepsPerBeat}
          onChange={(value) => {
            console.log("changed to", value);
            setStepsPerBeat(Number(value));
          }}
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
