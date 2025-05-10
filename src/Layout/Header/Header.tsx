import Num from "../../components/Input/Num";
import usePlayControls from "../../hooks/keyboardHooks/usePlayControls";
import { useBpm } from "../../stores/useDawStore";
import SequencerLauncher from "../../Applets/Sequencer/components/SequencerLauncher";
import ArrangerLauncher from "../../Applets/Arranger/components/ArrangerLauncher";

import "./Header.scss";

function Header() {
  const [bpm, setBpm] = useBpm();
  // Eventually we'll need play controls for the arranger as well as the sequencer,
  // and there will be some kind of toggle to chose which one to play
  const { togglePlayStop } = usePlayControls();
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
      <button onClick={togglePlayStop}>Play</button>
      <SequencerLauncher />
      <ArrangerLauncher />
    </header>
  );
}

export default Header;
