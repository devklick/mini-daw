import clsx from "clsx";

import useSequencerStore from "../../../stores/useSequencerStore.ts";
import { ContextMenuTarget } from "../../../../../components/ContextMenu/index.ts";
import useSampleStore from "../../../../../Samples/stores/useSamplesStore.ts";
import DropZone from "../../../../../components/DragAndDrop/DropZone/DropZone.tsx";

import "./SequencerTrackHeader.scss";

interface SequencerTrackHeaderProps {
  trackId: string;
}

function SequencerTrackHeader({ trackId }: SequencerTrackHeaderProps) {
  const deleteTrack = useSequencerStore((s) => s.deleteTrack);
  const getSample = useSampleStore((s) => s.getSample);
  const setSelectedTrack = useSequencerStore((s) => s.setSelectedTrack);
  const assignNewSampleToTrack = useSequencerStore(
    (s) => s.assignNewSampleToTrack
  );

  const trackName = useSequencerStore((s) => s.tracks[trackId]?.name);
  const isSelected = useSequencerStore((s) => s.selectedTrack === trackId);

  return (
    <div
      className={clsx("sequencer-track-header", {
        ["sequencer-track-header--selected"]: isSelected,
      })}
      onClick={() => setSelectedTrack(trackId)}
    >
      <ContextMenuTarget
        items={[
          { title: "Rename Track", action: () => null },
          { title: "Delete Track", action: () => deleteTrack(trackId) },
        ]}
        onOpen={() => setSelectedTrack(trackId)}
      >
        <DropZone
          dragOverClassName="sequencer-track-header--drag-over"
          onDropItem={(item) => {
            const sample = getSample(item.id);
            if (!sample) return;
            assignNewSampleToTrack(trackId, sample);
          }}
        >
          <span className="sequencer-track-header__track-name">
            {trackName}
          </span>
        </DropZone>
      </ContextMenuTarget>
    </div>
  );
}

function DropNewTrack() {
  const getSample = useSampleStore((s) => s.getSample);
  const addSampleAsTrack = useSequencerStore((s) => s.addSampleAsTrack);
  return (
    <div className="sequencer-track-header">
      <DropZone
        onDropItem={(item) => {
          const sample = getSample(item.id);
          if (!sample) return;
          addSampleAsTrack(sample);
        }}
      >
        <span className="sequencer-track-header__track-name">
          <i>Drop Sample</i>
        </span>
      </DropZone>
    </div>
  );
}

SequencerTrackHeader.DropNewTrack = DropNewTrack;

export default SequencerTrackHeader;
