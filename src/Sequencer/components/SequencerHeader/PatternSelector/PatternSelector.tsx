import SelectList from "../../../../components/SelectList/SelectList";
import useSequencerStore from "../../../stores/useSequencerStore";
import "./PatternSelector.scss";

function PatternSelector() {
  const selectedPattern = useSequencerStore((s) => s.selectedPattern);
  const patternIds = useSequencerStore((s) => s.patternIds);
  const setSelectedPattern = useSequencerStore((s) => s.setSelectedPattern);
  return (
    <SelectList
      items={patternIds.map((p) => ({
        id: p,
        text: p,
        selected: p === selectedPattern,
      }))}
      onChanged={setSelectedPattern}
    />
  );
}

export default PatternSelector;
