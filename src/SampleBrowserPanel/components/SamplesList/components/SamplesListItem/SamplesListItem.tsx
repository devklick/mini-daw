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
  const selectedSampleUrl = useSampleStore((s) => s.selectedSampleUrl);
  const isSelected = selectedSampleUrl === sample.url;
  return (
    <li
      className={clsx("samples-list-item", {
        ["samples-list-item--selected"]: isSelected,
      })}
      onClick={() => setSelectedSample(sample.url)}
    >
      <Draggable itemId={sample.url} itemType="sample">
        {sample.name}
      </Draggable>
    </li>
  );
}

export default SamplesListItem;
