import Sequencer from "./Sequencer";
import { useLoadSequencer } from "./Sequencer/stores/useSequencerStore";
import Layout from "./Layout";

import "./App.css";
import Applet from "./components/Applet";

function App() {
  useLoadSequencer();

  return <Layout></Layout>;
}

export default App;
