import SequencerTrack from "./components/SequencerTrack";
import useSequencerStore from "./stores/useSequencerStore";
import SequencerControls from "./components/SequencerControls";
import SequencerHeader from "./components/SequencerHeader/SequencerHeader";

import "./Sequencer.scss";
import SequencerFooter from "./components/SequencerFooter";

function Sequencer() {
  const trackCount = useSequencerStore((s) => s.tracks.length);

  return (
    <div className="sequencer">
      <SequencerControls />
      <SequencerHeader />
      {Array.from({ length: trackCount }).map((_, i) => (
        <SequencerTrack trackNo={i} key={`track-${i}`} />
      ))}
      <SequencerFooter />
    </div>
  );
}

export default Sequencer;
