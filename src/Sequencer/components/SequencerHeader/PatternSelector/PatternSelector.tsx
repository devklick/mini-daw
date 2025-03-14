import { useRef, useState } from "react";
import SelectList from "../../../../components/SelectList/SelectList";
import useSequencerStore from "../../../stores/useSequencerStore";
import { useScrollToChange } from "../../../../hooks/mouseHooks";
import Button from "../../../../components/Button";

import "./PatternSelector.scss";

function PatternSelector() {
  const selectedPattern = useSequencerStore((s) => s.selectedPattern);
  const selectedPatternIndex = useSequencerStore((s) =>
    s.patternIds?.indexOf(selectedPattern)
  );
  const minIndex = 0;
  const maxIndex = useSequencerStore((s) => s.patternIds.length - 1);

  const patternIds = useSequencerStore((s) => s.patternIds);
  const setSelectedPattern = useSequencerStore((s) => s.setSelectedPattern);
  const setSelectedPatternIndex = useSequencerStore(
    (s) => s.setSelectedPatternIndex
  );
  const addPattern = useSequencerStore((s) => s.addPattern);
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useScrollToChange(ref, {
    min: minIndex,
    max: maxIndex,
    value: selectedPatternIndex,
    loop: true,
    onChange: setSelectedPatternIndex,
    disabled: open,
  });

  return (
    <div className="pattern-selector">
      <SelectList
        items={patternIds.map((p) => ({
          id: p,
          text: p,
          selected: p === selectedPattern,
        }))}
        onChanged={setSelectedPattern}
        ref={ref}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        className="pattern-selector__select-list"
      />
      <Button
        onClick={() => addPattern()}
        backgroundColor="base4"
        size={{ height: "100%" }}
      >
        +
      </Button>
    </div>
  );
}

export default PatternSelector;
