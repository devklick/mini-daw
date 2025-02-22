import clsx from "clsx";

import useSequencerStore from "../../../stores/useSequencerStore.ts";
import { ContextMenuTarget } from "../../../../components/ContextMenu/index.ts";
import useSampleStore from "../../../../Samples/stores/useSamplesStore.ts";
import DropZone from "../../../../components/DragAndDrop/DropZone/DropZone.tsx";
import ControlKnob from "../../../../components/ControlKnob/ControlKnob.tsx";

import "./SequencerTrackHeader.scss";

interface SequencerTrackHeaderProps {
  trackNo: number;
}

function SequencerTrackHeader({ trackNo }: SequencerTrackHeaderProps) {
  const deleteTrack = useSequencerStore((s) => s.deleteTrack);
  const setVolume = useSequencerStore((s) => s.setTrackVolume);
  const setPan = useSequencerStore((s) => s.setTrackPan);
  const setPitch = useSequencerStore((s) => s.setTrackPitch);
  const assignNewSampleToTrack = useSequencerStore(
    (s) => s.assignNewSampleToTrack
  );
  const getSample = useSampleStore((s) => s.getSample);
  const trackName = useSequencerStore((s) => s.tracks[trackNo].name);
  const trackId = useSequencerStore((s) => s.tracks[trackNo].id);
  const volume = useSequencerStore((s) => s.tracks[trackNo].volume);
  const pan = useSequencerStore((s) => s.tracks[trackNo].pan);
  const pitch = useSequencerStore((s) => s.tracks[trackNo].pitch);

  return (
    <div className={clsx("sequencer-track-header")}>
      <ContextMenuTarget
        items={[{ title: "Delete Track", action: () => deleteTrack(trackId) }]}
      >
        <DropZone
          dragOverClassName="sequencer-track-header--drag-over"
          onDrop={(item) => {
            const sample = getSample(item.id);
            if (!sample) return;
            assignNewSampleToTrack(trackId, sample);
          }}
        >
          <span>{trackName}</span>
          <div className="sequencer-track-header__knobs">
            <div>
              <ContextMenuTarget
                items={[
                  {
                    title: "Reset",
                    action: () => setVolume(trackId, 80),
                    closeOnClick: true,
                  },
                ]}
              >
                <ControlKnob
                  min={0}
                  max={100}
                  defaultValue={volume}
                  size="small"
                  onChange={(newVolume) => setVolume(trackId, newVolume)}
                />
              </ContextMenuTarget>
            </div>
            <div>
              <ContextMenuTarget
                items={[
                  {
                    title: "Reset",
                    action: () => setPan(trackId, 0),
                    closeOnClick: true,
                  },
                ]}
              >
                <ControlKnob
                  min={-100}
                  max={100}
                  defaultValue={pan}
                  size="small"
                  onChange={(newPan) => setPan(trackId, newPan)}
                />
              </ContextMenuTarget>
            </div>
            <div>
              <ContextMenuTarget
                items={[
                  {
                    title: "Reset",
                    action: () => setPitch(trackId, 0),
                    closeOnClick: true,
                  },
                ]}
              >
                <ControlKnob
                  min={-12}
                  max={12}
                  defaultValue={pitch}
                  size="small"
                  onChange={(newPitch) => setPitch(trackId, newPitch)}
                />
              </ContextMenuTarget>
            </div>
          </div>
        </DropZone>
      </ContextMenuTarget>
    </div>
  );
}

function Placeholder() {
  return <div className="track-header__placeholder"></div>;
}

SequencerTrackHeader.Placeholder = Placeholder;

export default SequencerTrackHeader;
