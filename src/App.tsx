import SampleBrowser from "./Samples/components/SampleBrowser";
import Sequencer from "./Sequencer";
import { useLoadSequencer } from "./Sequencer/stores/useSequencerStore";
import Layout from "./Layout";

import "./App.css";

function App() {
  useLoadSequencer();

  return (
    <Layout>
      <Sequencer />
      <SampleBrowser />
    </Layout>
  );
}

export default App;
