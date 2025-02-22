import SequencerControls from "./components/SequencerControls";
import SequencerHeader from "./components/SequencerHeader/SequencerHeader";

import "./Sequencer.scss";
import SequencerFooter from "./components/SequencerFooter";
import SequencerTracks from "./components/SequencerTracks";

function Sequencer() {
  return (
    <div className="sequencer">
      {/* Controls to be moved into page header - should not be part of sequencer */}
      <SequencerControls />
      <SequencerHeader />
      <SequencerTracks />
      <SequencerFooter />
    </div>
  );
}

export default Sequencer;
