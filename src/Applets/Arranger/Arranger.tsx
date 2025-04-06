import { useRef } from "react";
import Container from "../../components/Container";
import "./Arranger.scss";
import ArrangerTracks from "./components/ArrangerTracks";

function Arranger() {
  /**
   * Ref to the scrollable container in which the content (arranger tracks) will be rendered
   */
  const containerRef = useRef<HTMLDivElement>(null);
  /**
   * Ref to the content (arranger tracks) that will be rendered inside the scrollable container
   */
  const scrollableContent = useRef<HTMLDivElement>(null);

  return (
    <Container
      scrollX
      scrollY
      scrollXGrow
      scrollYGrow
      ref={containerRef}
      contentRef={scrollableContent}
      className="arranger"
    >
      <ArrangerTracks ref={scrollableContent} />
    </Container>
  );
}

export default Arranger;
