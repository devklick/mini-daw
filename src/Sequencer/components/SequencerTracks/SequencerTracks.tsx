import useSequencerStore from "../../stores/useSequencerStore";
import SequencerTrackSteps from "./SequencerTrackSteps";
import SequencerStepsBackground from "./SequencerStepsBackground";
import SequencerTrackHeader from "./SequencerTrackHeader";

import "./SequencerTracks.scss";
import SequencerProgress from "../SequencerFooter/SequencerProgress";

function SequencerTracks() {
  const trackCount = useSequencerStore((s) => s.tracks.length);
  const template = Array.from({ length: trackCount });
  return (
    <div className="sequencer-tracks">
      <div className="sequencer-tracks__headers">
        {template.map((_, i) => (
          <SequencerTrackHeader trackNo={i} key={i} />
        ))}
        <SequencerTrackHeader.DropNewTrack />
      </div>
      <div className="sequencer-tracks__steps">
        <SequencerStepsBackground />
        {template.map((_, i) => (
          <SequencerTrackSteps trackNo={i} key={i} />
        ))}
        <SequencerProgress />
      </div>
    </div>
  );
}

export default SequencerTracks;
