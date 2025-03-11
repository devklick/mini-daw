import SelectList from "../../../../components/SelectList/SelectList";
import useSequencerStore from "../../../stores/useSequencerStore";
import "./PatternSelector.scss";

function PatternSelector() {
  const selectedPattern = useSequencerStore((s) => s.selectedPattern);
  return (
    <SelectList
      items={[
        { title: "first" },
        { title: "second" },
        { title: "third" },
        { title: "fourth" },
      ]}
      label="Pattern"
    />
  );
}

export default PatternSelector;
