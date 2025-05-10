import SequencerHeader from "./components/SequencerHeader/SequencerHeader";

import "./Sequencer.scss";
import SequencerFooter from "./components/SequencerFooter";
import SequencerTracks from "./components/SequencerTracks";

function Sequencer() {
  return (
    <div className="sequencer">
      <SequencerHeader />
      <SequencerTracks />
      <SequencerFooter />
    </div>
  );
}

export default Sequencer;
