import clsx from "clsx";

import useSequencerStore from "../../../stores/useSequencerStore.ts";
import { ContextMenuTarget } from "../../../../components/ContextMenu/index.ts";
import useSampleStore from "../../../../Samples/stores/useSamplesStore.ts";
import DropZone from "../../../../components/DragAndDrop/DropZone/DropZone.tsx";

import "./SequencerTrackHeader.scss";

interface SequencerTrackHeaderProps {
  trackNo: number;
}

function SequencerTrackHeader({ trackNo }: SequencerTrackHeaderProps) {
  const deleteTrack = useSequencerStore((s) => s.deleteTrack);
  const assignNewSampleToTrack = useSequencerStore(
    (s) => s.assignNewSampleToTrack
  );
  const getSample = useSampleStore((s) => s.getSample);
  const trackName = useSequencerStore((s) => s.tracks[trackNo].name);
  const trackId = useSequencerStore((s) => s.tracks[trackNo].id);
  const setSelectedTrack = useSequencerStore((s) => s.setSelectedTrack);
  const selectedTrack = useSequencerStore((s) => s.selectedTrack);
  const isSelected = trackNo == selectedTrack;
  const setTrackName = useSequencerStore((s) => s.setTrackName);

  return (
    <div
      className={clsx("sequencer-track-header", {
        ["sequencer-track-header--selected"]: isSelected,
      })}
      onClick={() => setSelectedTrack(trackNo)}
    >
      <ContextMenuTarget
        items={[
          { title: "Rename Track", action: () => null },
          { title: "Delete Track", action: () => deleteTrack(trackId) },
        ]}
      >
        <DropZone
          dragOverClassName="sequencer-track-header--drag-over"
          onDrop={(item) => {
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
        onDrop={(item) => {
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
