import { useLoadSequencer } from "./Applets/Sequencer/stores/useSequencerStore";
import Layout from "./Layout";

import "./App.css";

function App() {
  useLoadSequencer();

  return <Layout></Layout>;
}

export default App;
