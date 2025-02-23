import clsx from "clsx";

import useSequencerStore from "../Sequencer/stores/useSequencerStore";
import TrackPropertiesList from "./TrackPropertiesList";
import WaveformVisualizer from "../components/WaveFormVisualizer";

import "./TrackPropertiesPanel.scss";

function TrackPropertiesPanel() {
  const trackNo = useSequencerStore((s) => s.selectedTrack);
  const sample = useSequencerStore((s) => s.tracks[trackNo ?? -1]?.sample);

  return (
    <div className={clsx("track-properties-panel")}>
      {trackNo !== null && sample && (
        <>
          <TrackPropertiesList trackNo={trackNo} />
          <WaveformVisualizer url={sample.url} />
        </>
      )}
    </div>
  );
}

export default TrackPropertiesPanel;
