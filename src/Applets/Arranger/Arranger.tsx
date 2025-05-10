import { useRef } from "react";
import Container from "../../components/Container";
import ArrangerTracks from "./components/ArrangerTracks";
import { useScrollbarV2 } from "../../components/Container/Scrollbars/hooks/useScrollbars";
import { ScrollbarV2 } from "../../components/Container/Scrollbars/Scrollbars";

import "./Arranger.scss";

function Arranger() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<HTMLDivElement>(null);
  const colsRef = useRef<HTMLDivElement>(null);

  return (
    <div className="arranger" ref={viewportRef}>
      <div
        className="arranger__rows"
        ref={rowsRef}
        onScroll={() => console.log("ROWS SCROLL")}
      >
        <ScrollbarV2
          axis="y"
          containerRef={viewportRef}
          contentRef={rowsRef}
          grow
        />
      </div>
    </div>
  );
}

export default Arranger;
