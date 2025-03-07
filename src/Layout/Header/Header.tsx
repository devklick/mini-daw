import Num from "../../components/Input/Num";
import { useSequencer } from "../../Sequencer/stores/useSequencerStore";
import { useBpm } from "../../stores/useDawStore";
import SequencerLauncher from "./Buttons/SequencerLauncher";
import "./Header.scss";

function Header() {
  const [bpm, setBpm] = useBpm();
  // Eventually we'll need play controls for the arranger as well as the sequencer,
  // and there will be some kind of toggle to chose which one to play
  const { play, stop } = useSequencer();
  return (
    <header className="header">
      <Num
        label="Bpm"
        min={20}
        max={400}
        value={bpm}
        onChange={(value) => setBpm(Number(value))}
        className="header__bpm"
      />
      <button onClick={play}>Play</button>
      <button onClick={stop}>Stop</button>
      <SequencerLauncher />
    </header>
  );
}

export default Header;
