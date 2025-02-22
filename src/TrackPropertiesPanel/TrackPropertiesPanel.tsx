import clsx from "clsx";
import "./TrackPropertiesPanel.scss";
import useSequencerStore from "../Sequencer/stores/useSequencerStore";
import TrackProperty from "./TrackProperty";
import { ContextMenuTarget } from "../components/ContextMenu";

function TrackPropertiesPanel() {
  const trackNo = useSequencerStore((s) => s.selectedTrack);
  const trackId = useSequencerStore((s) => s.tracks[trackNo]?.id);
  const setTrackName = useSequencerStore((s) => s.setTrackName);
  const setTrackVolume = useSequencerStore((s) => s.setTrackVolume);
  const setTrackPan = useSequencerStore((s) => s.setTrackPan);
  const setTrackPitch = useSequencerStore((s) => s.setTrackPitch);

  // TODO: Need to sort the inconsistency around using either
  // the trackNo or trackId. Probs should use the ID to avoid
  // relying on indexes which could change.

  function setName(name: string) {
    setTrackName(trackNo, name);
  }
  function setVolume(volume: number) {
    setTrackVolume(trackId, volume);
  }
  function setPan(pan: number) {
    setTrackPan(trackId, pan);
  }
  function setPitch(pitch: number) {
    setTrackPitch(trackId, pitch);
  }
  return (
    <div className={clsx("track-properties-panel")}>
      <ContextMenuTarget items={[]}>
        <TrackProperty
          name="name"
          description="The name of the track in the sequencer"
          label="Name"
          onChange={setName}
          trackNo={trackNo}
          type="text"
        />
      </ContextMenuTarget>

      <ContextMenuTarget
        items={[
          {
            title: "Reset",
            action: () => setVolume(80),
            closeOnClick: true,
          },
        ]}
      >
        <TrackProperty
          name="volume"
          description="The input volume of the track"
          label="Volume"
          onChange={setVolume}
          trackNo={trackNo}
          type="knob"
          min={0}
          max={100}
        />
      </ContextMenuTarget>
      <ContextMenuTarget
        items={[
          {
            title: "Reset",
            action: () => setPan(0),
            closeOnClick: true,
          },
        ]}
      >
        <TrackProperty
          name="pan"
          description="The input panning of the track"
          label="Panning"
          onChange={setPan}
          trackNo={trackNo}
          type="knob"
          min={-100}
          max={100}
        />
      </ContextMenuTarget>
      <ContextMenuTarget
        items={[
          {
            title: "Reset",
            action: () => setPitch(0),
            closeOnClick: true,
          },
        ]}
      >
        <TrackProperty
          name="pitch"
          description="The input pitch of the track"
          label="Pitch"
          onChange={setPitch}
          trackNo={trackNo}
          type="knob"
          min={-12}
          max={12}
        />
      </ContextMenuTarget>
    </div>
  );
}

export default TrackPropertiesPanel;
