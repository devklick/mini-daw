import "./App.css";
import SampleBrowser from "./Samples/components/SampleBrowser";
import Sequencer from "./Sequencer";
import { useLoadSequencer } from "./Sequencer/stores/useSequencerStore";

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
