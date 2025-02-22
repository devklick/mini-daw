import SampleBrowser from "./Samples/components/SampleBrowser";
import Sequencer from "./Sequencer";
import { useLoadSequencer } from "./Sequencer/stores/useSequencerStore";

import "./App.css";

function App() {
  useLoadSequencer();

  return (
    <>
      <Sequencer />
      <SampleBrowser />
    </>
  );
}

export default App;
