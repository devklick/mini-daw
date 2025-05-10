import clsx from "clsx";
import Draggable from "../../../../../components/DragAndDrop/Draggable";
import useSampleStore, {
  SampleInfo,
  usePlaySample,
} from "../../../../../Samples/stores/useSamplesStore";
import "./SamplesListItem.scss";

interface SamplesListItemProps {
  sample: SampleInfo;
}

function SamplesListItem({ sample }: SamplesListItemProps) {
  const playSample = usePlaySample();
  const setSelectedSample = useSampleStore((s) => s.setSelectedSample);
  const selectedSampleUrl = useSampleStore((s) => s.selectedSampleUrl);
  const isSelected = selectedSampleUrl === sample.url;

  function handleClick() {
    if (isSelected) setSelectedSample(null);
    else {
      setSelectedSample(sample.url);
      playSample(sample.url);
    }
  }

  return (
    <li
      className={clsx("samples-list-item__container", {
        ["samples-list-item__container--selected"]: isSelected,
      })}
      onClick={handleClick}
    >
      <Draggable itemId={sample.url} itemType="sample">
        <div className="samples-list-item">
          <div className="samples-list-item__name">{sample.name}</div>
          {isSelected && (
            <div className="samples-list-item__details">
              <span>{`Instrument: ${sample.instrument}`}</span>
              <span>{`Length: ${sample.length}`}</span>
              <span>{`Pattern: ${sample.pattern}`}</span>
            </div>
          )}
        </div>
      </Draggable>
    </li>
  );
}

export default SamplesListItem;
