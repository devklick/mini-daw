import clsx from "clsx";

import useSequencerStore from "../Sequencer/stores/useSequencerStore";
import TrackPropertiesList from "./TrackPropertiesList";
import WaveformVisualizer from "../components/WaveFormVisualizer";

import "./TrackPropertiesPanel.scss";

function TrackPropertiesPanel() {
  const trackId = useSequencerStore((s) => s.selectedTrack);
  const sample = useSequencerStore((s) => s.tracks[trackId ?? -1]?.sample);

  return (
    <div className={clsx("track-properties-panel")}>
      {trackId !== null && sample && (
        <>
          <TrackPropertiesList trackId={trackId} />
          <WaveformVisualizer url={sample.url} />
        </>
      )}
    </div>
  );
}

export default TrackPropertiesPanel;
