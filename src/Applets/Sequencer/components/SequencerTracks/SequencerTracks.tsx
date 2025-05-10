import useSequencerStore from "../../stores/useSequencerStore";
import SequencerTrackSteps from "./SequencerTrackSteps";
import SequencerStepsBackground from "./SequencerStepsBackground";
import SequencerTrackHeader from "./SequencerTrackHeader";
import SequencerProgress from "../SequencerFooter/SequencerProgress";

import "./SequencerTracks.scss";

function SequencerTracks() {
  const trackIds = useSequencerStore((s) => s.trackIds);
  return (
    <div className="sequencer-tracks">
      <div className="sequencer-tracks__headers">
        {trackIds.map((id) => (
          <SequencerTrackHeader trackId={id} key={id} />
        ))}
        <SequencerTrackHeader.DropNewTrack key={"new-track"} />
      </div>
      <div className="sequencer-tracks__steps">
        <SequencerStepsBackground key={"steps-background"} />
        {trackIds.map((id) => (
          <SequencerTrackSteps trackId={id} key={id} />
        ))}
        <SequencerProgress key={"steps-progress"} />
      </div>
    </div>
  );
}

export default SequencerTracks;
