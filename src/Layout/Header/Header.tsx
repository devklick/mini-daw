import { useBpm } from "../../stores/useDawStore";
import "./Header.scss";

function Header() {
  const [bpm] = useBpm();
  return <header className="header">{bpm}</header>;
}

export default Header;
