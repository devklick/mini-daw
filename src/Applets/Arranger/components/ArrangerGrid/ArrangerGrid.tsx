import { useRef } from "react";
import ArrangerGridBar from "./ArrangerGridBar";

import "./ArrangerGrid.scss";
import { useSyncSize } from "../../../../hooks/stateHooks/useSyncSize";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ArrangerGridProps {}

/**
 * A component responsible for displaying the vertical lines on the arranger,
 * which indicate the snapping positions that patterns can be snapped to. These
 * snapping positions indicate beats, bars etc within the generated audio.
 * @returns
 */
// eslint-disable-next-line no-empty-pattern
function ArrangerGrid({}: ArrangerGridProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [trackWidth] = useSyncSize({ elementRef: ref, dimensions: ["width"] });

  return (
    <div className="arranger-grid" ref={ref}>
      {Array.from({ length: Math.ceil(trackWidth / 100) }).map((_, i) => (
        <ArrangerGridBar barNo={i} key={i} width={100} />
      ))}
    </div>
  );
}

export default ArrangerGrid;
