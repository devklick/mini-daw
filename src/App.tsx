import SampleBrowser from "./Samples/components/SampleBrowser";
import Sequencer from "./Sequencer";
import { useLoadSequencer } from "./Sequencer/stores/useSequencerStore";

import "./App.css";
import Layout from "./Layout";

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
