import { useEffect, useRef, useState } from "react";
import ArrangerGridBar from "./ArrangerGridBar";

import "./ArrangerGrid.scss";

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
  const [trackWidth, setTrackWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const resize = () => {
      if (!ref.current) return;
      setTrackWidth(ref.current.clientWidth);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);

  return (
    <div className="arranger-grid" ref={ref}>
      {Array.from({ length: Math.ceil(trackWidth / 100) }).map((_, i) => (
        <ArrangerGridBar barNo={i} key={i} width={100} />
      ))}
    </div>
  );
}

export default ArrangerGrid;
