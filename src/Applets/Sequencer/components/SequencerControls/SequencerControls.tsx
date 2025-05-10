import { useSequencer } from "../../stores/useSequencerStore";
import "./SequencerControls.scss";

function SequencerControls() {
  const { play, stop } = useSequencer();
  return (
    <div className="sequencer-controls">
      <button onClick={play}>Play</button>
      <button onClick={stop}>Stop</button>
    </div>
  );
}
export default SequencerControls;
