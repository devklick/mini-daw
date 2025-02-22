import useSampleStore from "../../../Samples/stores/useSamplesStore";
import useDndStore from "../../../components/DragAndDrop/stores/useDndStore";
import useSequencerStore from "../../stores/useSequencerStore";
import "./SequencerFooter.scss";

function SequencerFooter() {
  const dnd = useDndStore();
  const getSample = useSampleStore((s) => s.getSample);
  const addSampleAsTrack = useSequencerStore((s) => s.addSampleAsTrack);

  return (
    <div className="sequencer-footer">
      <div className="sequencer-footer__add-track">
        <button
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => {
            if (!dnd.item) return;
            const sample = getSample(dnd.item.id);
            if (!sample) return;
            addSampleAsTrack(sample);
          }}
        >
          Add Track
        </button>
      </div>
    </div>
  );
}

export default SequencerFooter;
