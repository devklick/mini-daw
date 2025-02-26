import Num from "../../components/Input/Num";
import { useBpm } from "../../stores/useDawStore";
import "./Header.scss";

function Header() {
  const [bpm, setBpm] = useBpm();
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
    </header>
  );
}

export default Header;
