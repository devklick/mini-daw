import clsx from "clsx";
import Draggable from "../../../../../components/DragAndDrop/Draggable";
import useSampleStore, {
  SampleInfo,
} from "../../../../../Samples/stores/useSamplesStore";
import "./SamplesListItem.scss";

interface SamplesListItemProps {
  sample: SampleInfo;
}

function SamplesListItem({ sample }: SamplesListItemProps) {
  const setSelectedSample = useSampleStore((s) => s.setSelectedSample);
  const selectedSampleId = useSampleStore((s) => s.selectedSampleId);
  const isSelected = selectedSampleId === sample.id;
  return (
    <li
      className={clsx("samples-list-item", {
        ["samples-list-item--selected"]: isSelected,
      })}
      onClick={() => setSelectedSample(sample.id)}
    >
      <Draggable itemId={sample.id} itemType="sample">
        {sample.name}
      </Draggable>
    </li>
  );
}

export default SamplesListItem;
