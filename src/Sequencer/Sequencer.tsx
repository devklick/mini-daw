import SequencerTrack from "./components/SequencerTrack";
import useSequencerStore from "./stores/useSequencerStore";
import SequencerControls from "./components/SequencerControls";

import "./Sequencer.scss";

function Sequencer() {
  const trackCount = useSequencerStore((s) => s.tracks.length);

  return (
    <div className="sequencer">
      {Array.from({ length: trackCount }).map((_, i) => (
        <SequencerTrack trackNo={i} key={`track-${i}`} />
      ))}
      <SequencerControls />
    </div>
  );
}

export default Sequencer;
