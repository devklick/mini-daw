import useSequencerStore from "../../stores/useSequencerStore";
import SequencerTrackSteps from "./SequencerTrackSteps";
import SequencerStepsBackground from "./SequencerStepsBackground";
import SequencerTrackHeader from "./SequencerTrackHeader";

import "./SequencerTracks.scss";

function SequencerTracks() {
  const trackCount = useSequencerStore((s) => s.tracks.length);
  const template = Array.from({ length: trackCount });
  return (
    <div className="sequencer-tracks">
      <div className="sequencer-tracks__headers">
        {template.map((_, i) => (
          <SequencerTrackHeader trackNo={i} />
        ))}
        <SequencerTrackHeader.Placeholder />
      </div>
      <div className="sequencer-tracks__steps">
        <SequencerStepsBackground />
        {template.map((_, i) => (
          <SequencerTrackSteps trackNo={i} />
        ))}
      </div>
    </div>
  );
}

export default SequencerTracks;
